import { useState } from 'react';
import { DietaryProfile } from '@/types/analysis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface DietaryProfileFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (profile: Omit<DietaryProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  initialData?: DietaryProfile;
}

const commonRestrictions = ['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free', 'Low-Sodium', 'Low-Sugar'];
const commonAllergies = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish', 'Sesame'];

export function DietaryProfileForm({ open, onClose, onSave, initialData }: DietaryProfileFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [restrictions, setRestrictions] = useState<string[]>(initialData?.restrictions || []);
  const [allergies, setAllergies] = useState<string[]>(initialData?.allergies || []);
  const [preferences, setPreferences] = useState<string[]>(initialData?.preferences || []);
  const [newPreference, setNewPreference] = useState('');

  const toggleRestriction = (r: string) => {
    setRestrictions(prev => 
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  const toggleAllergy = (a: string) => {
    setAllergies(prev => 
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const addPreference = () => {
    if (newPreference.trim() && !preferences.includes(newPreference.trim())) {
      setPreferences(prev => [...prev, newPreference.trim()]);
      setNewPreference('');
    }
  };

  const removePreference = (p: string) => {
    setPreferences(prev => prev.filter(x => x !== p));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      is_active: initialData?.is_active || false,
      restrictions,
      allergies,
      preferences,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Profile' : 'Create Dietary Profile'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Profile Name</Label>
            <Input
              id="name"
              placeholder="e.g., My Diet, Family Member"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Dietary Restrictions</Label>
            <div className="flex flex-wrap gap-2">
              {commonRestrictions.map(r => (
                <Badge
                  key={r}
                  variant={restrictions.includes(r) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleRestriction(r)}
                >
                  {r}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allergies</Label>
            <div className="flex flex-wrap gap-2">
              {commonAllergies.map(a => (
                <Badge
                  key={a}
                  variant={allergies.includes(a) ? 'destructive' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleAllergy(a)}
                >
                  {a}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Other Preferences</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom preference..."
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPreference()}
              />
              <Button variant="outline" size="icon" onClick={addPreference}>
                <Plus size={18} />
              </Button>
            </div>
            {preferences.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.map(p => (
                  <Badge key={p} variant="secondary" className="pr-1">
                    {p}
                    <button
                      onClick={() => removePreference(p)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {initialData ? 'Save Changes' : 'Create Profile'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
