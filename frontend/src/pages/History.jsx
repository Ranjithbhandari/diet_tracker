import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/meals/history');
      setHistory(response.data.history || []);
      setError('');
    } catch (err) {
      console.error('History fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const getComplianceStyle = (status) => {
    switch (status) {
      case 'on-track':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'var(--success-color)',
          color: 'var(--success-color)',
        };
      case 'over':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'var(--error-color)',
          color: 'var(--error-color)',
        };
      case 'under':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'var(--warning-color)',
          color: 'var(--warning-color)',
        };
      default:
        return {
          backgroundColor: 'var(--gray-100)',
          borderColor: 'var(--gray-400)',
          color: 'var(--gray-800)',
        };
    }
  };

  const getComplianceIcon = (status) => {
    switch (status) {
      case 'on-track':
        return '✓';
      case 'over':
        return '⚠';
      case 'under':
        return '↓';
      default:
        return '•';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'var(--gradient-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--white)', fontSize: '1.1rem' }}>Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--gradient-primary)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--white)',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'opacity 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            color: 'var(--white)',
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            History
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
            Your last 10 days of nutrition tracking
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.9)',
            border: '2px solid var(--error-color)',
            color: 'var(--white)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)'
          }}>
            {error}
          </div>
        )}

        {/* History Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {history.length === 0 ? (
            <div className="glass-card" style={{ 
              padding: '3rem', 
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease'
            }}>
              <p style={{ color: 'var(--gray-600)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                No history available yet
              </p>
              <p style={{ color: 'var(--gray-500)', fontSize: '1rem' }}>
                Start logging meals to see your history!
              </p>
            </div>
          ) : (
            history.map((day, index) => (
              <div
                key={day.date || index}
                className="glass-card"
                style={{
                  animation: `fadeIn 0.5s ease ${index * 0.1}s both`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                  alignItems: window.innerWidth < 768 ? 'stretch' : 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem'
                }}>
                  {/* Date and Status */}
                  <div style={{ flex: '1' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      color: 'var(--gray-800)',
                      marginBottom: '0.75rem'
                    }}>
                      {formatDate(day.date)}
                    </h3>
                    <div 
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        border: '2px solid',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        ...getComplianceStyle(day.status)
                      }}
                    >
                      {getComplianceIcon(day.status)} {day.status.replace('-', ' ')}
                    </div>
                  </div>

                  {/* Calories */}
                  <div style={{ textAlign: 'center', minWidth: '120px' }}>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--gray-600)', 
                      marginBottom: '0.25rem' 
                    }}>
                      Calories
                    </p>
                    <p style={{ 
                      fontSize: '2rem', 
                      fontWeight: '700', 
                      color: 'var(--primary-color)',
                      marginBottom: '0.25rem'
                    }}>
                      {day.totalCalories}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      of {day.target} cal
                    </p>
                  </div>

                  {/* Macros */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '1rem',
                    minWidth: '200px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--gray-600)', 
                        marginBottom: '0.25rem' 
                      }}>
                        Protein
                      </p>
                      <p style={{ 
                        fontWeight: '700', 
                        color: '#ea580c',
                        fontSize: '1.1rem'
                      }}>
                        {day.totalProtein}g
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--gray-600)', 
                        marginBottom: '0.25rem' 
                      }}>
                        Carbs
                      </p>
                      <p style={{ 
                        fontWeight: '700', 
                        color: '#ca8a04',
                        fontSize: '1.1rem'
                      }}>
                        {day.totalCarbs}g
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--gray-600)', 
                        marginBottom: '0.25rem' 
                      }}>
                        Fat
                      </p>
                      <p style={{ 
                        fontWeight: '700', 
                        color: '#dc2626',
                        fontSize: '1.1rem'
                      }}>
                        {day.totalFat}g
                      </p>
                    </div>
                  </div>
                </div>

                {/* Difference */}
                <div style={{ 
                  marginTop: '1.5rem', 
                  paddingTop: '1.5rem', 
                  borderTop: '1px solid var(--gray-200)' 
                }}>
                  {day.status === 'on-track' && (
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--success-color)',
                      fontWeight: '500'
                    }}>
                      ✓ Within 10% of target - Great job!
                    </p>
                  )}
                  {day.status === 'over' && (
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--error-color)',
                      fontWeight: '500'
                    }}>
                      ⚠ Over by {Math.abs(day.difference)} calories
                    </p>
                  )}
                  {day.status === 'under' && (
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--warning-color)',
                      fontWeight: '500'
                    }}>
                      ↓ Under by {Math.abs(day.difference)} calories
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Legend */}
        <div className="glass-card" style={{ marginTop: '3rem' }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: 'var(--gray-800)', 
            marginBottom: '1.5rem' 
          }}>
            Compliance Status Guide
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '1rem', 
                height: '1rem', 
                backgroundColor: 'var(--success-color)', 
                borderRadius: '50%' 
              }}></div>
              <p style={{ color: 'var(--gray-700)' }}>
                <span style={{ fontWeight: '600' }}>On Track:</span> Within 10% of target
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '1rem', 
                height: '1rem', 
                backgroundColor: 'var(--error-color)', 
                borderRadius: '50%' 
              }}></div>
              <p style={{ color: 'var(--gray-700)' }}>
                <span style={{ fontWeight: '600' }}>Over:</span> More than 10% above target
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '1rem', 
                height: '1rem', 
                backgroundColor: 'var(--warning-color)', 
                borderRadius: '50%' 
              }}></div>
              <p style={{ color: 'var(--gray-700)' }}>
                <span style={{ fontWeight: '600' }}>Under:</span> More than 10% below target
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
