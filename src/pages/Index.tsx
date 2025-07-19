import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { SectionCarousel } from '@/components/section-carousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Users, 
  Building, 
  GraduationCap, 
  Star,
  Headphones,
  Heart,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import images
import heroStudio from '@/assets/hero-studio.jpg';
import artist1 from '@/assets/artist-1.jpg';
import artist2 from '@/assets/artist-2.jpg';
import studio1 from '@/assets/studio-1.jpg';
import school1 from '@/assets/school-1.jpg';
import label1 from '@/assets/label-1.jpg';

const Index = () => {
  const navigate = useNavigate();
  // Sample data for different sections
  const featuredArtists = [
    {
      id: '1',
      title: 'Rajesh Kumar',
      subtitle: 'Classical Sitar Maestro',
      image: artist1,
      rating: 4.9,
      location: 'Mumbai',
      genre: 'Classical',
      price: '₹5,000/hr',
      type: 'artist' as const,
    },
    {
      id: '2',
      title: 'DJ Arjun',
      subtitle: 'Electronic Music Producer',
      image: artist2,
      rating: 4.8,
      location: 'Bangalore',
      genre: 'Electronic',
      price: '₹8,000/hr',
      type: 'artist' as const,
    },
    {
      id: '3',
      title: 'Shreya Singh',
      subtitle: 'Playback Singer',
      image: artist1,
      rating: 4.9,
      location: 'Delhi',
      genre: 'Bollywood',
      price: '₹12,000/hr',
      type: 'artist' as const,
    },
    {
      id: '4',
      title: 'Ravi Shankar Jr.',
      subtitle: 'Multi-instrumentalist',
      image: artist2,
      rating: 4.7,
      location: 'Chennai',
      genre: 'Fusion',
      price: '₹6,000/hr',
      type: 'artist' as const,
    },
  ];

  const topStudios = [
    {
      id: '1',
      title: 'SoundWave Studios',
      subtitle: 'Professional Recording',
      image: studio1,
      rating: 4.8,
      location: 'Mumbai',
      genre: 'All Genres',
      price: '₹3,000/hr',
      type: 'studio' as const,
    },
    {
      id: '2',
      title: 'Echo Chamber',
      subtitle: 'Mixing & Mastering',
      image: studio1,
      rating: 4.9,
      location: 'Bangalore',
      genre: 'Electronic',
      price: '₹4,500/hr',
      type: 'studio' as const,
    },
    {
      id: '3',
      title: 'Harmony Studios',
      subtitle: 'Live Recording Specialist',
      image: studio1,
      rating: 4.7,
      location: 'Delhi',
      genre: 'Classical',
      price: '₹2,800/hr',
      type: 'studio' as const,
    },
    {
      id: '4',
      title: 'Rhythm Records',
      subtitle: 'Full Production House',
      image: studio1,
      rating: 4.8,
      location: 'Pune',
      genre: 'All Genres',
      price: '₹5,000/hr',
      type: 'studio' as const,
    },
  ];

  const musicSchools = [
    {
      id: '1',
      title: 'Melody Academy',
      subtitle: 'Classical & Contemporary',
      image: school1,
      rating: 4.9,
      location: 'Mumbai',
      genre: 'All Instruments',
      price: '₹2,000/month',
      type: 'school' as const,
    },
    {
      id: '2',
      title: 'Sangam Music Institute',
      subtitle: 'Traditional Indian Music',
      image: school1,
      rating: 4.8,
      location: 'Varanasi',
      genre: 'Classical',
      price: '₹1,500/month',
      type: 'school' as const,
    },
  ];

  const topLabels = [
    {
      id: '1',
      title: 'Indie Sounds',
      subtitle: 'Independent Music Label',
      image: label1,
      rating: 4.7,
      location: 'Mumbai',
      genre: 'Indie',
      price: 'Partnership',
      type: 'label' as const,
    },
    {
      id: '2',
      title: 'Fusion Records',
      subtitle: 'World Music Specialists',
      image: label1,
      rating: 4.8,
      location: 'Delhi',
      genre: 'World Music',
      price: 'Partnership',
      type: 'label' as const,
    },
  ];

  const topJampads = [
    {
      id: '1',
      title: 'Rhythm Room',
      subtitle: 'Professional Jamming Space',
      image: studio1,
      rating: 4.8,
      location: 'Mumbai',
      genre: 'All Genres',
      price: '₹800/hr',
      type: 'jampad' as const,
    },
    {
      id: '2',
      title: 'Sound Sanctuary',
      subtitle: 'Band Rehearsal Studio',
      image: studio1,
      rating: 4.9,
      location: 'Bangalore',
      genre: 'Rock & Pop',
      price: '₹1,200/hr',
      type: 'jampad' as const,
    },
  ];

  const features = [
    {
      icon: Music,
      title: 'Professional Network',
      description: 'Connect with verified music professionals across India'
    },
    {
      icon: Heart,
      title: 'Seamless Booking',
      description: 'Book artists, studios, and teachers with integrated calendar'
    },
    {
      icon: Zap,
      title: 'Real-time Collaboration',
      description: 'Chat, share projects, and collaborate in real-time'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with escrow protection'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Artists */}
      <SectionCarousel
        title="Featured Artists"
        subtitle="Discover talented musicians from across India"
        data={featuredArtists}
        className="bg-muted/20"
      />

      {/* Top Studios */}
      <SectionCarousel
        title="Top Studios"
        subtitle="Professional recording studios for your next project"
        data={topStudios}
      />

      {/* Music Schools */}
      <SectionCarousel
        title="Music Schools"
        subtitle="Learn from the best music educators"
        data={musicSchools}
        className="bg-muted/20"
      />

      {/* Record Labels */}
      <SectionCarousel
        title="Record Labels"
        subtitle="Connect with leading music labels"
        data={topLabels}
      />

      {/* Jampads */}
      <SectionCarousel
        title="Top Jampads"
        subtitle="Find the perfect jamming space for your band"
        data={topJampads}
        className="bg-muted/20"
      />

      {/* Features Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              <Globe className="h-4 w-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to succeed in the music industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 content-card group hover:bg-card/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join India's Music Revolution?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you're an artist, student, or music enthusiast, our platform has something for everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 px-8 py-6 text-lg glow-primary" onClick={() => navigate('/auth')}>
                <Users className="h-5 w-5 mr-2" />
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10 px-8 py-6 text-lg" onClick={() => navigate('/artists')}>
                <Headphones className="h-5 w-5 mr-2" />
                Explore Platform
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/lovable-uploads/0ef42355-744e-4141-9372-c611bb5eb01a.png" alt="SoundInkube" className="h-32 w-auto object-contain" />
              </div>
              <p className="text-muted-foreground">
                India's premier music platform connecting professionals and enthusiasts.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Artists</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => navigate('/auth')} className="hover:text-primary transition-colors text-left">Create Profile</button></li>
                <li><button onClick={() => navigate('/bookings')} className="hover:text-primary transition-colors text-left">Manage Bookings</button></li>
                <li><button onClick={() => navigate('/collaborations')} className="hover:text-primary transition-colors text-left">Collaborate</button></li>
                <li><button onClick={() => navigate('/marketplace')} className="hover:text-primary transition-colors text-left">Sell Gear</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => navigate('/artists')} className="hover:text-primary transition-colors text-left">Book Artists</button></li>
                <li><button onClick={() => navigate('/studios')} className="hover:text-primary transition-colors text-left">Find Studios</button></li>
                <li><button onClick={() => navigate('/schools')} className="hover:text-primary transition-colors text-left">Learn Music</button></li>
                <li><button onClick={() => navigate('/jampads')} className="hover:text-primary transition-colors text-left">Find Jampads</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-primary transition-colors text-left">Help Center</button></li>
                <li><button onClick={() => navigate('/messages')} className="hover:text-primary transition-colors text-left">Contact Us</button></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Music Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
