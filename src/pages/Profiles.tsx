import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { DietaryProfileCard } from '@/components/DietaryProfileCard';
import { DietaryProfileForm } from '@/components/DietaryProfileForm';
import { useDietaryProfiles } from '@/hooks/useDietaryProfiles';
import { useAuth } from '@/hooks/useAuth';
import { DietaryProfile } from '@/types/analysis';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';

export default function Profiles() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profiles, loading, createProfile, updateProfile, setProfileActive, deleteProfile } = useDietaryProfiles();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<DietaryProfile | undefined>();

  // Redirect if not logged in
  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  const handleSave = async (data: Omit<DietaryProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (editingProfile) {
      await updateProfile(editingProfile.id, data);
    } else {
      await createProfile(data);
    }
    setEditingProfile(undefined);
  };

  const handleEdit = (profile: DietaryProfile) => {
    setEditingProfile(profile);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingProfile(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/')}>
          <ArrowLeft size={18} className="mr-2" />
          Back to Analysis
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dietary Profiles</h1>
            <p className="text-muted-foreground mt-1">
              Manage your dietary preferences and allergies
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus size={18} className="mr-2" />
            New Profile
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 bg-secondary/30 rounded-xl">
            <p className="text-muted-foreground mb-4">
              No dietary profiles yet. Create one to get personalized analysis.
            </p>
            <Button onClick={() => setFormOpen(true)}>
              <Plus size={18} className="mr-2" />
              Create Your First Profile
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {profiles.map((profile) => (
              <DietaryProfileCard
                key={profile.id}
                profile={profile}
                onSetActive={setProfileActive}
                onEdit={handleEdit}
                onDelete={deleteProfile}
              />
            ))}
          </div>
        )}

        <DietaryProfileForm
          open={formOpen}
          onClose={handleClose}
          onSave={handleSave}
          initialData={editingProfile}
        />
      </main>
    </div>
  );
}
