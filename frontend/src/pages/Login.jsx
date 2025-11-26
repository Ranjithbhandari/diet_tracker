import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success('Welcome back! 🎉');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-10rem',
          right: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-10rem',
          left: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite reverse'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          width: '5rem',
          height: '5rem',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          animation: 'bounce 3s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '20%',
          width: '3rem',
          height: '3rem',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          filter: 'blur(15px)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
      </div>

      <div style={{ width: '100%', maxWidth: '28rem', position: 'relative', zIndex: 10 }}>
        {/* Glassmorphism Card */}
        <div style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '2.5rem',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          animation: 'slideUp 0.8s ease-out'
        }}>
          {/* Logo/Title */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '1.5rem',
              marginBottom: '1.5rem',
              animation: 'glow 2s ease-in-out infinite alternate'
            }}>
              <svg style={{ width: '3rem', height: '3rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.5rem',
              animation: 'slideIn 0.8s ease-out 0.2s both'
            }}>
              DietTracker Pro
            </h1>
            <p style={{ 
              color: 'var(--gray-600)', 
              fontSize: '1.1rem',
              animation: 'slideIn 0.8s ease-out 0.4s both'
            }}>
              Welcome back! Sign in to continue your health journey 🌟
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Email Input */}
            <div style={{ animation: 'slideIn 0.8s ease-out 0.6s both' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: '0.5rem'
              }}>
                📧 Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  paddingLeft: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}>
                  <svg style={{ 
                    width: '1.25rem', 
                    height: '1.25rem', 
                    color: 'var(--gray-400)',
                    transition: 'color 0.2s ease'
                  }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    paddingTop: '0.875rem',
                    paddingBottom: '0.875rem',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '1rem',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: 'var(--white)',
                    color: 'var(--gray-900)',
                    outline: 'none'
                  }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ animation: 'slideIn 0.8s ease-out 0.8s both' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: '0.5rem'
              }}>
                🔒 Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  paddingLeft: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}>
                  <svg style={{ 
                    width: '1.25rem', 
                    height: '1.25rem', 
                    color: 'var(--gray-400)',
                    transition: 'color 0.2s ease'
                  }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '3rem',
                    paddingTop: '0.875rem',
                    paddingBottom: '0.875rem',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '1rem',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: 'var(--white)',
                    color: 'var(--gray-900)',
                    outline: 'none'
                  }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    paddingRight: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--gray-400)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = 'var(--gray-600)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--gray-400)'}
                >
                  {showPassword ? (
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'var(--gray-400)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'var(--white)',
                fontWeight: '700',
                padding: '1rem 1.5rem',
                borderRadius: '1rem',
                border: 'none',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 10px 25px rgba(102, 126, 234, 0.4)',
                transform: loading ? 'none' : 'translateY(0)',
                animation: 'slideIn 0.8s ease-out 1s both',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseDown={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(1px)';
                }
              }}
              onMouseUp={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div className="spinner spinner-sm" />
                  Signing in...
                </span>
              ) : (
                '🚀 Sign In to Continue'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ 
            position: 'relative', 
            margin: '2rem 0',
            animation: 'slideIn 0.8s ease-out 1.2s both'
          }}>
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              alignItems: 'center' 
            }}>
              <div style={{ width: '100%', borderTop: '1px solid var(--gray-200)' }}></div>
            </div>
            <div style={{ 
              position: 'relative', 
              display: 'flex', 
              justifyContent: 'center', 
              fontSize: '0.875rem' 
            }}>
              <span style={{ 
                padding: '0 1rem', 
                background: 'rgba(255, 255, 255, 0.95)', 
                color: 'var(--gray-500)' 
              }}>
                New to DietTracker Pro?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div style={{ 
            textAlign: 'center',
            animation: 'slideIn 0.8s ease-out 1.4s both'
          }}>
            <Link 
              to="/register" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'var(--primary-color)',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.target.style.color = 'var(--primary-dark)';
                e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.color = 'var(--primary-color)';
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ✨ Create your free account
              <svg style={{ 
                width: '1rem', 
                height: '1rem', 
                marginLeft: '0.5rem',
                transition: 'transform 0.2s ease'
              }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Forgot Password Link */}
          <div style={{ 
            textAlign: 'center',
            marginTop: '1rem',
            animation: 'slideIn 0.8s ease-out 1.6s both'
          }}>
            <button
              type="button"
              onClick={() => toast.info('Forgot password feature coming soon!')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gray-500)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.color = 'var(--gray-700)'}
              onMouseOut={(e) => e.target.style.color = 'var(--gray-500)'}
            >
              🔑 Forgot your password?
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <p style={{ 
          textAlign: 'center', 
          color: 'rgba(255, 255, 255, 0.9)', 
          fontSize: '1rem', 
          marginTop: '2rem',
          animation: 'slideIn 0.8s ease-out 1.8s both'
        }}>
          🌟 Join thousands tracking their nutrition journey with AI-powered insights
        </p>
      </div>
    </div>
  );
}
