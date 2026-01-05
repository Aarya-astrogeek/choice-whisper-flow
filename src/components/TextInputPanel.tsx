import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';

interface TextInputPanelProps {
  onAnalyze: (ingredients: string, productName?: string) => void;
  analyzing: boolean;
}

export function TextInputPanel({ onAnalyze, analyzing }: TextInputPanelProps) {
  const [ingredients, setIngredients] = useState('');
  const [productName, setProductName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.trim()) {
      onAnalyze(ingredients, productName || undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="productName">Product Name (optional)</Label>
        <Input
          id="productName"
          placeholder="e.g., Organic Granola Bar"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          disabled={analyzing}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ingredients">Ingredients List *</Label>
        <Textarea
          id="ingredients"
          placeholder="Paste the full ingredients list here...

Example: Water, Organic Rolled Oats, Organic Cane Sugar, Organic Rice Syrup, Organic Sunflower Seeds..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          disabled={analyzing}
          className="min-h-[180px] resize-none"
        />
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full gradient-primary text-primary-foreground shadow-glow"
        disabled={!ingredients.trim() || analyzing}
      >
        {analyzing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Analyze Ingredients
          </>
        )}
      </Button>
    </form>
  );
}
