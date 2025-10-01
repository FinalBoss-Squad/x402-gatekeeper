import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

const data = [
  { day: 'Mon', revenue: 245, savings: 89 },
  { day: 'Tue', revenue: 312, savings: 102 },
  { day: 'Wed', revenue: 289, savings: 95 },
  { day: 'Thu', revenue: 378, savings: 134 },
  { day: 'Fri', revenue: 421, savings: 156 },
  { day: 'Sat', revenue: 198, savings: 67 },
  { day: 'Sun', revenue: 167, savings: 54 },
];

export const RevenueChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue & Cost Savings</CardTitle>
        <CardDescription>Weekly performance overview (USD)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
