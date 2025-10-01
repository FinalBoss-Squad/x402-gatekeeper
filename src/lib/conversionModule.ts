// Token conversion module with gas fee calculations

export interface TokenRate {
  symbol: string;
  usdRate: number; // Price in USD
  gasFeeSats?: number; // Gas fee in satoshis (for Lightning)
  gasFeeGwei?: number; // Gas fee in Gwei (for Celo)
  gasFeeNano?: number; // Gas fee in nanoTON (for TON)
}

export interface ConversionResult {
  fromAmount: number;
  fromToken: string;
  toAmount: number;
  toToken: string;
  gasFee: number;
  gasFeeToken: string;
  netAmount: number;
  exchangeRate: number;
}

// Current market rates (these would typically come from an API)
export const TOKEN_RATES: Record<string, TokenRate> = {
  BTC: {
    symbol: 'BTC',
    usdRate: 43500,
    gasFeeSats: 500, // ~500 sats for Lightning
  },
  SATS: {
    symbol: 'SATS',
    usdRate: 0.000435, // 1 sat = 0.000435 USD
    gasFeeSats: 500,
  },
  CELO: {
    symbol: 'CELO',
    usdRate: 0.65,
    gasFeeGwei: 5000000, // ~0.005 CELO typical gas
  },
  cUSD: {
    symbol: 'cUSD',
    usdRate: 1.0,
    gasFeeGwei: 5000000,
  },
  TON: {
    symbol: 'TON',
    usdRate: 2.45,
    gasFeeNano: 10000000, // ~0.01 TON typical gas
  },
  USD: {
    symbol: 'USD',
    usdRate: 1.0,
  },
};

export class TokenConverter {
  private rates: Record<string, TokenRate>;

  constructor(rates?: Record<string, TokenRate>) {
    this.rates = rates || TOKEN_RATES;
  }

  /**
   * Convert amount from one token to another with gas fee deduction
   */
  convert(
    amount: number,
    fromToken: string,
    toToken: string,
    includeGasFee: boolean = true
  ): ConversionResult {
    const fromRate = this.rates[fromToken];
    const toRate = this.rates[toToken];

    if (!fromRate || !toRate) {
      throw new Error(`Unsupported token: ${!fromRate ? fromToken : toToken}`);
    }

    // Convert to USD as intermediate
    const usdValue = amount * fromRate.usdRate;

    // Calculate gas fee in the source token
    let gasFee = 0;
    let gasFeeToken = fromToken;

    if (includeGasFee) {
      if (fromToken === 'BTC' || fromToken === 'SATS') {
        // Lightning network fees in satoshis
        gasFee = (fromRate.gasFeeSats || 0) / 100000000; // Convert sats to BTC
        if (fromToken === 'SATS') {
          gasFee = fromRate.gasFeeSats || 0; // Keep in sats
        }
      } else if (fromToken === 'CELO' || fromToken === 'cUSD') {
        // Celo network fees in CELO
        gasFee = (fromRate.gasFeeGwei || 0) / 1000000000; // Convert Gwei to CELO
      } else if (fromToken === 'TON') {
        // TON network fees in TON
        gasFee = (fromRate.gasFeeNano || 0) / 1000000000; // Convert nanoTON to TON
      }
    }

    // Calculate net amount after gas fee
    const netUsdValue = usdValue - (gasFee * fromRate.usdRate);
    const toAmount = netUsdValue / toRate.usdRate;

    // Calculate exchange rate
    const exchangeRate = toAmount / amount;

    return {
      fromAmount: amount,
      fromToken,
      toAmount: parseFloat(toAmount.toFixed(8)),
      toToken,
      gasFee: parseFloat(gasFee.toFixed(8)),
      gasFeeToken,
      netAmount: parseFloat((amount - gasFee).toFixed(8)),
      exchangeRate: parseFloat(exchangeRate.toFixed(8)),
    };
  }

  /**
   * Get the equivalent value in USD
   */
  toUSD(amount: number, token: string): number {
    const rate = this.rates[token];
    if (!rate) {
      throw new Error(`Unsupported token: ${token}`);
    }
    return amount * rate.usdRate;
  }

  /**
   * Get the equivalent value from USD
   */
  fromUSD(usdAmount: number, token: string): number {
    const rate = this.rates[token];
    if (!rate) {
      throw new Error(`Unsupported token: ${token}`);
    }
    return usdAmount / rate.usdRate;
  }

  /**
   * Calculate gas fee for a specific token
   */
  getGasFee(token: string): { fee: number; feeInUSD: number } {
    const rate = this.rates[token];
    if (!rate) {
      throw new Error(`Unsupported token: ${token}`);
    }

    let fee = 0;
    
    if (token === 'BTC' || token === 'SATS') {
      fee = (rate.gasFeeSats || 0) / (token === 'BTC' ? 100000000 : 1);
    } else if (token === 'CELO' || token === 'cUSD') {
      fee = (rate.gasFeeGwei || 0) / 1000000000;
    } else if (token === 'TON') {
      fee = (rate.gasFeeNano || 0) / 1000000000;
    }

    return {
      fee: parseFloat(fee.toFixed(8)),
      feeInUSD: parseFloat((fee * rate.usdRate).toFixed(2)),
    };
  }

  /**
   * Update token rates (useful for real-time price updates)
   */
  updateRates(rates: Record<string, TokenRate>) {
    this.rates = { ...this.rates, ...rates };
  }

  /**
   * Get all supported tokens
   */
  getSupportedTokens(): string[] {
    return Object.keys(this.rates);
  }

  /**
   * Get rate for a specific token
   */
  getRate(token: string): TokenRate | undefined {
    return this.rates[token];
  }
}

// Singleton instance
export const tokenConverter = new TokenConverter();
