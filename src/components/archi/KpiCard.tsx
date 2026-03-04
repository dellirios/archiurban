import { DollarSign, TrendingDown, Target, FolderKanban, TrendingUp } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  DollarSign, TrendingDown, Target, FolderKanban,
};

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  icon: string;
}

const KpiCard = ({ label, value, change, icon }: KpiCardProps) => {
  const Icon = iconMap[icon] || DollarSign;
  const isPositive = change >= 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
        }`}>
          <TrendingUp className={`w-3 h-3 ${!isPositive ? 'rotate-180' : ''}`} />
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
};

export default KpiCard;
