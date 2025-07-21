import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Music, 
  Search, 
  Menu, 
  User, 
  LogIn, 
  UserPlus,
  Mic,
  Building,
  GraduationCap,
  Headphones,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Briefcase,
  MessageSquare,
  Calendar,
  Star,
  School,
  Disc
} from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  // Role-based navigation items
  const getRoleBasedNavItems = () => {
    if (!profile) {
      // Default public navigation
      return [
        { label: 'Artists', href: '/artists', icon: Mic },
        { label: 'Studios', href: '/studios', icon: Headphones },
        { label: 'Schools', href: '/music-schools', icon: GraduationCap },
        { label: 'Jampads', href: '/jampads', icon: Music },
        { label: 'Labels', href: '/record-labels', icon: Building },
      ];
    }

    switch (profile.user_type) {
      case 'client':
        return [
          { label: 'Music Professionals', href: '/artists', icon: Music },
          { label: 'Studios', href: '/studios', icon: Disc },
          { label: 'Music Schools', href: '/music-schools', icon: School },
          { label: 'My Gigs', href: '/gigs', icon: Briefcase },
          { label: 'Messages', href: '/messages', icon: MessageSquare }
        ];

      case 'artist':
        return [
          { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
          { label: 'Collaborations', href: '/collaborations', icon: Users },
          { label: 'Available Gigs', href: '/gigs', icon: Briefcase },
          { label: 'Studios', href: '/studios', icon: Disc },
          { label: 'Messages', href: '/messages', icon: MessageSquare }
        ];

      case 'studio':
      case 'school':
        return [
          { label: 'Bookings', href: '/bookings', icon: Calendar },
          { label: 'Artists', href: '/artists', icon: Star },
          { label: 'Messages', href: '/messages', icon: MessageSquare }
        ];

      case 'label':
      case 'manager':
        return [
          { label: 'Artists', href: '/artists', icon: Star },
          { label: 'Collaborations', href: '/collaborations', icon: Users },
          { label: 'Messages', href: '/messages', icon: MessageSquare }
        ];

      default:
        return [
          { label: 'Artists', href: '/artists', icon: Mic },
          { label: 'Studios', href: '/studios', icon: Headphones },
          { label: 'Schools', href: '/music-schools', icon: GraduationCap },
          { label: 'Labels', href: '/record-labels', icon: Building },
        ];
    }
  };

  const navItems = getRoleBasedNavItems();

  const userTypes = [
    { label: 'Music Professional', value: 'artist' },
    { label: 'Client', value: 'client' },
    { label: 'Artist Manager/Label', value: 'manager' },
    { label: 'Business (Schools & Jampads)', value: 'business' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="block">
              <img src="/lovable-uploads/0ef42355-744e-4141-9372-c611bb5eb01a.png" alt="SoundInkube" className="h-32 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg z-50">
                  <DropdownMenuItem asChild>
                    <Link to="/">
                      <Music className="h-4 w-4 mr-2" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" />
                      View My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Role-based feature links */}
                  {profile?.user_type === 'client' && (
                    <DropdownMenuItem asChild>
                      <Link to="/gigs">
                        <Briefcase className="h-4 w-4 mr-2" />
                        My Gigs
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {profile?.user_type === 'artist' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/marketplace">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Marketplace
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/collaborations">
                          <Users className="h-4 w-4 mr-2" />
                          Collaborations
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/gigs">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Available Gigs
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {(profile?.user_type === 'studio' || profile?.user_type === 'school') && (
                    <DropdownMenuItem asChild>
                      <Link to="/bookings">
                        <Calendar className="h-4 w-4 mr-2" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {(profile?.user_type === 'label' || profile?.user_type === 'manager') && (
                    <DropdownMenuItem asChild>
                      <Link to="/collaborations">
                        <Users className="h-4 w-4 mr-2" />
                        Collaborations
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem asChild>
                    <Link to="/messages">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {profile?.user_type === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Now
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {userTypes.map((type) => (
                      <DropdownMenuItem key={type.value} asChild>
                        <Link to="/auth">
                          <User className="h-4 w-4 mr-2" />
                          {type.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors p-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  
                  <div className="border-t pt-4">
                    {user ? (
                      <>
                        <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                          <Link to="/" onClick={() => setIsOpen(false)}>
                            <Music className="h-4 w-4 mr-2" />
                            Home
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                          <Link to="/profile" onClick={() => setIsOpen(false)}>
                            <User className="h-4 w-4 mr-2" />
                            View My Profile
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Dashboard
                          </Link>
                        </Button>
                        
                        {/* Role-based feature links for mobile */}
                        {profile?.user_type === 'client' && (
                          <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                            <Link to="/gigs" onClick={() => setIsOpen(false)}>
                              <Briefcase className="h-4 w-4 mr-2" />
                              My Gigs
                            </Link>
                          </Button>
                        )}
                        
                        {profile?.user_type === 'artist' && (
                          <>
                            <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                              <Link to="/marketplace" onClick={() => setIsOpen(false)}>
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Marketplace
                              </Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                              <Link to="/collaborations" onClick={() => setIsOpen(false)}>
                                <Users className="h-4 w-4 mr-2" />
                                Collaborations
                              </Link>
                            </Button>
                          </>
                        )}
                        
                        {(profile?.user_type === 'studio' || profile?.user_type === 'school') && (
                          <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                            <Link to="/bookings" onClick={() => setIsOpen(false)}>
                              <Calendar className="h-4 w-4 mr-2" />
                              My Bookings
                            </Link>
                          </Button>
                        )}
                        
                        {(profile?.user_type === 'label' || profile?.user_type === 'manager') && (
                          <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                            <Link to="/collaborations" onClick={() => setIsOpen(false)}>
                              <Users className="h-4 w-4 mr-2" />
                              Collaborations
                            </Link>
                          </Button>
                        )}
                        
                        <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                          <Link to="/messages" onClick={() => setIsOpen(false)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Messages
                          </Link>
                        </Button>
                        
                        {profile?.user_type === 'admin' && (
                          <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                            <Link to="/admin" onClick={() => setIsOpen(false)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Admin Panel
                            </Link>
                          </Button>
                        )}
                        
                        <Button variant="outline" className="w-full justify-start" onClick={signOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                          <Link to="/auth">
                            <LogIn className="h-4 w-4 mr-2" />
                            Sign In
                          </Link>
                        </Button>
                        
                        <Button className="w-full bg-gradient-primary hover:opacity-90" asChild>
                          <Link to="/auth">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Join Now
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}