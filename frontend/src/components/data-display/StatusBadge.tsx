import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: number;
  text?: string;
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
  let variant: 'success' | 'warning' | 'destructive' | 'info' = 'info';

  if (status >= 200 && status < 300) {
    variant = 'success';
  } else if (status >= 300 && status < 400) {
    variant = 'info';
  } else if (status >= 400 && status < 500) {
    variant = 'warning';
  } else if (status >= 500) {
    variant = 'destructive';
  }

  return (
    <Badge variant={variant} className="font-mono font-semibold">
      {status} {text && <span className="ml-1 opacity-80 font-sans text-[10px] uppercase">{text}</span>}
    </Badge>
  );
}
