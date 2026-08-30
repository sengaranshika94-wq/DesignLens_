import { motion } from 'framer-motion';
import { cn, getScoreBg } from '@/lib/utils';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true,
  className,
  animated = true,
  delay = 0,
  size = 'default',
}) {
  const percentage = Math.min(100, (value / max) * 100);
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-foreground/80">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {value}
              <span className="text-muted-foreground">/{max}</span>
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-muted',
          heightClass
        )}
      >
        {animated ? (
          <motion.div
            className={cn('h-full rounded-full', getScoreBg(value))}
            initial={{ width: 0 }}
            whileInView={{ width: `${percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={cn('h-full rounded-full', getScoreBg(value))}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}
