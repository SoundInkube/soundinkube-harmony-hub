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

export default function Artists() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select(`
          *,
          profile:profiles(*)
        `)
        .order('rating', { ascending: false });

      if (error) throw error;
      setArtists(data || []);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.stage_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = genreFilter === 'all' || !genreFilter || 
                        artist.genres?.some((genre: string) => 
                          genre.toLowerCase().includes(genreFilter.toLowerCase()));
    
    const matchesLocation = locationFilter === 'all' || !locationFilter || 
                           artist.profile?.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesGenre && matchesLocation;
  });

  const uniqueGenres = Array.from(new Set(
    artists.flatMap(artist => artist.genres || [])
  ));

  const uniqueLocations = Array.from(new Set(
    artists.map(artist => artist.profile?.location).filter(Boolean)
  ));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-muted-foreground">Loading artists...</div>
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Artists</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect with talented musicians across India for your next project
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
                        placeholder="Search artists by name or stage name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
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
                {filteredArtists.length} Artists Found
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

            {filteredArtists.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No artists found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredArtists.map((artist) => (
                  <div key={artist.id} className="group">
                    <ContentCard
                      title={artist.stage_name}
                      subtitle={artist.profile?.full_name}
                      image={artist.profile?.avatar_url || '/placeholder.svg'}
                      rating={artist.rating}
                      location={artist.profile?.location}
                      genre={artist.genres?.[0]}
                      price={artist.hourly_rate ? `₹${artist.hourly_rate}/hr` : undefined}
                      type="artist"
                      onClick={() => console.log('View artist:', artist.id)}
                    />
                    
                    {/* Additional Info */}
                    <div className="mt-3 space-y-2">
                      {artist.instruments && artist.instruments.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {artist.instruments.slice(0, 3).map((instrument: string) => (
                            <Badge key={instrument} variant="outline" className="text-xs">
                              {instrument}
                            </Badge>
                          ))}
                          {artist.instruments.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{artist.instruments.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          {artist.rating} ({artist.total_reviews} reviews)
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          artist.availability_status === 'available' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-warning/20 text-warning'
                        }`}>
                          {artist.availability_status}
                        </span>
                      </div>
                      
                      {/* Book Now Button */}
                      <BookingDialog provider={artist} providerType="artist">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-primary hover:opacity-90"
                          disabled={artist.availability_status !== 'available'}
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