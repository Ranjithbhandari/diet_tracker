import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 1000,
      padding: '1rem 1.5rem',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      backdropFilter: 'blur(10px)',
      border: '1px solid',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      minWidth: '300px',
      maxWidth: '500px',
      fontSize: '0.875rem',
      fontWeight: '500',
      transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
      opacity: isExiting ? 0 : 1,
      transition: 'all 0.3s ease',
      animation: isExiting ? 'none' : 'slideInRight 0.3s ease'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          background: 'rgba(16, 185, 129, 0.9)',
          borderColor: 'var(--success-color)',
          color: 'var(--white)'
        };
      case 'error':
        return {
          ...baseStyles,
          background: 'rgba(239, 68, 68, 0.9)',
          borderColor: 'var(--error-color)',
          color: 'var(--white)'
        };
      case 'warning':
        return {
          ...baseStyles,
          background: 'rgba(245, 158, 11, 0.9)',
          borderColor: 'var(--warning-color)',
          color: 'var(--white)'
        };
      default:
        return {
          ...baseStyles,
          background: 'rgba(99, 102, 241, 0.9)',
          borderColor: 'var(--primary-color)',
          color: 'var(--white)'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <>
      <div style={getToastStyles()}>
        <span style={{ fontSize: '1.25rem' }}>{getIcon()}</span>
        <span style={{ flex: 1 }}>{message}</span>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose?.();
            }, 300);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '1.25rem',
            padding: '0.25rem',
            borderRadius: 'var(--radius-md)',
            transition: 'background 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.target.style.background = 'none'}
        >
          ✕
        </button>
      </div>
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

// Toast Manager Component
export const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const { message, type, duration } = event.detail;
      const id = Date.now() + Math.random();
      
      setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    window.addEventListener('showToast', handleToast);
    return () => window.removeEventListener('showToast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'fixed',
            top: `${1 + index * 5}rem`,
            right: '1rem',
            zIndex: 1000 + index
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Helper function to show toasts
export const showToast = (message, type = 'info', duration = 3000) => {
  window.dispatchEvent(new CustomEvent('showToast', {
    detail: { message, type, duration }
  }));
};

export default Toast;