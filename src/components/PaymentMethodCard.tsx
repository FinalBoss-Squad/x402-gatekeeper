import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { PaymentProvider } from '@/types/payment';

interface PaymentMethodCardProps {
  provider: PaymentProvider;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onConfigure: () => void;
}

export const PaymentMethodCard = ({
  provider,
  enabled,
  onToggle,
  onConfigure,
}: PaymentMethodCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{provider.name}</CardTitle>
            <CardDescription className="mt-1">
              {provider.id === 'lightning' && 'Bitcoin Lightning Network micropayments'}
              {provider.id === 'stripe' && 'Credit card and digital wallet payments'}
              {provider.id === 'crypto' && 'Cryptocurrency on-chain payments'}
            </CardDescription>
          </div>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant={enabled ? 'default' : 'secondary'}>
            {enabled ? 'Active' : 'Inactive'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onConfigure}
            disabled={!enabled}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
