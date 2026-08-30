import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg',
        className
      )}
    >
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 -translate-y-full bg-gradient-to-b from-primary/5 to-transparent transition-transform duration-500 group-hover:translate-y-0" />

      <div className="relative">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <Icon className="h-5.5 w-5.5" size={22} />
        </div>
        <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
