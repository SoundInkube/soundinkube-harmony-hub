import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { useToast } from './use-toast';

export function useAdmin() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtists: 0,
    totalClients: 0,
    totalStudios: 0,
    totalSchools: 0,
    totalLabels: 0,
    totalBookings: 0,
    totalGigs: 0,
    totalCollaborations: 0,
    totalMarketplaceItems: 0,
    recentSignups: 0
  });
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.user_type === 'admin' && profile?.verified;

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadStats();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadStats = async () => {
    try {
      const [
        { count: totalUsers },
        { count: totalArtists },
        { count: totalClients },
        { count: totalStudios },
        { count: totalSchools },
        { count: totalLabels },
        { count: totalBookings },
        { count: totalGigs },
        { count: totalCollaborations },
        { count: totalMarketplaceItems },
        { count: recentSignups }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'artist'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'client'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'studio'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'school'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'label'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('gigs').select('*', { count: 'exact', head: true }),
        supabase.from('collaborations').select('*', { count: 'exact', head: true }),
        supabase.from('marketplace').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      setStats({
        totalUsers: totalUsers || 0,
        totalArtists: totalArtists || 0,
        totalClients: totalClients || 0,
        totalStudios: totalStudios || 0,
        totalSchools: totalSchools || 0,
        totalLabels: totalLabels || 0,
        totalBookings: totalBookings || 0,
        totalGigs: totalGigs || 0,
        totalCollaborations: totalCollaborations || 0,
        totalMarketplaceItems: totalMarketplaceItems || 0,
        recentSignups: recentSignups || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserType = async (userId: string, newUserType: string) => {
    try {
      const { error } = await supabase.rpc('admin_update_user_type', {
        target_user_id: userId,
        new_user_type: newUserType
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Security Error",
          description: error.message || "Access denied: Only administrators can update user types"
        });
        return { error };
      }

      await loadUsers();
      await loadStats(); // Refresh stats after user type change
      toast({
        title: "Success",
        description: "User type updated successfully"
      });
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Security Error",
        description: error.message || "Access denied"
      });
      return { error };
    }
  };

  const updateUserVerification = async (userId: string, verified: boolean) => {
    try {
      const { error } = await supabase.rpc('admin_update_user_verification', {
        target_user_id: userId,
        is_verified: verified
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Security Error",
          description: error.message || "Access denied: Only administrators can update verification status"
        });
        return { error };
      }

      await loadUsers();
      await loadStats(); // Refresh stats after verification change
      toast({
        title: "Success",
        description: `User ${verified ? 'verified' : 'unverified'} successfully`
      });
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Security Error",
        description: error.message || "Access denied"
      });
      return { error };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('admin_delete_user', {
        target_user_id: userId
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Security Error",
          description: error.message || "Access denied: Only administrators can delete users"
        });
        return { error };
      }

      await loadUsers();
      await loadStats(); // Refresh stats after user deletion
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Security Error",
        description: error.message || "Access denied"
      });
      return { error };
    }
  };

  const getTableData = async (tableName: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error loading ${tableName}:`, error);
      return { data: [], error };
    }
  };

  const updateTableRow = async (tableName: string, id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .update(updates)
        .eq('id', id);

      return { error };
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      return { error };
    }
  };

  const deleteTableRow = async (tableName: string, id: string) => {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      return { error };
    }
  };

  return {
    isAdmin,
    users,
    stats,
    loading,
    updateUserType,
    updateUserVerification,
    deleteUser,
    getTableData,
    updateTableRow,
    deleteTableRow,
    refreshUsers: loadUsers,
    refreshStats: loadStats
  };
}