import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendDirection = 'up',
  delay = 0,
  className,
  accent = 'primary',
}) {
  const accentColors = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    destructive: 'text-destructive bg-destructive/10',
  };

  const TrendIcon =
    trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn('p-5 hover:shadow-md transition-shadow', className)}>
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              accentColors[accent]
            )}
          >
            {Icon && <Icon className="h-5 w-5" />}
          </div>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trendDirection === 'up' ? 'text-success' : trendDirection === 'down' ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="text-3xl font-bold tabular-nums text-foreground">
            {value}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{label}</div>
        </div>
      </Card>
    </motion.div>
  );
}
