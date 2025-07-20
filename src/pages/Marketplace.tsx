import { Navigation } from '@/components/navigation';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign,
  MessageSquare,
  Heart
} from 'lucide-react';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useState } from 'react';
import { MarketplaceItemDialog } from '@/components/marketplace-item-dialog';

const Marketplace = () => {
  const { items, loading } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Gear Marketplace</h1>
              <p className="text-muted-foreground">Buy and sell musical instruments and equipment</p>
            </div>
            <MarketplaceItemDialog>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                List Item
              </Button>
            </MarketplaceItemDialog>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search instruments, equipment..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Marketplace Items */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded mb-4 w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'}
                      alt={item.title}
                      className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Button size="icon" variant="secondary" className="h-8 w-8 opacity-80 hover:opacity-100">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0">
                        {item.condition}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-primary font-bold text-xl">
                        <DollarSign className="h-5 w-5" />
                        {item.price.toLocaleString()}
                      </div>
                      {item.location && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          {item.location}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchTerm ? 'No items match your search.' : 'No items available yet.'}
              </p>
              <MarketplaceItemDialog>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  List Your First Item
                </Button>
              </MarketplaceItemDialog>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Marketplace;