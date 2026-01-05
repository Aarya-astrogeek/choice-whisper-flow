import { AnalysisHistoryItem } from '@/types/analysis';
import { VerdictBadge } from './VerdictBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface HistoryListProps {
  history: AnalysisHistoryItem[];
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (item: AnalysisHistoryItem) => void;
}

export function HistoryList({ history, onToggleStar, onDelete, onSelect }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No analysis history yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Your analyzed products will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <Card 
          key={item.id} 
          className="hover:bg-secondary/30 transition-colors cursor-pointer"
          onClick={() => onSelect(item)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">
                    {item.product_name || 'Untitled Analysis'}
                  </h4>
                  <VerdictBadge verdict={item.verdict} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.bottom_line || item.ingredients_text.slice(0, 100)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </p>
              </div>
              
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onToggleStar(item.id)}
                >
                  <Star 
                    size={18} 
                    className={cn(
                      item.is_starred && 'fill-primary text-primary'
                    )} 
                  />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 size={18} className="text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
