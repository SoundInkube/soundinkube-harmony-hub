import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TeacherSpecialization {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export const useTeacherSpecializations = () => {
  return useQuery({
    queryKey: ['teacher-specializations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_specializations')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as TeacherSpecialization[];
    },
  });
};