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
  Users,
  Music,
  DollarSign,
  Clock
} from 'lucide-react';
import { useCollaborations } from '@/hooks/useCollaborations';
import { useState } from 'react';

const Collaborations = () => {
  const { collaborations, myCollaborations, applications, loading } = useCollaborations();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCollaborations = collaborations.filter(collab =>
    collab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collab.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collab.collaboration_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCompensationDisplay = (collaboration: any) => {
    if (collaboration.compensation_type === 'revenue_share') {
      return 'Revenue Share';
    } else if (collaboration.compensation_type === 'fixed_fee') {
      return `$${collaboration.compensation_amount?.toLocaleString() || 0}`;
    }
    return 'TBD';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Collaborations</h1>
              <p className="text-muted-foreground">Find and create musical collaboration opportunities</p>
            </div>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Collaboration
            </Button>
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browse">Browse Projects</TabsTrigger>
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="applications">My Applications</TabsTrigger>
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
                          placeholder="Search collaborations..."
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

              {/* Collaboration List */}
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
                  filteredCollaborations.map((collaboration) => (
                    <Card key={collaboration.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{collaboration.title}</h3>
                              <Badge variant="secondary">{collaboration.collaboration_type}</Badge>
                            </div>
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {collaboration.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-primary">
                              {getCompensationDisplay(collaboration)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {collaboration.compensation_type === 'revenue_share' ? 'Revenue Share' : 'Fixed Fee'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                          {collaboration.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {collaboration.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {collaboration.current_participants}/{collaboration.max_participants} participants
                          </div>
                          {collaboration.deadline && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due {new Date(collaboration.deadline).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {collaboration.required_skills?.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {collaboration.required_skills?.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{collaboration.required_skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                          <Button>Apply Now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="my-projects" className="space-y-6">
              <div className="space-y-4">
                {myCollaborations.map((collaboration) => (
                  <Card key={collaboration.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{collaboration.title}</h3>
                          <p className="text-muted-foreground mb-4">{collaboration.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge>{collaboration.status}</Badge>
                            <span>{collaboration.current_participants}/{collaboration.max_participants} participants</span>
                          </div>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Application</h3>
                          <p className="text-muted-foreground mb-4">{application.message}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant={application.status === 'accepted' ? 'default' : application.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {application.status}
                            </Badge>
                            <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Collaborations;