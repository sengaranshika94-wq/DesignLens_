import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn, getScoreStroke, getScoreLabel } from '@/lib/utils';

export default function ScoreRing({
  score = 0,
  size = 120,
  strokeWidth = 10,
  showLabel = true,
  className,
  animate = true,
}) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeColor = getScoreStroke(score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }
    let frame;
    const start = displayScore;
    const diff = score - start;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(start + diff * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, animate]);

  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold tabular-nums text-foreground">
          {displayScore}
        </span>
        {showLabel && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {getScoreLabel(score)}
          </span>
        )}
      </div>
    </div>
  );
}
