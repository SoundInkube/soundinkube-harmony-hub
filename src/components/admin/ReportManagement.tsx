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
  AlertTriangle, 
  Trash2, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  MessageSquare,
  User,
  FileText
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from '@/hooks/use-toast';

interface Report {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  reported_content_id?: string;
  content_type: string;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  reporter_profile?: any;
  reported_user_profile?: any;
}

// Mock data for reports since we don't have a reports table yet
const mockReports: Report[] = [
  {
    id: '1',
    reporter_id: 'user1',
    reported_user_id: 'user2',
    reported_content_id: null,
    content_type: 'user_profile',
    reason: 'inappropriate_behavior',
    description: 'User is posting inappropriate content and harassing other users.',
    status: 'pending',
    priority: 'high',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reporter_profile: { full_name: 'John Doe', avatar_url: null },
    reported_user_profile: { full_name: 'Jane Smith', avatar_url: null }
  },
  {
    id: '2',
    reporter_id: 'user3',
    reported_user_id: null,
    reported_content_id: 'listing1',
    content_type: 'marketplace_listing',
    reason: 'fraud_scam',
    description: 'This listing appears to be a scam. The seller is asking for payment outside the platform.',
    status: 'investigating',
    priority: 'critical',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    reporter_profile: { full_name: 'Mike Johnson', avatar_url: null }
  },
  {
    id: '3',
    reporter_id: 'user4',
    reported_user_id: 'user5',
    reported_content_id: null,
    content_type: 'gig_posting',
    reason: 'spam',
    description: 'User is posting the same gig multiple times with different titles.',
    status: 'resolved',
    priority: 'medium',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    reporter_profile: { full_name: 'Sarah Wilson', avatar_url: null },
    reported_user_profile: { full_name: 'Alex Brown', avatar_url: null }
  }
];

export function ReportManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (reportId: string, newStatus: Report['status']) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: newStatus, updated_at: new Date().toISOString() }
        : report
    ));
    
    toast({
      title: "Success",
      description: `Report status updated to ${newStatus}`,
    });
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
    toast({
      title: "Success",
      description: "Report deleted successfully",
    });
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reported_user_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      activeTab === 'all' || 
      report.status === activeTab ||
      (activeTab === 'urgent' && ['high', 'critical'].includes(report.priority));

    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: Report['status']) => {
    const variants = {
      pending: 'secondary',
      investigating: 'default',
      resolved: 'default',
      dismissed: 'outline'
    };
    return variants[status] || 'secondary';
  };

  const getPriorityBadge = (priority: Report['priority']) => {
    const variants = {
      low: 'outline',
      medium: 'secondary',
      high: 'default',
      critical: 'destructive'
    };
    return variants[priority] || 'outline';
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'user_profile':
        return <User className="h-4 w-4" />;
      case 'marketplace_listing':
        return <FileText className="h-4 w-4" />;
      case 'gig_posting':
        return <FileText className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels = {
      inappropriate_behavior: 'Inappropriate Behavior',
      fraud_scam: 'Fraud/Scam',
      spam: 'Spam',
      harassment: 'Harassment',
      fake_profile: 'Fake Profile',
      copyright_violation: 'Copyright Violation',
      other: 'Other'
    };
    return labels[reason as keyof typeof labels] || reason;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Report Management</h2>
          <p className="text-muted-foreground">Handle user reports and safety issues</p>
        </div>
        <Button onClick={() => setReports([...mockReports])}>
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Reports ({reports.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({reports.filter(r => r.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="investigating">Investigating ({reports.filter(r => r.status === 'investigating').length})</TabsTrigger>
          <TabsTrigger value="urgent">Urgent ({reports.filter(r => ['high', 'critical'].includes(r.priority)).length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-red-100">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{getReasonLabel(report.reason)}</h4>
                            <Badge variant={getStatusBadge(report.status) as any}>
                              {report.status}
                            </Badge>
                            <Badge variant={getPriorityBadge(report.priority) as any}>
                              {report.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getContentTypeIcon(report.content_type)}
                            <span>{report.content_type.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {report.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(report.created_at).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Reported by:</span>
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {report.reporter_profile?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{report.reporter_profile?.full_name || 'Anonymous'}</span>
                        </div>
                        {report.reported_user_profile && (
                          <div className="flex items-center gap-2">
                            <span>Target:</span>
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {report.reported_user_profile.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{report.reported_user_profile.full_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {report.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleStatusChange(report.id, 'investigating')}
                            >
                              Start Investigation
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusChange(report.id, 'dismissed')}
                            >
                              Dismiss
                            </Button>
                          </>
                        )}
                        
                        {report.status === 'investigating' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleStatusChange(report.id, 'resolved')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusChange(report.id, 'dismissed')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Dismiss
                            </Button>
                          </>
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
                            <AlertDialogTitle>Delete Report</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this report? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteReport(report.id)}
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

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {searchTerm ? "No reports match your search." : "No reports found."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}