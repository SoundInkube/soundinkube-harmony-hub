import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Instrument {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export const useInstruments = () => {
  return useQuery({
    queryKey: ['instruments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instruments')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Instrument[];
    },
  });
};