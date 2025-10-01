import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useRecentActivity } from '@/hooks/useDashboardData';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from './ui/skeleton';

export const ActivityLog = () => {
  const { data: activities, isLoading } = useRecentActivity();

  const getStatusType = (status: string): 'verified' | 'denied' | 'pending' => {
    if (status === 'verified') return 'verified';
    if (status === 'failed' || status === 'expired') return 'denied';
    return 'pending';
  };
  const getIcon = (type: 'verified' | 'denied' | 'pending') => {
    switch (type) {
      case 'verified':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'denied':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBadgeVariant = (type: 'verified' | 'denied' | 'pending') => {
    switch (type) {
      case 'verified':
        return 'default';
      case 'denied':
        return 'destructive';
      case 'pending':
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest payment verification requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest payment verification requests</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.map((activity) => {
                const statusType = getStatusType(activity.status);
                return (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(statusType)}
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Payment Request #{activity.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.amount} {activity.currency} via {activity.payment_method}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getBadgeVariant(statusType)} className="capitalize">
                      {statusType}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent activity
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
