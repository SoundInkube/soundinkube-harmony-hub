import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Music, 
  Users, 
  Building, 
  Calendar, 
  MessageSquare, 
  ShoppingBag,
  UserCheck,
  Briefcase,
  Star,
  School,
  Disc
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function RoleBasedNavigation() {
  const location = useLocation();
  const { profile } = useProfile();

  const getNavigationItems = (): NavigationItem[] => {
    if (!profile) return [];

    const baseItems: NavigationItem[] = [
      { href: '/dashboard', label: 'Dashboard', icon: Building }
    ];

    switch (profile.user_type) {
      case 'client':
        return [
          ...baseItems,
          { href: '/artists', label: 'Music Professionals', icon: Music },
          { href: '/studios', label: 'Studios', icon: Disc },
          { href: '/music-schools', label: 'Music Schools', icon: School },
          { href: '/gigs', label: 'My Gig Requests', icon: Briefcase },
          { href: '/messages', label: 'Messages', icon: MessageSquare }
        ];

      case 'music_professional':
        return [
          ...baseItems,
          { href: '/marketplace', label: 'Gear Marketplace', icon: ShoppingBag },
          { href: '/collaborations', label: 'Collaborations', icon: Users },
          { href: '/gigs', label: 'Available Gigs', icon: Briefcase },
          { href: '/studios', label: 'Book Studios', icon: Disc },
          { href: '/music-schools', label: 'Apply to Schools', icon: School },
          { href: '/messages', label: 'Messages', icon: MessageSquare }
        ];

      case 'business':
        return [
          ...baseItems,
          { href: '/bookings', label: 'Bookings & Applications', icon: Calendar },
          { href: '/messages', label: 'Messages', icon: MessageSquare }
        ];

      case 'record_label':
      case 'artist_manager':
        return [
          ...baseItems,
          { href: '/artists', label: 'Artist Roster', icon: Star },
          { href: '/collaborations', label: 'Collaboration Requests', icon: Users },
          { href: '/messages', label: 'Messages', icon: MessageSquare }
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}