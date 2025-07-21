import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Camera, Globe, Images, Instagram, Twitter, Youtube, Music2, Linkedin } from 'lucide-react';

import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useGenres } from '@/hooks/useGenres';
import { useCities } from '@/hooks/useCities';
import { useSkills } from '@/hooks/useSkills';
import { useInstruments } from '@/hooks/useInstruments';
import { useTeacherSpecializations } from '@/hooks/useTeacherSpecializations';
import { ImageUpload } from './ui/image-upload';
import { GalleryUpload } from './ui/gallery-upload';
import { MultiSelect } from './ui/multi-select';
import { GenreMultiSelect } from './ui/genre-multi-select';

interface ProfileEditDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface FormData {
  full_name: string;
  username: string;
  bio: string;
  location: string;
  phone: string;
  website: string;
  avatar_url: string;
  gallery_images: string[];
  specializations: string[];
  company_name: string;
  social_media: {
    instagram: string;
    twitter: string;
    youtube: string;
    soundcloud: string;
    spotify: string;
    apple_music: string;
    linkedin: string;
    tiktok: string;
    facebook: string;
    bandcamp: string;
  };
  skills: string[];
  instruments: string[];
  selectedGenres: string[];
  hourly_rate: string;
  experience_level: string;
  availability_status: string;
  founded_year: string;
}

export function ProfileEditDialog({ children, open = false, onOpenChange }: ProfileEditDialogProps) {
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile, refreshProfile } = useProfile();
  const { updateProfileGenres } = useGenres();
  const { genres } = useGenres();
  const { data: cities } = useCities();
  const { data: skills } = useSkills();
  const { data: instruments } = useInstruments();
  const { data: teacherSpecializations } = useTeacherSpecializations();
  
  const [loading, setLoading] = useState(false);

  // Initialize form data with empty values
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    avatar_url: '',
    gallery_images: [],
    specializations: [],
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
    skills: [],
    instruments: [],
    selectedGenres: [],
    hourly_rate: '',
    experience_level: '',
    availability_status: '',
    founded_year: ''
  });

  // Load profile data when profile is available
  useEffect(() => {
    if (profile && open) {
      const profileData = profile as any;
      
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        website: profile.website || '',
        avatar_url: profile.avatar_url || '',
        gallery_images: profileData.gallery_images || [],
        specializations: profileData.specializations || [],
        company_name: profileData.company_name || '',
        social_media: {
          instagram: profileData.social_media?.instagram || '',
          twitter: profileData.social_media?.twitter || '',
          youtube: profileData.social_media?.youtube || '',
          soundcloud: profileData.social_media?.soundcloud || '',
          spotify: profileData.social_media?.spotify || '',
          apple_music: profileData.social_media?.apple_music || '',
          linkedin: profileData.social_media?.linkedin || '',
          tiktok: profileData.social_media?.tiktok || '',
          facebook: profileData.social_media?.facebook || '',
          bandcamp: profileData.social_media?.bandcamp || ''
        },
        skills: profileData.skills || [],
        instruments: profileData.instruments || [],
        selectedGenres: profileData.genres || [],
        hourly_rate: profileData.hourly_rate?.toString() || '',
        experience_level: profileData.experience_level || '',
        availability_status: profileData.availability_status || 'available',
        founded_year: profileData.founded_year?.toString() || ''
      });
    }
  }, [profile, open]);

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

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value
      }
    }));
  };

  const handleSpecializationChange = (spec: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specializations: checked 
        ? [...prev.specializations, spec]
        : prev.specializations.filter(s => s !== spec)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    
    try {
      // Prepare update data (excluding genres which are handled separately)
      const updateData = {
        full_name: formData.full_name,
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        website: formData.website,
        avatar_url: formData.avatar_url,
        gallery_images: formData.gallery_images,
        specializations: formData.specializations,
        company_name: formData.company_name,
        social_media: formData.social_media,
        skills: formData.skills,
        instruments: formData.instruments,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        experience_level: formData.experience_level,
        availability_status: formData.availability_status,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
      };

      // Update profile data
      const { error: profileError } = await updateProfile(updateData);
      if (profileError) throw profileError;

      // Update genres separately using the junction table
      if (profile?.id && formData.selectedGenres) {
        await updateProfileGenres(profile.id, formData.selectedGenres);
      }

      toast.success("Profile updated successfully!");
      
      // Refresh profile data
      await refreshProfile();
      
      if (onOpenChange) onOpenChange(false);
      
      // Force page reload to ensure all data is fresh
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error: any) {
      console.error('Profile update error:', error);
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
              onImageUploaded={(url) => handleInputChange('avatar_url', url)}
              onImageRemoved={() => handleInputChange('avatar_url', '')}
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
              onImagesUpdated={(images) => handleInputChange('gallery_images', images)}
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
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="@username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
            </div>
          </div>

          {/* Music Professional Specializations */}
          {profile?.user_type === 'artist' && (
            <div>
              <Label>Specializations (Select multiple)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {musicSpecializations.map((spec) => (
                  <label key={spec.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(spec.label)}
                      onChange={(e) => handleSpecializationChange(spec.label, e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{spec.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Specializations */}
          {profile?.user_type === 'teacher' && (
            <div>
              <Label>Teaching Specializations (Select multiple)</Label>
              <MultiSelect
                options={teacherSpecializations?.map(spec => ({
                  value: spec.name,
                  label: spec.name,
                  category: spec.category
                })) || []}
                selected={formData.specializations}
                onChange={(selectedSpecs) => handleInputChange('specializations', selectedSpecs)}
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
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">City</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleInputChange('location', value)}
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
                value={formData.experience_level}
                onValueChange={(value) => handleInputChange('experience_level', value)}
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
              selected={formData.skills}
              onChange={(selectedSkills) => handleInputChange('skills', selectedSkills)}
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
              selected={formData.instruments}
              onChange={(selectedInstruments) => handleInputChange('instruments', selectedInstruments)}
              placeholder="Select your instruments"
              className="w-full"
            />
          </div>

          {/* Genres Section (for professionals only) */}
          {(profile?.user_type === 'artist' || profile?.user_type === 'manager') && (
            <div>
              <Label>Genres (Select multiple)</Label>
              <GenreMultiSelect
                selectedGenres={formData.selectedGenres}
                onGenresChange={(genres) => handleInputChange('selectedGenres', genres)}
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
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
          </div>

          {/* Professional Information */}
          {(profile?.user_type === 'artist' || profile?.user_type === 'teacher') && (
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate (USD)</Label>
              <Input
                id="hourly_rate"
                type="number"
                placeholder="e.g., 50"
                value={formData.hourly_rate}
                onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
              />
            </div>
          )}

          {/* Company Information */}
          {(profile?.user_type === 'studio' || profile?.user_type === 'school' || profile?.user_type === 'label') && (
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                placeholder="Your company name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
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
                    value={formData.social_media.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-blue-400" />
                  <Input
                    placeholder="Twitter/X username"
                    value={formData.social_media.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-500" />
                  <Input
                    placeholder="YouTube channel"
                    value={formData.social_media.youtube}
                    onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Music2 className="h-4 w-4 text-orange-500" />
                  <Input
                    placeholder="SoundCloud profile"
                    value={formData.social_media.soundcloud}
                    onChange={(e) => handleSocialMediaChange('soundcloud', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  <Input
                    placeholder="LinkedIn profile"
                    value={formData.social_media.linkedin}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
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