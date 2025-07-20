import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Star, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BookingDialog } from '@/components/booking-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface MusicSchool {
  id: string;
  school_name: string;
  description: string;
  monthly_fee: number;
  rating: number;
  total_reviews: number;
  address: string;
  city: string;
  state: string;
  courses_offered: string[];
  instruments_taught: string[];
  facilities: string[];
  images: string[];
  founded_year: number;
}

const MusicSchools = () => {
  const [schools, setSchools] = useState<MusicSchool[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<MusicSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<MusicSchool | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    filterSchools();
  }, [schools, searchTerm, locationFilter, instrumentFilter]);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('music_schools')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load music schools"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSchools = () => {
    let filtered = schools;

    if (searchTerm) {
      filtered = filtered.filter(school =>
        school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter && locationFilter !== 'all') {
      filtered = filtered.filter(school =>
        school.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        school.state?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (instrumentFilter && instrumentFilter !== 'all') {
      filtered = filtered.filter(school =>
        school.instruments_taught?.some(instrument =>
          instrument.toLowerCase().includes(instrumentFilter.toLowerCase())
        )
      );
    }

    setFilteredSchools(filtered);
  };

  const handleEnrollSchool = (school: MusicSchool) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to enroll in a music school"
      });
      return;
    }
    setSelectedSchool(school);
    setBookingDialogOpen(true);
  };

  const uniqueCities = [...new Set(schools.map(school => school.city).filter(Boolean))];
  const uniqueInstruments = [...new Set(schools.flatMap(school => school.instruments_taught || []))];

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
          <h1 className="text-4xl font-bold mb-4">Music Schools</h1>
          <p className="text-muted-foreground text-lg">
            Learn from the best music educators across India
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
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

            <Select value={instrumentFilter} onValueChange={setInstrumentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instruments</SelectItem>
                {uniqueInstruments.map(instrument => (
                  <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{filteredSchools.length} schools found</span>
            {(searchTerm || locationFilter || instrumentFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setInstrumentFilter('');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSchools.map((school) => (
            <div key={school.id} className="group">
              <ContentCard
                title={school.school_name}
                subtitle={school.description}
                image={school.images?.[0] || '/placeholder.svg'}
                rating={school.rating}
                location={`${school.city}, ${school.state}`}
                genre={school.instruments_taught?.[0]}
                price={school.monthly_fee ? `₹${school.monthly_fee}/month` : undefined}
                type="school"
                onClick={() => handleEnrollSchool(school)}
              />
              
              {/* Additional Info */}
              <div className="mt-3 px-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span>{school.rating}</span>
                    <span>({school.total_reviews} reviews)</span>
                  </div>
                  {school.founded_year && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <GraduationCap className="h-3 w-3" />
                      <span>Est. {school.founded_year}</span>
                    </div>
                  )}
                </div>
                
                {school.courses_offered && school.courses_offered.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {school.courses_offered.slice(0, 2).map((course, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                    {school.courses_offered.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{school.courses_offered.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSchools.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No music schools found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      {selectedSchool && (
        <BookingDialog
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          provider={selectedSchool}
          providerType="school"
        />
      )}
    </div>
  );
};

export default MusicSchools;