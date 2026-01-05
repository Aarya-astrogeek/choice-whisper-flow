import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DietaryProfile } from '@/types/analysis';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useDietaryProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<DietaryProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<DietaryProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfiles();
    } else {
      setProfiles([]);
      setActiveProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfiles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dietary_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []) as DietaryProfile[];
      setProfiles(typedData);
      setActiveProfile(typedData.find(p => p.is_active) || null);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load dietary profiles');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profile: Omit<DietaryProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('dietary_profiles')
        .insert({
          ...profile,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const typedData = data as DietaryProfile;
      setProfiles(prev => [typedData, ...prev]);
      toast.success('Profile created!');
      return typedData;
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
      return null;
    }
  };

  const updateProfile = async (id: string, updates: Partial<DietaryProfile>) => {
    try {
      const { error } = await supabase
        .from('dietary_profiles')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      toast.success('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const setProfileActive = async (id: string) => {
    if (!user) return;

    try {
      // First, deactivate all profiles
      await supabase
        .from('dietary_profiles')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Then activate the selected one
      const { error } = await supabase
        .from('dietary_profiles')
        .update({ is_active: true })
        .eq('id', id);

      if (error) throw error;

      setProfiles(prev => prev.map(p => ({
        ...p,
        is_active: p.id === id
      })));
      setActiveProfile(profiles.find(p => p.id === id) || null);
      toast.success('Profile activated!');
    } catch (error) {
      console.error('Error setting active profile:', error);
      toast.error('Failed to activate profile');
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dietary_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProfiles(prev => prev.filter(p => p.id !== id));
      if (activeProfile?.id === id) {
        setActiveProfile(null);
      }
      toast.success('Profile deleted!');
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };

  return {
    profiles,
    activeProfile,
    loading,
    createProfile,
    updateProfile,
    setProfileActive,
    deleteProfile,
    refetch: fetchProfiles,
  };
}
