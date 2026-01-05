import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult, DietaryProfile, ConversationMessage, AnalysisSession } from '@/types/analysis';
import { toast } from 'sonner';

export function useIngredientAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [conversing, setConversing] = useState(false);

  const analyzeIngredients = async (
    ingredients: string,
    productName?: string,
    dietaryProfile?: DietaryProfile | null
  ) => {
    if (!ingredients.trim()) {
      toast.error('Please enter some ingredients to analyze');
      return null;
    }

    setAnalyzing(true);
    setResult(null);
    setSession(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-ingredients', {
        body: {
          ingredients,
          productName,
          dietaryProfile: dietaryProfile ? {
            restrictions: dietaryProfile.restrictions,
            allergies: dietaryProfile.allergies,
            preferences: dietaryProfile.preferences,
          } : undefined,
        },
      });

      if (error) {
        console.error('Analysis error:', error);
        toast.error(error.message || 'Analysis failed');
        return null;
      }

      if (data.error) {
        toast.error(data.error);
        return null;
      }

      const analysisResult: AnalysisResult = {
        verdict: data.verdict,
        whatStoodOut: data.whatStoodOut,
        whyMatters: data.whyMatters,
        whatsUncertain: data.whatsUncertain,
        bottomLine: data.bottomLine,
      };

      setResult(analysisResult);
      
      // Initialize session for conversation continuity
      setSession({
        ingredients,
        productName,
        initialResult: analysisResult,
        conversation: [],
      });
      
      return analysisResult;
    } catch (error) {
      console.error('Error analyzing ingredients:', error);
      toast.error('Failed to analyze ingredients');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const sendFollowUp = useCallback(async (
    message: string,
    dietaryProfile?: DietaryProfile | null
  ): Promise<string | null> => {
    if (!session) {
      toast.error('No active analysis session');
      return null;
    }

    setConversing(true);

    // Add user message to conversation
    const userMessage: ConversationMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setSession(prev => prev ? {
      ...prev,
      conversation: [...prev.conversation, userMessage],
    } : null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-ingredients', {
        body: {
          ingredients: session.ingredients,
          productName: session.productName,
          dietaryProfile: dietaryProfile ? {
            restrictions: dietaryProfile.restrictions,
            allergies: dietaryProfile.allergies,
            preferences: dietaryProfile.preferences,
          } : undefined,
          followUp: message,
          previousAnalysis: session.initialResult,
          conversationHistory: session.conversation.map(m => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (error) {
        console.error('Follow-up error:', error);
        toast.error(error.message || 'Failed to process follow-up');
        return null;
      }

      if (data.error) {
        toast.error(data.error);
        return null;
      }

      const assistantResponse = data.response as string;

      // Add assistant response to conversation
      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      };

      setSession(prev => prev ? {
        ...prev,
        conversation: [...prev.conversation, assistantMessage],
      } : null);

      return assistantResponse;
    } catch (error) {
      console.error('Error sending follow-up:', error);
      toast.error('Failed to send follow-up question');
      return null;
    } finally {
      setConversing(false);
    }
  }, [session]);

  const extractFromImage = async (imageBase64: string) => {
    setAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('extract-ingredients', {
        body: { imageBase64 },
      });

      if (error) {
        console.error('Extraction error:', error);
        toast.error(error.message || 'Image processing failed');
        return null;
      }

      if (data.error) {
        toast.error(data.error);
        return null;
      }

      if (!data.ingredients) {
        toast.error('Could not find ingredients in this image');
        return null;
      }

      return {
        productName: data.productName as string | null,
        ingredients: data.ingredients as string,
      };
    } catch (error) {
      console.error('Error extracting ingredients:', error);
      toast.error('Failed to process image');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setSession(null);
  };

  return {
    analyzing,
    conversing,
    result,
    session,
    analyzeIngredients,
    sendFollowUp,
    extractFromImage,
    clearResult,
  };
}
