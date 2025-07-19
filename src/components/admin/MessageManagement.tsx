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
  MessageSquare, 
  Trash2, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from '@/hooks/use-toast';

export function MessageManagement() {
  const { getTableData, deleteTableRow } = useAdmin();
  const [activeTab, setActiveTab] = useState('messages');
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageRequests, setMessageRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [messagesRes, requestsRes] = await Promise.all([
        getTableData('messages'),
        getTableData('message_requests')
      ]);
      
      setMessages(messagesRes.data || []);
      setMessageRequests(requestsRes.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load message data",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteMessage = async (id: string) => {
    const { error } = await deleteTableRow('messages', id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      loadData();
    }
  };

  const handleDeleteRequest = async (id: string) => {
    const { error } = await deleteTableRow('message_requests', id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete message request",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Message request deleted successfully",
      });
      loadData();
    }
  };

  const filteredMessages = messages.filter((message: any) =>
    message.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = messageRequests.filter((request: any) =>
    request.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMessages = () => {
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
        {filteredMessages.map((message: any) => (
          <Card key={message.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {message.sender_profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{message.sender_profile?.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground">
                        to {message.recipient_profile?.full_name || 'Unknown Recipient'}
                      </p>
                    </div>
                    <Badge variant={message.read_at ? 'default' : 'secondary'}>
                      {message.read_at ? 'Read' : 'Unread'}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {message.content}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                    <Badge variant="outline">
                      {message.message_type || 'text'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Message</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this message? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMessage(message.id)}
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

  const renderRequests = () => {
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
        {filteredRequests.map((request: any) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {request.sender_profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.sender_profile?.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground">
                        to {request.recipient_profile?.full_name || 'Unknown Recipient'}
                      </p>
                    </div>
                    <Badge variant={
                      request.status === 'approved' ? 'default' : 
                      request.status === 'rejected' ? 'destructive' : 'secondary'
                    }>
                      {request.status}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {request.message || 'No message provided'}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(request.created_at).toLocaleString()}
                    </div>
                    {request.context_type && (
                      <Badge variant="outline">
                        {request.context_type}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Message Request</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this message request? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteRequest(request.id)}
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
          <h2 className="text-2xl font-bold">Message Management</h2>
          <p className="text-muted-foreground">Monitor and manage platform messages</p>
        </div>
        <Button onClick={loadData}>
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="messages">Messages ({messages.length})</TabsTrigger>
          <TabsTrigger value="requests">Message Requests ({messageRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {renderMessages()}

          {!loading && filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {searchTerm ? "No messages match your search." : "No messages found."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search message requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {renderRequests()}

          {!loading && filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {searchTerm ? "No message requests match your search." : "No message requests found."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}