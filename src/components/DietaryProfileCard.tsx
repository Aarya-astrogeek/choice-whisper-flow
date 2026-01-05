import { DietaryProfile } from '@/types/analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DietaryProfileCardProps {
  profile: DietaryProfile;
  onSetActive: (id: string) => void;
  onEdit: (profile: DietaryProfile) => void;
  onDelete: (id: string) => void;
}

export function DietaryProfileCard({ profile, onSetActive, onEdit, onDelete }: DietaryProfileCardProps) {
  const allTags = [
    ...profile.restrictions.map(r => ({ label: r, type: 'restriction' as const })),
    ...profile.allergies.map(a => ({ label: a, type: 'allergy' as const })),
    ...profile.preferences.map(p => ({ label: p, type: 'preference' as const })),
  ];

  return (
    <Card className={cn(
      'transition-all',
      profile.is_active && 'ring-2 ring-primary shadow-glow'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {profile.name}
            {profile.is_active && (
              <Badge variant="default" className="gradient-primary text-primary-foreground">
                Active
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(profile)}>
              <Edit size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(profile.id)}>
              <Trash2 size={16} className="text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {allTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag, i) => (
              <Badge 
                key={i} 
                variant={tag.type === 'allergy' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No dietary preferences set</p>
        )}

        {!profile.is_active && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onSetActive(profile.id)}
          >
            <Check size={16} className="mr-2" />
            Set as Active
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
