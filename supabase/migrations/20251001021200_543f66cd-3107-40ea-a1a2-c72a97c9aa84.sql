-- Create enum for request types
CREATE TYPE public.request_status AS ENUM ('inbound', 'denied', 'verified');

-- Create enum for payment methods
CREATE TYPE public.payment_method_type AS ENUM ('lightning', 'celo', 'ton');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'verified', 'failed', 'expired');

-- Create requests table to track all inbound, denied, and success requests
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status public.request_status NOT NULL,
  content_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_requests table to track payment details
CREATE TABLE public.payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  payment_method public.payment_method_type NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  currency TEXT NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'pending',
  transaction_id TEXT,
  gas_fee DECIMAL(20, 8),
  net_amount DECIMAL(20, 8),
  invoice_data JSONB,
  verification_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_requests_status ON public.requests(status);
CREATE INDEX idx_requests_created_at ON public.requests(created_at DESC);
CREATE INDEX idx_requests_content_id ON public.requests(content_id);
CREATE INDEX idx_payment_requests_status ON public.payment_requests(status);
CREATE INDEX idx_payment_requests_method ON public.payment_requests(payment_method);
CREATE INDEX idx_payment_requests_created_at ON public.payment_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for requests table
-- Allow anyone to insert (for tracking requests from the system)
CREATE POLICY "Allow public insert on requests"
ON public.requests
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to select (for dashboard - can be restricted later with auth)
CREATE POLICY "Allow public select on requests"
ON public.requests
FOR SELECT
TO public
USING (true);

-- RLS Policies for payment_requests table
-- Allow anyone to insert (for tracking payment requests)
CREATE POLICY "Allow public insert on payment_requests"
ON public.payment_requests
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to select (for dashboard - can be restricted later with auth)
CREATE POLICY "Allow public select on payment_requests"
ON public.payment_requests
FOR SELECT
TO public
USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on payment_requests
CREATE TRIGGER update_payment_requests_updated_at
BEFORE UPDATE ON public.payment_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();