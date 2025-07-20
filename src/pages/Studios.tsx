import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BookingDialog } from '@/components/booking-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Studio {
  id: string;
  studio_name: string;
  description: string;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  address: string;
  city: string;
  state: string;
  specialties: string[];
  equipment: string[];
  amenities: string[];
  images: string[];
}

const Studios = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchStudios();
  }, []);

  useEffect(() => {
    filterStudios();
  }, [studios, searchTerm, locationFilter, specialtyFilter]);

  const fetchStudios = async () => {
    try {
      const { data, error } = await supabase
        .from('studios')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setStudios(data || []);
    } catch (error) {
      console.error('Error fetching studios:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load studios"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterStudios = () => {
    let filtered = studios;

    if (searchTerm) {
      filtered = filtered.filter(studio =>
        studio.studio_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studio.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter && locationFilter !== 'all') {
      filtered = filtered.filter(studio =>
        studio.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        studio.state?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (specialtyFilter && specialtyFilter !== 'all') {
      filtered = filtered.filter(studio =>
        studio.specialties?.some(specialty =>
          specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
        )
      );
    }

    setFilteredStudios(filtered);
  };

  const handleBookStudio = (studio: Studio) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to book a studio"
      });
      return;
    }
    setSelectedStudio(studio);
    setBookingDialogOpen(true);
  };

  const uniqueCities = [...new Set(studios.map(studio => studio.city).filter(Boolean))];
  const uniqueSpecialties = [...new Set(studios.flatMap(studio => studio.specialties || []))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Recording Studios</h1>
          <p className="text-muted-foreground text-lg">
            Find the perfect recording studio for your next project
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search studios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {uniqueSpecialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{filteredStudios.length} studios found</span>
            {(searchTerm || locationFilter || specialtyFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setSpecialtyFilter('');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Studios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudios.map((studio) => (
            <div key={studio.id} className="group">
              <ContentCard
                title={studio.studio_name}
                subtitle={studio.description}
                image={studio.images?.[0] || '/placeholder.svg'}
                rating={studio.rating}
                location={`${studio.city}, ${studio.state}`}
                genre={studio.specialties?.[0]}
                price={studio.hourly_rate ? `₹${studio.hourly_rate}/hr` : undefined}
                type="studio"
                onClick={() => handleBookStudio(studio)}
              />
              
              {/* Additional Info */}
              <div className="mt-3 px-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span>{studio.rating}</span>
                    <span>({studio.total_reviews} reviews)</span>
                  </div>
                </div>
                
                {studio.specialties && studio.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {studio.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {studio.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{studio.specialties.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredStudios.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No studios found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      {selectedStudio && (
        <BookingDialog
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          provider={selectedStudio}
          providerType="studio"
        />
      )}
    </div>
  );
};

export default Studios;