import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye,
  Clock,
  User,
  Building,
  Music,
  Star,
  MapPin,
  Globe,
  Calendar
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from '@/hooks/use-toast';

export function ProfileApproval() {
  const { getTableData, updateTableRow, updateUserVerification } = useAdmin();
  const [activeTab, setActiveTab] = useState('profiles');
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [artists, setArtists] = useState([]);
  const [studios, setStudios] = useState([]);
  const [schools, setSchools] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profilesRes, artistsRes, studiosRes, schoolsRes, labelsRes] = await Promise.all([
        getTableData('profiles'),
        getTableData('artists'),
        getTableData('studios'), 
        getTableData('music_schools'),
        getTableData('record_labels')
      ]);
      
      setProfiles(profilesRes.data || []);
      setArtists(artistsRes.data || []);
      setStudios(studiosRes.data || []);
      setSchools(schoolsRes.data || []);
      setLabels(labelsRes.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleApproveProfile = async (userId: string) => {
    const { error } = await updateUserVerification(userId, true);
    if (!error) {
      loadData();
    }
  };

  const handleRejectProfile = async (userId: string) => {
    const { error } = await updateUserVerification(userId, false);
    if (!error) {
      loadData();
    }
  };

  const handleApproveEntity = async (tableName: string, entityId: string) => {
    const { error } = await updateTableRow(tableName, entityId, { approved: true, status: 'active' });
    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve entity",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Entity approved successfully",
      });
      loadData();
    }
  };

  const handleRejectEntity = async (tableName: string, entityId: string) => {
    const { error } = await updateTableRow(tableName, entityId, { approved: false, status: 'rejected' });
    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject entity",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Entity rejected successfully",
      });
      loadData();
    }
  };

  const renderProfiles = () => {
    const pendingProfiles = profiles.filter((profile: any) => !profile.verified);
    const filteredProfiles = pendingProfiles.filter((profile: any) =>
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        {filteredProfiles.map((profile: any) => (
          <Card key={profile.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback>
                        {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{profile.full_name || profile.username}</h4>
                      <p className="text-muted-foreground">@{profile.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{profile.user_type}</Badge>
                        <Badge variant="secondary">Pending Verification</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <p className="text-muted-foreground mb-4 line-clamp-2">{profile.bio}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                    )}
                    {profile.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Website
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => handleApproveProfile(profile.user_id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Profile</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject this profile? The user will be notified.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRejectProfile(profile.user_id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              {searchTerm ? "No profiles match your search." : "No pending profile approvals."}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderEntityApproval = (entities: any[], tableName: string, entityType: string) => {
    const pendingEntities = entities.filter((entity: any) => !entity.approved && entity.status !== 'rejected');
    const filteredEntities = pendingEntities.filter((entity: any) => {
      const searchFields = ['studio_name', 'school_name', 'label_name', 'stage_name', 'title'];
      return searchFields.some(field => 
        entity[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    return (
      <div className="space-y-4">
        {filteredEntities.map((entity: any) => (
          <Card key={entity.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      {entityType === 'studio' && <Building className="h-6 w-6" />}
                      {entityType === 'school' && <Music className="h-6 w-6" />}
                      {entityType === 'label' && <Star className="h-6 w-6" />}
                      {entityType === 'artist' && <User className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">
                        {entity.studio_name || entity.school_name || entity.label_name || entity.stage_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{entityType}</Badge>
                        <Badge variant="secondary">Pending Approval</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {entity.description || entity.bio || 'No description provided'}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created {new Date(entity.created_at).toLocaleDateString()}
                    </div>
                    {(entity.city || entity.location) && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {entity.city || entity.location}
                      </div>
                    )}
                    {entity.hourly_rate && (
                      <div className="text-green-600 font-medium">
                        ${entity.hourly_rate}/hr
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => handleApproveEntity(tableName, entity.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject {entityType}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject this {entityType}? The owner will be notified.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRejectEntity(tableName, entity.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredEntities.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              {searchTerm ? `No ${entityType}s match your search.` : `No pending ${entityType} approvals.`}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Profile & Listing Approval</h2>
            <p className="text-muted-foreground">Review and approve user profiles and listings</p>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded mb-4 w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const pendingProfilesCount = profiles.filter((p: any) => !p.verified).length;
  const pendingArtistsCount = artists.filter((a: any) => !a.approved).length;
  const pendingStudiosCount = studios.filter((s: any) => !s.approved).length;
  const pendingSchoolsCount = schools.filter((s: any) => !s.approved).length;
  const pendingLabelsCount = labels.filter((l: any) => !l.approved).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Profile & Listing Approval</h2>
          <p className="text-muted-foreground">Review and approve user profiles and listings</p>
        </div>
        <Button onClick={loadData}>
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="profiles">Profiles ({pendingProfilesCount})</TabsTrigger>
          <TabsTrigger value="artists">Artists ({pendingArtistsCount})</TabsTrigger>
          <TabsTrigger value="studios">Studios ({pendingStudiosCount})</TabsTrigger>
          <TabsTrigger value="schools">Schools ({pendingSchoolsCount})</TabsTrigger>
          <TabsTrigger value="labels">Labels ({pendingLabelsCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
          {renderProfiles()}
        </TabsContent>

        <TabsContent value="artists" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
          {renderEntityApproval(artists, 'artists', 'artist')}
        </TabsContent>

        <TabsContent value="studios" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search studios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
          {renderEntityApproval(studios, 'studios', 'studio')}
        </TabsContent>

        <TabsContent value="schools" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
          {renderEntityApproval(schools, 'music_schools', 'school')}
        </TabsContent>

        <TabsContent value="labels" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search labels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
          {renderEntityApproval(labels, 'record_labels', 'label')}
        </TabsContent>
      </Tabs>
    </div>
  );
}