import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// App-wide toast notifications. Call `showToast({ type, message })` from
// anywhere inside the provider.
const DURATION = 5000;
const ICONS = { success: 'check_circle', info: 'info', warning: 'warning', danger: 'error' };

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

function Toast({ toast, onDismiss }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(DURATION);
  const startedAt = useRef(0);

  // Auto-dismiss, pausing while the toast is hovered or has focus so
  // people get time to read it or reach the close button
  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, toast.id, onDismiss]);

  return (
    <li
      className={`toast toast-${toast.type}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="material-icons" aria-hidden="true">{ICONS[toast.type] || 'info'}</span>
      <span className="toast__message">{toast.message}</span>
      <button
        type="button"
        className="toast__close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <span className="material-icons" aria-hidden="true">close</span>
      </button>
    </li>
  );
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', message }) => {
    nextId.current += 1;
    const id = nextId.current;
    // Keep the stack short - the oldest drops off first
    setToasts((prev) => [...prev, { id, type, message }].slice(-4));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* The live region is always rendered, so screen readers pick up
          toasts that are added to it later */}
      <ol className="toast-region" aria-live="polite" aria-label="Notifications">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </ol>
    </ToastContext.Provider>
  );
};
