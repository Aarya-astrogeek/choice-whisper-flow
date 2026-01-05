import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult, DietaryProfile } from '@/types/analysis';
import { toast } from 'sonner';

export function useIngredientAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

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
      return analysisResult;
    } catch (error) {
      console.error('Error analyzing ingredients:', error);
      toast.error('Failed to analyze ingredients');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

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

  const clearResult = () => setResult(null);

  return {
    analyzing,
    result,
    analyzeIngredients,
    extractFromImage,
    clearResult,
  };
}
