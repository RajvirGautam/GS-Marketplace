import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    // Safe fallback — prevents crash when used outside SocketProvider
    return ctx ?? {
        socket: null,
        unreadCount: 0,
        toasts: [],
        dismissToast: () => { },
        markConversationRead: () => { },
        fetchUnreadCount: () => { },
        notifications: [],
        unreadNotifCount: 0,
        markNotifRead: () => { },
        markAllNotifsRead: () => { },
        deleteNotif: () => { },
    };
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const SOCKET_URL = API_URL.replace('/api', '');

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const socketRef = useRef(null);
    const [socketInstance, setSocketInstance] = useState(null); // reactive socket for consumers
    const [unreadCount, setUnreadCount] = useState(0);
    const [toasts, setToasts] = useState([]); // [{ id, conversationId, message, product? }]

    // ── Notification state ────────────────────────────────────────────────────
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);

    // ── Fetch initial unread count ────────────────────────────────────────────
    const fetchUnreadCount = useCallback(async () => {
        const token = Cookies.get('accessToken');
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/chat/unread-count`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setUnreadCount(data.count);
        } catch (_) { }
    }, []);

    // ── Fetch notifications from server ──────────────────────────────────────
    const fetchNotifications = useCallback(async () => {
        const token = Cookies.get('accessToken');
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(data.notifications);
                setUnreadNotifCount(data.unreadCount);
            }
        } catch (_) { }
    }, []);

    // ── Connect / disconnect socket tied to auth state ────────────────────────
    useEffect(() => {
        if (!isAuthenticated || !user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setUnreadCount(0);
            setNotifications([]);
            setUnreadNotifCount(0);
            return;
        }

        const token = Cookies.get('accessToken');
        if (!token) return;

        // Fetch initial data on login
        fetchUnreadCount();
        fetchNotifications();

        const socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socket.on('connect', () => {
            console.log('🟢 Socket connected');
            // Re-sync counts after connect/reconnect to recover any missed events
            fetchUnreadCount();
            fetchNotifications();
        });

        socket.on('new_message', ({ conversationId, message }) => {
            const currentPath = window.location.pathname;
            const isViewingConversation = currentPath === `/chat/${conversationId}`;

            // Only bump badge if the user isn't actively reading this conversation.
            // When they ARE reading it, Chat.jsx calls markConversationRead() which
            // re-fetches the accurate count from the server instead.
            if (!isViewingConversation) {
                setUnreadCount(prev => prev + 1);

                // Show toast only when not on that conversation
                const toastId = `${conversationId}-${message._id || Date.now()}`;
                setToasts(prev => {
                    // Replace existing toast for same conversation (don't stack duplicates)
                    const filtered = prev.filter(t => t.conversationId !== conversationId);
                    return [...filtered, { id: toastId, conversationId, message }];
                });
            }
        });

        // ── New in-app notification from server ──────────────────────────────
        socket.on('new_notification', (notif) => {
            setNotifications(prev => [notif, ...prev].slice(0, 30)); // keep latest 30
            setUnreadNotifCount(prev => prev + 1);
        });

        socket.on('disconnect', () => {
            console.log('🔴 Socket disconnected');
        });

        socketRef.current = socket;
        setSocketInstance(socket);

        return () => {
            socket.disconnect();
            socketRef.current = null;
            setSocketInstance(null);
        };
    }, [isAuthenticated, user]);

    // ── Toast management ──────────────────────────────────────────────────────
    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Called when user opens a conversation — zero out badge if all read
    const markConversationRead = useCallback(() => {
        fetchUnreadCount();
    }, [fetchUnreadCount]);

    // ── Notification helpers ──────────────────────────────────────────────────
    const markNotifRead = useCallback(async (id) => {
        const token = Cookies.get('accessToken');
        try {
            await fetch(`${API_URL}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadNotifCount(prev => Math.max(0, prev - 1));
        } catch (_) { }
    }, []);

    const markAllNotifsRead = useCallback(async () => {
        const token = Cookies.get('accessToken');
        try {
            await fetch(`${API_URL}/notifications/read-all`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadNotifCount(0);
        } catch (_) { }
    }, []);

    const deleteNotif = useCallback(async (id) => {
        const token = Cookies.get('accessToken');
        try {
            await fetch(`${API_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => {
                const toDelete = prev.find(n => n._id === id);
                if (toDelete && !toDelete.isRead) setUnreadNotifCount(c => Math.max(0, c - 1));
                return prev.filter(n => n._id !== id);
            });
        } catch (_) { }
    }, []);

    return (
        <SocketContext.Provider value={{
            socket: socketInstance,
            unreadCount,
            toasts,
            dismissToast,
            markConversationRead,
            fetchUnreadCount,
            // Notification API
            notifications,
            unreadNotifCount,
            markNotifRead,
            markAllNotifsRead,
            deleteNotif,
        }}>
            {children}
        </SocketContext.Provider>
    );
};
