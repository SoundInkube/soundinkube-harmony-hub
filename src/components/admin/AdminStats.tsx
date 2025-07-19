import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Music, 
  Building, 
  Briefcase, 
  ShoppingBag,
  Calendar,
  Star,
  TrendingUp,
  UserPlus,
  Activity
} from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    totalArtists: number;
    totalClients: number;
    totalStudios: number;
    totalSchools: number;
    totalLabels: number;
    totalBookings: number;
    totalGigs: number;
    totalCollaborations: number;
    totalMarketplaceItems: number;
    recentSignups: number;
  };
  loading: boolean;
}

export function AdminStats({ stats, loading }: AdminStatsProps) {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Artists',
      value: stats.totalArtists,
      icon: Music,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Clients',
      value: stats.totalClients,
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Studios',
      value: stats.totalStudios,
      icon: Building,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Schools',
      value: stats.totalSchools,
      icon: Building,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
    {
      title: 'Labels',
      value: stats.totalLabels,
      icon: Star,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Active Gigs',
      value: stats.totalGigs,
      icon: Briefcase,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Collaborations',
      value: stats.totalCollaborations,
      icon: Users,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Marketplace Items',
      value: stats.totalMarketplaceItems,
      icon: ShoppingBag,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Recent Signups (30d)',
      value: stats.recentSignups,
      icon: TrendingUp,
      color: 'text-violet-600',
      bgColor: 'bg-violet-100',
    },
    {
      title: 'Platform Activity',
      value: stats.totalBookings + stats.totalGigs + stats.totalCollaborations,
      icon: Activity,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-muted rounded mb-2 w-20" />
                  <div className="h-8 bg-muted rounded w-16" />
                </div>
                <div className="h-12 w-12 bg-muted rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}