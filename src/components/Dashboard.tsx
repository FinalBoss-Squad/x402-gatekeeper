import { MetricCard } from './MetricCard';
import { TrafficChart } from './TrafficChart';
import { RevenueChart } from './RevenueChart';
import { ActivityLog } from './ActivityLog';
import { TrendingUp, TrendingDown, DollarSign, ShieldCheck, Ban, Zap } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Requests"
          value="12,843"
          change={12.5}
          icon={Zap}
          iconColor="text-primary"
          description="Last 30 days"
        />
        <MetricCard
          title="Verified Payments"
          value="9,234"
          change={8.3}
          icon={ShieldCheck}
          iconColor="text-success"
          description="72% conversion rate"
        />
        <MetricCard
          title="Denied Requests"
          value="3,609"
          change={-4.2}
          icon={Ban}
          iconColor="text-destructive"
          description="28% of total"
        />
        <MetricCard
          title="Revenue Generated"
          value="$8,945"
          change={15.8}
          icon={DollarSign}
          iconColor="text-success"
          description="Last 30 days"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Cost Savings"
          value="$2,341"
          change={9.7}
          icon={TrendingUp}
          iconColor="text-primary"
          description="Bandwidth saved"
        />
        <MetricCard
          title="Avg Payment Value"
          value="$0.97"
          change={3.2}
          icon={DollarSign}
          iconColor="text-accent"
          description="Per transaction"
        />
        <MetricCard
          title="Denied Rate"
          value="28.1%"
          change={-4.2}
          icon={TrendingDown}
          iconColor="text-success"
          description="Improving"
        />
        <MetricCard
          title="Peak Traffic Hour"
          value="4 PM"
          icon={Zap}
          iconColor="text-secondary"
          description="167 req/hour"
        />
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
