import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Camera, Globe, Phone, Music, Star, Award, Images, MapPin, Clock, DollarSign, Instagram, Twitter, Youtube, Music2, Linkedin } from 'lucide-react';

import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useGenres } from '@/hooks/useGenres';
import { useCities } from '@/hooks/useCities';
import { useSkills } from '@/hooks/useSkills';
import { useInstruments } from '@/hooks/useInstruments';
import { useTeacherSpecializations } from '@/hooks/useTeacherSpecializations';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { validateProfileData, sanitizeProfileData } from '@/lib/validation';
import { ImageUpload } from './ui/image-upload';
import { GalleryUpload } from './ui/gallery-upload';
import { MultiSelect } from './ui/multi-select';
import { GenreMultiSelect } from './ui/genre-multi-select';

interface ProfileEditDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProfileEditDialog({ children, open = false, onOpenChange }: ProfileEditDialogProps) {
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { genres } = useGenres();
  const { data: cities } = useCities();
  const { data: skills } = useSkills();
  const { data: instruments } = useInstruments();
  const { data: teacherSpecializations } = useTeacherSpecializations();
  const { isProfileComplete } = useProfileCompletion();
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    user_type: 'client',
    avatar_url: '',
    gallery_images: [] as string[],
    specializations: [] as string[],
    company_name: '',
    social_media: {
      instagram: '',
      twitter: '',
      youtube: '',
      soundcloud: '',
      spotify: '',
      apple_music: '',
      linkedin: '',
      tiktok: '',
      facebook: '',
      bandcamp: ''
    },
    skills: [] as string[],
    instruments: [] as string[],
    selectedGenres: [] as string[],
    hourly_rate: '',
    experience_level: ''
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {        
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
        social_media: {
          instagram: (profile as any).social_media?.instagram || '',
          twitter: (profile as any).social_media?.twitter || '',
          youtube: (profile as any).social_media?.youtube || '',
          soundcloud: (profile as any).social_media?.soundcloud || '',
          spotify: (profile as any).social_media?.spotify || '',
          apple_music: (profile as any).social_media?.apple_music || '',
          linkedin: (profile as any).social_media?.linkedin || '',
          tiktok: (profile as any).social_media?.tiktok || '',
          facebook: (profile as any).social_media?.facebook || '',
          bandcamp: (profile as any).social_media?.bandcamp || ''
        },
        skills: (profile as any).skills || [],
        instruments: (profile as any).instruments || [],
        selectedGenres: (profile as any).genres || [],
        hourly_rate: (profile as any).hourly_rate || '',
        experience_level: (profile as any).experience_level || ''
      });
    }
  }, [profile]);

  

  const userTypes = [
    { value: 'client', label: 'Client' },
    { value: 'artist', label: 'Music Professional' },
    { value: 'studio', label: 'Studio' },
    { value: 'school', label: 'Music School' },
    { value: 'label', label: 'Record Label' },
    { value: 'teacher', label: 'Teacher' },
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

      // Remove genres from the profile update as they're handled separately

      const { error } = await updateProfile(sanitizedData);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      if (onOpenChange) onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                value={formData.full_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="@username"
                value={formData.username || ''}
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
              value={formData.bio || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">City</Label>
              <Select
                value={formData.location || ""}
                onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map(city => (
                    <SelectItem key={city.id} value={`${city.name}, ${city.state}`}>
                      {city.name}, {city.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experience_level">Experience Level</Label>
              <Select
                value={formData.experience_level || ""}
                onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <Label>Skills (Select multiple)</Label>
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

          {/* Instruments Section */}
          <div>
            <Label>Instruments (Select multiple)</Label>
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
              placeholder="Select your instruments"
              className="w-full"
            />
          </div>

          {/* Genres Section (for professionals only) */}
          {(formData.user_type === 'artist' || formData.user_type === 'manager') && (
            <div>
              <Label>Genres (Select multiple)</Label>
              <GenreMultiSelect
                selectedGenres={formData.selectedGenres || []}
                onGenresChange={(genres) => setFormData(prev => ({ 
                  ...prev, 
                  selectedGenres: genres
                }))}
                placeholder="Select your music genres"
                className="w-full"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.website || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>

          {/* Professional Information */}
          {(formData.user_type === 'artist' || formData.user_type === 'teacher') && (
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate (USD)</Label>
              <Input
                id="hourly_rate"
                type="number"
                placeholder="e.g., 50"
                value={formData.hourly_rate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
              />
            </div>
          )}

          {/* Company Information */}
          {(formData.user_type === 'studio' || formData.user_type === 'school' || formData.user_type === 'label') && (
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                placeholder="Your company name"
                value={formData.company_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              />
            </div>
          )}

          {/* Social Media Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <Input
                    placeholder="Instagram username"
                    value={formData.social_media.instagram || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, instagram: e.target.value }
                    }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-blue-400" />
                  <Input
                    placeholder="Twitter/X username"
                    value={formData.social_media.twitter || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, twitter: e.target.value }
                    }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-500" />
                  <Input
                    placeholder="YouTube channel"
                    value={formData.social_media.youtube || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, youtube: e.target.value }
                    }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Music2 className="h-4 w-4 text-orange-500" />
                  <Input
                    placeholder="SoundCloud profile"
                    value={formData.social_media.soundcloud || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, soundcloud: e.target.value }
                    }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-green-500" />
                  <Input
                    placeholder="Spotify artist profile"
                    value={formData.social_media.spotify || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, spotify: e.target.value }
                    }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  <Input
                    placeholder="LinkedIn profile"
                    value={formData.social_media.linkedin || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, linkedin: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange && onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}