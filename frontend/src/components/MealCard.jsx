

import { useState } from 'react';

export default function MealCard({ meal, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const getMealTypeIcon = (type) => {
    switch (type) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🍽️';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍎';
      default:
        return '🍴';
    }
  };

  const getMealTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getMealTypeColor = (type) => {
    switch (type) {
      case 'breakfast':
        return {
          bg: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
          border: 'rgba(245, 158, 11, 0.3)',
          badge: 'rgba(245, 158, 11, 0.2)',
          badgeText: '#d97706'
        };
      case 'lunch':
        return {
          bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: 'rgba(16, 185, 129, 0.3)',
          badge: 'rgba(16, 185, 129, 0.2)',
          badgeText: '#059669'
        };
      case 'dinner':
        return {
          bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: 'rgba(139, 92, 246, 0.3)',
          badge: 'rgba(139, 92, 246, 0.2)',
          badgeText: '#7c3aed'
        };
      case 'snack':
        return {
          bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)',
          border: 'rgba(219, 39, 119, 0.3)',
          badge: 'rgba(219, 39, 119, 0.2)',
          badgeText: '#be185d'
        };
      default:
        return {
          bg: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)',
          border: 'rgba(107, 114, 128, 0.3)',
          badge: 'rgba(107, 114, 128, 0.2)',
          badgeText: '#4b5563'
        };
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(meal._id);
    } finally {
      setIsDeleting(false);
    }
  };

  const colors = getMealTypeColor(meal.mealType);

  return (
    <div 
      style={{
        background: colors.bg,
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        border: `2px solid ${colors.border}`,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Decorative gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle, ${colors.border} 0%, transparent 70%)`,
        opacity: 0.3,
        pointerEvents: 'none'
      }} />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        alignItems: window.innerWidth < 768 ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Meal Info */}
        <div style={{ flex: '1' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            marginBottom: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
              {getMealTypeIcon(meal.mealType)}
            </span>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: 'var(--gray-800)',
              margin: 0,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {meal.foodName}
            </h3>
            <span style={{
              fontSize: '0.75rem',
              background: colors.badge,
              color: colors.badgeText,
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {getMealTypeLabel(meal.mealType)}
            </span>
          </div>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--gray-600)',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🕐</span>
            {meal.createdAt && new Date(meal.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Nutritional Info */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: window.innerWidth < 768 ? '0.75rem' : '1rem',
          minWidth: window.innerWidth < 768 ? 'auto' : '280px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--gray-600)', 
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              Calories
            </p>
            <p style={{ 
              fontWeight: '700', 
              color: 'var(--primary-color)',
              fontSize: '1.1rem'
            }}>
              {meal.calories}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--gray-600)', 
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              Protein
            </p>
            <p style={{ 
              fontWeight: '700', 
              color: '#ea580c',
              fontSize: '1.1rem'
            }}>
              {meal.protein}g
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--gray-600)', 
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              Carbs
            </p>
            <p style={{ 
              fontWeight: '700', 
              color: '#ca8a04',
              fontSize: '1.1rem'
            }}>
              {meal.carbs}g
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--gray-600)', 
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              Fat
            </p>
            <p style={{ 
              fontWeight: '700', 
              color: '#dc2626',
              fontSize: '1.1rem'
            }}>
              {meal.fat}g
            </p>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            background: isDeleting ? 'var(--gray-400)' : 'var(--error-color)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--white)',
            padding: '0.75rem 1rem',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            minWidth: '80px',
            opacity: isDeleting ? 0.7 : 1,
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseOver={(e) => {
            if (!isDeleting) {
              e.target.style.background = '#dc2626';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = 'var(--shadow-lg)';
            }
          }}
          onMouseOut={(e) => {
            if (!isDeleting) {
              e.target.style.background = 'var(--error-color)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'var(--shadow-md)';
            }
          }}
        >
          {isDeleting ? (
            <>
              <div className="spinner spinner-sm" />
              Deleting...
            </>
          ) : (
            <>
              🗑️ Delete
            </>
          )}
        </button>
      </div>
    </div>
  );
}
