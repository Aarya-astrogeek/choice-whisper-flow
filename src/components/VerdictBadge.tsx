import { Verdict } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const verdictConfig = {
  pass: {
    label: 'Pass',
    icon: CheckCircle,
    className: 'verdict-pass',
  },
  caution: {
    label: 'Caution',
    icon: AlertTriangle,
    className: 'verdict-caution',
  },
  avoid: {
    label: 'Avoid',
    icon: XCircle,
    className: 'verdict-avoid',
  },
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-4 py-2 text-base gap-2',
};

const iconSizes = {
  sm: 12,
  md: 16,
  lg: 20,
};

export function VerdictBadge({ verdict, size = 'md', className }: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border-2',
        sizeClasses[size],
        config.className,
        className
      )}
    >
      <Icon size={iconSizes[size]} />
      {config.label}
    </span>
  );
}
