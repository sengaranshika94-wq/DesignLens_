import { Link } from 'react-router-dom';
import { Scan } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className, size = 'default', to = '/' }) {
  const sizes = {
    sm: { box: 'h-7 w-7', icon: 15, text: 'text-base' },
    default: { box: 'h-9 w-9', icon: 18, text: 'text-lg' },
    lg: { box: 'h-11 w-11', icon: 22, text: 'text-xl' },
  };
  const s = sizes[size];

  return (
    <Link to={to} className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-400 shadow-md shadow-primary/20',
          s.box
        )}
      >
        <Scan size={s.icon} className="text-white" strokeWidth={2.5} />
      </div>
      <span className={cn('font-bold tracking-tight text-foreground', s.text)}>
        Design<span className="text-primary">Lens</span>
      </span>
    </Link>
  );
}
