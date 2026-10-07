import { Activity } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
        <Activity className="w-8 h-8 text-primary animate-pulse" />
        <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-25" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading Observatory...</p>
    </div>
  );
}
