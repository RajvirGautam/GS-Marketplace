// src/utils/toast.js
// Centralized toast utility with premium glassmorphism design
import toast from 'react-hot-toast';

const BASE_STYLE = {
  background: 'rgba(7, 10, 18, 0.92)',
  border: '1px solid rgba(148, 163, 184, 0.18)',
  boxShadow: '0 18px 48px -20px rgba(0, 0, 0, 0.95), 0 6px 18px -10px rgba(0, 217, 255, 0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
  borderRadius: '18px',
  padding: '0',
  maxWidth: '390px',
  width: 'min(92vw, 360px)',
  color: '#fff',
  fontFamily: '"Manrope", sans-serif',
  backdropFilter: 'blur(12px)',
};

// --- Custom JSX Renderer --
// react-hot-toast supports custom JSX as the first argument so we can pass a
// component. All our helpers return a toast id.

function iconCircle(type) {
  const map = {
    success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.35)', icon: '✓', color: '#10B981' },
    error:   { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.35)',  icon: '✕', color: '#EF4444' },
    loading: { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.35)', icon: '↑', color: '#818CF8' },
    info:    { bg: 'rgba(0,217,255,0.12)',  border: 'rgba(0,217,255,0.35)',  icon: 'ℹ', color: '#00D9FF' },
  };
  return map[type] || map.info;
}

function gradientFor(type) {
  const map = {
    success: 'radial-gradient(ellipse at top right, rgba(16,185,129,0.15) 0%, transparent 60%)',
    error:   'radial-gradient(ellipse at top right, rgba(239,68,68,0.15) 0%, transparent 60%)',
    loading: 'radial-gradient(ellipse at top right, rgba(99,102,241,0.12) 0%, transparent 60%)',
    info:    'radial-gradient(ellipse at top right, rgba(0,217,255,0.12) 0%, transparent 60%)',
  };
  return map[type] || 'none';
}

function buildToast({ type, title, message, actions, toastRef }) {
  const c = iconCircle(type);
  return (t) => (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: '#0A0A12', // Solid base
        backgroundImage: gradientFor(type), // Gradient overlay
      }}
    >
      {/* Close button */}
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          color: 'rgba(255,255,255,0.5)',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '12px',
          lineHeight: 1,
        }}
      >
        ✕
      </button>

      {/* Icon + Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '28px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: c.bg,
            border: `1px solid ${c.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: c.color,
            fontWeight: '700',
            fontSize: '15px',
            flexShrink: 0,
          }}
        >
          {type === 'loading' ? (
            <span
              style={{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: `2px solid ${c.color}`,
                borderTopColor: 'transparent',
                animation: 'spin 0.7s linear infinite',
              }}
            />
          ) : (
            c.icon
          )}
        </div>
        <span style={{ fontWeight: '700', fontSize: '15px', color: '#fff', letterSpacing: '-0.01em' }}>
          {title}
        </span>
      </div>

      {/* Message */}
      {message && (
        <p style={{ margin: '0', fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', paddingLeft: '48px' }}>
          {message}
        </p>
      )}

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', paddingLeft: '48px' }}>
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => { toast.dismiss(t.id); action.onClick?.(); }}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: i === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ----- Public API -----

export function showSuccess(title, message, actions) {
  return toast.custom(buildToast({ type: 'success', title, message, actions }), {
    duration: 4000,
    style: BASE_STYLE,
  });
}

export function showError(title, message, actions) {
  return toast.custom(buildToast({ type: 'error', title, message, actions }), {
    duration: 5000,
    style: BASE_STYLE,
  });
}

export function showLoading(title, message) {
  return toast.custom(buildToast({ type: 'loading', title, message }), {
    duration: Infinity,
    style: BASE_STYLE,
  });
}

export function showInfo(title, message, actions) {
  return toast.custom(buildToast({ type: 'info', title, message, actions }), {
    duration: 4000,
    style: BASE_STYLE,
  });
}

// Dismiss any toast by id
export function dismissToast(id) {
  toast.dismiss(id);
}

// Upgrade a loading toast to success/error
export function updateToast(id, type, title, message, actions) {
  toast.dismiss(id);
  if (type === 'success') return showSuccess(title, message, actions);
  if (type === 'error') return showError(title, message, actions);
  return showInfo(title, message, actions);
}
