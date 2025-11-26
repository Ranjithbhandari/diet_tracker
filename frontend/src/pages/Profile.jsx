import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    age: user?.age || '',
    gender: user?.gender || 'male',
    height: user?.height || '',
    weight: user?.weight || '',
    activityLevel: user?.activityLevel || 'moderate',
    goal: user?.goal || 'maintain',
    dietType: user?.dietType || 'balanced',
  });

  const [results, setResults] = useState(null);

  useEffect(() => {
    if (user?.calorieTarget) {
      setResults({
        bmr: user.bmr,
        tdee: user.tdee,
        calorieTarget: user.calorieTarget,
        macros: user.macros,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.age || formData.age < 1 || formData.age > 150) {
      setError('Please enter a valid age (1-150)');
      return;
    }

    if (!formData.height || formData.height < 50 || formData.height > 300) {
      setError('Please enter a valid height in cm (50-300)');
      return;
    }

    if (!formData.weight || formData.weight < 20 || formData.weight > 500) {
      setError('Please enter a valid weight in kg (20-500)');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put('/user/profile', {
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        dietType: formData.dietType,
      });

      setResults(response.data.assessment);
      setUser(response.data.user);
      
      // Show success toast and stay on page
      toast.success('🎉 Profile updated successfully! Your nutrition targets have been calculated.');
      
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('settingsUpdated'));
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              color: '#ffffff',
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
            fontWeight: '800', 
            color: '#ffffff',
            marginBottom: '0.5rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            🧮 Diet Assessment
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem' }}>
            Complete your profile to get personalized nutrition targets using the Mifflin-St Jeor formula
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.95)',
            border: '2px solid #ef4444',
            color: '#ffffff',
            padding: '1rem 1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
          gap: '2rem'
        }}>
          {/* Form */}
          <div className="glass-card">
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📝 Your Information
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Age */}
              <div>
                <label className="label">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                  min="1"
                  max="150"
                  className="input"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="label">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="male">👨 Male</option>
                  <option value="female">👩 Female</option>
                </select>
              </div>

              {/* Height */}
              <div>
                <label className="label">Height (cm) *</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="175"
                  min="50"
                  max="300"
                  className="input"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="label">Weight (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="75"
                  min="20"
                  max="500"
                  className="input"
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="label">Activity Level *</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="sedentary">🛋️ Sedentary (1.2x) - Little or no exercise</option>
                  <option value="light">🚶 Light (1.375x) - Light exercise 1-3 days/week</option>
                  <option value="moderate">🏃 Moderate (1.55x) - Moderate exercise 3-5 days/week</option>
                  <option value="active">💪 Active (1.725x) - Heavy exercise 6-7 days/week</option>
                  <option value="very_active">🏋️ Very Active (1.9x) - Very heavy exercise, physical job</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="label">Goal *</label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="lose">📉 Lose Weight (-500 cal/day)</option>
                  <option value="maintain">⚖️ Maintain Weight (TDEE)</option>
                  <option value="gain">📈 Gain Weight (+500 cal/day)</option>
                </select>
              </div>

              {/* Diet Type */}
              <div>
                <label className="label">Diet Type *</label>
                <select
                  name="dietType"
                  value={formData.dietType}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="balanced">🥗 Balanced (30% protein, 40% carbs, 30% fat)</option>
                  <option value="low_carb">🥩 Low Carb (35% protein, 25% carbs, 40% fat)</option>
                  <option value="high_protein">💪 High Protein (40% protein, 30% carbs, 30% fat)</option>
                  <option value="keto">🥑 Keto (25% protein, 5% carbs, 70% fat)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  marginTop: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <div className="spinner spinner-sm" />
                    Calculating...
                  </span>
                ) : (
                  '🧮 Calculate & Save'
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="glass-card">
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📊 Your Results
            </h2>

            {results ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* BMR */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.05) 100%)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '2px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                    🔥 Basal Metabolic Rate (BMR)
                  </p>
                  <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#3b82f6', marginBottom: '0.25rem' }}>
                    {Math.round(results.bmr)}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    Calories burned at rest (Mifflin-St Jeor formula)
                  </p>
                </div>

                {/* TDEE */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(196, 181, 253, 0.05) 100%)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '2px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                    ⚡ Total Daily Energy Expenditure (TDEE)
                  </p>
                  <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#8b5cf6', marginBottom: '0.25rem' }}>
                    {Math.round(results.tdee)}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    BMR × Activity Level ({formData.activityLevel})
                  </p>
                </div>

                {/* Calorie Target */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(110, 231, 183, 0.05) 100%)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '2px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                    🎯 Daily Calorie Target
                  </p>
                  <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981', marginBottom: '0.25rem' }}>
                    {Math.round(results.calorieTarget)}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    Based on your {formData.goal} goal
                  </p>
                </div>

                {/* Macros */}
                <div style={{ 
                  marginTop: '1rem', 
                  paddingTop: '1.5rem', 
                  borderTop: '2px solid rgba(229, 231, 235, 0.3)' 
                }}>
                  <p style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '700', 
                    color: '#1f2937', 
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    🥗 Daily Macro Targets
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'rgba(234, 88, 12, 0.1)',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(234, 88, 12, 0.2)'
                    }}>
                      <span style={{ color: '#1f2937', fontWeight: '600' }}>🥩 Protein</span>
                      <span style={{ fontWeight: '800', color: '#ea580c', fontSize: '1.2rem' }}>
                        {Math.round(results.macros.protein)}g
                      </span>
                    </div>
                    <div style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'rgba(202, 138, 4, 0.1)',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(202, 138, 4, 0.2)'
                    }}>
                      <span style={{ color: '#1f2937', fontWeight: '600' }}>🍞 Carbohydrates</span>
                      <span style={{ fontWeight: '800', color: '#ca8a04', fontSize: '1.2rem' }}>
                        {Math.round(results.macros.carbs)}g
                      </span>
                    </div>
                    <div style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'rgba(220, 38, 38, 0.1)',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(220, 38, 38, 0.2)'
                    }}>
                      <span style={{ color: '#1f2937', fontWeight: '600' }}>🥑 Fats</span>
                      <span style={{ fontWeight: '800', color: '#dc2626', fontSize: '1.2rem' }}>
                        {Math.round(results.macros.fat)}g
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '1rem',
                    color: '#ffffff',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                    marginTop: '1rem'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  📊 View Dashboard
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  🧮
                </div>
                <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  No calculations yet
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                  Fill out the form to calculate your personalized nutrition targets
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
