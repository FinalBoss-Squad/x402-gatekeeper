import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowDownUp, Calculator } from 'lucide-react';
import { tokenConverter } from '@/lib/conversionModule';
import { toast } from 'sonner';

export const ConversionCalculator = () => {
  const [amount, setAmount] = useState('100');
  const [fromToken, setFromToken] = useState('SATS');
  const [toToken, setToToken] = useState('TON');
  const [result, setResult] = useState<any>(null);

  const tokens = tokenConverter.getSupportedTokens().filter(t => t !== 'USD');

  const handleConvert = () => {
    try {
      const conversionResult = tokenConverter.convert(
        parseFloat(amount),
        fromToken,
        toToken,
        true
      );
      setResult(conversionResult);
      toast.success('Conversion calculated successfully');
    } catch (error) {
      toast.error('Conversion failed: ' + (error as Error).message);
    }
  };

  const handleSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setResult(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Token Conversion Calculator
        </CardTitle>
        <CardDescription>
          Convert between supported tokens with automatic gas fee deduction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="flex-1"
              />
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token} value={token}>
                      {token}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              className="rounded-full"
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <Label htmlFor="toToken">Convert To</Label>
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger id="toToken">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token} value={token}>
                    {token}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleConvert} className="w-full gradient-primary">
            Calculate Conversion
          </Button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">You send</span>
              <span className="font-semibold">
                {result.fromAmount} {result.fromToken}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Gas fee</span>
              <span className="font-medium text-destructive">
                -{result.gasFee} {result.gasFeeToken}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Net amount</span>
              <span className="font-medium">
                {result.netAmount} {result.fromToken}
              </span>
            </div>

            <div className="h-px bg-border" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">You receive</span>
              <span className="text-lg font-bold text-success">
                {result.toAmount} {result.toToken}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Exchange rate</span>
              <span className="text-sm font-medium">
                1 {result.fromToken} = {result.exchangeRate.toFixed(8)} {result.toToken}
              </span>
            </div>
          </div>
        )}

        {/* Gas Fee Information */}
        <div className="space-y-2 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold">Current Gas Fees</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {tokens.map((token) => {
              const fee = tokenConverter.getGasFee(token);
              return (
                <div key={token} className="flex justify-between p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground">{token}</span>
                  <span className="font-medium">
                    {fee.fee} (~${fee.feeInUSD})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
