import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  DollarSign,
  MapPin
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from '@/hooks/use-toast';

export function ContentManagement() {
  const { getTableData, updateTableRow, deleteTableRow } = useAdmin();
  const [activeTab, setActiveTab] = useState('artists');
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const tables = [
    { id: 'artists', name: 'Artists', table: 'artists' },
    { id: 'studios', name: 'Studios', table: 'studios' },
    { id: 'music_schools', name: 'Schools', table: 'music_schools' },
    { id: 'record_labels', name: 'Labels', table: 'record_labels' },
    { id: 'marketplace', name: 'Marketplace', table: 'marketplace' },
    { id: 'gigs', name: 'Gigs', table: 'gigs' },
    { id: 'collaborations', name: 'Collaborations', table: 'collaborations' },
    { id: 'bookings', name: 'Bookings', table: 'bookings' },
  ];

  useEffect(() => {
    loadTableData(activeTab);
  }, [activeTab]);

  const loadTableData = async (tableId: string) => {
    setLoading(true);
    const table = tables.find(t => t.id === tableId);
    if (table) {
      const { data, error } = await getTableData(table.table);
      if (error) {
        toast({
          title: "Error",
          description: `Failed to load ${table.name}`,
          variant: "destructive",
        });
      } else {
        setTableData(data || []);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const table = tables.find(t => t.id === activeTab);
    if (table) {
      const { error } = await deleteTableRow(table.table, id);
      if (error) {
        toast({
          title: "Error",
          description: `Failed to delete ${table.name.toLowerCase()}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `${table.name} deleted successfully`,
        });
        loadTableData(activeTab);
      }
    }
  };

  const filteredData = tableData.filter((item: any) => {
    const searchFields = ['title', 'name', 'studio_name', 'school_name', 'label_name', 'stage_name', 'event_type'];
    return searchFields.some(field => 
      item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderTableContent = () => {
    if (loading) {
      return (
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
      );
    }

    return (
      <div className="space-y-4">
        {filteredData.map((item: any) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {item.title || item.studio_name || item.school_name || item.label_name || item.stage_name || 'Untitled'}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {item.description || item.bio || 'No description available'}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {item.created_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    )}
                    
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>
                    )}

                    {(item.price || item.hourly_rate || item.budget_min) && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {item.price || item.hourly_rate || item.budget_min}
                      </div>
                    )}

                    {item.status && (
                      <Badge variant="outline">
                        {item.status}
                      </Badge>
                    )}

                    {item.event_type && (
                      <Badge variant="secondary">
                        {item.event_type}
                      </Badge>
                    )}

                    {item.collaboration_type && (
                      <Badge variant="secondary">
                        {item.collaboration_type}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this item? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">Manage all platform content and listings</p>
        </div>
        <Button onClick={() => loadTableData(activeTab)}>
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          {tables.map((table) => (
            <TabsTrigger key={table.id} value={table.id} className="text-xs">
              {table.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {tables.map((table) => (
          <TabsContent key={table.id} value={table.id} className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Search ${table.name.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            {renderTableContent()}

            {!loading && filteredData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchTerm ? `No ${table.name.toLowerCase()} match your search.` : `No ${table.name.toLowerCase()} found.`}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}