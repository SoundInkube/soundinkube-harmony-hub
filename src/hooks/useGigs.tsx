import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

export interface Gig {
  id: string;
  client_id: string;
  title: string;
  description: string;
  event_type: string;
  location: string;
  event_date: string;
  duration_hours: number;
  budget_min: number;
  budget_max: number;
  required_skills: string[];
  required_instruments: string[];
  status: string;
  selected_professional_id: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export interface GigApplication {
  id: string;
  gig_id: string;
  professional_id: string;
  proposal: string;
  quoted_price: number;
  status: string;
  applied_at: string;
  responded_at: string | null;
  profiles?: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export function useGigs() {
  const { profile } = useProfile();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [myGigs, setMyGigs] = useState<Gig[]>([]);
  const [applications, setApplications] = useState<GigApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGigs();
    if (profile?.id) {
      loadMyGigs();
      loadApplications();
    }
  }, [profile?.id]);

  const loadGigs = async () => {
    try {
      const { data, error } = await supabase
        .from('gigs')
        .select(`
          *,
          profiles (
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGigs((data as any) || []);
    } catch (error) {
      console.error('Error loading gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyGigs = async () => {
    if (!profile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('client_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyGigs((data as any) || []);
    } catch (error) {
      console.error('Error loading my gigs:', error);
    }
  };

  const loadApplications = async () => {
    if (!profile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('gig_applications')
        .select(`
          *,
          profiles (
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('professional_id', profile.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications((data as any) || []);
    } catch (error) {
      console.error('Error loading gig applications:', error);
    }
  };

  const createGig = async (gigData: Omit<Gig, 'id' | 'client_id' | 'created_at' | 'updated_at' | 'selected_professional_id' | 'profiles'>) => {
    if (!profile?.id) throw new Error('Must be logged in to create gig');

    try {
      const { data, error } = await supabase
        .from('gigs')
        .insert([{
          ...gigData,
          client_id: profile.id
        }])
        .select()
        .single();

      if (error) throw error;
      await loadGigs();
      await loadMyGigs();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating gig:', error);
      return { data: null, error };
    }
  };

  const applyToGig = async (gigId: string, proposal: string, quotedPrice: number) => {
    if (!profile?.id) throw new Error('Must be logged in to apply');

    try {
      const { data, error } = await supabase
        .from('gig_applications')
        .insert([{
          gig_id: gigId,
          professional_id: profile.id,
          proposal,
          quoted_price: quotedPrice
        }])
        .select()
        .single();

      if (error) throw error;
      await loadApplications();
      return { data, error: null };
    } catch (error) {
      console.error('Error applying to gig:', error);
      return { data: null, error };
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('gig_applications')
        .update({ 
          status,
          responded_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;
      await loadApplications();
      return { error: null };
    } catch (error) {
      console.error('Error updating application status:', error);
      return { error };
    }
  };

  return {
    gigs,
    myGigs,
    applications,
    loading,
    createGig,
    applyToGig,
    updateApplicationStatus,
    refetch: loadGigs
  };
}