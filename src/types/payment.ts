// Core types for the x402 verification engine

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'lightning' | 'stripe' | 'crypto' | 'custom';
  enabled: boolean;
  config: Record<string, any>;
}

export interface VerificationParams {
  contentId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface VerificationResult {
  verified: boolean;
  paymentMethod: string;
  transactionId?: string;
  timestamp: Date;
  error?: string;
}

export interface ContentAccess {
  contentId: string;
  requiredAmount: number;
  currency: string;
  allowedMethods: string[];
}

// Abstract interface for payment providers
export interface PaymentProvider {
  id: string;
  name: string;
  
  // Generate payment parameters
  generateParams(params: VerificationParams): Promise<any>;
  
  // Verify payment
  verify(token: string): Promise<VerificationResult>;
  
  // Get configuration schema
  getConfigSchema(): Record<string, any>;
}
