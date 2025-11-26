import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Settings() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customCalorieTarget: user?.customCalorieTarget || user?.calorieTarget || 2000,
    useCustomTarget: user?.useCustomTarget || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.customCalorieTarget < 500 || formData.customCalorieTarget > 10000) {
      toast.error('Calorie target must be between 500 and 10,000');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put('/user/settings', {
        customCalorieTarget: parseInt(formData.customCalorieTarget),
        useCustomTarget: formData.useCustomTarget,
      });

      setUser(response.data.user);
      toast.success('Settings updated successfully! 🎉');
      
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('settingsUpdated'));
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const calculatedTarget = user?.calorieTarget || 2000;
  const currentTarget = formData.useCustomTarget ? formData.customCalorieTarget : calculatedTarget;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--gradient-cool)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
            Settings ⚙️
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
            Customize your nutrition targets and preferences
          </p>
        </div>

        {/* Settings Form */}
        <div className="glass-card">
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: 'var(--gray-800)', 
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🎯 Calorie Target Settings
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Current Calculated Target Info */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              border: '2px solid rgba(99, 102, 241, 0.2)'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                color: 'var(--gray-800)', 
                marginBottom: '0.5rem' 
              }}>
                📊 Your Calculated Target
              </h3>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: 'var(--primary-color)',
                marginBottom: '0.5rem'
              }}>
                {calculatedTarget} calories/day
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                Based on your profile: BMR, activity level, and goals
              </p>
            </div>

            {/* Custom Target Toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--gray-800)'
              }}>
                <input
                  type="checkbox"
                  name="useCustomTarget"
                  checked={formData.useCustomTarget}
                  onChange={handleChange}
                  className="checkbox"
                />
                🎛️ Use Custom Calorie Target
              </label>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginLeft: '2rem' }}>
                Override the calculated target with your own custom value
              </p>
            </div>

            {/* Custom Target Input */}
            {formData.useCustomTarget && (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                border: '2px solid rgba(16, 185, 129, 0.2)',
                animation: 'slideUp 0.3s ease'
              }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  color: 'var(--gray-700)', 
                  marginBottom: '0.5rem',
                  fontSize: '1rem'
                }}>
                  🎯 Custom Daily Calorie Target
                </label>
                <input
                  type="number"
                  name="customCalorieTarget"
                  value={formData.customCalorieTarget}
                  onChange={handleChange}
                  min="500"
                  max="10000"
                  step="50"
                  className="input"
                  style={{ 
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    background: 'var(--white)',
                    border: '2px solid var(--success-color)'
                  }}
                  placeholder="2000"
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                  Range: 500 - 10,000 calories per day
                </p>
              </div>
            )}

            {/* Current Active Target Display */}
            <div style={{
              background: formData.useCustomTarget 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(99, 102, 241, 0.1)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              border: `2px solid ${formData.useCustomTarget 
                ? 'rgba(16, 185, 129, 0.2)' 
                : 'rgba(99, 102, 241, 0.2)'}`
            }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                color: 'var(--gray-800)', 
                marginBottom: '0.5rem' 
              }}>
                🎯 Active Target
              </h3>
              <p style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                color: formData.useCustomTarget ? 'var(--success-color)' : 'var(--primary-color)',
                marginBottom: '0.5rem'
              }}>
                {currentTarget} calories/day
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                {formData.useCustomTarget 
                  ? '✨ Using your custom target' 
                  : '📊 Using calculated target'}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                background: loading ? 'var(--gray-400)' : 'var(--gradient-success)',
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                color: 'var(--white)',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'var(--shadow-lg)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div className="spinner spinner-sm" />
                  Saving Settings...
                </span>
              ) : (
                '💾 Save Settings'
              )}
            </button>
          </form>

          {/* Help Section */}
          <div style={{ 
            marginTop: '2rem', 
            paddingTop: '2rem', 
            borderTop: '1px solid var(--gray-200)' 
          }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              color: 'var(--gray-800)', 
              marginBottom: '1rem' 
            }}>
              💡 Tips
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                • <strong>Calculated Target:</strong> Based on your BMR, activity level, and goals
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                • <strong>Custom Target:</strong> Set your own target if you have specific requirements
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                • <strong>Recommendation:</strong> Consult a nutritionist for personalized advice
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}