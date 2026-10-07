import { HttpMethod } from '../../types/api.types';

interface HttpMethodBadgeProps {
  method: HttpMethod | string;
  className?: string;
}

export function HttpMethodBadge({ method, className = '' }: HttpMethodBadgeProps) {
  const m = (method || 'GET').toUpperCase();

  let colorClasses = 'bg-slate-500/15 text-slate-400 border-slate-500/30';

  switch (m) {
    case 'GET':
      colorClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      break;
    case 'POST':
      colorClasses = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      break;
    case 'PUT':
      colorClasses = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      break;
    case 'PATCH':
      colorClasses = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      break;
    case 'DELETE':
      colorClasses = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      break;
    case 'HEAD':
    case 'OPTIONS':
      colorClasses = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      break;
  }

  return (
    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-mono font-bold border tracking-wider ${colorClasses} ${className}`}>
      {m}
    </span>
  );
}
