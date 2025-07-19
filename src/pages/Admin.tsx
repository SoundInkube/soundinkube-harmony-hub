import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminStats } from '@/components/admin/AdminStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  TrendingUp,
  Users,
  AlertTriangle,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, stats, loading, users } = useAdmin();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, isAdmin, navigate]);

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

  const recentUsers = users.slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening on SoundInkube today.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
            <AdminStats stats={stats} loading={loading} />
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.full_name || 'Unnamed User'}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{user.user_type}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentUsers.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No recent users</p>
                  )}
                </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/admin/users')}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    Manage Users
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/admin/content')}
                  >
                    <Clock className="h-6 w-6 mb-2" />
                    Review Content
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/admin/analytics')}
                  >
                    <TrendingUp className="h-6 w-6 mb-2" />
                    View Analytics
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/admin/messages')}
                  >
                    <MessageSquare className="h-6 w-6 mb-2" />
                    Check Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="h-2 bg-green-200 rounded-full mb-2">
                      <div className="h-2 bg-green-600 rounded-full w-4/5"></div>
                    </div>
                    <p className="text-sm font-medium">Database Performance</p>
                    <p className="text-xs text-muted-foreground">80% Optimal</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-2 bg-blue-200 rounded-full mb-2">
                      <div className="h-2 bg-blue-600 rounded-full w-full"></div>
                    </div>
                    <p className="text-sm font-medium">API Response Time</p>
                    <p className="text-xs text-muted-foreground">95% Optimal</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-2 bg-yellow-200 rounded-full mb-2">
                      <div className="h-2 bg-yellow-600 rounded-full w-3/5"></div>
                    </div>
                    <p className="text-sm font-medium">Storage Usage</p>
                    <p className="text-xs text-muted-foreground">60% Used</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;