import { useState, useCallback } from 'react';
import { InputMethod, DietaryProfile } from '@/types/analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputMethodTabs } from './InputMethodTabs';
import { TextInputPanel } from './TextInputPanel';
import { ImageUploadPanel } from './ImageUploadPanel';
import { ProductSearchPanel } from './ProductSearchPanel';
import { useIngredientAnalysis } from '@/hooks/useIngredientAnalysis';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import { AnalysisResultCard } from './AnalysisResultCard';

interface AnalysisInputProps {
  activeProfile?: DietaryProfile | null;
}

export function AnalysisInput({ activeProfile }: AnalysisInputProps) {
  const [inputMethod, setInputMethod] = useState<InputMethod>('text');
  const [productName, setProductName] = useState<string | undefined>();
  
  const { 
    analyzing, 
    conversing,
    result, 
    session,
    analyzeIngredients, 
    sendFollowUp,
    extractFromImage, 
    clearResult 
  } = useIngredientAnalysis();
  const { saveAnalysis } = useAnalysisHistory();

  const handleAnalyze = async (ingredients: string, name?: string) => {
    setProductName(name);
    const analysisResult = await analyzeIngredients(ingredients, name, activeProfile);
    if (analysisResult) {
      await saveAnalysis(ingredients, analysisResult, name);
    }
  };

  const handleFollowUp = useCallback(async (message: string) => {
    await sendFollowUp(message, activeProfile);
  }, [sendFollowUp, activeProfile]);

  const handleMethodChange = (method: InputMethod) => {
    setInputMethod(method);
    clearResult();
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Analyze Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InputMethodTabs value={inputMethod} onChange={handleMethodChange} />
          
          {inputMethod === 'text' && (
            <TextInputPanel 
              onAnalyze={handleAnalyze} 
              analyzing={analyzing} 
            />
          )}
          
          {inputMethod === 'image' && (
            <ImageUploadPanel 
              onExtract={extractFromImage}
              onAnalyze={handleAnalyze}
              analyzing={analyzing}
            />
          )}
          
          {inputMethod === 'search' && (
            <ProductSearchPanel 
              onSelectProduct={handleAnalyze}
            />
          )}
        </CardContent>
      </Card>

      {result && (
        <AnalysisResultCard 
          result={result} 
          productName={productName}
          conversation={session?.conversation}
          onSendFollowUp={handleFollowUp}
          isConversing={conversing}
        />
      )}
    </div>
  );
}
