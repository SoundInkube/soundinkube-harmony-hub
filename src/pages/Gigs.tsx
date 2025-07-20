import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Calendar,
  Clock,
  DollarSign,
  Music,
  Briefcase
} from 'lucide-react';
import { useGigs } from '@/hooks/useGigs';
import { useProfile } from '@/hooks/useProfile';
import { useState } from 'react';
import { GigCreationDialog } from '@/components/gig-creation-dialog';
import { GigApplicationDialog } from '@/components/gig-application-dialog';

const Gigs = () => {
  const { gigs, myGigs, applications, loading } = useGigs();
  const { profile } = useProfile();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGigs = gigs.filter(gig =>
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.event_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBudgetDisplay = (gig: any) => {
    if (gig.budget_min && gig.budget_max) {
      return `$${gig.budget_min.toLocaleString()} - $${gig.budget_max.toLocaleString()}`;
    } else if (gig.budget_min) {
      return `$${gig.budget_min.toLocaleString()}+`;
    }
    return 'Budget TBD';
  };

  const isClient = profile?.user_type === 'client';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {isClient ? 'My Gig Requests' : 'Available Gigs'}
              </h1>
              <p className="text-muted-foreground">
                {isClient 
                  ? 'Manage your gig postings and applications'
                  : 'Discover and apply to performance opportunities'
                }
              </p>
            </div>
            {isClient && (
              <GigCreationDialog>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Gig
                </Button>
              </GigCreationDialog>
            )}
          </div>

          <Tabs defaultValue={isClient ? "my-gigs" : "browse"} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browse">
                {isClient ? 'Browse Professionals' : 'Available Gigs'}
              </TabsTrigger>
              <TabsTrigger value="my-gigs">
                {isClient ? 'My Posted Gigs' : 'My Applications'}
              </TabsTrigger>
              <TabsTrigger value="applications">
                {isClient ? 'Applications Received' : 'Saved Gigs'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={isClient ? "Search professionals..." : "Search gigs..."}
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

              {/* Gigs List */}
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-muted rounded mb-2" />
                        <div className="h-4 bg-muted rounded mb-4 w-3/4" />
                        <div className="flex gap-2 mb-4">
                          <div className="h-6 bg-muted rounded w-20" />
                          <div className="h-6 bg-muted rounded w-24" />
                        </div>
                        <div className="h-10 bg-muted rounded w-32" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  filteredGigs.map((gig) => (
                    <Card key={gig.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{gig.title}</h3>
                              <Badge variant="secondary">{gig.event_type}</Badge>
                              <Badge variant="outline">{gig.status}</Badge>
                            </div>
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {gig.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-primary text-lg">
                              {getBudgetDisplay(gig)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Budget
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {gig.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(gig.event_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {gig.duration_hours}h duration
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {gig.required_skills?.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {gig.required_skills?.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{gig.required_skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            {!isClient && (
                              <GigApplicationDialog gig={gig}>
                                <Button size="sm">Apply Now</Button>
                              </GigApplicationDialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {!loading && filteredGigs.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-4">
                    {searchTerm ? 'No gigs match your search.' : 'No gigs available yet.'}
                  </p>
                  {isClient && (
                    <GigCreationDialog>
                      <Button className="bg-gradient-primary hover:opacity-90">
                        <Plus className="h-4 w-4 mr-2" />
                        Post Your First Gig
                      </Button>
                    </GigCreationDialog>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-gigs" className="space-y-6">
              <div className="space-y-4">
                {(isClient ? myGigs : applications).map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {isClient ? item.title : `Application for ${item.gig?.title || 'Gig'}`}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {isClient ? item.description : item.proposal}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant={item.status === 'open' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                            {isClient ? (
                              <span>Posted {new Date(item.created_at).toLocaleDateString()}</span>
                            ) : (
                              <span>Applied {new Date(item.applied_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <Button variant="outline">
                          {isClient ? 'Manage' : 'View Application'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">No applications to show yet.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Gigs;