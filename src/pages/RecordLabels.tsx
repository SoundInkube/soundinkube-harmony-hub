import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Star, Users, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RecordLabel {
  id: string;
  label_name: string;
  description: string;
  rating: number;
  total_reviews: number;
  address: string;
  city: string;
  state: string;
  genres: string[];
  website: string;
  contact_email: string;
  images: string[];
  founded_year: number;
  artists_signed: number;
}

const RecordLabels = () => {
  const [labels, setLabels] = useState<RecordLabel[]>([]);
  const [filteredLabels, setFilteredLabels] = useState<RecordLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchLabels();
  }, []);

  useEffect(() => {
    filterLabels();
  }, [labels, searchTerm, locationFilter, genreFilter]);

  const fetchLabels = async () => {
    try {
      const { data, error } = await supabase
        .from('record_labels')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setLabels(data || []);
    } catch (error) {
      console.error('Error fetching labels:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load record labels"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterLabels = () => {
    let filtered = labels;

    if (searchTerm) {
      filtered = filtered.filter(label =>
        label.label_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        label.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(label =>
        label.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        label.state?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (genreFilter) {
      filtered = filtered.filter(label =>
        label.genres?.some(genre =>
          genre.toLowerCase().includes(genreFilter.toLowerCase())
        )
      );
    }

    setFilteredLabels(filtered);
  };

  const handleContactLabel = (label: RecordLabel) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to contact record labels"
      });
      return;
    }
    
    if (label.contact_email) {
      window.location.href = `mailto:${label.contact_email}?subject=Partnership Inquiry - ${label.label_name}`;
    } else if (label.website) {
      window.open(label.website, '_blank');
    } else {
      toast({
        title: "Contact Information",
        description: "Contact details will be available soon"
      });
    }
  };

  const uniqueCities = [...new Set(labels.map(label => label.city).filter(Boolean))];
  const uniqueGenres = [...new Set(labels.flatMap(label => label.genres || []))];

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
          <h1 className="text-4xl font-bold mb-4">Record Labels</h1>
          <p className="text-muted-foreground text-lg">
            Connect with leading music labels and get your music heard
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search record labels..."
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
                <SelectItem value="">All Locations</SelectItem>
                {uniqueCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Genres</SelectItem>
                {uniqueGenres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{filteredLabels.length} labels found</span>
            {(searchTerm || locationFilter || genreFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setGenreFilter('');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Labels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLabels.map((label) => (
            <div key={label.id} className="group">
              <ContentCard
                title={label.label_name}
                subtitle={label.description}
                image={label.images?.[0] || '/placeholder.svg'}
                rating={label.rating}
                location={`${label.city}, ${label.state}`}
                genre={label.genres?.[0]}
                price="Partnership"
                type="label"
                onClick={() => handleContactLabel(label)}
              />
              
              {/* Additional Info */}
              <div className="mt-3 px-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span>{label.rating}</span>
                    <span>({label.total_reviews} reviews)</span>
                  </div>
                  {label.artists_signed > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{label.artists_signed} artists</span>
                    </div>
                  )}
                </div>
                
                {label.genres && label.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {label.genres.slice(0, 2).map((genre, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                    {label.genres.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{label.genres.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Contact Actions */}
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleContactLabel(label)}
                  >
                    Contact Label
                  </Button>
                  {label.website && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(label.website, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLabels.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No record labels found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordLabels;