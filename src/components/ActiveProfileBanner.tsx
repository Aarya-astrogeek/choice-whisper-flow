import { DietaryProfile } from '@/types/analysis';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActiveProfileBannerProps {
  profile: DietaryProfile | null;
}

export function ActiveProfileBanner({ profile }: ActiveProfileBannerProps) {
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="bg-secondary/50 border border-border rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <User size={20} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">No active dietary profile</p>
            <p className="text-sm text-muted-foreground">
              Create one to get personalized analysis
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/profiles')}>
          <Settings size={16} className="mr-2" />
          Set Up Profile
        </Button>
      </div>
    );
  }

  const allTags = [
    ...profile.restrictions,
    ...profile.allergies,
    ...profile.preferences,
  ];

  return (
    <div className="bg-gradient-hero border border-primary/20 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <User size={20} className="text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              Analyzing as: <span className="text-primary">{profile.name}</span>
            </p>
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {allTags.slice(0, 4).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {allTags.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{allTags.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/profiles')}>
          <Settings size={16} />
        </Button>
      </div>
    </div>
  );
}
