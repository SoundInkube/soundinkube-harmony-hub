import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Genre {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all genres
  const fetchGenres = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('category, name');
      
      if (error) throw error;
      setGenres(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get genres grouped by category
  const getGenresByCategory = () => {
    const grouped: Record<string, Genre[]> = {};
    genres.forEach(genre => {
      if (!grouped[genre.category]) {
        grouped[genre.category] = [];
      }
      grouped[genre.category].push(genre);
    });
    return grouped;
  };

  // Manage profile genres
  const updateProfileGenres = async (profileId: string, genreIds: string[]) => {
    try {
      // First, delete existing profile genres
      await supabase
        .from('profile_genres')
        .delete()
        .eq('profile_id', profileId);

      // Then insert new ones
      if (genreIds.length > 0) {
        const profileGenres = genreIds.map(genreId => ({
          profile_id: profileId,
          genre_id: genreId
        }));

        const { error } = await supabase
          .from('profile_genres')
          .insert(profileGenres);

        if (error) throw error;
      }
    } catch (err: any) {
      throw new Error(`Failed to update profile genres: ${err.message}`);
    }
  };

  // Get profile genres
  const getProfileGenres = async (profileId: string): Promise<Genre[]> => {
    try {
      const { data, error } = await supabase
        .from('profile_genres')
        .select(`
          genre_id,
          genres (
            id,
            name,
            category,
            description
          )
        `)
        .eq('profile_id', profileId);

      if (error) throw error;
      
      return (data || []).map(item => item.genres as Genre).filter(Boolean);
    } catch (err: any) {
      throw new Error(`Failed to fetch profile genres: ${err.message}`);
    }
  };

  // Manage gig genres
  const updateGigGenres = async (gigId: string, genreIds: string[]) => {
    try {
      // First, delete existing gig genres
      await supabase
        .from('gig_genres')
        .delete()
        .eq('gig_id', gigId);

      // Then insert new ones
      if (genreIds.length > 0) {
        const gigGenres = genreIds.map(genreId => ({
          gig_id: gigId,
          genre_id: genreId
        }));

        const { error } = await supabase
          .from('gig_genres')
          .insert(gigGenres);

        if (error) throw error;
      }
    } catch (err: any) {
      throw new Error(`Failed to update gig genres: ${err.message}`);
    }
  };

  // Get gig genres
  const getGigGenres = async (gigId: string): Promise<Genre[]> => {
    try {
      const { data, error } = await supabase
        .from('gig_genres')
        .select(`
          genre_id,
          genres (
            id,
            name,
            category,
            description
          )
        `)
        .eq('gig_id', gigId);

      if (error) throw error;
      
      return (data || []).map(item => item.genres as Genre).filter(Boolean);
    } catch (err: any) {
      throw new Error(`Failed to fetch gig genres: ${err.message}`);
    }
  };

  // Manage collaboration genres
  const updateCollaborationGenres = async (collaborationId: string, genreIds: string[]) => {
    try {
      // First, delete existing collaboration genres
      await supabase
        .from('collaboration_genres')
        .delete()
        .eq('collaboration_id', collaborationId);

      // Then insert new ones
      if (genreIds.length > 0) {
        const collaborationGenres = genreIds.map(genreId => ({
          collaboration_id: collaborationId,
          genre_id: genreId
        }));

        const { error } = await supabase
          .from('collaboration_genres')
          .insert(collaborationGenres);

        if (error) throw error;
      }
    } catch (err: any) {
      throw new Error(`Failed to update collaboration genres: ${err.message}`);
    }
  };

  // Get collaboration genres
  const getCollaborationGenres = async (collaborationId: string): Promise<Genre[]> => {
    try {
      const { data, error } = await supabase
        .from('collaboration_genres')
        .select(`
          genre_id,
          genres (
            id,
            name,
            category,
            description
          )
        `)
        .eq('collaboration_id', collaborationId);

      if (error) throw error;
      
      return (data || []).map(item => item.genres as Genre).filter(Boolean);
    } catch (err: any) {
      throw new Error(`Failed to fetch collaboration genres: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return {
    genres,
    loading,
    error,
    getGenresByCategory,
    updateProfileGenres,
    getProfileGenres,
    updateGigGenres,
    getGigGenres,
    updateCollaborationGenres,
    getCollaborationGenres,
    refetch: fetchGenres
  };
}