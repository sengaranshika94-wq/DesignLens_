import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const severityConfig = {
  high: {
    icon: AlertTriangle,
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/20',
    label: 'High',
  },
  medium: {
    icon: Lightbulb,
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/20',
    label: 'Medium',
  },
  low: {
    icon: CheckCircle2,
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/20',
    label: 'Low',
  },
};

export default function InsightCard({
  title,
  explanation,
  recommendation,
  severity = 'medium',
  delay = 0,
  className,
}) {
  const config = severityConfig[severity] || severityConfig.medium;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      <Card className={cn('p-5 hover:shadow-md transition-shadow', className)}>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
              config.bg
            )}
          >
            <Icon className={cn('h-4.5 w-4.5', config.text)} size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">{title}</h4>
              <span
                className={cn(
                  'rounded-md px-2 py-0.5 text-[10px] font-medium',
                  config.bg,
                  config.text
                )}
              >
                {config.label}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {explanation}
            </p>
            {recommendation && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-secondary/60 p-3">
                <ArrowRight
                  className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', config.text)}
                />
                <p className="text-xs leading-relaxed text-foreground/80">
                  {recommendation}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
