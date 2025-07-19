import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Music, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-accent animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-40 w-28 h-28 rounded-full bg-secondary animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge 
            className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-all duration-300"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            India's Premier Music Platform
          </Badge>

          {/* Main Logo */}
          <div className="flex justify-center mb-0">
            <img 
              src="/lovable-uploads/69918e24-a799-4c5c-9104-37eee2db9aac.png" 
              alt="Music Platform Logo" 
              className="h-[576px] md:h-[768px] w-auto object-contain filter drop-shadow-2xl"
            />
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed -mt-120">
            Where Music Professionals Connect, Collaborate, and Create. 
            From booking artists to learning music, discover India's vibrant music ecosystem.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 transition-all duration-300 px-8 py-6 text-lg glow-primary group"
            >
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Explore Platform
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/50 hover:bg-primary/10 px-8 py-6 text-lg"
            >
              <Music className="h-5 w-5 mr-2" />
              Join as Artist
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Artists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Studios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">200+</div>
              <div className="text-sm text-muted-foreground">Schools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Labels</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}