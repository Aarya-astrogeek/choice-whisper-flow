import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Mic } from 'lucide-react'; // Added Mic icon
import MicRecorder from 'mic-recorder-to-wav';

interface TextInputPanelProps {
  onAnalyze: (ingredients: string, productName?: string) => void;
  analyzing: boolean;
}

const recorder = new MicRecorder({ bitRate: 128 });

export function TextInputPanel({ onAnalyze, analyzing }: TextInputPanelProps) {
  const [ingredients, setIngredients] = useState('');
  const [productName, setProductName] = useState('');
  const [recording, setRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.trim()) {
      onAnalyze(ingredients, productName || undefined);
    }
  };

  // -------- Voice recording handlers --------
  const startRecording = async () => {
    try {
      await recorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      const [buffer, blob] = await recorder.stop().getWAV();
      setRecording(false);

      // send audio blob to Whisper
      const transcript = await transcribeAudio(blob);
      setIngredients(transcript);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');

      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}, // or your env var
        },
        body: formData,
      });

      const data = await res.json();
      return data.text || '';
    } catch (err) {
      console.error('Transcription error:', err);
      return '';
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

        {/* Voice Input Button */}
        <div className="flex items-center mb-2">
          <Button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            disabled={analyzing}
            className="mr-2 flex items-center gap-1"
          >
            <Mic className="h-4 w-4" />
            {recording ? 'Stop & Transcribe' : 'Record Ingredients'}
          </Button>
          {recording && <span className="text-sm text-muted-foreground">Recording...</span>}
        </div>

        <Textarea
          id="ingredients"
          placeholder={`Paste the full ingredients list here...

Example: Water, Organic Rolled Oats, Organic Cane Sugar, Organic Rice Syrup, Organic Sunflower Seeds...`}
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
