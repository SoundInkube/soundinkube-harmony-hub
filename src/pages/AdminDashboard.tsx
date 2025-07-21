import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Music, 
  Building, 
  Calendar, 
  MessageSquare, 
  ShoppingBag,
  TrendingUp,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Home,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtists: 0,
    totalStudios: 0,
    totalSchools: 0,
    totalLabels: 0,
    totalBookings: 0,
    totalGigs: 0,
    totalMarketplace: 0,
    totalMessages: 0,
    totalMessageRequests: 0,
    recentSignups: 0
  });
  const [users, setUsers] = useState([]);
  const [studios, setStudios] = useState([]);
  const [schools, setSchools] = useState([]);
  const [labels, setLabels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageRequests, setMessageRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if user is admin
    if (user.email !== 'soundvibetribe@gmail.com') {
      toast({
        title: "Access Denied",
        description: "You don't have admin permissions",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    await loadDashboardData();
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all data in parallel
      const [
        profilesRes,
        artistsRes,
        studiosRes,
        schoolsRes,
        labelsRes,
        bookingsRes,
        gigsRes,
        marketplaceRes,
        messagesRes,
        messageRequestsRes,
        recentUsersRes,
        studioDataRes,
        schoolDataRes,
        labelDataRes
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('artists').select('*', { count: 'exact' }),
        supabase.from('studios').select('*', { count: 'exact' }),
        supabase.from('music_schools').select('*', { count: 'exact' }),
        supabase.from('record_labels').select('*', { count: 'exact' }),
        supabase.from('bookings').select('*', { count: 'exact' }),
        supabase.from('gigs').select('*', { count: 'exact' }),
        supabase.from('marketplace').select('*', { count: 'exact' }),
        supabase.from('messages').select('*', { count: 'exact' }),
        supabase.from('message_requests').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('studios').select('*, profiles!inner(full_name, avatar_url)').order('created_at', { ascending: false }).limit(20),
        supabase.from('music_schools').select('*, profiles!inner(full_name, avatar_url)').order('created_at', { ascending: false }).limit(20),
        supabase.from('record_labels').select('*, profiles!inner(full_name, avatar_url)').order('created_at', { ascending: false }).limit(20)
      ]);

      setStats({
        totalUsers: profilesRes.count || 0,
        totalArtists: artistsRes.count || 0,
        totalStudios: studiosRes.count || 0,
        totalSchools: schoolsRes.count || 0,
        totalLabels: labelsRes.count || 0,
        totalBookings: bookingsRes.count || 0,
        totalGigs: gigsRes.count || 0,
        totalMarketplace: marketplaceRes.count || 0,
        totalMessages: messagesRes.count || 0,
        totalMessageRequests: messageRequestsRes.count || 0,
        recentSignups: recentUsersRes.data?.length || 0
      });

      setUsers(recentUsersRes.data || []);
      setStudios(studioDataRes.data || []);
      setSchools(schoolDataRes.data || []);
      setLabels(labelDataRes.data || []);
      
      // Mock recent activity
      setRecentActivity([
        { id: 1, action: 'New user registered', user: 'John Doe', time: '2 min ago' },
        { id: 2, action: 'Booking created', user: 'Sarah Smith', time: '15 min ago' },
        { id: 3, action: 'Gig posted', user: 'Mike Johnson', time: '1 hour ago' }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      
      await loadDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const toggleUserVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verified: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${!currentStatus ? 'verified' : 'unverified'} successfully`
      });
      
      await loadDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user verification",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🔧 Admin Control Panel</h1>
              <p className="text-muted-foreground">Complete backend control for {user?.email}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                Back to Homepage
              </Button>
              <Button onClick={loadDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Artists</p>
                  <p className="text-2xl font-bold">{stats.totalArtists}</p>
                </div>
                <Music className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Studios</p>
                  <p className="text-2xl font-bold">{stats.totalStudios}</p>
                </div>
                <Building className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jampads/Schools</p>
                  <p className="text-2xl font-bold">{stats.totalSchools}</p>
                </div>
                <Building className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Record Labels</p>
                  <p className="text-2xl font-bold">{stats.totalLabels}</p>
                </div>
                <Music className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Messages</p>
                  <p className="text-2xl font-bold">{stats.totalMessages}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Message Requests</p>
                  <p className="text-2xl font-bold">{stats.totalMessageRequests}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bookings</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gigs</p>
                  <p className="text-2xl font-bold">{stats.totalGigs}</p>
                </div>
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Marketplace</p>
                  <p className="text-2xl font-bold">{stats.totalMarketplace}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-violet-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'studios', label: 'Studios', icon: Building },
            { id: 'schools', label: 'Jampads/Schools', icon: Building },
            { id: 'labels', label: 'Record Labels', icon: Music },
            { id: 'messages', label: 'Messages', icon: MessageSquare }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content based on active tab */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management ({stats.totalUsers})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.full_name || user.username || 'Unnamed User'}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {user.user_type}
                            </Badge>
                            {user.verified && (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleUserVerification(user.user_id, user.verified)}
                        >
                          {user.verified ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.full_name || user.username}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteUser(user.user_id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Studios Tab */}
          {activeTab === 'studios' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Studios Management ({stats.totalStudios})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {studios.filter(studio => 
                    studio.studio_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    studio.city?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((studio) => (
                    <div key={studio.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{studio.studio_name}</p>
                          <p className="text-xs text-muted-foreground">{studio.city || 'No location'} • ${studio.hourly_rate || 0}/hr</p>
                        </div>
                      </div>
                      <Badge variant="outline">{studio.rating || 0}★ ({studio.total_reviews || 0})</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schools Tab */}
          {activeTab === 'schools' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Jampads/Music Schools Management ({stats.totalSchools})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {schools.filter(school => 
                    school.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    school.city?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((school) => (
                    <div key={school.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Building className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{school.school_name}</p>
                          <p className="text-xs text-muted-foreground">{school.city || 'No location'} • ${school.monthly_fee || 0}/month</p>
                        </div>
                      </div>
                      <Badge variant="outline">{school.rating || 0}★ ({school.total_reviews || 0})</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Labels Tab */}
          {activeTab === 'labels' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Record Labels Management ({stats.totalLabels})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {labels.filter(label => 
                    label.label_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    label.city?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((label) => (
                    <div key={label.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Music className="h-4 w-4 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{label.label_name}</p>
                          <p className="text-xs text-muted-foreground">{label.city || 'No location'} • {label.artists_signed || 0} artists</p>
                        </div>
                      </div>
                      <Badge variant="outline">{label.rating || 0}★ ({label.total_reviews || 0})</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Messages ({stats.totalMessages})
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Message management coming soon</p>
                      <p className="text-sm">Total messages: {stats.totalMessages}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Message Requests ({stats.totalMessageRequests})
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Message request management coming soon</p>
                      <p className="text-sm">Total requests: {stats.totalMessageRequests}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button onClick={() => navigate('/artists')} variant="outline" className="h-20 flex-col">
                <Music className="h-6 w-6 mb-2" />
                View Artists
              </Button>
              <Button onClick={() => navigate('/studios')} variant="outline" className="h-20 flex-col">
                <Building className="h-6 w-6 mb-2" />
                View Studios
              </Button>
              <Button onClick={() => navigate('/marketplace')} variant="outline" className="h-20 flex-col">
                <ShoppingBag className="h-6 w-6 mb-2" />
                View Marketplace
              </Button>
              <Button onClick={() => navigate('/gigs')} variant="outline" className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                View Gigs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}