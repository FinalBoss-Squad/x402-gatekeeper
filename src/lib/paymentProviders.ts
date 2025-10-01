import { PaymentProvider, VerificationParams, VerificationResult } from '@/types/payment';
import { tokenConverter } from './conversionModule';

// Lightning Network Provider
export class LightningProvider implements PaymentProvider {
  id = 'lightning';
  name = 'Lightning Network';

  async generateParams(params: VerificationParams): Promise<any> {
    // Convert amount to satoshis if needed
    const amountInSats = params.currency === 'sats' 
      ? params.amount 
      : tokenConverter.fromUSD(params.amount, 'SATS');

    // Get gas fee info
    const gasFee = tokenConverter.getGasFee('SATS');

    return {
      invoice: `lnbc${amountInSats}n...`, // Mock Lightning invoice
      amount: amountInSats,
      currency: 'sats',
      gasFee: gasFee.fee,
      gasFeeUSD: gasFee.feeInUSD,
      expires: params.expiresAt,
      checkUrl: `/api/verify/lightning/${params.contentId}`,
      network: 'Bitcoin Lightning',
    };
  }

  async verify(token: string): Promise<VerificationResult> {
    return {
      verified: true,
      paymentMethod: this.id,
      transactionId: token,
      timestamp: new Date(),
    };
  }

  getConfigSchema() {
    return {
      nodeUrl: { type: 'string', required: true, label: 'Lightning Node URL' },
      macaroon: { type: 'string', required: true, label: 'Admin Macaroon' },
      tlsCert: { type: 'string', required: false, label: 'TLS Certificate' },
    };
  }
}

// Celo Network Provider
export class CeloProvider implements PaymentProvider {
  id = 'celo';
  name = 'Celo Network';

  async generateParams(params: VerificationParams): Promise<any> {
    // Convert to CELO or cUSD
    const tokenSymbol = params.currency === 'cUSD' ? 'cUSD' : 'CELO';
    const amountInToken = params.currency === tokenSymbol
      ? params.amount
      : tokenConverter.fromUSD(params.amount, tokenSymbol);

    // Get gas fee info
    const gasFee = tokenConverter.getGasFee(tokenSymbol);

    return {
      address: '0x' + '0'.repeat(40), // Mock Celo address
      amount: amountInToken,
      currency: tokenSymbol,
      gasFee: gasFee.fee,
      gasFeeUSD: gasFee.feeInUSD,
      network: 'Celo',
      chainId: 42220, // Celo mainnet
      checkUrl: `/api/verify/celo/${params.contentId}`,
      contractAddress: tokenSymbol === 'cUSD' 
        ? '0x765DE816845861e75A25fCA122bb6898B8B1282a' // cUSD token
        : null,
    };
  }

  async verify(token: string): Promise<VerificationResult> {
    return {
      verified: true,
      paymentMethod: this.id,
      transactionId: token,
      timestamp: new Date(),
    };
  }

  getConfigSchema() {
    return {
      walletAddress: { type: 'string', required: true, label: 'Wallet Address' },
      privateKey: { type: 'string', required: true, label: 'Private Key (stored securely)' },
      rpcUrl: { type: 'string', required: false, label: 'Custom RPC URL', default: 'https://forno.celo.org' },
      tokenType: { type: 'select', options: ['CELO', 'cUSD'], label: 'Token Type', default: 'cUSD' },
    };
  }
}

// TON Network Provider
export class TONProvider implements PaymentProvider {
  id = 'ton';
  name = 'TON Network';

  async generateParams(params: VerificationParams): Promise<any> {
    // Convert to TON
    const amountInTON = params.currency === 'TON'
      ? params.amount
      : tokenConverter.fromUSD(params.amount, 'TON');

    // Get gas fee info
    const gasFee = tokenConverter.getGasFee('TON');

    return {
      address: 'EQ' + 'A'.repeat(46), // Mock TON address (base64)
      amount: amountInTON,
      currency: 'TON',
      gasFee: gasFee.fee,
      gasFeeUSD: gasFee.feeInUSD,
      network: 'TON',
      memo: params.contentId,
      checkUrl: `/api/verify/ton/${params.contentId}`,
      paymentUrl: `ton://transfer/${params.contentId}`,
    };
  }

  async verify(token: string): Promise<VerificationResult> {
    return {
      verified: true,
      paymentMethod: this.id,
      transactionId: token,
      timestamp: new Date(),
    };
  }

  getConfigSchema() {
    return {
      walletAddress: { type: 'string', required: true, label: 'TON Wallet Address' },
      apiKey: { type: 'string', required: true, label: 'TONCenter API Key' },
      network: { type: 'select', options: ['mainnet', 'testnet'], label: 'Network', default: 'mainnet' },
    };
  }
}

// Payment Provider Registry
export class PaymentProviderRegistry {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    // Register default providers
    this.register(new LightningProvider());
    this.register(new CeloProvider());
    this.register(new TONProvider());
  }

  register(provider: PaymentProvider) {
    this.providers.set(provider.id, provider);
  }

  get(id: string): PaymentProvider | undefined {
    return this.providers.get(id);
  }

  getAll(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }
}

export const paymentRegistry = new PaymentProviderRegistry();
