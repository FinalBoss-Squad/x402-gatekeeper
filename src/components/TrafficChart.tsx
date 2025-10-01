import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { time: '00:00', inbound: 45, denied: 12, verified: 33 },
  { time: '04:00', inbound: 52, denied: 15, verified: 37 },
  { time: '08:00', inbound: 89, denied: 28, verified: 61 },
  { time: '12:00', inbound: 134, denied: 42, verified: 92 },
  { time: '16:00', inbound: 167, denied: 51, verified: 116 },
  { time: '20:00', inbound: 98, denied: 31, verified: 67 },
  { time: '23:59', inbound: 76, denied: 23, verified: 53 },
];

export const TrafficChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Overview</CardTitle>
        <CardDescription>Inbound requests vs denied vs verified (last 24h)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDenied" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="time" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="inbound"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorInbound)"
              name="Inbound"
            />
            <Area
              type="monotone"
              dataKey="denied"
              stroke="hsl(var(--destructive))"
              fillOpacity={1}
              fill="url(#colorDenied)"
              name="Denied"
            />
            <Area
              type="monotone"
              dataKey="verified"
              stroke="hsl(var(--success))"
              fillOpacity={1}
              fill="url(#colorVerified)"
              name="Verified"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
