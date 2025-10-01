import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardMetric {
  metric_key: string;
  metric_value: string;
  metric_change: number | null;
  description: string;
  icon_name: string;
}

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .order('metric_key');

      if (error) throw error;
      return data as DashboardMetric[];
    },
  });
};

export const useTrafficData = () => {
  return useQuery({
    queryKey: ['traffic-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('traffic_data')
        .select('*')
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useRevenueData = () => {
  return useQuery({
    queryKey: ['revenue-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_data')
        .select('*')
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
};
