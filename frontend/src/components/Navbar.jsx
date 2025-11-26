import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
    setShowLogoutModal(false);
  };

  // Don't render navbar if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      <nav style={navStyles}>
        <div style={containerStyles}>
          {/* Logo */}
          <Link to="/dashboard" style={logoStyles}>
            <span style={logoTextStyles}>DietTracker Pro</span>
          </Link>

          {/* Desktop Menu */}
          <div style={desktopMenuStyles} className="desktop-menu">
            <Link 
              to="/dashboard" 
              style={{
                ...linkStyles,
                ...(isActive('/dashboard') ? activeLinkStyles : {})
              }}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/profile" 
              style={{
                ...linkStyles,
                ...(isActive('/profile') ? activeLinkStyles : {})
              }}
            >
              👤 Profile
            </Link>
            <Link 
              to="/add-meal" 
              style={{
                ...linkStyles,
                ...(isActive('/add-meal') ? activeLinkStyles : {})
              }}
            >
              🍽️ Add Meal
            </Link>
            <Link 
              to="/activity" 
              style={{
                ...linkStyles,
                ...(isActive('/activity') ? activeLinkStyles : {})
              }}
            >
              💪 Activity
            </Link>
            <Link 
              to="/history" 
              style={{
                ...linkStyles,
                ...(isActive('/history') ? activeLinkStyles : {})
              }}
            >
              📈 History
            </Link>
            <Link 
              to="/settings" 
              style={{
                ...linkStyles,
                ...(isActive('/settings') ? activeLinkStyles : {})
              }}
            >
              ⚙️ Settings
            </Link>

            {/* User Info & Logout */}
            <div style={userSectionStyles}>
              <div style={userInfoStyles}>
                <div style={avatarStyles}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={userNameStyles}>{user?.name}</span>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                style={logoutButtonStyles}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            style={mobileMenuButtonStyles}
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              style={{ width: '24px', height: '24px' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={mobileMenuStyles} className="mobile-menu">
            <div style={mobileMenuContentStyles}>
              <Link
                to="/dashboard"
                style={{
                  ...mobileLinkStyles,
                  ...(isActive('/dashboard') ? activeMobileLinkStyles : {})
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                📊 Dashboard
              </Link>
              <Link
                to="/profile"
                style={{
                  ...mobileLinkStyles,
                  ...(isActive('/profile') ? activeMobileLinkStyles : {})
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                👤 Profile
              </Link>
              <Link
                to="/add-meal"
                style={{
                  ...mobileLinkStyles,
                  ...(isActive('/add-meal') ? activeMobileLinkStyles : {})
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                🍽️ Add Meal
              </Link>
              <Link
                to="/activity"
                style={{
                  ...mobileLinkStyles,
                  ...(isActive('/activity') ? activeMobileLinkStyles : {})
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                💪 Activity
              </Link>
              <Link
                to="/history"
                style={{
                  ...mobileLinkStyles,
                  ...(isActive('/history') ? activeMobileLinkStyles : {})
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                📈 History
              </Link>
              <Link
                to="/settings"
                style={{
                  ...mobileLinkStyles,
                  ...(isActive('/settings') ? activeMobileLinkStyles : {})
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                ⚙️ Settings
              </Link>
              <button
                onClick={() => {
                  setShowLogoutModal(true);
                  setMobileMenuOpen(false);
                }}
                style={mobileLogoutButtonStyles}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={modalOverlayStyles}>
          <div style={modalStyles}>
            <div style={modalContentStyles}>
              <div style={modalIconStyles}>
                <svg style={{ height: '24px', width: '24px', color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 style={modalTitleStyles}>
                Confirm Logout
              </h3>
              <p style={modalTextStyles}>
                Are you sure you want to logout? You'll need to sign in again to access your account.
              </p>
              <div style={modalButtonsStyles}>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  style={modalCancelButtonStyles}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  style={modalConfirmButtonStyles}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .desktop-menu {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          color: #4b5563;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .mobile-menu-button:hover {
          background: rgba(107, 114, 128, 0.1);
        }
        
        .mobile-menu {
          display: block;
        }
        
        @media (max-width: 768px) {
          .desktop-menu {
            display: none;
          }
          
          .mobile-menu-button {
            display: block;
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

// Styles
const navStyles = {
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  padding: '0.75rem 0',
};

const containerStyles = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyles = {
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const logoTextStyles = {
  fontSize: '1.75rem',
  fontWeight: '800',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const desktopMenuStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const linkStyles = {
  padding: '0.75rem 1rem',
  borderRadius: '12px',
  textDecoration: 'none',
  color: '#4b5563',
  fontWeight: '500',
  fontSize: '0.875rem',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
};

const activeLinkStyles = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  transform: 'translateY(-1px)',
};

const userSectionStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginLeft: '1rem',
  paddingLeft: '1rem',
  borderLeft: '1px solid rgba(107, 114, 128, 0.2)',
};

const userInfoStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const avatarStyles = {
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontWeight: '700',
  fontSize: '0.875rem',
};

const userNameStyles = {
  color: '#374151',
  fontWeight: '500',
  fontSize: '0.875rem',
};

const logoutButtonStyles = {
  padding: '0.5rem 1rem',
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
};

const mobileMenuButtonStyles = {
  background: 'none',
  border: 'none',
  color: '#4b5563',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
};

const mobileMenuStyles = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(229, 231, 235, 0.5)',
  animation: 'slideDown 0.3s ease',
};

const mobileMenuContentStyles = {
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const mobileLinkStyles = {
  display: 'block',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#4b5563',
  fontWeight: '500',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
};

const activeMobileLinkStyles = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
};

const mobileLogoutButtonStyles = {
  width: '100%',
  textAlign: 'left',
  padding: '0.75rem 1rem',
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '500',
  fontSize: '0.875rem',
  cursor: 'pointer',
  marginTop: '0.5rem',
};

const modalOverlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
  animation: 'fadeIn 0.3s ease',
};

const modalStyles = {
  background: '#ffffff',
  borderRadius: '1.5rem',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  maxWidth: '400px',
  width: '100%',
  animation: 'slideUp 0.3s ease',
};

const modalContentStyles = {
  padding: '2rem',
  textAlign: 'center',
};

const modalIconStyles = {
  margin: '0 auto 1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: 'rgba(239, 68, 68, 0.1)',
};

const modalTitleStyles = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#111827',
  marginBottom: '0.5rem',
};

const modalTextStyles = {
  color: '#6b7280',
  marginBottom: '2rem',
  lineHeight: '1.5',
};

const modalButtonsStyles = {
  display: 'flex',
  gap: '0.75rem',
};

const modalCancelButtonStyles = {
  flex: 1,
  padding: '0.75rem 1rem',
  background: '#f3f4f6',
  color: '#374151',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const modalConfirmButtonStyles = {
  flex: 1,
  padding: '0.75rem 1rem',
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};
