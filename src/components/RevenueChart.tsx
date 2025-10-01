import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { useRevenueData } from '@/hooks/useDashboardData';
import { Skeleton } from './ui/skeleton';

export const RevenueChart = () => {
  const { data, isLoading } = useRevenueData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Cost Savings</CardTitle>
          <CardDescription>Weekly performance overview (USD)</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.map(item => ({
    day: item.day_label,
    revenue: Number(item.revenue),
    savings: Number(item.savings),
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue & Cost Savings</CardTitle>
        <CardDescription>Weekly performance overview (USD)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="day" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="hsl(var(--success))" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="savings" fill="hsl(var(--primary))" name="Cost Savings" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
