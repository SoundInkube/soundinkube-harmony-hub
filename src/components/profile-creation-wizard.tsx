import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { GalleryUpload } from '@/components/ui/gallery-upload';
import { GenreMultiSelect } from '@/components/ui/genre-multi-select';
import { useGenres } from '@/hooks/useGenres';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  User, 
  Loader2, 
  Camera, 
  Images, 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Info,
  Star,
  Briefcase,
  Globe,
  Music,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateProfileData, sanitizeProfileData } from '@/lib/validation';
import { cn } from '@/lib/utils';

interface ProfileCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  // Basic Info
  full_name: string;
  username: string;
  user_type: string;
  bio: string;
  location: string;
  avatar_url: string;
  
  // Contact & Social
  phone: string;
  website: string;
  social_media: Record<string, string>;
  
  // Professional Details
  company_name: string;
  hourly_rate: string;
  experience_level: string;
  specializations: string[];
  skills: string[];
  instruments: string[];
  selectedGenres: string[];
  
  // Gallery
  gallery_images: string[];
}

const STEPS = [
  { id: 'basic', title: 'Basic Info', icon: User, description: 'Tell us about yourself' },
  { id: 'type', title: 'Account Type', icon: Briefcase, description: 'Choose your role' },
  { id: 'professional', title: 'Professional', icon: Star, description: 'Your expertise' },
  { id: 'media', title: 'Photos & Portfolio', icon: Camera, description: 'Showcase your work' },
  { id: 'social', title: 'Connect', icon: Globe, description: 'Social & contact info' },
  { id: 'review', title: 'Review', icon: Check, description: 'Confirm your profile' }
];

const USER_TYPES = [
  { 
    value: 'client', 
    label: 'Client', 
    description: 'Looking to hire music professionals',
    icon: '🎯'
  },
  { 
    value: 'artist', 
    label: 'Music Professional', 
    description: 'Performer, producer, or music creator',
    icon: '🎵'
  },
  { 
    value: 'studio', 
    label: 'Studio Owner', 
    description: 'Recording or rehearsal studio',
    icon: '🎙️'
  },
  { 
    value: 'school', 
    label: 'Music School', 
    description: 'Music education institution',
    icon: '🎓'
  },
  { 
    value: 'label', 
    label: 'Record Label', 
    description: 'Music publishing and distribution',
    icon: '💿'
  },
  { 
    value: 'manager', 
    label: 'Artist Manager', 
    description: 'Managing music talent',
    icon: '👔'
  }
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: '0-2 years' },
  { value: 'intermediate', label: 'Intermediate', description: '2-5 years' },
  { value: 'advanced', label: 'Advanced', description: '5-10 years' },
  { value: 'professional', label: 'Professional', description: '10+ years' },
  { value: 'expert', label: 'Expert', description: 'Industry veteran' }
];

