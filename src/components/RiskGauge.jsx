import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function RiskGauge({ score, size = 200 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - 20) / 2;
  const cx = size / 2;
  const cy = size / 2 + 10;
  
  // Semicircle arc calculation
  const circumference = Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const offset = circumference - progress;

  // Color based on score
  const getColor = (s) => {
    if (s >= 75) return '#4a0d0d';
    if (s >= 50) return '#7a3b1a';
    if (s >= 25) return '#8a6820';
    return '#1b4332';
  };

  const getLabel = (s) => {
    if (s >= 75) return 'CRITICAL';
    if (s >= 50) return 'HIGH';
    if (s >= 25) return 'MEDIUM';
    return 'LOW';
  };

  const getGlowColor = (s) => {
    if (s >= 75) return 'rgba(74, 13, 13, 0.3)';
    if (s >= 50) return 'rgba(122, 59, 26, 0.25)';
    if (s >= 25) return 'rgba(138, 104, 32, 0.2)';
    return 'rgba(27, 67, 50, 0.2)';
  };

  const color = getColor(animatedScore);
  const label = getLabel(animatedScore);

  return (
    <div className="flex flex-col items-center" role="img" aria-label={`Risk score: ${score} out of 100, ${label} risk`}>
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        {/* Background arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#D2C7AB"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.4"
        />
        
        {/* Progress arc */}
        <motion.path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 8px ${getGlowColor(animatedScore)})` }}
        />

        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = Math.PI - (tick / 100) * Math.PI;
          const x1 = cx + (radius - 18) * Math.cos(angle);
          const y1 = cy - (radius - 18) * Math.sin(angle);
          const x2 = cx + (radius + 4) * Math.cos(angle);
          const y2 = cy - (radius + 4) * Math.sin(angle);
          return (
            <line
              key={tick}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#2C221A"
              strokeWidth="1.5"
              opacity="0.3"
            />
          );
        })}

        {/* Center score text */}
        <motion.text
          x={cx}
          y={cy - 20}
          textAnchor="middle"
          className="font-serif"
          fill={color}
          fontSize={size * 0.22}
          fontWeight="900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {animatedScore}
        </motion.text>

        {/* Label */}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fill={color}
          fontSize="9"
          fontWeight="700"
          letterSpacing="3"
          className="font-sans uppercase"
        >
          {label} RISK
        </text>
      </svg>
    </div>
  );
}
