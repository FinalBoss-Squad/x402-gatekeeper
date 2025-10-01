import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParameterGenerator } from '@/components/ParameterGenerator';
import { PaymentMethodCard } from '@/components/PaymentMethodCard';
import { IntegrationGuide } from '@/components/IntegrationGuide';
import { Dashboard } from '@/components/Dashboard';
import { paymentRegistry } from '@/lib/paymentProviders';
import { Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [enabledMethods, setEnabledMethods] = useState<Record<string, boolean>>({
    lightning: true,
    stripe: true,
    crypto: false,
  });

  const providers = paymentRegistry.getAll();

  const handleToggleMethod = (providerId: string, enabled: boolean) => {
    setEnabledMethods((prev) => ({ ...prev, [providerId]: enabled }));
    toast.success(`${providerId} ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleConfigure = (providerId: string) => {
    toast.info(`Opening configuration for ${providerId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">x402 Verification Engine</h1>
                <p className="text-sm text-muted-foreground">
                  Modular payment verification system
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Live
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="methods">Methods</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <ParameterGenerator />
          </TabsContent>

          <TabsContent value="methods" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider) => (
                <PaymentMethodCard
                  key={provider.id}
                  provider={provider}
                  enabled={enabledMethods[provider.id] ?? false}
                  onToggle={(enabled) => handleToggleMethod(provider.id, enabled)}
                  onConfigure={() => handleConfigure(provider.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <IntegrationGuide />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
