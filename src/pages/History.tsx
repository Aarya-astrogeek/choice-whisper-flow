import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HistoryList } from '@/components/HistoryList';
import { AnalysisResultCard } from '@/components/AnalysisResultCard';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import { useAuth } from '@/hooks/useAuth';
import { AnalysisHistoryItem, AnalysisResult } from '@/types/analysis';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, X } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { history, loading, toggleStar, deleteHistoryItem } = useAnalysisHistory();
  const [filter, setFilter] = useState<'all' | 'starred'>('all');
  const [selectedItem, setSelectedItem] = useState<AnalysisHistoryItem | null>(null);

  // Redirect if not logged in
  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  const filteredHistory = filter === 'starred' 
    ? history.filter(h => h.is_starred)
    : history;

  const handleSelect = (item: AnalysisHistoryItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/')}>
          <ArrowLeft size={18} className="mr-2" />
          Back to Analysis
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analysis History</h1>
            <p className="text-muted-foreground mt-1">
              Review your past ingredient analyses
            </p>
          </div>
        </div>

        {selectedItem ? (
          <div className="space-y-4">
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              <X size={18} className="mr-2" />
              Close Details
            </Button>
            <AnalysisResultCard
              result={{
                verdict: selectedItem.verdict,
                whatStoodOut: selectedItem.what_stood_out || '',
                whyMatters: selectedItem.why_matters || '',
                whatsUncertain: selectedItem.whats_uncertain || '',
                bottomLine: selectedItem.bottom_line || '',
              }}
              productName={selectedItem.product_name || undefined}
            />
            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Original Ingredients</h4>
              <p className="text-sm text-muted-foreground">
                {selectedItem.ingredients_text}
              </p>
            </div>
          </div>
        ) : (
          <>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'starred')} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All ({history.length})</TabsTrigger>
                <TabsTrigger value="starred">
                  Starred ({history.filter(h => h.is_starred).length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <HistoryList
                history={filteredHistory}
                onToggleStar={toggleStar}
                onDelete={deleteHistoryItem}
                onSelect={handleSelect}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
