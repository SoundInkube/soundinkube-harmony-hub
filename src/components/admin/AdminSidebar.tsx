import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Database,
  Shield,
  FileText,
  MessageSquare,
  Briefcase,
  Music,
  Building,
  School,
  Disc,
  ShoppingBag,
  Calendar,
  Star
} from 'lucide-react';

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Content Management',
      href: '/admin/content',
      icon: Database,
      children: [
        { name: 'Artists', href: '/admin/content/artists', icon: Music },
        { name: 'Studios', href: '/admin/content/studios', icon: Disc },
        { name: 'Schools', href: '/admin/content/schools', icon: School },
        { name: 'Labels', href: '/admin/content/labels', icon: Building },
        { name: 'Marketplace', href: '/admin/content/marketplace', icon: ShoppingBag },
        { name: 'Gigs', href: '/admin/content/gigs', icon: Briefcase },
        { name: 'Collaborations', href: '/admin/content/collaborations', icon: Users },
        { name: 'Bookings', href: '/admin/content/bookings', icon: Calendar },
      ]
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      name: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare,
    },
    {
      name: 'Reviews',
      href: '/admin/reviews',
      icon: Star,
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: FileText,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className={cn('flex h-full w-64 flex-col bg-card border-r', className)}>
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Admin Panel</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const hasChildren = item.children && item.children.length > 0;
          
          return (
            <div key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                  )}
                />
                {item.name}
              </Link>
              
              {hasChildren && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const isChildActive = location.pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={cn(
                          'group flex items-center px-2 py-1 text-sm rounded-md transition-colors',
                          isChildActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <child.icon className="mr-2 h-4 w-4" />
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}