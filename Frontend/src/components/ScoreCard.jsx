import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { cn, getScoreColor, getScoreLabel } from '@/lib/utils';

export default function ScoreCard({
  title,
  score,
  icon: Icon,
  delay = 0,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
    >
      <Card className={cn('p-5 hover:shadow-md', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                <Icon className="h-4.5 w-4.5" size={18} />
              </div>
            )}
            <span className="text-sm font-medium text-foreground/80">
              {title}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <span className={cn('text-3xl font-bold tabular-nums', getScoreColor(score))}>
            {score}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {getScoreLabel(score)}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className={cn('h-full rounded-full', getScoreColor(score).replace('text-', 'bg-'))}
            initial={{ width: 0 }}
            whileInView={{ width: `${score}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.2, ease: 'easeOut' }}
          />
        </div>
      </Card>
    </motion.div>
  );
}
