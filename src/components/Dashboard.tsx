import { MetricCard } from './MetricCard';
import { TrafficChart } from './TrafficChart';
import { RevenueChart } from './RevenueChart';
import { ActivityLog } from './ActivityLog';
import { TrendingUp, TrendingDown, DollarSign, ShieldCheck, Ban, Zap, LucideIcon } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardData';
import { Skeleton } from './ui/skeleton';

const iconMap: Record<string, LucideIcon> = {
  Zap,
  ShieldCheck,
  Ban,
  DollarSign,
  TrendingUp,
  TrendingDown,
};

const getIconColor = (key: string): string => {
  const colorMap: Record<string, string> = {
    total_requests: 'text-primary',
    verified_payments: 'text-success',
    denied_requests: 'text-destructive',
    revenue_generated: 'text-success',
    cost_savings: 'text-primary',
    avg_payment_value: 'text-accent',
    denied_rate: 'text-success',
    peak_traffic_hour: 'text-secondary',
  };
  return colorMap[key] || 'text-primary';
};

const formatTitle = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const Dashboard = () => {
  const { data: metrics, isLoading } = useDashboardMetrics();

  const primaryMetrics = metrics?.slice(0, 4) || [];
  const secondaryMetrics = metrics?.slice(4) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {primaryMetrics.map((metric) => (
          <MetricCard
            key={metric.metric_key}
            title={formatTitle(metric.metric_key)}
            value={metric.metric_value}
            change={metric.metric_change ?? undefined}
            icon={iconMap[metric.icon_name] || Zap}
            iconColor={getIconColor(metric.metric_key)}
            description={metric.description}
          />
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {secondaryMetrics.map((metric) => (
          <MetricCard
            key={metric.metric_key}
            title={formatTitle(metric.metric_key)}
            value={metric.metric_value}
            change={metric.metric_change ?? undefined}
            icon={iconMap[metric.icon_name] || Zap}
            iconColor={getIconColor(metric.metric_key)}
            description={metric.description}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TrafficChart />
        <RevenueChart />
      </div>

      {/* Activity Log */}
      <ActivityLog />
    </div>
  );
};
