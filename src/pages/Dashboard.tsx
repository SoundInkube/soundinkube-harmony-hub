import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileEditDialog } from '@/components/profile-edit-dialog';
import { GigCreationDialog } from '@/components/gig-creation-dialog';
import { CollaborationDialog } from '@/components/collaboration-dialog';
import { MarketplaceItemDialog } from '@/components/marketplace-item-dialog';
import { 
  Calendar, 
  MessageSquare, 
  Star, 
  Settings, 
  Music, 
  Users, 
  Building, 
  GraduationCap,
  BarChart3,
  Clock,
  DollarSign,
  Plus,
  Briefcase,
  ShoppingBag,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  School,
  Disc,
  Headphones
} from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      // Load user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile(profileData);

      if (!profileData) return;

      // Load user-specific data based on profile type
      await Promise.all([
        loadBookings(profileData),
        loadGigs(profileData),
        loadCollaborations(profileData),
        loadMarketplaceItems(profileData),
        loadApplications(profileData),
        loadStats(profileData)
      ]);
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async (profileData: any) => {
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        client:client_id(full_name),
        provider:provider_id(full_name)
      `)
      .or(`client_id.eq.${profileData.id},provider_id.eq.${profileData.id}`)
      .order('created_at', { ascending: false })
      .limit(5);
    
    setBookings(data || []);
  };

  const loadGigs = async (profileData: any) => {
    if (profileData.user_type === 'client') {
      // Load gigs created by client
      const { data } = await supabase
        .from('gigs')
        .select('*')
        .eq('client_id', profileData.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setGigs(data || []);
    } else {
      // Load available gigs for professionals
      const { data } = await supabase
        .from('gigs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5);
      setGigs(data || []);
    }
  };

  const loadCollaborations = async (profileData: any) => {
    if (profileData.user_type === 'artist' || profileData.user_type === 'manager') {
      const { data } = await supabase
        .from('collaborations')
        .select('*')
        .or(`creator_id.eq.${profileData.id},status.eq.open`)
        .order('created_at', { ascending: false })
        .limit(5);
      setCollaborations(data || []);
    }
  };

  const loadMarketplaceItems = async (profileData: any) => {
    const { data } = await supabase
      .from('marketplace')
      .select('*')
      .eq('seller_id', profileData.id)
      .order('created_at', { ascending: false })
      .limit(5);
    setMarketplaceItems(data || []);
  };

  const loadApplications = async (profileData: any) => {
    // Load gig applications for professionals
    if (profileData.user_type === 'artist') {
      const { data } = await supabase
        .from('gig_applications')
        .select(`
          *,
          gig:gig_id(title, event_date)
        `)
        .eq('professional_id', profileData.id)
        .order('applied_at', { ascending: false })
        .limit(5);
      setApplications(data || []);
    }
  };

  const loadStats = async (profileData: any) => {
    const statsData: any = {};

    // Load earnings for service providers
    if (['artist', 'studio', 'manager'].includes(profileData.user_type)) {
      const { data: earningsData } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('provider_id', profileData.id)
        .eq('status', 'completed');
      
      const totalEarnings = earningsData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
      statsData.earnings = totalEarnings;
    }

    // Load reviews count
    const { count: reviewsCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('reviewee_id', profileData.id);
    
    statsData.reviews = reviewsCount || 0;

    setStats(statsData);
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'artist': return <Music className="h-4 w-4" />;
      case 'studio': return <Building className="h-4 w-4" />;
      case 'school': return <GraduationCap className="h-4 w-4" />;
      case 'label': return <Star className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {profile?.full_name}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getUserTypeIcon(profile?.user_type)}
                    <span className="ml-1 capitalize">{profile?.user_type}</span>
                  </Badge>
                  {profile?.verified && (
                    <Badge className="text-xs bg-success text-success-foreground">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* User Type Specific Quick Actions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                {profile?.user_type === 'client' && (
                  <GigCreationDialog>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <Plus className="h-4 w-4 mr-2" />
                      Post a Gig
                    </Button>
                  </GigCreationDialog>
                )}
                
                {(profile?.user_type === 'artist' || profile?.user_type === 'manager') && (
                  <>
                    <CollaborationDialog>
                      <Button className="bg-gradient-primary hover:opacity-90">
                        <Users className="h-4 w-4 mr-2" />
                        Start Collaboration
                      </Button>
                    </CollaborationDialog>
                    <Button variant="outline" onClick={() => navigate('/gigs')}>
                      <Briefcase className="h-4 w-4 mr-2" />
                      Browse Gigs
                    </Button>
                  </>
                )}

                {['artist', 'studio', 'label'].includes(profile?.user_type) && (
                  <MarketplaceItemDialog>
                    <Button variant="outline">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Sell Equipment
                    </Button>
                  </MarketplaceItemDialog>
                )}

                <Button variant="outline" onClick={() => navigate('/marketplace')}>
                  <Eye className="h-4 w-4 mr-2" />
                  Browse Marketplace
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {profile?.user_type === 'client' ? 'Active Bookings' : 'Total Bookings'}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {profile?.user_type === 'client' ? 'Services booked' : 'Services provided'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {profile?.user_type === 'client' ? 'Posted Gigs' : 'Applications'}
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {profile?.user_type === 'client' ? gigs.length : applications.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {profile?.user_type === 'client' ? 'Opportunities created' : 'Gigs applied to'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.reviews || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Customer feedback received
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {['artist', 'studio', 'manager'].includes(profile?.user_type) ? 'Earnings' : 'Marketplace Items'}
                  </CardTitle>
                  {['artist', 'studio', 'manager'].includes(profile?.user_type) ? 
                    <DollarSign className="h-4 w-4 text-muted-foreground" /> :
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  }
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {['artist', 'studio', 'manager'].includes(profile?.user_type) ? 
                      `$${stats.earnings || 0}` : 
                      marketplaceItems.length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {['artist', 'studio', 'manager'].includes(profile?.user_type) ? 
                      'Total revenue' : 
                      'Items for sale'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {profile?.user_type === 'client' ? 'My Gig Posts' : 
                     profile?.user_type === 'artist' ? 'Recent Applications' : 
                     'Recent Bookings'}
                  </CardTitle>
                  <CardDescription>
                    {profile?.user_type === 'client' ? 'Gigs you\'ve posted for musicians' : 
                     profile?.user_type === 'artist' ? 'Your latest gig applications' : 
                     'Your latest booking activity'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile?.user_type === 'client' && gigs.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No gigs posted yet. Create your first gig posting!
                      </p>
                    )}
                    
                    {profile?.user_type === 'artist' && applications.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No applications yet. Browse available gigs to get started!
                      </p>
                    )}

                    {profile?.user_type === 'client' && gigs.map((gig) => (
                      <div key={gig.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{gig.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(gig.event_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(gig.status)}>
                          {gig.status}
                        </Badge>
                      </div>
                    ))}

                    {profile?.user_type === 'artist' && applications.map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{app.gig?.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Applied {new Date(app.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                    ))}

                    {!['client', 'artist'].includes(profile?.user_type) && bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{booking.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.start_datetime).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Navigation Hub</CardTitle>
                  <CardDescription>Quick access to your important sections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {/* Universal actions */}
                    <Button variant="outline" className="justify-start" onClick={() => navigate('/bookings')}>
                      <Calendar className="h-4 w-4 mr-2" />
                      My Bookings
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => navigate('/messages')}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Messages
                    </Button>

                    {/* User type specific actions */}
                    {profile?.user_type === 'client' && (
                      <>
                        <Button variant="outline" className="justify-start" onClick={() => navigate('/artists')}>
                          <Music className="h-4 w-4 mr-2" />
                          Find Musicians
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => navigate('/studios')}>
                          <Disc className="h-4 w-4 mr-2" />
                          Book Studios
                        </Button>
                      </>
                    )}

                    {profile?.user_type === 'artist' && (
                      <>
                        <Button variant="outline" className="justify-start" onClick={() => navigate('/gigs')}>
                          <Briefcase className="h-4 w-4 mr-2" />
                          Browse Gigs
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => navigate('/collaborations')}>
                          <Users className="h-4 w-4 mr-2" />
                          Collaborations
                        </Button>
                      </>
                    )}

                    {(profile?.user_type === 'studio' || profile?.user_type === 'school') && (
                      <>
                        <Button variant="outline" className="justify-start" onClick={() => navigate('/studios')}>
                          <Building className="h-4 w-4 mr-2" />
                          Studio Management
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => navigate('/music-schools')}>
                          <School className="h-4 w-4 mr-2" />
                          School Management
                        </Button>
                      </>
                    )}

                    {(profile?.user_type === 'label' || profile?.user_type === 'manager') && (
                      <>
                        <Button variant="outline" className="justify-start" onClick={() => navigate('/artists')}>
                          <Star className="h-4 w-4 mr-2" />
                          Artist Roster
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => navigate('/record-labels')}>
                          <Building className="h-4 w-4 mr-2" />
                          Label Management
                        </Button>
                      </>
                    )}

                    <Button variant="outline" className="justify-start" onClick={() => navigate('/marketplace')}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Marketplace
                    </Button>

                    <ProfileEditDialog>
                      <Button variant="outline" className="justify-start w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </Button>
                    </ProfileEditDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage your upcoming and past bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No bookings yet. Start connecting with musicians!
                    </p>
                  ) : (
                    bookings.map((booking) => (
                      <div key={booking.id} className="p-4 border border-border/50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{booking.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {booking.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(booking.start_datetime).toLocaleString()}
                              </span>
                              <span>
                                {booking.booking_type}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            {booking.total_amount && (
                              <p className="text-sm font-medium mt-1">
                                ₹{booking.total_amount}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Chat with clients and collaborators</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Message feature coming soon! Connect with other musicians through bookings for now.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-sm text-muted-foreground">{profile?.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Account Type</label>
                      <p className="text-sm text-muted-foreground capitalize">{profile?.user_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <p className="text-sm text-muted-foreground">{profile?.location || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <p className="text-sm text-muted-foreground">{profile?.bio || 'No bio yet'}</p>
                  </div>
                  
                  <ProfileEditDialog>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Edit Profile
                    </Button>
                  </ProfileEditDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}