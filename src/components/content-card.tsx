import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star, MapPin, Music, Users } from 'lucide-react';

interface ContentCardProps {
  title: string;
  subtitle?: string;
  image: string;
  rating?: number;
  location?: string;
  genre?: string;
  price?: string;
  type: 'artist' | 'studio' | 'school' | 'label';
  className?: string;
  onClick?: () => void;
}

export function ContentCard({
  title,
  subtitle,
  image,
  rating,
  location,
  genre,
  price,
  type,
  className,
  onClick
}: ContentCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'artist': return <Music className="h-4 w-4" />;
      case 'studio': return <Play className="h-4 w-4" />;
      case 'school': return <Users className="h-4 w-4" />;
      case 'label': return <Star className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'artist': return 'bg-primary';
      case 'studio': return 'bg-accent';
      case 'school': return 'bg-secondary';
      case 'label': return 'bg-warning';
    }
  };

  return (
    <div
      className={cn(
        "content-card group cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Type Badge */}
        <Badge 
          className={cn(
            "absolute top-3 left-3 text-white border-0",
            getTypeColor()
          )}
        >
          {getTypeIcon()}
          <span className="ml-1 capitalize">{type}</span>
        </Badge>

        {/* Price Badge */}
        {price && (
          <Badge 
            className="absolute top-3 right-3 bg-background/90 text-foreground border-0"
          >
            {price}
          </Badge>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="icon" className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 glow-primary">
            <Play className="h-6 w-6 fill-current" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
            {subtitle}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span>{rating}</span>
              </div>
            )}
            
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
          </div>

          {genre && (
            <Badge variant="outline" className="text-xs">
              {genre}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}