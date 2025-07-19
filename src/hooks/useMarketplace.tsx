import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

export interface MarketplaceItem {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  currency: string;
  images: string[];
  location: string;
  status: string;
  tags: string[];
  contact_preference: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

export function useMarketplace() {
  const { profile } = useProfile();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [myItems, setMyItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketplaceItems();
    if (profile?.id) {
      loadMyItems();
    }
  }, [profile?.id]);

  const loadMarketplaceItems = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace')
        .select(`
          *,
          profiles (
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data as any) || []);
    } catch (error) {
      console.error('Error loading marketplace items:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyItems = async () => {
    if (!profile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('marketplace')
        .select('*')
        .eq('seller_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyItems(data || []);
    } catch (error) {
      console.error('Error loading my items:', error);
    }
  };

  const createItem = async (itemData: Omit<MarketplaceItem, 'id' | 'seller_id' | 'created_at' | 'updated_at'>) => {
    if (!profile?.id) throw new Error('Must be logged in to create item');

    try {
      const { data, error } = await supabase
        .from('marketplace')
        .insert([{
          ...itemData,
          seller_id: profile.id
        }])
        .select()
        .single();

      if (error) throw error;
      await loadMarketplaceItems();
      await loadMyItems();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating item:', error);
      return { data: null, error };
    }
  };

  const updateItem = async (id: string, updates: Partial<MarketplaceItem>) => {
    try {
      const { error } = await supabase
        .from('marketplace')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await loadMarketplaceItems();
      await loadMyItems();
      return { error: null };
    } catch (error) {
      console.error('Error updating item:', error);
      return { error };
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('marketplace')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadMarketplaceItems();
      await loadMyItems();
      return { error: null };
    } catch (error) {
      console.error('Error deleting item:', error);
      return { error };
    }
  };

  return {
    items,
    myItems,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refetch: loadMarketplaceItems
  };
}