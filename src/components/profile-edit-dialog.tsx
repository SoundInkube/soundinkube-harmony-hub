import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useCities } from '@/hooks/useCities';
import { useSkills } from '@/hooks/useSkills';
import { useInstruments } from '@/hooks/useInstruments';
import { useTeacherSpecializations } from '@/hooks/useTeacherSpecializations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { ImageUpload } from '@/components/ui/image-upload';
import { GalleryUpload } from '@/components/ui/gallery-upload';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { User, Loader2, Camera, Images } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateProfileData, sanitizeProfileData } from '@/lib/validation';
import { GenreMultiSelect } from '@/components/ui/genre-multi-select';
import { useGenres } from '@/hooks/useGenres';

interface ProfileEditDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProfileEditDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: ProfileEditDialogProps) {
  const { user } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { data: cities } = useCities();
  const { data: skills } = useSkills();
  const { data: instruments } = useInstruments();
  const { data: teacherSpecializations } = useTeacherSpecializations();
  const { toast } = useToast();
  const { getProfileGenres, updateProfileGenres } = useGenres();
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
    avatar_url: profile?.avatar_url || '',
    gallery_images: (profile as any)?.gallery_images || [],
    specializations: (profile as any)?.specializations || [],
    company_name: (profile as any)?.company_name || '',
    social_media: (profile as any)?.social_media || {},
    skills: (profile as any)?.skills || [],
    instruments: (profile as any)?.instruments || [],
    selectedGenres: [],
    hourly_rate: (profile as any)?.hourly_rate || '',
    experience_level: (profile as any)?.experience_level || ''
  });

  // Update form when profile loads
  useEffect(() => {
    const loadProfileData = async () => {
      if (profile) {
        let profileGenres: string[] = [];
        
        // Load existing genres for music professionals
        if (profile.user_type === 'artist' || profile.user_type === 'manager') {
          try {
            const genres = await getProfileGenres(profile.id);
            profileGenres = genres.map(g => g.id);
          } catch (error) {
            console.error('Error loading profile genres:', error);
          }
        }

        setFormData({
          full_name: profile.full_name || '',
          username: profile.username || '',
          bio: profile.bio || '',
          location: profile.location || '',
          phone: profile.phone || '',
          website: profile.website || '',
          user_type: profile.user_type || 'client',
          avatar_url: profile.avatar_url || '',
          gallery_images: (profile as any).gallery_images || [],
          specializations: (profile as any).specializations || [],
          company_name: (profile as any).company_name || '',
          social_media: (profile as any).social_media || {},
        skills: (profile as any)?.skills || [],
        instruments: (profile as any)?.instruments || [],
          selectedGenres: profileGenres,
          hourly_rate: (profile as any).hourly_rate || '',
          experience_level: (profile as any).experience_level || ''
        });
      }
    };

    loadProfileData();
  }, [profile, getProfileGenres]);

  const userTypes = [
    { value: 'client', label: 'Client' },
    { value: 'artist', label: 'Music Professional' },
    { value: 'teacher', label: 'Music Teacher' },
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

  const musicSpecializations = [
    { value: 'singer-songwriter', label: 'Singer/Songwriter' },
    { value: 'dj', label: 'DJ' },
    { value: 'producer', label: 'Producer' },
    { value: 'engineer', label: 'Engineer' },
    { value: 'lyricist', label: 'Lyricist' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'director', label: 'Director' },
    { value: 'instrumentalist', label: 'Instrumentalist' },
    { value: 'band', label: 'Band' },
    { value: 'beatboxer', label: 'Beatboxer' },
    { value: 'vocalist', label: 'Vocalist' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    
    try {
      // Validate form data
      const validation = validateProfileData(formData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Sanitize form data
      const sanitizedData = sanitizeProfileData(formData);

      // Update profile genres if user is a professional
      if (profile && (formData.user_type === 'artist' || formData.user_type === 'manager')) {
        await updateProfileGenres(profile.id, formData.selectedGenres);
      }

      const { error } = await updateProfile(sanitizedData);

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Profile Image
            </Label>
            <ImageUpload
              bucketName="avatars"
              currentImage={formData.avatar_url}
              onImageUploaded={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
              onImageRemoved={() => setFormData(prev => ({ ...prev, avatar_url: '' }))}
              placeholder="Upload your profile picture"
              className="max-w-sm"
            />
          </div>

          {/* Gallery Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Images className="h-4 w-4" />
              Gallery ({formData.gallery_images?.length || 0}/10)
            </Label>
            <GalleryUpload
              bucketName="profile-galleries"
              currentImages={formData.gallery_images}
              onImagesUpdated={(images) => setFormData(prev => ({ ...prev, gallery_images: images }))}
              maxImages={10}
            />
          </div>

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


          {/* Music Professional Specializations */}
          {formData.user_type === 'artist' && (
            <div>
              <Label htmlFor="specializations">Specializations (Select multiple)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {musicSpecializations.map((spec) => (
                  <label key={spec.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specializations?.includes(spec.label) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            specializations: [...(prev.specializations || []), spec.label]
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            specializations: (prev.specializations || []).filter(s => s !== spec.label)
                          }));
                        }
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{spec.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Specializations */}
          {formData.user_type === 'teacher' && (
            <div>
              <Label>Teaching Specializations (Select multiple)</Label>
              <MultiSelect
                options={teacherSpecializations?.map(spec => ({
                  value: spec.name,
                  label: spec.name,
                  category: spec.category
                })) || []}
                selected={formData.specializations || []}
                onChange={(selectedSpecs) => setFormData(prev => ({ 
                  ...prev, 
                  specializations: selectedSpecs
                }))}
                placeholder="Select your teaching specializations"
                className="w-full"
              />
            </div>
          )}

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
              <Label htmlFor="location">City</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={`${city.name}, ${city.state}`}>
                      {city.name}, {city.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Country</Label>
              <Select value="India" disabled>
                <SelectTrigger>
                  <SelectValue placeholder="India" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
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
            <Label className="text-base font-semibold">Social Media & Streaming</Label>
            
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
                <Label htmlFor="apple_music">Apple Music</Label>
                <Input
                  id="apple_music"
                  placeholder="https://music.apple.com/artist/..."
                  value={formData.social_media?.apple_music || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_media: { ...prev.social_media, apple_music: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  id="tiktok"
                  placeholder="https://tiktok.com/@username"
                  value={formData.social_media?.tiktok || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_media: { ...prev.social_media, tiktok: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/username"
                  value={formData.social_media?.facebook || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_media: { ...prev.social_media, facebook: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="bandcamp">Bandcamp</Label>
                <Input
                  id="bandcamp"
                  placeholder="https://username.bandcamp.com"
                  value={formData.social_media?.bandcamp || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_media: { ...prev.social_media, bandcamp: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          {(['artist', 'studio', 'manager', 'label', 'school'].includes(formData.user_type)) && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Professional Details</Label>
              
              <div className="grid grid-cols-2 gap-4">
                {(formData.user_type === 'artist' || formData.user_type === 'studio') && (
                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      placeholder="50"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                    />
                  </div>
                )}
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
              
              {formData.user_type === 'label' && (
                <div>
                  <Label htmlFor="company_name">Label Name</Label>
                  <Input
                    id="company_name"
                    placeholder="Record Label Name"
                    value={formData.company_name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  />
                </div>
              )}
              
              {(formData.user_type === 'studio' || formData.user_type === 'school') && (
                <div>
                  <Label htmlFor="company_name">Business Name</Label>
                  <Input
                    id="company_name"
                    placeholder="Studio/School Name"
                    value={formData.company_name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  />
                </div>
              )}
            </div>
          )}

          {/* Skills and Instruments for relevant user types */}
          {(formData.user_type === 'artist' || formData.user_type === 'manager' || formData.user_type === 'teacher') && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Skills & Expertise</Label>
              
              <div>
                <Label>Skills</Label>
                <MultiSelect
                  options={skills?.map(skill => ({
                    value: skill.name,
                    label: skill.name,
                    category: skill.category
                  })) || []}
                  selected={formData.skills || []}
                  onChange={(selectedSkills) => setFormData(prev => ({ 
                    ...prev, 
                    skills: selectedSkills
                  }))}
                  placeholder="Select your skills"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label>Instruments</Label>
                <MultiSelect
                  options={instruments?.map(instrument => ({
                    value: instrument.name,
                    label: instrument.name,
                    category: instrument.category
                  })) || []}
                  selected={formData.instruments || []}
                  onChange={(selectedInstruments) => setFormData(prev => ({ 
                    ...prev, 
                    instruments: selectedInstruments
                  }))}
                  placeholder="Select instruments you play"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="genres">Genres</Label>
                <GenreMultiSelect
                  selectedGenres={formData.selectedGenres}
                  onGenresChange={(genreIds) => setFormData(prev => ({ 
                    ...prev, 
                    selectedGenres: genreIds
                  }))}
                  placeholder="Select your music genres..."
                  className="mt-1"
                />
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