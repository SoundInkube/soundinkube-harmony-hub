import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

export interface Collaboration {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  required_skills: string[];
  required_instruments: string[];
  collaboration_type: string;
  location: string;
  compensation_type: string;
  compensation_amount: number;
  status: string;
  max_participants: number;
  current_participants: number;
  deadline: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

export interface CollaborationApplication {
  id: string;
  collaboration_id: string;
  applicant_id: string;
  message: string;
  status: string;
  applied_at: string;
  responded_at: string;
  profiles?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

export function useCollaborations() {
  const { profile } = useProfile();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [myCollaborations, setMyCollaborations] = useState<Collaboration[]>([]);
  const [applications, setApplications] = useState<CollaborationApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollaborations();
    if (profile?.id) {
      loadMyCollaborations();
      loadApplications();
    }
  }, [profile?.id]);

  const loadCollaborations = async () => {
    try {
      const { data, error } = await supabase
        .from('collaborations')
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
      setCollaborations((data as any) || []);
    } catch (error) {
      console.error('Error loading collaborations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyCollaborations = async () => {
    if (!profile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('collaborations')
        .select('*')
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyCollaborations(data || []);
    } catch (error) {
      console.error('Error loading my collaborations:', error);
    }
  };

  const loadApplications = async () => {
    if (!profile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('collaboration_applications')
        .select(`
          *,
          profiles (
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('applicant_id', profile.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications((data as any) || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const createCollaboration = async (collaborationData: Omit<Collaboration, 'id' | 'creator_id' | 'created_at' | 'updated_at' | 'current_participants'>) => {
    if (!profile?.id) throw new Error('Must be logged in to create collaboration');

    try {
      const { data, error } = await supabase
        .from('collaborations')
        .insert([{
          ...collaborationData,
          creator_id: profile.id,
          current_participants: 0
        }])
        .select()
        .single();

      if (error) throw error;
      await loadCollaborations();
      await loadMyCollaborations();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating collaboration:', error);
      return { data: null, error };
    }
  };

  const applyToCollaboration = async (collaborationId: string, message: string) => {
    if (!profile?.id) throw new Error('Must be logged in to apply');

    try {
      const { data, error } = await supabase
        .from('collaboration_applications')
        .insert([{
          collaboration_id: collaborationId,
          applicant_id: profile.id,
          message
        }])
        .select()
        .single();

      if (error) throw error;
      await loadApplications();
      return { data, error: null };
    } catch (error) {
      console.error('Error applying to collaboration:', error);
      return { data: null, error };
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('collaboration_applications')
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
    collaborations,
    myCollaborations,
    applications,
    loading,
    createCollaboration,
    applyToCollaboration,
    updateApplicationStatus,
    refetch: loadCollaborations
  };
}