import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ContentManagement } from '@/components/admin/ContentManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminContentManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin, stats, loading } = useAdmin();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, isAdmin, navigate]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access the admin panel.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/admin/users') {
      return <UserManagement />;
    }
    
    if (path.startsWith('/admin/content')) {
      return <ContentManagement />;
    }
    
    if (path === '/admin/analytics') {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
          <AdminStats stats={stats} loading={loading} />
        </div>
      );
    }
    
    if (path === '/admin/messages') {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Message Management</h2>
          <p className="text-muted-foreground">Message management features coming soon.</p>
        </div>
      );
    }
    
    if (path === '/admin/reviews') {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Review Management</h2>
          <p className="text-muted-foreground">Review management features coming soon.</p>
        </div>
      );
    }
    
    if (path === '/admin/reports') {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Reports & Issues</h2>
          <p className="text-muted-foreground">Report management features coming soon.</p>
        </div>
      );
    }
    
    if (path === '/admin/settings') {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>
          <p className="text-muted-foreground">Settings management features coming soon.</p>
        </div>
      );
    }
    
    // Default dashboard view
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Admin Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! Here's what's happening on your platform.</p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Refresh Data
          </Button>
        </div>
        <AdminOverview />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminContentManager;