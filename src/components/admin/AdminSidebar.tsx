import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Star, 
  AlertTriangle, 
  Settings,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState<string | null>('content');

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Home',
      href: '/',
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
      icon: FileText,
      children: [
        { name: 'Artists', href: '/admin/content/artists' },
        { name: 'Studios', href: '/admin/content/studios' },
        { name: 'Schools', href: '/admin/content/schools' },
        { name: 'Labels', href: '/admin/content/labels' },
        { name: 'Marketplace', href: '/admin/content/marketplace' },
        { name: 'Gigs', href: '/admin/content/gigs' },
        { name: 'Collaborations', href: '/admin/content/collaborations' },
        { name: 'Bookings', href: '/admin/content/bookings' },
      ]
    },
    {
      name: 'Approvals',
      href: '/admin/approvals',
      icon: CheckCircle,
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
      icon: AlertTriangle,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  return (
    <div className={cn("bg-card border-r w-64 min-h-screen", className)}>
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Manage your platform</p>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleSection(item.name.toLowerCase().replace(' ', '-'))}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActiveRoute(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    expandedSection === item.name.toLowerCase().replace(' ', '-') ? "rotate-180" : ""
                  )} />
                </button>
                
                {expandedSection === item.name.toLowerCase().replace(' ', '-') && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-md transition-colors",
                          isActiveRoute(child.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActiveRoute(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}