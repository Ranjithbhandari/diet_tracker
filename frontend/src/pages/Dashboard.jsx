import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ProgressCircle from '../components/ProgressCircle';
import MealCard from '../components/MealCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);

  useEffect(() => {
    fetchTodaysData();
    
    // Listen for meal and activity additions
    const handleDataUpdate = () => {
      fetchTodaysData();
    };
    
    window.addEventListener('mealAdded', handleDataUpdate);
    window.addEventListener('activityAdded', handleDataUpdate);
    window.addEventListener('settingsUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('mealAdded', handleDataUpdate);
      window.removeEventListener('activityAdded', handleDataUpdate);
      window.removeEventListener('settingsUpdated', handleDataUpdate);
    };
  }, []);

  const fetchTodaysData = async () => {
    try {
      setLoading(true);
      
      // Fetch meals and activities in parallel
      const [mealsResponse, activitiesResponse] = await Promise.all([
        api.get('/meals/today'),
        api.get('/activities/today').catch(() => ({ data: { activities: [], totalCaloriesBurned: 0 } }))
      ]);
      
      setMeals(mealsResponse.data.meals || []);
      setTotals(mealsResponse.data.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 });
      setActivities(activitiesResponse.data.activities || []);
      setTotalCaloriesBurned(activitiesResponse.data.totalCaloriesBurned || 0);
      setError('');
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;

    try {
      await api.delete(`/meals/${mealId}`);
      toast.success('🗑️ Meal deleted successfully');
      // Refresh data to get updated totals
      fetchTodaysData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete meal');
    }
  };

  const calorieTarget = user?.useCustomTarget 
    ? (user?.customCalorieTarget || 2000)
    : (user?.calorieTarget || 2000);
  const netCalories = totals.calories - totalCaloriesBurned;

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#ffffff', fontSize: '1.1rem' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            color: '#ffffff',
            marginBottom: '0.5rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.2)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome back, {user?.name?.split(' ')[0]}! 🌟
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.3rem', fontWeight: '500' }}>
            Track your daily nutrition and fitness journey with precision
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

        {/* Main Progress Section - Separate Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Calories Consumed Today */}
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#1f2937',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                🍽️ Calories Consumed
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Today's intake</p>
            </div>
            
            <ProgressCircle
              current={totals.calories}
              target={calorieTarget}
              size={180}
              type="consumed"
              showPercentage={true}
            />
            
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: '800', 
                color: '#1f2937',
                marginBottom: '0.25rem'
              }}>
                {totals.calories}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                of {calorieTarget} kcal target
              </p>
            </div>
          </div>

          {/* Calories Burned Today */}
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#1f2937',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                🔥 Calories Burned
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Today's activity</p>
            </div>
            
            <ProgressCircle
              current={totalCaloriesBurned}
              target={Math.max(500, totalCaloriesBurned || 300)} // Dynamic target or minimum 500
              size={180}
              type="burned"
              showPercentage={false}
            />
            
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: '800', 
                color: '#1f2937',
                marginBottom: '0.25rem'
              }}>
                {totalCaloriesBurned}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                calories burned • {activities.length} activities
              </p>
            </div>
          </div>

          {/* Net Calories */}
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#1f2937',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                ⚖️ Net Calories
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Consumed - Burned</p>
            </div>
            
            <ProgressCircle
              current={netCalories}
              target={calorieTarget}
              size={180}
              type="net"
              showPercentage={false}
            />
            
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: '800', 
                color: netCalories > calorieTarget * 1.1 ? '#ef4444' : 
                       netCalories < calorieTarget * 0.9 ? '#10b981' : '#6366f1',
                marginBottom: '0.25rem'
              }}>
                {netCalories > 0 ? '+' : ''}{netCalories}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                {netCalories > calorieTarget * 1.1 ? 'Surplus' : 
                 netCalories < calorieTarget * 0.9 ? 'Deficit' : 'Maintenance'}
              </p>
            </div>
          </div>
        </div>

        {/* Macronutrients Section */}
        <div className="glass-card" style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            color: '#1f2937', 
            marginBottom: '2rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            🥗 Today's Macronutrients
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)', 
            gap: '2rem' 
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%)',
              borderRadius: '1.5rem',
              padding: '2rem',
              textAlign: 'center',
              border: '2px solid rgba(234, 88, 12, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(234, 88, 12, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥩</p>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                Protein
              </p>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ea580c', marginBottom: '0.25rem' }}>
                {totals.protein}g
              </p>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Target: {user?.macros?.protein || 0}g
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(202, 138, 4, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
              borderRadius: '1.5rem',
              padding: '2rem',
              textAlign: 'center',
              border: '2px solid rgba(202, 138, 4, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(202, 138, 4, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍞</p>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                Carbohydrates
              </p>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ca8a04', marginBottom: '0.25rem' }}>
                {totals.carbs}g
              </p>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Target: {user?.macros?.carbs || 0}g
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(248, 113, 113, 0.05) 100%)',
              borderRadius: '1.5rem',
              padding: '2rem',
              textAlign: 'center',
              border: '2px solid rgba(220, 38, 38, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥑</p>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                Fats
              </p>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#dc2626', marginBottom: '0.25rem' }}>
                {totals.fat}g
              </p>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Target: {user?.macros?.fat || 0}g
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <button
            onClick={() => navigate('/add-meal')}
            className="btn btn-primary"
            style={{
              padding: '1.5rem 2rem',
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              borderRadius: '1.5rem',
              color: '#ffffff',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(79, 172, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 15px 35px rgba(79, 172, 254, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(79, 172, 254, 0.3)';
            }}
          >
            🍽️ Add Meal
          </button>
          <button
            onClick={() => navigate('/activity')}
            className="btn btn-primary"
            style={{
              padding: '1.5rem 2rem',
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
              border: 'none',
              borderRadius: '1.5rem',
              color: '#ffffff',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(255, 107, 107, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 15px 35px rgba(255, 107, 107, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(255, 107, 107, 0.3)';
            }}
          >
            💪 Log Activity
          </button>
        </div>

        {/* Meals List */}
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
            📋 Today's Meals
          </h2>

          {meals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                🍽️
              </div>
              <p style={{ color: '#4b5563', fontSize: '1.4rem', marginBottom: '0.75rem', fontWeight: '600' }}>
                No meals logged yet
              </p>
              <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '2rem' }}>
                Add your first meal to start tracking your nutrition journey!
              </p>
              <button
                onClick={() => navigate('/add-meal')}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  border: 'none',
                  borderRadius: '1rem',
                  color: '#ffffff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🍽️ Add Your First Meal
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {meals.map(meal => (
                <MealCard
                  key={meal._id}
                  meal={meal}
                  onDelete={handleDeleteMeal}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
