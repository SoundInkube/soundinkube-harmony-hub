import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

export function AdminOverview() {
  const { stats, users, loading } = useAdmin();
  const [recentActivity, setRecentActivity] = useState([]);

  const recentUsers = users.slice(0, 5);
  const verifiedUsers = users.filter(user => user.verified).length;
  const unverifiedUsers = users.length - verifiedUsers;
  const verificationRate = users.length > 0 ? (verifiedUsers / users.length) * 100 : 0;

  // Mock recent activity data
  const mockRecentActivity = [
    { id: 1, type: 'user_signup', user: 'John Doe', time: '2 minutes ago', status: 'completed' },
    { id: 2, type: 'booking_created', user: 'Sarah Smith', time: '15 minutes ago', status: 'pending' },
    { id: 3, type: 'gig_posted', user: 'Mike Johnson', time: '1 hour ago', status: 'completed' },
    { id: 4, type: 'collaboration_started', user: 'Emma Wilson', time: '2 hours ago', status: 'completed' },
    { id: 5, type: 'marketplace_item', user: 'Alex Brown', time: '3 hours ago', status: 'completed' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup': return <Users className="h-4 w-4" />;
      case 'booking_created': return <Calendar className="h-4 w-4" />;
      case 'gig_posted': return <DollarSign className="h-4 w-4" />;
      case 'collaboration_started': return <Users className="h-4 w-4" />;
      case 'marketplace_item': return <Star className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'user_signup': return `${activity.user} signed up`;
      case 'booking_created': return `${activity.user} created a booking`;
      case 'gig_posted': return `${activity.user} posted a new gig`;
      case 'collaboration_started': return `${activity.user} started a collaboration`;
      case 'marketplace_item': return `${activity.user} listed an item`;
      default: return `${activity.user} performed an action`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2 w-20" />
                <div className="h-8 bg-muted rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">$12,453</p>
                <p className="text-sm text-green-600">+23% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-blue-600">+12% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-3xl font-bold">{stats.totalBookings}</p>
                <p className="text-sm text-purple-600">+18% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platform Growth</p>
                <p className="text-3xl font-bold">+{stats.recentSignups}</p>
                <p className="text-sm text-orange-600">New users this month</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              User Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Verification Rate</span>
                  <span>{verificationRate.toFixed(1)}%</span>
                </div>
                <Progress value={verificationRate} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{verifiedUsers}</p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{unverifiedUsers}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{getActivityText(activity)}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Users
            </span>
            <Button variant="outline" size="sm">View All</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>
                      {user.full_name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.full_name || user.username || 'Unnamed User'}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.verified ? 'default' : 'secondary'}>
                    {user.user_type}
                  </Badge>
                  {user.verified ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-orange-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}