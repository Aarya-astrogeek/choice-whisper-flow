import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisHistoryItem, AnalysisResult, Verdict } from '@/types/analysis';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useAnalysisHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('analysis_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setHistory((data || []) as AnalysisHistoryItem[]);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load analysis history');
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysis = async (
    ingredientsText: string,
    result: AnalysisResult,
    productName?: string
  ) => {
    if (!user) {
      toast.info('Sign in to save your analysis history');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('analysis_history')
        .insert({
          user_id: user.id,
          product_name: productName || null,
          ingredients_text: ingredientsText,
          verdict: result.verdict as Verdict,
          what_stood_out: result.whatStoodOut,
          why_matters: result.whyMatters,
          whats_uncertain: result.whatsUncertain,
          bottom_line: result.bottomLine,
        })
        .select()
        .single();

      if (error) throw error;

      setHistory(prev => [data as AnalysisHistoryItem, ...prev]);
      return data as AnalysisHistoryItem;
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast.error('Failed to save analysis');
      return null;
    }
  };

  const toggleStar = async (id: string) => {
    const item = history.find(h => h.id === id);
    if (!item) return;

    try {
      const { error } = await supabase
        .from('analysis_history')
        .update({ is_starred: !item.is_starred })
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.map(h => 
        h.id === id ? { ...h, is_starred: !h.is_starred } : h
      ));
    } catch (error) {
      console.error('Error toggling star:', error);
      toast.error('Failed to update');
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analysis_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(h => h.id !== id));
      toast.success('Deleted from history');
    } catch (error) {
      console.error('Error deleting history item:', error);
      toast.error('Failed to delete');
    }
  };

  return {
    history,
    loading,
    saveAnalysis,
    toggleStar,
    deleteHistoryItem,
    refetch: fetchHistory,
  };
}
