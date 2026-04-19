import { useEffect, useState } from 'react';

interface RiskScoreRingProps {
  score: number;
  size?: 'sm' | 'lg';
  animated?: boolean;
}

export function RiskScoreRing({ score, size = 'lg', animated = true }: RiskScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(animated ? 0 : score);
  
  const riskColor = score > 70 ? '#EF4444' : score > 40 ? '#F59E0B' : '#10B981';
  const riskLabel = score > 70 ? 'YÜKSEK RİSK' : score > 40 ? 'ORTA RİSK' : 'DÜŞÜK RİSK';
  
  const dimensions = size === 'lg' ? { width: 140, height: 140, stroke: 12, font: 32 } : { width: 80, height: 80, stroke: 8, font: 18 };
  const radius = (dimensions.width - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  
  useEffect(() => {
    if (!animated) return;
    
    const duration = 1500;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score, animated]);
  
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={dimensions.width} height={dimensions.height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={dimensions.width / 2}
          cy={dimensions.height / 2}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={dimensions.stroke}
        />
        {/* Foreground arc */}
        <circle
          cx={dimensions.width / 2}
          cy={dimensions.height / 2}
          r={radius}
          fill="none"
          stroke={riskColor}
          strokeWidth={dimensions.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: animated ? 'none' : 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="text-center -mt-8 relative" style={{ marginTop: size === 'lg' ? '-90px' : '-52px' }}>
        <span 
          className="font-extrabold" 
          style={{ fontSize: dimensions.font, color: riskColor }}
        >
          {animatedScore}
        </span>
      </div>
      {size === 'lg' && (
        <span 
          className="text-xs font-bold px-3 py-1 rounded-full mt-1"
          style={{ 
            backgroundColor: riskColor + '20', 
            color: riskColor 
          }}
        >
          {riskLabel}
        </span>
      )}
    </div>
  );
}
