import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentCard } from '@/components/content-card';
import { BookingDialog } from '@/components/booking-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/navigation';
import { Search, Filter, MapPin, Star, Music, Calendar } from 'lucide-react';

export default function MusicProfessionals() {
  const [musicProfessionals, setMusicProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');

  useEffect(() => {
    loadMusicProfessionals();
  }, []);

  const loadMusicProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select(`
          *,
          profile:profiles(*)
        `)
        .order('rating', { ascending: false });

      if (error) throw error;
      setMusicProfessionals(data || []);
    } catch (error) {
      console.error('Error loading music professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessionals = musicProfessionals.filter(professional => {
    const matchesSearch = professional.stage_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.specializations?.some((spec: string) => 
                           spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGenre = genreFilter === 'all' || !genreFilter || 
                        professional.genres?.some((genre: string) => 
                          genre.toLowerCase().includes(genreFilter.toLowerCase()));
    
    const matchesLocation = locationFilter === 'all' || !locationFilter || 
                           professional.profile?.location?.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesSpecialization = specializationFilter === 'all' || !specializationFilter || 
                                 professional.specializations?.some((spec: string) => 
                                   spec.toLowerCase().includes(specializationFilter.toLowerCase()));

    return matchesSearch && matchesGenre && matchesLocation && matchesSpecialization;
  });

  const uniqueGenres = Array.from(new Set(
    musicProfessionals.flatMap(professional => professional.genres || [])
  ));

  const uniqueLocations = Array.from(new Set(
    musicProfessionals.map(professional => professional.profile?.location).filter(Boolean)
  ));

  const uniqueSpecializations = Array.from(new Set(
    musicProfessionals.flatMap(professional => professional.specializations || [])
  ));

  const musicSpecializations = [
    'Singer/Songwriter',
    'DJ',
    'Producer',
    'Engineer',
    'Lyricist',
    'Teacher',
    'Director',
    'Instrumentalist',
    'Band',
    'Beatboxer',
    'Vocalist'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-muted-foreground">Loading music professionals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-card">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Music Professionals</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect with talented music professionals across India for your next project
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, stage name, or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="All Specializations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specializations</SelectItem>
                        {musicSpecializations.map((specialization) => (
                          <SelectItem key={specialization} value={specialization}>
                            {specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={genreFilter} onValueChange={setGenreFilter}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="All Genres" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genres</SelectItem>
                        {uniqueGenres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                {filteredProfessionals.length} Music Professionals Found
              </h2>
              
              <Select defaultValue="rating">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredProfessionals.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No music professionals found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProfessionals.map((professional) => (
                  <div key={professional.id} className="group">
                    <ContentCard
                      title={professional.stage_name}
                      subtitle={professional.profile?.full_name}
                      image={professional.profile?.avatar_url || '/placeholder.svg'}
                      rating={professional.rating}
                      location={professional.profile?.location}
                      genre={professional.genres?.[0]}
                      price={professional.hourly_rate ? `₹${professional.hourly_rate}/hr` : undefined}
                      type="artist"
                      onClick={() => console.log('View music professional:', professional.id)}
                    />
                    
                    {/* Additional Info */}
                    <div className="mt-3 space-y-2">
                      {professional.specializations && professional.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {professional.specializations.slice(0, 2).map((spec: string) => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {professional.specializations.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{professional.specializations.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {professional.instruments && professional.instruments.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {professional.instruments.slice(0, 3).map((instrument: string) => (
                            <Badge key={instrument} variant="outline" className="text-xs">
                              {instrument}
                            </Badge>
                          ))}
                          {professional.instruments.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{professional.instruments.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          {professional.rating} ({professional.total_reviews} reviews)
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          professional.availability_status === 'available' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-warning/20 text-warning'
                        }`}>
                          {professional.availability_status}
                        </span>
                      </div>
                      
                      {/* Book Now Button */}
                      <BookingDialog provider={professional} providerType="artist">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-primary hover:opacity-90"
                          disabled={professional.availability_status !== 'available'}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Book Now
                        </Button>
                      </BookingDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}