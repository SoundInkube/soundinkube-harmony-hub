import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Star, Music2, Calendar, Users, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BookingDialog } from '@/components/booking-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Import images for demo data
import studio1 from '@/assets/studio-1.jpg';

interface Jampad {
  id: string;
  jampad_name: string;
  description: string;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  city: string;
  state: string;
  images: string[];
  equipment: string[];
  amenities: string[];
  room_capacity: number;
  created_at: string;
  updated_at: string;
  profile_id: string;
  profiles?: {
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
  } | null;
}

export default function Jampads() {
  const [jampads, setJampads] = useState<Jampad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedJampad, setSelectedJampad] = useState<Jampad | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Demo data for jampads (since no database table exists yet)
  const demoJampads: Jampad[] = [
    {
      id: '1',
      jampad_name: 'Rhythm Room',
      description: 'Professional jamming space with high-end equipment for bands and solo artists',
      hourly_rate: 800,
      rating: 4.8,
      total_reviews: 45,
      city: 'Mumbai',
      state: 'Maharashtra',
      images: [studio1],
      equipment: ['Drums', 'Amplifiers', 'Microphones', 'Keyboards'],
      amenities: ['Air Conditioning', 'Parking', 'WiFi', 'Refreshments'],
      room_capacity: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile_id: '1',
      profiles: {
        full_name: 'Music Hub',
        phone: '+91 98765 43210',
        avatar_url: null
      }
    },
    {
      id: '2',
      jampad_name: 'Sound Sanctuary',
      description: 'Spacious jamming studio perfect for band rehearsals and music production',
      hourly_rate: 1200,
      rating: 4.9,
      total_reviews: 62,
      city: 'Bangalore',
      state: 'Karnataka',
      images: [studio1],
      equipment: ['Professional Drums', 'Bass Amps', 'Guitar Amps', 'PA System'],
      amenities: ['24/7 Access', 'Security', 'Parking', 'Recording Setup'],
      room_capacity: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile_id: '2',
      profiles: {
        full_name: 'Sonic Studios',
        phone: '+91 87654 32109',
        avatar_url: null
      }
    },
    {
      id: '3',
      jampad_name: 'Harmony Hall',
      description: 'Affordable jamming space for emerging artists and music enthusiasts',
      hourly_rate: 600,
      rating: 4.6,
      total_reviews: 28,
      city: 'Delhi',
      state: 'Delhi',
      images: [studio1],
      equipment: ['Basic Drums', 'Guitar Amps', 'Microphones', 'Mixer'],
      amenities: ['WiFi', 'Parking', 'Air Conditioning'],
      room_capacity: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile_id: '3',
      profiles: {
        full_name: 'Music Academy',
        phone: '+91 76543 21098',
        avatar_url: null
      }
    },
    {
      id: '4',
      jampad_name: 'Electric Dreams',
      description: 'Modern jamming facility with latest electronic equipment and gear',
      hourly_rate: 1000,
      rating: 4.7,
      total_reviews: 38,
      city: 'Pune',
      state: 'Maharashtra',
      images: [studio1],
      equipment: ['Electronic Drums', 'Synthesizers', 'MIDI Controllers', 'Studio Monitors'],
      amenities: ['Recording', 'WiFi', 'Parking', 'Green Room'],
      room_capacity: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile_id: '4',
      profiles: {
        full_name: 'Digital Music Co.',
        phone: '+91 65432 10987',
        avatar_url: null
      }
    }
  ];

  useEffect(() => {
    loadJampads();
  }, []);

  const loadJampads = async () => {
    setLoading(true);
    // For now, use demo data since no database table exists
    // In the future, this would fetch from a 'jampads' table
    setTimeout(() => {
      setJampads(demoJampads);
      setLoading(false);
    }, 500);
  };

  const handleBooking = (jampad: Jampad) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a jampad session.",
        variant: "destructive",
      });
      return;
    }
    setSelectedJampad(jampad);
    setBookingDialogOpen(true);
  };

  const filteredJampads = jampads.filter(jampad => {
    const matchesSearch = jampad.jampad_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jampad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || jampad.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const sortedJampads = [...filteredJampads].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price_low':
        return a.hourly_rate - b.hourly_rate;
      case 'price_high':
        return b.hourly_rate - a.hourly_rate;
      case 'reviews':
        return b.total_reviews - a.total_reviews;
      default:
        return 0;
    }
  });

  const cities = Array.from(new Set(jampads.map(jampad => jampad.city)));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-6">
            <div className="animate-pulse space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded mb-4 w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Music2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Jampads</h1>
                <p className="text-muted-foreground">Find the perfect jamming space for your band</p>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-card rounded-lg p-6 mb-8 border shadow-sm">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jampads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="reviews">Most Reviewed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          {sortedJampads.length === 0 ? (
            <div className="text-center py-12">
              <Music2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Jampads Found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedJampads.map((jampad) => (
                <Card key={jampad.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                    <img
                      src={jampad.images[0] || studio1}
                      alt={jampad.jampad_name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-white">
                        ₹{jampad.hourly_rate}/hr
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold line-clamp-1">{jampad.jampad_name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span>{jampad.rating}</span>
                        <span className="text-muted-foreground">({jampad.total_reviews})</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {jampad.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{jampad.city}, {jampad.state}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Capacity: {jampad.room_capacity} people</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {jampad.equipment.slice(0, 3).map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                      {jampad.equipment.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{jampad.equipment.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => handleBooking(jampad)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                      <Button variant="outline" size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Showing {sortedJampads.length} of {jampads.length} jampads
            </p>
          </div>
        </div>
      </main>

      {/* Booking Dialog */}
      {selectedJampad && (
        <BookingDialog
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          provider={selectedJampad}
          providerType="jampad"
        >
          <></>
        </BookingDialog>
      )}
    </div>
  );
}