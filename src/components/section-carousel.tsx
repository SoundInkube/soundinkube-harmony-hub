import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { ContentCard } from './content-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SectionCarouselProps {
  title: string;
  subtitle?: string;
  data: Array<{
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    rating?: number;
    location?: string;
    genre?: string;
    price?: string;
    type: 'artist' | 'studio' | 'school' | 'label' | 'jampad';
  }>;
  className?: string;
}

export function SectionCarousel({ title, subtitle, data, className }: SectionCarouselProps) {
  const navigate = useNavigate();

  const getViewAllPath = () => {
    if (data.length > 0) {
      const type = data[0].type;
      switch (type) {
        case 'artist': return '/artists';
        case 'studio': return '/studios';
        case 'school': return '/schools';
        case 'label': return '/labels';
        case 'jampad': return '/jampads';
        default: return '/';
      }
    }
    return '/';
  };

  const handleCardClick = (item: any) => {
    const basePath = getViewAllPath();
    navigate(`${basePath}#${item.id}`);
  };

  return (
    <section className={`py-16 ${className || ''}`}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground text-lg">{subtitle}</p>
            )}
          </div>
          
          <Button variant="ghost" className="group" onClick={() => navigate(getViewAllPath())}>
            View All
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {data.map((item) => (
              <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ContentCard
                  title={item.title}
                  subtitle={item.subtitle}
                  image={item.image}
                  rating={item.rating}
                  location={item.location}
                  genre={item.genre}
                  price={item.price}
                  type={item.type}
                  onClick={() => handleCardClick(item)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-background/80 backdrop-blur-sm border-border/50" />
          <CarouselNext className="hidden md:flex -right-4 bg-background/80 backdrop-blur-sm border-border/50" />
        </Carousel>
      </div>
    </section>
  );
}