const SPECIALIZATIONS = [
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

export function ProfileCreationWizard({ open, onOpenChange }: ProfileCreationWizardProps) {
  const { user } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { updateProfileGenres } = useGenres();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    username: '',
    user_type: 'client',
    bio: '',
    location: '',
    avatar_url: '',
    phone: '',
    website: '',
    social_media: {},
    company_name: '',
    hourly_rate: '',
    experience_level: '',
    specializations: [],
    skills: [],
    instruments: [],
    selectedGenres: [],
    gallery_images: []
  });

  // Load existing profile data
  useEffect(() => {
    if (profile && open) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        user_type: profile.user_type || 'client',
        bio: profile.bio || '',
        location: profile.location || '',
        avatar_url: profile.avatar_url || '',
        phone: profile.phone || '',
        website: profile.website || '',
        social_media: (profile as any).social_media || {},
        company_name: (profile as any).company_name || '',
        hourly_rate: (profile as any).hourly_rate || '',
        experience_level: (profile as any).experience_level || '',
        specializations: (profile as any).specializations || [],
        skills: (profile as any).skills || [],
        instruments: (profile as any).instruments || [],
        selectedGenres: [],
        gallery_images: (profile as any).gallery_images || []
      });
    }
  }, [profile, open]);

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const isProfessionalUser = ['artist', 'studio', 'manager', 'label', 'school'].includes(formData.user_type);

  const handleNext = () => {
    // Skip professional step for clients
    if (currentStep === 1 && formData.user_type === 'client') {
      setCurrentStep(3); // Skip to media step
    } else {
      setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
    }
  };

  const handlePrevious = () => {
    // Skip professional step for clients when going back
    if (currentStep === 3 && formData.user_type === 'client') {
      setCurrentStep(1); // Go back to type step
    } else {
      setCurrentStep(Math.max(currentStep - 1, 0));
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return formData.full_name.trim().length >= 2;
      case 1: // User Type
        return formData.user_type !== '';
      case 2: // Professional
        if (!isProfessionalUser) return true;
        return formData.experience_level !== '';
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!user || !profile) return;

    setLoading(true);
    
    try {
      const validation = validateProfileData(formData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const sanitizedData = sanitizeProfileData(formData);

      // Update profile genres if user is a professional
      if (isProfessionalUser && formData.selectedGenres.length > 0) {
        await updateProfileGenres(profile.id, formData.selectedGenres);
      }

      const { error } = await updateProfile(sanitizedData);
      if (error) throw error;

      toast({
        title: "Profile Created!",
        description: "Welcome to the platform! Your profile has been set up successfully."
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Profile Creation Failed",
        description: error.message || "Failed to create profile. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Let's start with the basics</h3>
              <p className="text-muted-foreground">We'll help you create an amazing profile</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">This will be displayed on your profile</p>
              </div>
              
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="@username (optional)"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Choose a unique username for easy discovery</p>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Help others find local talent</p>
              </div>
            </div>
          </div>
        );

      case 1: // User Type
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">What brings you here?</h3>
              <p className="text-muted-foreground">Choose the option that best describes you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {USER_TYPES.map((type) => (
                <Card 
                  key={type.value}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md border-2",
                    formData.user_type === type.value ? "border-primary bg-primary/5" : "border-border"
                  )}
                  onClick={() => setFormData(prev => ({ ...prev, user_type: type.value }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold">{type.label}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                      {formData.user_type === type.value && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2: // Professional Details
        if (!isProfessionalUser) return null;
        
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Tell us about your expertise</h3>
              <p className="text-muted-foreground">This helps us match you with the right opportunities</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="experience_level" className="flex items-center gap-2">
                  Experience Level <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.experience_level} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex flex-col">
                          <span>{level.label}</span>
                          <span className="text-xs text-muted-foreground">{level.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(formData.user_type === 'artist' || formData.user_type === 'studio') && (
                <div>
                  <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    placeholder="1000"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">This helps clients understand your pricing</p>
                </div>
              )}

              {formData.user_type === 'artist' && (
                <div>
                  <Label>Specializations</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {SPECIALIZATIONS.map((spec) => (
                      <label key={spec.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specializations.includes(spec.label)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ 
                                ...prev, 
                                specializations: [...prev.specializations, spec.label]
                              }));
                            } else {
                              setFormData(prev => ({ 
                                ...prev, 
                                specializations: prev.specializations.filter(s => s !== spec.label)
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

              {(formData.user_type === 'artist' || formData.user_type === 'manager') && (
                <>
                  <div>
                    <Label htmlFor="instruments">Instruments</Label>
                    <Input
                      id="instruments"
                      placeholder="Guitar, Piano, Drums (comma-separated)"
                      value={Array.isArray(formData.instruments) ? formData.instruments.join(', ') : ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        instruments: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Music Genres</Label>
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

                  <div>
                    <Label htmlFor="skills">Skills & Expertise</Label>
                    <Input
                      id="skills"
                      placeholder="Music Production, Mixing, Mastering (comma-separated)"
                      value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }))}
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              {(formData.user_type === 'label' || formData.user_type === 'studio' || formData.user_type === 'school') && (
                <div>
                  <Label htmlFor="company_name">
                    {formData.user_type === 'label' ? 'Label Name' : 'Business Name'}
                  </Label>
                  <Input
                    id="company_name"
                    placeholder={
                      formData.user_type === 'label' ? 'Your Record Label Name' :
                      formData.user_type === 'studio' ? 'Your Studio Name' :
                      'Your School Name'
                    }
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3: // Media & Portfolio
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Showcase yourself</h3>
              <p className="text-muted-foreground">Add photos to make your profile stand out</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Profile Picture
                </Label>
                <p className="text-sm text-muted-foreground mb-3">Choose a clear, professional photo</p>
                <ImageUpload
                  bucketName="avatars"
                  currentImage={formData.avatar_url}
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
                  onImageRemoved={() => setFormData(prev => ({ ...prev, avatar_url: '' }))}
                  placeholder="Upload your profile picture"
                  className="max-w-sm"
                />
              </div>

              {isProfessionalUser && (
                <div>
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Images className="h-4 w-4" />
                    Portfolio Gallery ({formData.gallery_images?.length || 0}/10)
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add photos of your work, performances, or studio
                  </p>
                  <GalleryUpload
                    bucketName="profile-galleries"
                    currentImages={formData.gallery_images}
                    onImagesUpdated={(images) => setFormData(prev => ({ ...prev, gallery_images: images }))}
                    maxImages={10}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="bio">About You</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell people about yourself, your experience, and what makes you unique..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>
          </div>
        );

      case 4: // Social & Contact
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Stay connected</h3>
              <p className="text-muted-foreground">Add your contact info and social links</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Social Media & Streaming</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
                    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@username' },
                    { key: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/artist/...' },
                    { key: 'soundcloud', label: 'SoundCloud', placeholder: 'https://soundcloud.com/username' }
                  ].map((social) => (
                    <div key={social.key}>
                      <Label htmlFor={social.key}>{social.label}</Label>
                      <Input
                        id={social.key}
                        placeholder={social.placeholder}
                        value={formData.social_media?.[social.key] || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          social_media: { ...prev.social_media, [social.key]: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Review
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Review your profile</h3>
              <p className="text-muted-foreground">Make sure everything looks good before finishing</p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {formData.avatar_url ? (
                    <img 
                      src={formData.avatar_url} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-semibold">{formData.full_name}</h4>
                    {formData.username && <p className="text-muted-foreground">@{formData.username}</p>}
                    <Badge variant="secondary">
                      {USER_TYPES.find(t => t.value === formData.user_type)?.label}
                    </Badge>
                  </div>
                </div>
                
                {formData.bio && (
                  <p className="text-sm text-muted-foreground mb-3">{formData.bio}</p>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {formData.location && <p><strong>Location:</strong> {formData.location}</p>}
                  {formData.experience_level && (
                    <p><strong>Experience:</strong> {EXPERIENCE_LEVELS.find(e => e.value === formData.experience_level)?.label}</p>
                  )}
                  {formData.hourly_rate && <p><strong>Hourly Rate:</strong> ₹{formData.hourly_rate}</p>}
                  {formData.specializations.length > 0 && (
                    <p><strong>Specializations:</strong> {formData.specializations.slice(0, 2).join(', ')}{formData.specializations.length > 2 ? '...' : ''}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (profileLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <currentStepData.icon className="h-6 w-6 text-primary" />
            <div>
              <DialogTitle>{currentStepData.title}</DialogTitle>
              <DialogDescription>{currentStepData.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep + 1} of {STEPS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index <= currentStep ? "bg-primary" : "bg-muted",
                  index === currentStep && "w-3 h-3"
                )}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="py-4">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-primary hover:opacity-90"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Creating Profile...' : 'Complete Profile'}
              <Check className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}