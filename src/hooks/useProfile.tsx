import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  username: string | null;
  user_type: string;
  verified: boolean;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  gallery_images: string[] | null;
  genres: string[] | null;
  skills: string[] | null;
  instruments: string[] | null;
  specializations: string[] | null;
  social_media: any;
  hourly_rate: number | null;
  experience_level: string | null;
  availability_status: string | null;
  company_name: string | null;
  founded_year: number | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          profile_genres (
            genres (
              id,
              name,
              category
            )
          )
        `)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        setProfile(null);
      } else if (data) {
        // Extract genre names from the relationship
        const genreNames = data.profile_genres?.map((pg: any) => pg.genres?.name).filter(Boolean) || [];
        
        const profileWithGenres: Profile = {
          ...data,
          genres: genreNames,
          social_media: data.social_media || {},
        };
        
        setProfile(profileWithGenres);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: 'No user or profile found' };

    try {
      // Direct table update to handle arrays properly
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await loadProfile();
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refreshProfile: loadProfile
  };
}