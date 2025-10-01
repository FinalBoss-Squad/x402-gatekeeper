import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'verified' | 'denied' | 'pending';
  contentId: string;
  amount: number;
  currency: string;
  method: string;
  timestamp: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'verified',
    contentId: 'premium-content-001',
    amount: 1000,
    currency: 'sats',
    method: 'lightning',
    timestamp: '2 min ago',
  },
  {
    id: '2',
    type: 'denied',
    contentId: 'premium-content-045',
    amount: 5.99,
    currency: 'USD',
    method: 'stripe',
    timestamp: '5 min ago',
  },
  {
    id: '3',
    type: 'verified',
    contentId: 'premium-content-023',
    amount: 2500,
    currency: 'sats',
    method: 'lightning',
    timestamp: '8 min ago',
  },
  {
    id: '4',
    type: 'pending',
    contentId: 'premium-content-067',
    amount: 0.001,
    currency: 'BTC',
    method: 'crypto',
    timestamp: '12 min ago',
  },
  {
    id: '5',
    type: 'verified',
    contentId: 'premium-content-089',
    amount: 9.99,
    currency: 'USD',
    method: 'stripe',
    timestamp: '15 min ago',
  },
  {
    id: '6',
    type: 'denied',
    contentId: 'premium-content-012',
    amount: 1500,
    currency: 'sats',
    method: 'lightning',
    timestamp: '18 min ago',
  },
];

export const ActivityLog = () => {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'verified':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'denied':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBadgeVariant = (type: Activity['type']) => {
    switch (type) {
      case 'verified':
        return 'default';
      case 'denied':
        return 'destructive';
      case 'pending':
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest payment verification requests</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  {getIcon(activity.type)}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.contentId}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.amount} {activity.currency} via {activity.method}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
                <Badge variant={getBadgeVariant(activity.type)} className="capitalize">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
