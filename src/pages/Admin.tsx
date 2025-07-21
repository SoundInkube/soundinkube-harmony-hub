import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminStats } from '@/components/admin/AdminStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Activity,
  TrendingUp,
  Users,
  AlertTriangle,
  Clock,
  MessageSquare,
  Calendar,
  DollarSign,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, stats, loading, users, refreshStats, refreshUsers } = useAdmin();
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentGigs, setRecentGigs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    loadRecentData();
  }, [user, isAdmin, navigate]);

  const loadRecentData = async () => {
    try {
      const [bookingsRes, gigsRes] = await Promise.all([
        supabase
          .from('bookings')
          .select(`
            *,
            client_profile:profiles!bookings_client_id_fkey(full_name, avatar_url),
            provider_profile:profiles!bookings_provider_id_fkey(full_name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(5),
        
        supabase
          .from('gigs')
          .select(`
            *,
            profiles(full_name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      setRecentBookings(bookingsRes.data || []);
      setRecentGigs(gigsRes.data || []);
    } catch (error) {
      console.error('Error loading recent data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleRefresh = async () => {
    setLoadingData(true);
    await Promise.all([
      refreshStats(),
      refreshUsers(),
      loadRecentData()
    ]);
    setLoadingData(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access the admin panel.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening on your platform.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                Go to Homepage
              </Button>
              <Button onClick={handleRefresh} disabled={loadingData}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingData ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <AdminStats stats={stats} loading={loading} />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                          <div className="h-10 w-10 bg-muted rounded-full" />
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded mb-1" />
                            <div className="h-3 bg-muted rounded w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentBookings.length > 0 ? (
                    <div className="space-y-4">
                      {recentBookings.map((booking: any) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={booking.client_profile?.avatar_url} />
                              <AvatarFallback>
                                {booking.client_profile?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{booking.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {booking.client_profile?.full_name} → {booking.provider_profile?.full_name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" onClick={() => navigate('/admin/content/bookings')}>
                        View All Bookings
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No recent bookings</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Gigs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Gigs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                          <div className="h-10 w-10 bg-muted rounded-full" />
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded mb-1" />
                            <div className="h-3 bg-muted rounded w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentGigs.length > 0 ? (
                    <div className="space-y-4">
                      {recentGigs.map((gig: any) => (
                        <div key={gig.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={gig.profiles?.avatar_url} />
                              <AvatarFallback>
                                {gig.profiles?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{gig.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {gig.event_type} • {gig.location}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={gig.status === 'open' ? 'default' : 'secondary'}>
                              {gig.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              ${gig.budget_min} - ${gig.budget_max}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" onClick={() => navigate('/admin/content/gigs')}>
                        View All Gigs
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No recent gigs</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Recent Users & Quick Actions */}
            <div className="space-y-6">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recent Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                          <div className="h-8 w-8 bg-muted rounded-full" />
                          <div className="flex-1">
                            <div className="h-3 bg-muted rounded mb-1" />
                            <div className="h-2 bg-muted rounded w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {users.slice(0, 5).map((user: any) => (
                        <div key={user.id} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback>
                              {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.full_name || user.username || 'Unknown'}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {user.user_type}
                              </Badge>
                              {user.verified && (
                                <Badge variant="default" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" onClick={() => navigate('/admin/users')}>
                        Manage All Users
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => navigate('/admin/users')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => navigate('/admin/content')}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Review Content
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => navigate('/admin/analytics')}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => navigate('/admin/messages')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Check Messages
                    </Button>

                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => navigate('/admin/settings')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Database Performance</span>
                        <span>85%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-2 bg-green-600 rounded-full w-[85%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>API Response Time</span>
                        <span>95%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-2 bg-blue-600 rounded-full w-[95%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Storage Usage</span>
                        <span>65%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-2 bg-yellow-600 rounded-full w-[65%]"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;