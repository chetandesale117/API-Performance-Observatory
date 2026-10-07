import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number; // percentage, e.g., +4.2 or -1.5
  isPositiveGood?: boolean;
  icon: LucideIcon;
  subtitle?: string;
}

export function KpiCard({ title, value, unit, change, isPositiveGood = true, icon: Icon, subtitle }: KpiCardProps) {
  const isUp = change !== undefined && change >= 0;
  const isGood = isUp === isPositiveGood;

  return (
    <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
          <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
            {unit && <span className="text-xs font-medium text-muted-foreground">{unit}</span>}
          </div>

          {change !== undefined && (
            <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              isGood
                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
            }`}>
              {isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
