import { AnalysisResult, ConversationMessage } from '@/types/analysis';
import { VerdictBadge } from './VerdictBadge';
import { ConversationChat } from './ConversationChat';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Lightbulb, HelpCircle, Target, Zap, MessageCircle } from 'lucide-react';

interface AnalysisResultCardProps {
  result: AnalysisResult;
  productName?: string;
  conversation?: ConversationMessage[];
  onSendFollowUp?: (message: string) => Promise<void>;
  isConversing?: boolean;
}

export function AnalysisResultCard({ 
  result, 
  productName,
  conversation = [],
  onSendFollowUp,
  isConversing = false,
}: AnalysisResultCardProps) {
  return (
    <Card className="overflow-hidden animate-fade-in shadow-lg">
      <CardHeader className="gradient-hero border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <div>
            {productName && (
              <p className="text-sm text-muted-foreground mb-1">Analysis for</p>
            )}
            <h3 className="text-xl font-bold">
              {productName || 'Ingredient Analysis'}
            </h3>
          </div>
          <VerdictBadge verdict={result.verdict} size="lg" />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          <AnalysisSection
            icon={<Zap className="text-primary" size={20} />}
            title="What Stood Out"
            content={result.whatStoodOut}
          />
          
          <AnalysisSection
            icon={<Lightbulb className="text-primary" size={20} />}
            title="Why This Matters"
            content={result.whyMatters}
          />
          
          <AnalysisSection
            icon={<HelpCircle className="text-muted-foreground" size={20} />}
            title="What's Uncertain"
            content={result.whatsUncertain}
          />
          
          <AnalysisSection
            icon={<Target className="text-primary" size={20} />}
            title="Bottom Line"
            content={result.bottomLine}
            highlight
          />
        </div>

        {/* Conversation Section */}
        {onSendFollowUp && (
          <div className="border-t border-border">
            <div className="px-5 py-3 bg-muted/30 flex items-center gap-2">
              <MessageCircle size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Follow-up Questions</span>
            </div>
            <ConversationChat
              messages={conversation}
              onSendMessage={onSendFollowUp}
              isLoading={isConversing}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AnalysisSectionProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  highlight?: boolean;
}

function AnalysisSection({ icon, title, content, highlight }: AnalysisSectionProps) {
  return (
    <div className={`p-5 ${highlight ? 'bg-secondary/50' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>
      <p className={`text-muted-foreground ${highlight ? 'font-medium text-foreground' : ''}`}>
        {content}
      </p>
    </div>
  );
}
