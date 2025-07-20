import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileEditDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProfileEditDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: ProfileEditDialogProps) {
  const { user } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    phone: profile?.phone || '',
    website: profile?.website || '',
    user_type: profile?.user_type || 'client',
    social_media: (profile as any)?.social_media || {},
    skills: (profile as any)?.skills || [],
    instruments: (profile as any)?.instruments || [],
    genres: (profile as any)?.genres || [],
    hourly_rate: (profile as any)?.hourly_rate || '',
    experience_level: (profile as any)?.experience_level || ''
  });

  // Update form when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        website: profile.website || '',
        user_type: profile.user_type || 'client',
        social_media: (profile as any).social_media || {},
        skills: (profile as any).skills || [],
        instruments: (profile as any).instruments || [],
        genres: (profile as any).genres || [],
        hourly_rate: (profile as any).hourly_rate || '',
        experience_level: (profile as any).experience_level || ''
      });
    }
  });

  const userTypes = [
    { value: 'client', label: 'Client' },
    { value: 'artist', label: 'Music Professional' },
    { value: 'studio', label: 'Studio Owner' },
    { value: 'school', label: 'Music School' },
    { value: 'label', label: 'Record Label' },
    { value: 'manager', label: 'Artist Manager' }
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'professional', label: 'Professional' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    
    try {
      const { error } = await updateProfile(formData);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!"
      });

      setOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your profile information and preferences.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Your full name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="@username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="user_type">Account Type</Label>
            <Select 
              value={formData.user_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, user_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell others about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            />
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Social Media Links</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/username"
                  value={formData.social_media?.instagram || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_media: { ...prev.social_media, instagram: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/username"
                  value={formData.social_media?.twitter || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_media: { ...prev.social_media, twitter: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  placeholder="https://youtube.com/@username"
                  value={formData.social_media?.youtube || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_media: { ...prev.social_media, youtube: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="soundcloud">SoundCloud</Label>
                <Input
                  id="soundcloud"
                  placeholder="https://soundcloud.com/username"
                  value={formData.social_media?.soundcloud || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_media: { ...prev.social_media, soundcloud: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="spotify">Spotify</Label>
                <Input
                  id="spotify"
                  placeholder="https://open.spotify.com/artist/..."
                  value={formData.social_media?.spotify || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_media: { ...prev.social_media, spotify: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.social_media?.linkedin || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_media: { ...prev.social_media, linkedin: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          {(formData.user_type === 'artist' || formData.user_type === 'studio') && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Professional Details</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    placeholder="50"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="experience_level">Experience Level</Label>
                  <Select 
                    value={formData.experience_level} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}