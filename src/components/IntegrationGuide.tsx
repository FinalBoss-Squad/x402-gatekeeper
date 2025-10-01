import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeSnippet } from './CodeSnippet';
import { BookOpen } from 'lucide-react';

export const IntegrationGuide = () => {
  const clientExample = `// Client-side integration
async function fetchPremiumContent(contentId) {
  const response = await fetch(\`/api/content/\${contentId}\`);
  
  if (response.status === 402) {
    const paymentInfo = await response.json();
    
    // Show payment modal to user
    const payment = await initiatePayment(paymentInfo);
    
    // Retry with payment token
    const verifiedResponse = await fetch(\`/api/content/\${contentId}\`, {
      headers: {
        'X-Payment-Token': payment.token
      }
    });
    
    return verifiedResponse.json();
  }
  
  return response.json();
}`;

  const serverExample = `// Express.js middleware example
const x402Middleware = (options) => {
  return async (req, res, next) => {
    const token = req.headers['x-payment-token'];
    
    if (!token) {
      // No payment token, return 402
      return res.status(402).json({
        error: 'Payment Required',
        payment: {
          method: options.method,
          amount: options.amount,
          currency: options.currency,
          contentId: req.params.id
        }
      });
    }
    
    // Verify payment
    const provider = paymentRegistry.get(options.method);
    const result = await provider.verify(token);
    
    if (result.verified) {
      req.payment = result;
      next();
    } else {
      res.status(402).json({
        error: 'Payment verification failed'
      });
    }
  };
};

// Usage
app.get('/api/content/:id', 
  x402Middleware({ method: 'lightning', amount: 1000, currency: 'sats' }),
  (req, res) => {
    res.json({ content: getContent(req.params.id) });
  }
);`;

  const customProviderExample = `// Creating a custom payment provider
import { PaymentProvider, VerificationParams, VerificationResult } from './types';

export class MyCustomProvider implements PaymentProvider {
  id = 'my-provider';
  name = 'My Custom Provider';

  async generateParams(params: VerificationParams) {
    // Generate payment request
    return {
      paymentUrl: 'https://payment.example.com/...',
      amount: params.amount,
      currency: params.currency,
    };
  }

  async verify(token: string): Promise<VerificationResult> {
    // Verify the payment
    const response = await fetch(\`https://api.example.com/verify/\${token}\`);
    const data = await response.json();
    
    return {
      verified: data.valid,
      paymentMethod: this.id,
      transactionId: data.txId,
      timestamp: new Date(),
    };
  }

  getConfigSchema() {
    return {
      apiKey: { type: 'string', required: true, label: 'API Key' },
      webhookUrl: { type: 'string', required: true, label: 'Webhook URL' },
    };
  }
}

// Register the provider
paymentRegistry.register(new MyCustomProvider());`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Integration Guide
        </CardTitle>
        <CardDescription>
          Learn how to integrate the x402 verification engine into your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="client" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="client">Client-Side</TabsTrigger>
            <TabsTrigger value="server">Server-Side</TabsTrigger>
            <TabsTrigger value="custom">Custom Provider</TabsTrigger>
          </TabsList>

          <TabsContent value="client" className="space-y-4">
            <CodeSnippet
              title="Client-Side Implementation"
              language="javascript"
              description="Handle 402 responses and initiate payment flow"
              code={clientExample}
            />
          </TabsContent>

          <TabsContent value="server" className="space-y-4">
            <CodeSnippet
              title="Server-Side Middleware"
              language="javascript"
              description="Protect routes with payment verification"
              code={serverExample}
            />
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <CodeSnippet
              title="Custom Payment Provider"
              language="typescript"
              description="Create your own payment method integration"
              code={customProviderExample}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
