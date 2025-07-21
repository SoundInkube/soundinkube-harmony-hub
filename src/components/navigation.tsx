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
        { label: 'Music Professionals', href: '/artists', icon: Mic },
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
           { label: 'Music Professionals', href: '/artists', icon: Star },
          { label: 'Messages', href: '/messages', icon: MessageSquare }
        ];

      case 'label':
      case 'manager':
        return [
          { label: 'Music Professionals', href: '/artists', icon: Star },
          { label: 'Collaborations', href: '/collaborations', icon: Users },
          { label: 'Messages', href: '/messages', icon: MessageSquare }
        ];

      default:
        return [
          { label: 'Music Professionals', href: '/artists', icon: Mic },
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
    <nav className="fixed top-0 w-full z-50 glass-premium border-b border-border/30 backdrop-blur-xl">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="block group">
              <div className="relative">
                <img 
                  src="/lovable-uploads/0ef42355-744e-4141-9372-c611bb5eb01a.png" 
                  alt="SoundInkube" 
                  className="h-48 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg" 
                />
                <div className="absolute -inset-2 bg-gradient-primary opacity-0 group-hover:opacity-20 rounded-xl blur transition-all duration-300"></div>
              </div>
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
                  className="nav-link flex items-center space-x-2 text-muted-foreground hover:text-foreground font-medium transition-all duration-300 group"
                >
                  <Icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                  <span className="font-display">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-xl">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-all duration-300 group">
                    <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-64 glass-premium border border-border/40 shadow-luxury z-[9999] pointer-events-auto backdrop-blur-xl">
                  <div className="p-2">
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{profile?.user_type || 'User'}</p>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors">
                    <Link to="/" className="flex items-center space-x-3 p-3">
                      <Music className="h-4 w-4 text-primary" />
                      <span className="font-medium">Home</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-border/50" />
                  
                  <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors">
                    <Link to="/profile" className="flex items-center space-x-3 p-3">
                      <User className="h-4 w-4 text-accent" />
                      <span className="font-medium">View My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-border/50" />
                  
                  {/* Role-based feature links */}
                  {profile?.user_type === 'client' && (
                    <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors">
                      <Link to="/gigs" className="flex items-center space-x-3 p-3">
                        <Briefcase className="h-4 w-4 text-warning" />
                        <span className="font-medium">My Gigs</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {profile?.user_type === 'artist' && (
                    <>
                      <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors">
                        <Link to="/marketplace" className="flex items-center space-x-3 p-3">
                          <ShoppingBag className="h-4 w-4 text-success" />
                          <span className="font-medium">Marketplace</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors">
                        <Link to="/collaborations" className="flex items-center space-x-3 p-3">
                          <Users className="h-4 w-4 text-accent" />
                          <span className="font-medium">Collaborations</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors">
                        <Link to="/gigs" className="flex items-center space-x-3 p-3">
                          <Briefcase className="h-4 w-4 text-warning" />
                          <span className="font-medium">Available Gigs</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {(profile?.user_type === 'studio' || profile?.user_type === 'school') && (
                    <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors">
                      <Link to="/bookings" className="flex items-center space-x-3 p-3">
                        <Calendar className="h-4 w-4 text-secondary" />
                        <span className="font-medium">My Bookings</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {(profile?.user_type === 'label' || profile?.user_type === 'manager') && (
                    <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors">
                      <Link to="/collaborations" className="flex items-center space-x-3 p-3">
                        <Users className="h-4 w-4 text-accent" />
                        <span className="font-medium">Collaborations</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors">
                    <Link to="/messages" className="flex items-center space-x-3 p-3">
                      <MessageSquare className="h-4 w-4 text-accent" />
                      <span className="font-medium">Messages</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-border/50" />
                   
                   {/* Admin Dashboard for soundvibetribe@gmail.com */}
                   {user?.email === 'soundvibetribe@gmail.com' && (
                     <DropdownMenuItem asChild className="hover:bg-destructive/10 transition-colors">
                       <Link to="/admin" className="flex items-center space-x-3 p-3">
                         <Settings className="h-4 w-4 text-destructive" />
                         <span className="font-bold text-destructive">🔧 ADMIN DASHBOARD</span>
                       </Link>
                     </DropdownMenuItem>
                   )}
                  
                  <DropdownMenuItem className="hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3 p-3 w-full">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Settings</span>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-border/50" />
                  
                  <DropdownMenuItem onClick={signOut} className="hover:bg-destructive/10 transition-colors">
                    <div className="flex items-center space-x-3 p-3 w-full">
                      <LogOut className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-destructive">Sign Out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="hover:bg-primary/10 transition-all duration-300 rounded-xl">
                  <Link to="/auth" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span className="font-medium">Sign In</span>
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="btn-premium">
                      <UserPlus className="h-4 w-4 mr-2" />
                      <span className="font-semibold">Join Now</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 glass-premium border border-border/40 shadow-luxury">
                    <div className="p-2">
                      <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg mb-2">
                        <h4 className="font-semibold text-sm mb-1">Choose Your Path</h4>
                        <p className="text-xs text-muted-foreground">Join as a professional or client</p>
                      </div>
                    </div>
                    {userTypes.map((type) => (
                      <DropdownMenuItem key={type.value} asChild className="hover:bg-primary/10 transition-colors">
                        <Link to="/auth" className="flex items-center space-x-3 p-3">
                          <User className="h-4 w-4 text-primary" />
                          <span className="font-medium">{type.label}</span>
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
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 rounded-xl transition-all duration-300">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="glass-premium border-l border-border/40 backdrop-blur-xl">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="pb-4 border-b border-border/50">
                    <img 
                      src="/lovable-uploads/0ef42355-744e-4141-9372-c611bb5eb01a.png" 
                      alt="SoundInkube" 
                      className="h-8 w-auto object-contain" 
                    />
                  </div>

                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-all duration-300 p-3 hover:bg-primary/10 rounded-xl group"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                        <span className="font-medium font-display">{item.label}</span>
                      </Link>
                    );
                  })}
                  
                  <div className="border-t border-border/50 pt-6">
                    {user ? (
                      <>
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mb-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                              {user.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                            <p className="text-xs text-muted-foreground">{profile?.user_type || 'User'}</p>
                          </div>
                        </div>

                        <Button variant="ghost" className="w-full justify-start mb-3 hover:bg-primary/10 rounded-xl" asChild>
                          <Link to="/" onClick={() => setIsOpen(false)}>
                            <Music className="h-4 w-4 mr-3 text-primary" />
                            <span className="font-medium">Home</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start mb-3 hover:bg-primary/10 rounded-xl" asChild>
                          <Link to="/profile" onClick={() => setIsOpen(false)}>
                            <User className="h-4 w-4 mr-3 text-accent" />
                            <span className="font-medium">View My Profile</span>
                          </Link>
                        </Button>
                        
                        {/* Role-based feature links for mobile */}
                        {profile?.user_type === 'client' && (
                          <Button variant="ghost" className="w-full justify-start mb-3 hover:bg-primary/10 rounded-xl" asChild>
                            <Link to="/gigs" onClick={() => setIsOpen(false)}>
                              <Briefcase className="h-4 w-4 mr-3 text-warning" />
                              <span className="font-medium">My Gigs</span>
                            </Link>
                          </Button>
                        )}
                        
                        {profile?.user_type === 'artist' && (
                          <>
                            <Button variant="ghost" className="w-full justify-start mb-3 hover:bg-primary/10 rounded-xl" asChild>
                              <Link to="/marketplace" onClick={() => setIsOpen(false)}>
                                <ShoppingBag className="h-4 w-4 mr-3 text-success" />
                                <span className="font-medium">Marketplace</span>
                              </Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start mb-3 hover:bg-primary/10 rounded-xl" asChild>
                              <Link to="/collaborations" onClick={() => setIsOpen(false)}>
                                <Users className="h-4 w-4 mr-3 text-accent" />
                                <span className="font-medium">Collaborations</span>
                              </Link>
                            </Button>
                          </>
                        )}
                        
                        {(profile?.user_type === 'studio' || profile?.user_type === 'school') && (
                          <Button variant="ghost" className="w-full justify-start mb-3 hover:bg-primary/10 rounded-xl" asChild>
                            <Link to="/bookings" onClick={() => setIsOpen(false)}>
                              <Calendar className="h-4 w-4 mr-3 text-secondary" />
                              <span className="font-medium">My Bookings</span>
                            </Link>
                          </Button>
                        )}
                        
                        {(profile?.user_type === 'label' || profile?.user_type === 'manager') && (
                          <Button variant="ghost" className="w-full justify-start mb-3 hover:bg-primary/10 rounded-xl" asChild>
                            <Link to="/collaborations" onClick={() => setIsOpen(false)}>
                              <Users className="h-4 w-4 mr-3 text-accent" />
                              <span className="font-medium">Collaborations</span>
                            </Link>
                          </Button>
                        )}
                        
                        <Button variant="ghost" className="w-full justify-start mb-3 hover:bg-primary/10 rounded-xl" asChild>
                          <Link to="/messages" onClick={() => setIsOpen(false)}>
                            <MessageSquare className="h-4 w-4 mr-3 text-accent" />
                            <span className="font-medium">Messages</span>
                          </Link>
                        </Button>
                        
                        {profile?.user_type === 'admin' && (
                          <Button variant="ghost" className="w-full justify-start mb-3 hover:bg-destructive/10 rounded-xl" asChild>
                            <Link to="/admin" onClick={() => setIsOpen(false)}>
                              <Settings className="h-4 w-4 mr-3 text-destructive" />
                              <span className="font-bold text-destructive">Admin Panel</span>
                            </Link>
                          </Button>
                        )}
                        
                        <Button variant="outline" className="w-full justify-start mt-6 hover:bg-destructive/10 border-destructive/50" onClick={signOut}>
                          <LogOut className="h-4 w-4 mr-3 text-destructive" />
                          <span className="font-medium text-destructive">Sign Out</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" className="w-full justify-start mb-3 hover:bg-primary/10 rounded-xl" asChild>
                          <Link to="/auth">
                            <LogIn className="h-4 w-4 mr-3" />
                            <span className="font-medium">Sign In</span>
                          </Link>
                        </Button>
                        
                        <Button className="w-full btn-premium mt-3" asChild>
                          <Link to="/auth">
                            <UserPlus className="h-4 w-4 mr-3" />
                            <span className="font-semibold">Join Now</span>
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