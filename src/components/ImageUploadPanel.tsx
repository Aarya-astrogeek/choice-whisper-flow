import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Upload, X, Camera, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadPanelProps {
  onExtract: (imageBase64: string) => Promise<{ productName: string | null; ingredients: string } | null>;
  onAnalyze: (ingredients: string, productName?: string) => void;
  analyzing: boolean;
}

export function ImageUploadPanel({ onExtract, onAnalyze, analyzing }: ImageUploadPanelProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<{ productName: string | null; ingredients: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      setExtractedData(null);

      const result = await onExtract(base64);
      if (result) {
        setExtractedData(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    setExtractedData(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleAnalyze = () => {
    if (extractedData) {
      onAnalyze(extractedData.ingredients, extractedData.productName || undefined);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {!preview ? (
        <Card
          className={cn(
            'border-2 border-dashed p-8 text-center cursor-pointer transition-all',
            dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
          )}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Upload a label image</p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop or click to browse
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={preview} 
              alt="Uploaded label" 
              className="w-full rounded-lg border border-border max-h-[300px] object-contain bg-secondary/20"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={clearImage}
            >
              <X size={18} />
            </Button>
          </div>

          {analyzing && !extractedData && (
            <div className="flex items-center justify-center gap-2 p-4 bg-secondary rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-muted-foreground">Extracting ingredients...</span>
            </div>
          )}

          {extractedData && (
            <Card className="p-4 bg-secondary/50">
              {extractedData.productName && (
                <p className="text-sm text-muted-foreground mb-1">
                  Detected: <span className="font-medium text-foreground">{extractedData.productName}</span>
                </p>
              )}
              <p className="text-sm">
                <span className="font-medium">Ingredients: </span>
                <span className="text-muted-foreground">
                  {extractedData.ingredients.length > 200 
                    ? extractedData.ingredients.slice(0, 200) + '...'
                    : extractedData.ingredients
                  }
                </span>
              </p>
            </Card>
          )}

          {extractedData && (
            <Button 
              size="lg" 
              className="w-full gradient-primary text-primary-foreground shadow-glow"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze These Ingredients
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
