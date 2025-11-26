
import { useEffect, useState } from 'react';

export default function ProgressCircle({ 
  current, 
  target, 
  size = 200, 
  type = 'net', // 'consumed', 'burned', 'net'
  label = '',
  showPercentage = true 
}) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  
  const actualPercentage = Math.min(100, (current / target) * 100);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  // Animate the progress on mount and when values change
  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const startPercentage = animatedPercentage;
    const startCurrent = animatedCurrent;
    const targetPercentage = actualPercentage;
    const targetCurrent = current;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      setAnimatedPercentage(startPercentage + (targetPercentage - startPercentage) * easeProgress);
      setAnimatedCurrent(Math.round(startCurrent + (targetCurrent - startCurrent) * easeProgress));
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedPercentage(targetPercentage);
        setAnimatedCurrent(targetCurrent);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [current, target, actualPercentage]);

  // Determine color and status based on type and percentage
  let color, glowColor, status, gradient;
  
  if (type === 'consumed') {
    if (animatedPercentage > 110) {
      color = '#ef4444';
      glowColor = 'rgba(239, 68, 68, 0.3)';
      status = 'Over Target';
      gradient = 'url(#consumedOverGradient)';
    } else if (animatedPercentage >= 90) {
      color = '#10b981';
      glowColor = 'rgba(16, 185, 129, 0.3)';
      status = 'On Track';
      gradient = 'url(#consumedGoodGradient)';
    } else {
      color = '#3b82f6';
      glowColor = 'rgba(59, 130, 246, 0.3)';
      status = 'Under Target';
      gradient = 'url(#consumedNormalGradient)';
    }
  } else if (type === 'burned') {
    color = '#f59e0b';
    glowColor = 'rgba(245, 158, 11, 0.3)';
    status = 'Active';
    gradient = 'url(#burnedGradient)';
  } else { // net calories
    if (current > target * 1.1) {
      color = '#ef4444';
      glowColor = 'rgba(239, 68, 68, 0.3)';
      status = 'Surplus';
      gradient = 'url(#netSurplusGradient)';
    } else if (current < target * 0.9) {
      color = '#10b981';
      glowColor = 'rgba(16, 185, 129, 0.3)';
      status = 'Deficit';
      gradient = 'url(#netDeficitGradient)';
    } else {
      color = '#6366f1';
      glowColor = 'rgba(99, 102, 241, 0.3)';
      status = 'Maintenance';
      gradient = 'url(#netMaintenanceGradient)';
    }
  }

  return (
    <div style={{ 
      position: 'relative',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <svg 
        width={size} 
        height={size} 
        style={{ 
          transform: 'rotate(-90deg)',
          filter: `drop-shadow(0 0 15px ${glowColor})`
        }}
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="consumedNormalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c9ff" />
            <stop offset="100%" stopColor="#92fe9d" />
          </linearGradient>
          <linearGradient id="consumedGoodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>
          <linearGradient id="consumedOverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#feca57" />
          </linearGradient>
          <linearGradient id="burnedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#feca57" />
          </linearGradient>
          <linearGradient id="netDeficitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>
          <linearGradient id="netSurplusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#ff8e53" />
          </linearGradient>
          <linearGradient id="netMaintenanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(229, 231, 235, 0.2)"
          strokeWidth="8"
        />
        
        {/* Glow effect circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={glowColor}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ 
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 0.4
          }}
        />
        
        {/* Main progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gradient}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ 
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: animatedPercentage > 0 ? 'pulse 3s ease-in-out infinite' : 'none'
          }}
        />
        
        {/* Animated dot at progress end */}
        {animatedPercentage > 0 && (
          <circle
            cx={size / 2 + radius * Math.cos((animatedPercentage / 100) * 2 * Math.PI - Math.PI / 2)}
            cy={size / 2 + radius * Math.sin((animatedPercentage / 100) * 2 * Math.PI - Math.PI / 2)}
            r="4"
            fill={color}
            style={{
              animation: 'float 2s ease-in-out infinite',
              filter: `drop-shadow(0 0 8px ${color})`
            }}
          />
        )}
      </svg>

      {/* Text in center */}
      <div style={{
        position: 'absolute',
        textAlign: 'center',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '80%'
      }}>
        {showPercentage && (
          <p style={{ 
            fontSize: size > 150 ? '2.2rem' : '1.8rem', 
            fontWeight: '800', 
            color: 'var(--gray-800)',
            marginBottom: '0.25rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {type === 'net' ? animatedCurrent : Math.round(animatedPercentage)}
            {type !== 'net' && '%'}
          </p>
        )}
        
        <p style={{ 
          fontSize: size > 150 ? '0.9rem' : '0.8rem', 
          color: 'var(--gray-600)',
          fontWeight: '600',
          marginBottom: '0.25rem'
        }}>
          {type === 'net' ? 'Net Calories' : `${animatedCurrent} / ${target}`}
        </p>
        
        {label && (
          <p style={{ 
            fontSize: size > 150 ? '0.75rem' : '0.65rem', 
            color: color,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {label}
          </p>
        )}
        
        <p style={{ 
          fontSize: size > 150 ? '0.7rem' : '0.6rem', 
          color: color,
          fontWeight: '600',
          marginTop: '0.25rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {status}
        </p>
      </div>
      
      {/* Enhanced animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.02);
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
            opacity: 1;
          }
          50% { 
            transform: translateY(-3px) scale(1.2); 
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
