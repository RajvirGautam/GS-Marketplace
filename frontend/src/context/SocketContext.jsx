import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    // Safe fallback — prevents crash when used outside SocketProvider
    return ctx ?? { socket: null, unreadCount: 0, toasts: [], dismissToast: () => { }, markConversationRead: () => { } };
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const SOCKET_URL = API_URL.replace('/api', '');

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const socketRef = useRef(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [toasts, setToasts] = useState([]); // [{ id, conversationId, message, product? }]

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

    // ── Connect / disconnect socket tied to auth state ────────────────────────
    useEffect(() => {
        if (!isAuthenticated || !user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setUnreadCount(0);
            return;
        }

        const token = Cookies.get('accessToken');
        if (!token) return;

        // Fetch initial count on login
        fetchUnreadCount();

        const socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socket.on('connect', () => {
            console.log('🟢 Socket connected');
        });

        socket.on('new_message', ({ conversationId, message }) => {
            // Increment badge
            setUnreadCount(prev => prev + 1);

            // Show toast (skip if window is currently on that conversation)
            const currentPath = window.location.pathname;
            if (currentPath === `/chat/${conversationId}`) return;

            const toastId = `${conversationId}-${message._id || Date.now()}`;
            setToasts(prev => {
                // Replace existing toast for same conversation (don't stack duplicates)
                const filtered = prev.filter(t => t.conversationId !== conversationId);
                return [...filtered, { id: toastId, conversationId, message }];
            });
        });

        socket.on('disconnect', () => {
            console.log('🔴 Socket disconnected');
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
            socketRef.current = null;
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

    return (
        <SocketContext.Provider value={{
            socket: socketRef.current,
            unreadCount,
            toasts,
            dismissToast,
            markConversationRead
        }}>
            {children}
        </SocketContext.Provider>
    );
};
