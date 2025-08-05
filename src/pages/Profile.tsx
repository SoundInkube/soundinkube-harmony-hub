import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Navigation } from '@/components/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SmartProfileDialog } from '@/components/smart-profile-dialog';
import { 
  MapPin, 
  Globe, 
  Phone, 
  Star, 
  Music, 
  Users, 
  Calendar,
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MessageSquare,
  Settings,
  Verified,
  Eye,
  Award,
  TrendingUp,
  Heart,
  Share2,
  Download,
  Play,
  Camera,
  Clock,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SocialMediaFeed } from '@/components/social-media-feed';

export default function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { profile: currentUserProfile } = useProfile();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [socialContent, setSocialContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      if (!userId && user) {
        // Load current user's profile for public view
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select(`
            *,
            profile_genres (
              genres (
                id,
                name,
                category
              )
            )
          `)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading own profile:', error);
          throw error;
        }
        
        // Extract genre names from the relationship
        const genreNames = profileData?.profile_genres?.map((pg: any) => pg.genres?.name).filter(Boolean) || [];
        const processedProfile = {
          ...profileData,
          genres: genreNames,
        };
        
        setProfile(processedProfile);
        setIsOwnProfile(true);
      } else if (userId) {
        // Load specific user's profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select(`
            *,
            profile_genres (
              genres (
                id,
                name,
                category
              )
            )
          `)
          .eq('id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading user profile:', error);
          throw error;
        }
        
        // Extract genre names from the relationship
        const genreNames = profileData?.profile_genres?.map((pg: any) => pg.genres?.name).filter(Boolean) || [];
        const processedProfile = {
          ...profileData,
          genres: genreNames,
        };
        
        setProfile(processedProfile);
        setIsOwnProfile(user?.id === profileData?.user_id);
      } else if (!user) {
        // Not authenticated
        setProfile(null);
        setIsOwnProfile(false);
      }

      // Load social media content if profile has social links
      if (profile?.social_media) {
        loadSocialContent();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile."
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSocialContent = async () => {
    // This would call our edge functions to fetch social media content
    // For now, we'll use placeholder data
    setSocialContent({
      instagram: {
        posts: [],
        followers: 1250,
        following: 500
      },
      twitter: {
        tweets: [],
        followers: 890,
        following: 320
      },
      youtube: {
        videos: [],
        subscribers: 5420,
        views: 125000
      }
    });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'twitter': case 'x': return <Twitter className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'tiktok': return <Music className="h-4 w-4" />;
      case 'spotify': case 'apple_music': case 'soundcloud': case 'bandcamp': return <Music className="h-4 w-4" />;
      case 'facebook': return <Users className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getUserTypeDisplay = (userType: string) => {
    const types = {
      'artist': 'Music Professional',
      'client': 'Client',
      'studio': 'Studio Owner',
      'school': 'Music School',
      'label': 'Record Label',
      'manager': 'Artist Manager'
    };
    return types[userType as keyof typeof types] || userType;
  };

  const getUsername = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split('/').filter(Boolean).pop() || '';
    } catch {
      return '';
    }
  };

  const getChannelId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (url.includes('channel/')) {
        return url.split('channel/')[1]?.split('/')[0] || '';
      }
      return urlObj.pathname.split('/').filter(Boolean).pop() || '';
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Cover Section */}
        <div className="profile-cover h-80 md:h-96 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/5" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          
          {/* Navigation Overlay */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
            <Button variant="ghost" size="sm" asChild className="bg-background/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30">
              <a href="/">
                <ExternalLink className="h-4 w-4 mr-2" />
                Back to Homepage
              </a>
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="bg-background/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="bg-background/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="container mx-auto px-6 -mt-32 relative z-20">
          <div className="profile-card-premium rounded-3xl p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="profile-avatar-container mb-6">
                  <Avatar className="profile-avatar h-40 w-40 md:h-48 md:w-48">
                    <AvatarImage src={profile.avatar_url} className="object-cover" />
                    <AvatarFallback className="text-4xl md:text-5xl font-bold bg-gradient-primary text-white">
                      {profile.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {profile.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 border-4 border-background">
                      <Verified className="h-6 w-6 text-white fill-current" />
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="profile-stats-card p-4 w-full max-w-xs">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">4.9</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">127</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">98%</div>
                      <div className="text-xs text-muted-foreground">Success</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Profile Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                      {profile.full_name}
                    </h1>
                    <Badge className="profile-badge-verified rounded-full px-4 py-2 text-sm font-semibold">
                      {getUserTypeDisplay(profile.user_type)}
                    </Badge>
                  </div>
                  
                  {profile.username && (
                    <p className="text-xl text-muted-foreground mb-2">@{profile.username}</p>
                  )}
                  
                  {profile.bio && (
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.location && (
                    <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">{profile.location}</span>
                    </div>
                  )}
                  
                  {profile.hourly_rate && (
                    <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-4">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="font-medium">₹{profile.hourly_rate}/hr</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <Badge variant={profile.availability_status === 'available' ? 'default' : 'secondary'} className="rounded-full">
                      {profile.availability_status || 'Available'}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {(user && profile?.user_id === user.id) ? (
                    <>
                      <SmartProfileDialog>
                        <Button size="lg" className="bg-gradient-primary hover:opacity-90 rounded-xl px-8">
                          <Settings className="h-5 w-5 mr-2" />
                          Edit Profile
                        </Button>
                      </SmartProfileDialog>
                      
                      <Button variant="outline" size="lg" asChild className="rounded-xl px-8">
                        <a href={`/profile/${profile.id}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-5 w-5 mr-2" />
                          Public View
                        </a>
                      </Button>
                    </>
                  ) : user ? (
                    <>
                      <Button size="lg" className="bg-gradient-primary hover:opacity-90 rounded-xl px-8">
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Contact Artist
                      </Button>
                      <Button variant="outline" size="lg" className="rounded-xl px-8">
                        <Heart className="h-5 w-5 mr-2" />
                        Follow
                      </Button>
                      <Button variant="outline" size="lg" className="rounded-xl px-8">
                        <Download className="h-5 w-5 mr-2" />
                        Download EPK
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted/50 backdrop-blur-sm rounded-2xl p-2">
              <TabsTrigger value="about" className="rounded-xl font-semibold">About</TabsTrigger>
              <TabsTrigger value="portfolio" className="rounded-xl font-semibold">Portfolio</TabsTrigger>
              <TabsTrigger value="social" className="rounded-xl font-semibold">Social</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-xl font-semibold">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Skills & Expertise */}
                <Card className="profile-section-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Award className="h-6 w-6 text-primary" />
                      Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profile.skills?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-lg">Core Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary" className="rounded-full px-4 py-2 font-medium">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profile.instruments?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-lg">Instruments</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.instruments.map((instrument: string, index: number) => (
                            <Badge key={index} variant="outline" className="rounded-full px-4 py-2 font-medium">
                              <Music className="h-3 w-3 mr-2" />
                              {instrument}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profile.genres?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-lg">Genres</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.genres.map((genre: string, index: number) => (
                            <Badge key={index} className="bg-gradient-primary text-white rounded-full px-4 py-2 font-medium">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Professional Details */}
                <Card className="profile-section-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <TrendingUp className="h-6 w-6 text-primary" />
                      Professional Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profile.experience_level && (
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <span className="font-medium">Experience Level</span>
                        <Badge variant="outline" className="capitalize rounded-full px-4 py-2">
                          {profile.experience_level}
                        </Badge>
                      </div>
                    )}
                    
                    {profile.phone && (
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <span className="font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </span>
                        <span className="font-mono">{profile.phone}</span>
                      </div>
                    )}
                    
                    {profile.website && (
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <span className="font-medium flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Website
                        </span>
                        <a 
                          href={profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium"
                        >
                          Visit Site
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <span className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Member Since
                      </span>
                      <span>{new Date(profile.created_at).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-8">
              {/* Gallery Section */}
              {profile.gallery_images?.length > 0 && (
                <Card className="profile-section-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Camera className="h-6 w-6 text-primary" />
                      Media Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {profile.gallery_images.map((imageUrl: string, index: number) => (
                        <div
                          key={index}
                          className="group relative aspect-square overflow-hidden rounded-2xl border border-border/40"
                        >
                          <img
                            src={imageUrl}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30">
                              <Play className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Portfolio Links */}
              <Card className="profile-section-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <ExternalLink className="h-6 w-6 text-primary" />
                    Portfolio & Work
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.portfolio_urls?.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {profile.portfolio_urls.map((url: string, index: number) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block p-6 border border-border/40 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                              <ExternalLink className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg mb-1">Portfolio Link {index + 1}</h4>
                              <p className="text-sm text-muted-foreground truncate max-w-xs">{url}</p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No portfolio links available yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-8">
              <Card className="profile-section-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Users className="h-6 w-6 text-primary" />
                    Social Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.social_media && Object.keys(profile.social_media).length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(profile.social_media).map(([platform, url]: [string, any]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block p-6 border border-border/40 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                              {getSocialIcon(platform)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg mb-1 capitalize">{platform}</h4>
                              <p className="text-sm text-muted-foreground">@{getUsername(url) || 'profile'}</p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No social media links available yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-8">
              <Card className="profile-section-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Star className="h-6 w-6 text-primary" />
                    Client Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No reviews available yet.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}