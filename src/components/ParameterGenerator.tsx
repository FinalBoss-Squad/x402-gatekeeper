import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeSnippet } from './CodeSnippet';
import { paymentRegistry } from '@/lib/paymentProviders';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const ParameterGenerator = () => {
  const [contentId, setContentId] = useState('premium-content-001');
  const [amount, setAmount] = useState('1000');
  const [currency, setCurrency] = useState('sats');
  const [paymentMethod, setPaymentMethod] = useState('lightning');

  const providers = paymentRegistry.getAll();

  const generateResponse = () => {
    const response = {
      status: 402,
      headers: {
        'WWW-Authenticate': `${paymentMethod.toUpperCase()} amount="${amount}" currency="${currency}" content-id="${contentId}"`,
        'Content-Type': 'application/json',
      },
      body: {
        error: 'Payment Required',
        message: 'This content requires payment to access',
        payment: {
          method: paymentMethod,
          amount: parseInt(amount),
          currency: currency,
          contentId: contentId,
        },
      },
    };

    return JSON.stringify(response, null, 2);
  };

  const generateVerificationCode = () => {
    return `// Server-side verification example
import { paymentRegistry } from './paymentProviders';

async function verifyAndServeContent(req, res) {
  const { token, contentId } = req.body;
  
  // Get the payment provider
  const provider = paymentRegistry.get('${paymentMethod}');
  
  // Verify payment
  const result = await provider.verify(token);
  
  if (result.verified) {
    // Serve the protected content
    return res.status(200).json({
      content: getContent(contentId),
      access: {
        granted: true,
        transactionId: result.transactionId,
        expiresAt: new Date(Date.now() + 86400000) // 24h
      }
    });
  }
  
  // Return 402 if not verified
  return res.status(402).json({
    error: 'Payment verification failed',
    details: result.error
  });
}`;
  };

  const handleGenerate = () => {
    toast.success('Parameters generated successfully!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate 402 Parameters
          </CardTitle>
          <CardDescription>
            Configure payment requirements and generate HTTP 402 response parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contentId">Content ID</Label>
              <Input
                id="contentId"
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
                placeholder="premium-content-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sats">Satoshis</SelectItem>
                  <SelectItem value="CELO">CELO</SelectItem>
                  <SelectItem value="cUSD">cUSD</SelectItem>
                  <SelectItem value="TON">TON</SelectItem>
                  <SelectItem value="usd">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleGenerate} className="w-full gradient-primary">
            Generate Parameters
          </Button>
        </CardContent>
      </Card>

      <CodeSnippet
        title="HTTP 402 Response"
        language="json"
        description="Complete 402 response with payment parameters"
        code={generateResponse()}
      />

      <CodeSnippet
        title="Verification & Content Serving"
        language="javascript"
        description="Server-side code to verify payment and serve protected content"
        code={generateVerificationCode()}
      />
    </div>
  );
};
