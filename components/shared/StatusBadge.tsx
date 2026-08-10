import { ApplicationStatus } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const normalizedStatus = (status?.toUpperCase() || 'APPLIED') as ApplicationStatus;
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.APPLIED;
  
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bgClass,
        config.textClass,
        config.borderClass,
        className
      )}
    >
      {showDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />
      )}
      {config.label}
    </span>
  );
}
