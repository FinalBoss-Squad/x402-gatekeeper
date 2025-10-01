-- Create dashboard_metrics table for storing aggregated metrics
CREATE TABLE public.dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key TEXT NOT NULL UNIQUE,
  metric_value TEXT NOT NULL,
  metric_change DECIMAL(5, 2),
  description TEXT,
  icon_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create traffic_data table for hourly traffic statistics
CREATE TABLE public.traffic_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time_label TEXT NOT NULL,
  inbound INTEGER NOT NULL DEFAULT 0,
  denied INTEGER NOT NULL DEFAULT 0,
  verified INTEGER NOT NULL DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create revenue_data table for daily revenue and savings
CREATE TABLE public.revenue_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_label TEXT NOT NULL,
  revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
  savings DECIMAL(10, 2) NOT NULL DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_data ENABLE ROW LEVEL SECURITY;

-- Allow public read access for dashboard display
CREATE POLICY "Allow public select on dashboard_metrics"
ON public.dashboard_metrics
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public select on traffic_data"
ON public.traffic_data
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public select on revenue_data"
ON public.revenue_data
FOR SELECT
TO public
USING (true);

-- Insert dummy dashboard metrics
INSERT INTO public.dashboard_metrics (metric_key, metric_value, metric_change, description, icon_name) VALUES
('total_requests', '12,843', 12.5, 'Last 30 days', 'Zap'),
('verified_payments', '9,234', 8.3, '72% conversion rate', 'ShieldCheck'),
('denied_requests', '3,609', -4.2, '28% of total', 'Ban'),
('revenue_generated', '$8,945', 15.8, 'Last 30 days', 'DollarSign'),
('cost_savings', '$2,341', 9.7, 'Bandwidth saved', 'TrendingUp'),
('avg_payment_value', '$0.97', 3.2, 'Per transaction', 'DollarSign'),
('denied_rate', '28.1%', -4.2, 'Improving', 'TrendingDown'),
('peak_traffic_hour', '4 PM', NULL, '167 req/hour', 'Zap');

-- Insert dummy traffic data (last 24 hours)
INSERT INTO public.traffic_data (time_label, inbound, denied, verified) VALUES
('00:00', 45, 12, 33),
('04:00', 52, 15, 37),
('08:00', 89, 28, 61),
('12:00', 134, 42, 92),
('16:00', 167, 51, 116),
('20:00', 98, 31, 67),
('23:59', 76, 23, 53);

-- Insert dummy revenue data (weekly)
INSERT INTO public.revenue_data (day_label, revenue, savings) VALUES
('Mon', 245.00, 89.00),
('Tue', 312.00, 102.00),
('Wed', 289.00, 95.00),
('Thu', 378.00, 134.00),
('Fri', 421.00, 156.00),
('Sat', 198.00, 67.00),
('Sun', 167.00, 54.00);

-- Create indexes for better performance
CREATE INDEX idx_dashboard_metrics_key ON public.dashboard_metrics(metric_key);
CREATE INDEX idx_traffic_data_time ON public.traffic_data(time_label);
CREATE INDEX idx_revenue_data_day ON public.revenue_data(day_label);
CREATE INDEX idx_traffic_data_recorded ON public.traffic_data(recorded_at DESC);
CREATE INDEX idx_revenue_data_recorded ON public.revenue_data(recorded_at DESC);