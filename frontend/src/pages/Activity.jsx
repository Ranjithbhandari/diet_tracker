import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ACTIVITY_TYPES = [
  { value: 'walking', label: '🚶 Walking', icon: '🚶‍♂️' },
  { value: 'running', label: '🏃 Running', icon: '🏃‍♂️' },
  { value: 'cycling', label: '🚴 Cycling', icon: '🚴‍♂️' },
  { value: 'gym', label: '💪 Gym Workout', icon: '🏋️‍♂️' },
  { value: 'yoga', label: '🧘 Yoga', icon: '🧘‍♀️' },
  { value: 'swimming', label: '🏊 Swimming', icon: '🏊‍♂️' },
  { value: 'sports', label: '⚽ Sports', icon: '🏀' },
  { value: 'dancing', label: '💃 Dancing', icon: '💃' },
  { value: 'hiking', label: '🥾 Hiking', icon: '🏔️' },
  { value: 'other', label: '🎯 Other', icon: '🎯' },
];

const INTENSITY_LEVELS = [
  { value: 'low', label: 'Low', color: '#10b981', description: 'Light effort, can talk easily' },
  { value: 'moderate', label: 'Moderate', color: '#f59e0b', description: 'Some effort, can talk with breaks' },
  { value: 'high', label: 'High', color: '#ef4444', description: 'High effort, difficult to talk' },
];

export default function Activity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    activityType: 'walking',
    duration: '',
    intensity: 'moderate',
    notes: '',
  });

  useEffect(() => {
    fetchTodaysActivities();
  }, []);

  const fetchTodaysActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/activities/today');
      setActivities(response.data.activities || []);
      setTotalCaloriesBurned(response.data.totalCaloriesBurned || 0);
      setError('');
    } catch (err) {
      console.error('Activities fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.duration || formData.duration < 1) {
      toast.error('Please enter a valid duration');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/activities', {
        activityType: formData.activityType,
        duration: parseInt(formData.duration),
        intensity: formData.intensity,
        notes: formData.notes,
      });

      toast.success(`Activity logged! Burned ${response.data.activity.caloriesBurned} calories 🔥`);
      
      // Reset form and refresh activities
      setFormData({
        activityType: 'walking',
        duration: '',
        intensity: 'moderate',
        notes: '',
      });
      setShowForm(false);
      fetchTodaysActivities();
      
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('activityAdded'));
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log activity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      await api.delete(`/activities/${activityId}`);
      toast.success('Activity deleted successfully');
      fetchTodaysActivities();
      window.dispatchEvent(new Event('activityAdded'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete activity');
    }
  };

  const getActivityIcon = (type) => {
    return ACTIVITY_TYPES.find(a => a.value === type)?.icon || '🎯';
  };

  const getIntensityColor = (intensity) => {
    return INTENSITY_LEVELS.find(i => i.value === intensity)?.color || '#6b7280';
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'var(--gradient-warm)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--white)', fontSize: '1.1rem' }}>Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--gradient-warm)',
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
            Activity Tracker
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
            Log your workouts and track calories burned
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

        {/* Stats Card */}
        <div className="glass-card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: 'var(--gray-800)', 
            marginBottom: '1rem' 
          }}>
            Today's Activity Summary
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '3rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.5rem' }}>
                🔥 {totalCaloriesBurned}
              </p>
              <p style={{ color: 'var(--gray-600)', fontWeight: '500' }}>Calories Burned</p>
            </div>
            <div>
              <p style={{ fontSize: '3rem', fontWeight: '700', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                💪 {activities.length}
              </p>
              <p style={{ color: 'var(--gray-600)', fontWeight: '500' }}>Activities</p>
            </div>
            <div>
              <p style={{ fontSize: '3rem', fontWeight: '700', color: '#06b6d4', marginBottom: '0.5rem' }}>
                ⏱️ {activities.reduce((sum, a) => sum + a.duration, 0)}
              </p>
              <p style={{ color: 'var(--gray-600)', fontWeight: '500' }}>Minutes</p>
            </div>
          </div>
        </div>

        {/* Add Activity Button */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              background: showForm ? 'var(--error-color)' : 'var(--gradient-success)',
              border: 'none',
              borderRadius: 'var(--radius-xl)',
              color: 'var(--white)',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {showForm ? '✕ Cancel' : '+ Log New Activity'}
          </button>
        </div>

        {/* Activity Form */}
        {showForm && (
          <div className="glass-card" style={{ marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: 'var(--gray-800)', 
              marginBottom: '1.5rem' 
            }}>
              Log New Activity
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Activity Type */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  color: 'var(--gray-700)', 
                  marginBottom: '0.5rem' 
                }}>
                  Activity Type
                </label>
                <select
                  name="activityType"
                  value={formData.activityType}
                  onChange={handleChange}
                  className="select"
                  style={{ fontSize: '1rem' }}
                >
                  {ACTIVITY_TYPES.map(activity => (
                    <option key={activity.value} value={activity.value}>
                      {activity.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration and Intensity */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
                gap: '1.5rem'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    color: 'var(--gray-700)', 
                    marginBottom: '0.5rem' 
                  }}>
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="30"
                    min="1"
                    max="1440"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    color: 'var(--gray-700)', 
                    marginBottom: '0.5rem' 
                  }}>
                    Intensity Level
                  </label>
                  <select
                    name="intensity"
                    value={formData.intensity}
                    onChange={handleChange}
                    className="select"
                  >
                    {INTENSITY_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  color: 'var(--gray-700)', 
                  marginBottom: '0.5rem' 
                }}>
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="How did it feel? Any achievements?"
                  rows="3"
                  className="input"
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  background: submitting ? 'var(--gray-400)' : 'var(--gradient-success)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--white)',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Logging Activity...' : 'Log Activity'}
              </button>
            </form>
          </div>
        )}

        {/* Activities List */}
        <div className="glass-card">
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: 'var(--gray-800)', 
            marginBottom: '1.5rem' 
          }}>
            Today's Activities
          </h2>

          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏃‍♂️</p>
              <p style={{ color: 'var(--gray-600)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                No activities logged yet
              </p>
              <p style={{ color: 'var(--gray-500)', fontSize: '1rem' }}>
                Start your fitness journey by logging your first activity!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activities.map((activity, index) => (
                <div
                  key={activity._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    animation: `slideIn 0.3s ease ${index * 0.1}s both`,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{getActivityIcon(activity.activityType)}</span>
                        <h3 style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '700', 
                          color: 'var(--gray-800)',
                          textTransform: 'capitalize'
                        }}>
                          {activity.activityType.replace('_', ' ')}
                        </h3>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--gray-600)',
                          background: 'rgba(99, 102, 241, 0.1)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: '500'
                        }}>
                          ⏱️ {formatDuration(activity.duration)}
                        </span>
                        <span style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--white)',
                          background: getIntensityColor(activity.intensity),
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {activity.intensity} Intensity
                        </span>
                      </div>

                      {activity.notes && (
                        <p style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--gray-600)', 
                          fontStyle: 'italic',
                          marginTop: '0.5rem'
                        }}>
                          "{activity.notes}"
                        </p>
                      )}
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      flexShrink: 0
                    }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '700', 
                          color: '#ef4444',
                          marginBottom: '0.25rem'
                        }}>
                          🔥 {activity.caloriesBurned}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                          calories burned
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteActivity(activity._id)}
                        style={{
                          background: 'var(--error-color)',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--white)',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#dc2626'}
                        onMouseOut={(e) => e.target.style.background = 'var(--error-color)'}
                        title="Delete activity"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}