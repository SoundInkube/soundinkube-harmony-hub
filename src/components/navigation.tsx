import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  Headphones
} from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Artists', href: '/artists', icon: Mic },
    { label: 'Studios', href: '/studios', icon: Headphones },
    { label: 'Schools', href: '/schools', icon: GraduationCap },
    { label: 'Labels', href: '/labels', icon: Building },
  ];

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
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Music className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">SoundInkube</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
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
                  <DropdownMenuItem key={type.value}>
                    <User className="h-4 w-4 mr-2" />
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors p-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </a>
                    );
                  })}
                  
                  <div className="border-t pt-4">
                    <Button variant="ghost" className="w-full justify-start mb-2">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                    
                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Now
                    </Button>
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