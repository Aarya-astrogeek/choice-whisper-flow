import { Header } from '@/components/Header';
import { AnalysisInput } from '@/components/AnalysisInput';
import { ActiveProfileBanner } from '@/components/ActiveProfileBanner';
import { useDietaryProfiles } from '@/hooks/useDietaryProfiles';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, Shield, Zap, Leaf } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();
  const { activeProfile } = useDietaryProfiles();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles size={16} />
            AI-Powered Ingredient Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Understand What You're Eating
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Paste ingredients, upload labels, or search products. Get instant clarity on what's in your food.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <FeatureCard
            icon={<Zap className="text-primary" />}
            title="Instant Analysis"
            description="Quick verdict on any ingredient list"
          />
          <FeatureCard
            icon={<Shield className="text-primary" />}
            title="Diet-Aware"
            description="Personalized to your dietary needs"
          />
          <FeatureCard
            icon={<Leaf className="text-primary" />}
            title="Eco Insights"
            description="Environmental impact awareness"
          />
        </div>

        {/* Active Profile Banner */}
        {user && (
          <div className="mb-6">
            <ActiveProfileBanner profile={activeProfile} />
          </div>
        )}

        {/* Main Analysis Input */}
        <AnalysisInput activeProfile={activeProfile} />
      </main>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 text-center">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
