import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { foodCategories, searchFoods } from '../data/indianFoods';

export default function AddMeal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mealType, setMealType] = useState('breakfast');
  const [foods, setFoods] = useState([]);
  const [currentFood, setCurrentFood] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    quantity: 1,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);

  const filteredFoods = searchFoods(searchQuery, selectedCategory);

  const handleCurrentFoodChange = (e) => {
    const { name, value } = e.target;
    setCurrentFood(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentFood(prev => ({ ...prev, foodName: value }));
    setShowDropdown(true);
    setIsManualEntry(true);
  };

  const selectFood = (food) => {
    setCurrentFood({
      ...currentFood,
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    });
    setSearchQuery(food.name);
    setShowDropdown(false);
    setIsManualEntry(false);
    toast.success(`✅ ${food.name} selected!`);
  };

  const addFoodToMeal = () => {
    // Validation
    if (!currentFood.foodName.trim()) {
      toast.error('Food name is required');
      return;
    }

    if (!currentFood.calories || currentFood.calories < 0) {
      toast.error('Valid calories are required');
      return;
    }

    if (!currentFood.protein || currentFood.protein < 0) {
      toast.error('Valid protein is required');
      return;
    }

    if (!currentFood.carbs || currentFood.carbs < 0) {
      toast.error('Valid carbs are required');
      return;
    }

    if (!currentFood.fat || currentFood.fat < 0) {
      toast.error('Valid fat is required');
      return;
    }

    if (!currentFood.quantity || currentFood.quantity < 0.1) {
      toast.error('Valid quantity is required');
      return;
    }

    const quantity = parseFloat(currentFood.quantity);
    const foodToAdd = {
      id: Date.now(),
      foodName: currentFood.foodName,
      calories: Math.round(parseFloat(currentFood.calories) * quantity),
      protein: Math.round(parseFloat(currentFood.protein) * quantity * 10) / 10,
      carbs: Math.round(parseFloat(currentFood.carbs) * quantity * 10) / 10,
      fat: Math.round(parseFloat(currentFood.fat) * quantity * 10) / 10,
      quantity: quantity,
      baseCalories: parseFloat(currentFood.calories),
      baseProtein: parseFloat(currentFood.protein),
      baseCarbs: parseFloat(currentFood.carbs),
      baseFat: parseFloat(currentFood.fat),
    };

    setFoods(prev => [...prev, foodToAdd]);
    
    // Reset current food form
    setCurrentFood({
      foodName: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      quantity: 1,
    });
    setSearchQuery('');
    setIsManualEntry(false);
    
    toast.success(`🍽️ ${foodToAdd.foodName} added to meal!`);
  };

  const removeFoodFromMeal = (foodId) => {
    setFoods(prev => prev.filter(food => food.id !== foodId));
    toast.success('🗑️ Food removed from meal');
  };

  const getTotalNutrition = () => {
    return foods.reduce((total, food) => ({
      calories: total.calories + food.calories,
      protein: Math.round((total.protein + food.protein) * 10) / 10,
      carbs: Math.round((total.carbs + food.carbs) * 10) / 10,
      fat: Math.round((total.fat + food.fat) * 10) / 10,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (foods.length === 0) {
      toast.error('Please add at least one food item to the meal');
      return;
    }

    try {
      setLoading(true);
      const totalNutrition = getTotalNutrition();
      const foodNames = foods.map(food => 
        food.quantity === 1 ? food.foodName : `${food.foodName} (${food.quantity}x)`
      ).join(', ');

      await api.post('/meals', {
        mealType: mealType,
        foodName: foodNames,
        calories: totalNutrition.calories,
        protein: totalNutrition.protein,
        carbs: totalNutrition.carbs,
        fat: totalNutrition.fat,
        foods: foods, // Store individual foods for detailed tracking
      });

      toast.success('Meal added successfully! 🎉');
      
      // Trigger dashboard refresh by dispatching custom event
      window.dispatchEvent(new Event('mealAdded'));
      
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add meal');
    } finally {
      setLoading(false);
    }
  };

  const totalNutrition = getTotalNutrition();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'opacity 0.2s ease',
              margin: '0 auto 1.5rem auto'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            color: '#ffffff',
            marginBottom: '0.75rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.2)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🍽️ Add Meal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.3rem', fontWeight: '500' }}>
            Build your meal by adding multiple foods from our comprehensive Indian database
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
          gap: '2rem'
        }}>
          {/* Add Food Form */}
          <div className="glass-card">
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: 'var(--gray-800)', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🥘 Add Food to Meal
            </h2>

            {/* Meal Type */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="select"
              >
                <option value="breakfast">🌅 Breakfast</option>
                <option value="lunch">🍽️ Lunch</option>
                <option value="dinner">🌙 Dinner</option>
                <option value="snack">🍎 Snack</option>
              </select>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">🏷️ Food Category</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {foodCategories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className="btn btn-sm"
                    style={{
                      background: selectedCategory === category 
                        ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      color: selectedCategory === category 
                        ? '#ffffff' 
                        : '#374151',
                      fontSize: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      border: selectedCategory === category 
                        ? 'none' 
                        : '1px solid rgba(209, 213, 219, 0.5)',
                      fontWeight: selectedCategory === category ? '600' : '500',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedCategory === category 
                        ? '0 4px 12px rgba(79, 172, 254, 0.3)' 
                        : 'none'
                    }}
                    onMouseOver={(e) => {
                      if (selectedCategory !== category) {
                        e.target.style.background = 'rgba(79, 172, 254, 0.1)';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedCategory !== category) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Search */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <label className="label">🔍 Search Indian Food Database</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search for Roti, Biryani, Dal, Idli, Samosa, etc..."
                  className="input"
                  style={{
                    paddingRight: '3rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  fontSize: '1.2rem'
                }}>
                  🔍
                </span>
              </div>

              {/* Enhanced Dropdown */}
              {showDropdown && filteredFoods.length > 0 && (
                <div style={{
                  position: 'absolute',
                  zIndex: 10,
                  width: '100%',
                  marginTop: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(79, 172, 254, 0.2)',
                  borderRadius: '1.5rem',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <div style={{ 
                    padding: '0.75rem 1rem', 
                    borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                    background: 'rgba(79, 172, 254, 0.05)',
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    fontWeight: '600'
                  }}>
                    Found {filteredFoods.length} foods • Showing top 12
                  </div>
                  {filteredFoods.slice(0, 12).map((food, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectFood(food)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        borderBottom: index < filteredFoods.slice(0, 12).length - 1 ? '1px solid rgba(229, 231, 235, 0.3)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(79, 172, 254, 0.08)';
                        e.target.style.transform = 'translateX(4px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'none';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ 
                            fontWeight: '700', 
                            color: '#1f2937', 
                            marginBottom: '0.25rem',
                            fontSize: '0.95rem'
                          }}>
                            {food.name}
                          </p>
                          <p style={{ 
                            fontSize: '0.75rem', 
                            color: '#6b7280',
                            background: 'rgba(79, 172, 254, 0.1)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.5rem',
                            display: 'inline-block'
                          }}>
                            {food.category}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
                          <p style={{ 
                            fontSize: '1rem', 
                            fontWeight: '800', 
                            color: '#4facfe',
                            marginBottom: '0.25rem'
                          }}>
                            {food.calories} cal
                          </p>
                          <p style={{ 
                            fontSize: '0.7rem', 
                            color: '#9ca3af',
                            display: 'flex',
                            gap: '0.5rem'
                          }}>
                            <span>P:{food.protein}g</span>
                            <span>C:{food.carbs}g</span>
                            <span>F:{food.fat}g</span>
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Manual Entry Hint */}
            {isManualEntry && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.05) 100%)',
                border: '2px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '1rem',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#3b82f6',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  💡 <strong>Manual Entry Mode</strong>
                </p>
                <p style={{ 
                  fontSize: '0.8rem', 
                  color: '#6b7280',
                  marginTop: '0.5rem'
                }}>
                  You can manually enter nutritional values below or select from our comprehensive Indian food database above.
                </p>
              </div>
            )}

            {/* Nutritional Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="label">Calories *</label>
                <input
                  type="number"
                  name="calories"
                  value={currentFood.calories}
                  onChange={handleCurrentFoodChange}
                  placeholder="0"
                  min="0"
                  step="1"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={currentFood.quantity}
                  onChange={handleCurrentFoodChange}
                  placeholder="1"
                  min="0.1"
                  step="0.1"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Protein (g) *</label>
                <input
                  type="number"
                  name="protein"
                  value={currentFood.protein}
                  onChange={handleCurrentFoodChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Carbs (g) *</label>
                <input
                  type="number"
                  name="carbs"
                  value={currentFood.carbs}
                  onChange={handleCurrentFoodChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                  className="input"
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label className="label">Fat (g) *</label>
                <input
                  type="number"
                  name="fat"
                  value={currentFood.fat}
                  onChange={handleCurrentFoodChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                  className="input"
                />
              </div>
            </div>

            {/* Add Food Button */}
            <button
              type="button"
              onClick={addFoodToMeal}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                background: 'var(--gradient-success)',
                marginBottom: '1rem'
              }}
            >
              ➕ Add to Meal
            </button>
          </div>

          {/* Meal Summary */}
          <div className="glass-card">
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: 'var(--gray-800)', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📋 Meal Summary
            </h2>

            {/* Meal Type Display */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {mealType === 'breakfast' && '🌅'}
                {mealType === 'lunch' && '🍽️'}
                {mealType === 'dinner' && '🌙'}
                {mealType === 'snack' && '🍎'}
              </p>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--gray-800)', textTransform: 'capitalize' }}>
                {mealType}
              </p>
            </div>

            {/* Foods List */}
            {foods.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍽️</p>
                <p style={{ color: 'var(--gray-600)', fontSize: '1rem' }}>
                  No foods added yet
                </p>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                  Add foods using the form on the left
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '1rem' }}>
                  Foods in this meal:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {foods.map((food) => (
                    <div
                      key={food.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '0.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '600', color: 'var(--gray-800)', marginBottom: '0.25rem' }}>
                          {food.foodName} {food.quantity !== 1 && `(${food.quantity}x)`}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                          {food.calories} cal • P:{food.protein}g • C:{food.carbs}g • F:{food.fat}g
                        </p>
                      </div>
                      <button
                        onClick={() => removeFoodFromMeal(food.id)}
                        style={{
                          background: 'var(--error-color)',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--white)',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#dc2626'}
                        onMouseOut={(e) => e.target.style.background = 'var(--error-color)'}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Nutrition */}
            {foods.length > 0 && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '1rem' }}>
                  🎯 Total Nutrition
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                      {totalNutrition.calories}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Calories</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ea580c' }}>
                      {totalNutrition.protein}g
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Protein</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ca8a04' }}>
                      {totalNutrition.carbs}g
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Carbs</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>
                      {totalNutrition.fat}g
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Fat</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem 1.5rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || foods.length === 0}
                className="btn btn-primary"
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  background: loading ? 'var(--gray-400)' : 'var(--gradient-success)',
                  opacity: foods.length === 0 ? 0.5 : 1,
                  cursor: foods.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <div className="spinner spinner-sm" />
                    Adding Meal...
                  </span>
                ) : (
                  '🍽️ Add Meal'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
