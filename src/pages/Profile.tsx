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
  Eye
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
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading own profile:', error);
          throw error;
        }
        
        setProfile(profileData);
        setIsOwnProfile(true);
      } else if (userId) {
        // Load specific user's profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading user profile:', error);
          throw error;
        }
        
        setProfile(profileData);
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
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Profile Header */}
          <div className="relative mb-8">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
            </div>
            
            {/* Profile Info */}
            <div className="relative -mt-20 px-6">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    {profile.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 md:mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      {profile.full_name}
                    </h1>
                    {profile.verified && (
                      <Verified className="h-6 w-6 text-primary fill-current" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    {profile.username && (
                      <span className="text-muted-foreground">@{profile.username}</span>
                    )}
                    <Badge variant="outline">
                      {getUserTypeDisplay(profile.user_type)}
                    </Badge>
                  </div>
                  
                  {profile.bio && (
                    <p className="text-muted-foreground mb-4 max-w-2xl">
                      {profile.bio}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                    )}
                    {profile.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a 
                          href={profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(profile.created_at).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {isOwnProfile || (!userId && user) ? (
                    <div className="flex gap-2">
                      <SmartProfileDialog>
                        <Button className="bg-gradient-primary hover:opacity-90">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </SmartProfileDialog>
                      
                      <Button variant="outline" asChild>
                        <a href={`/profile/${profile.id}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          Public View
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Follow
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="about" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.skills?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profile.instruments?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Instruments</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.instruments.map((instrument: string, index: number) => (
                            <Badge key={index} variant="outline">
                              <Music className="h-3 w-3 mr-1" />
                              {instrument}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profile.genres?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Genres</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.genres.map((genre: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profile.experience_level && (
                      <div>
                        <h4 className="font-medium mb-2">Experience Level</h4>
                        <p className="text-muted-foreground capitalize">
                          {profile.experience_level}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact & Rates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.hourly_rate && (
                      <div>
                        <h4 className="font-medium mb-1">Hourly Rate</h4>
                        <p className="text-2xl font-bold text-primary">
                          ₹{profile.hourly_rate}/hr
                        </p>
                      </div>
                    )}
                    
                    {profile.phone && (
                      <div>
                        <h4 className="font-medium mb-1">Phone</h4>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{profile.phone}</span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-1">Availability</h4>
                      <Badge 
                        variant={profile.availability_status === 'available' ? 'default' : 'secondary'}
                      >
                        {profile.availability_status || 'Available'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio & Work</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.portfolio_urls?.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {profile.portfolio_urls.map((url: string, index: number) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            <span className="truncate">{url}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No portfolio items yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              {profile.social_media && Object.keys(profile.social_media).length > 0 ? (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                  {Object.entries(profile.social_media).map(([platform, url]: [string, any]) => (
                    <Card key={platform}>
                      <CardHeader className="flex flex-row items-center gap-3">
                        {getSocialIcon(platform)}
                        <CardTitle className="capitalize">{platform}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Full Profile
                        </a>
                        
                        {/* Live Social Media Content Preview */}
                        <div className="border-t pt-4">
                          {platform === 'instagram' && (
                            <SocialMediaFeed 
                              platform="instagram" 
                              username={getUsername(url)} 
                            />
                          )}
                          {platform === 'twitter' && (
                            <SocialMediaFeed 
                              platform="twitter" 
                              username={getUsername(url)} 
                            />
                          )}
                          {platform === 'youtube' && (
                            <SocialMediaFeed 
                              platform="youtube" 
                              channelId={getChannelId(url)}
                              username={getUsername(url)} 
                            />
                          )}
                          {!['instagram', 'twitter', 'youtube'].includes(platform) && (
                            <div className="text-sm text-muted-foreground space-y-2">
                              <div className="flex items-center gap-2">
                                {getSocialIcon(platform)}
                                <span>Profile linked successfully</span>
                              </div>
                              <div className="text-xs">
                                Click "View Full Profile" to visit {platform}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <div className="bg-muted rounded-full p-4">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No social media links added yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect your social media accounts to showcase your online presence and engage with your audience.
                    </p>
                    {isOwnProfile && (
                      <SmartProfileDialog>
                        <Button className="bg-gradient-primary hover:opacity-90">
                          Add Social Links
                        </Button>
                      </SmartProfileDialog>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews & Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No reviews yet.</p>
                    <p className="text-sm">Complete some bookings to get your first reviews!</p>
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