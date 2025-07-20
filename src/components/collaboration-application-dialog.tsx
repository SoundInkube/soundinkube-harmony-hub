import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useCollaborations } from '@/hooks/useCollaborations';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, LogIn, DollarSign, Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollaborationApplicationDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collaboration: any;
}

export function CollaborationApplicationDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange, collaboration }: CollaborationApplicationDialogProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { applyToCollaboration } = useCollaborations();
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    message: ''
  });

  const getCompensationDisplay = (collaboration: any) => {
    if (collaboration.compensation_type === 'Paid' && collaboration.compensation_amount) {
      return `$${collaboration.compensation_amount.toLocaleString()}`;
    } else if (collaboration.compensation_type) {
      return collaboration.compensation_type;
    }
    return 'TBD';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to apply for collaborations."
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await applyToCollaboration(
        collaboration.id, 
        formData.message
      );

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your collaboration application has been sent!"
      });

      setOpen(false);
      setFormData({
        message: ''
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Apply for "{collaboration.title}"
          </DialogTitle>
          <DialogDescription>
            Submit your application to join this collaboration project.
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <LogIn className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Please log in to fully access SoundInkube</h3>
              <p className="text-muted-foreground">
                You need to be logged in to apply for collaborations and access all features.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button asChild className="bg-gradient-primary hover:opacity-90">
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Collaboration Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{collaboration.title}</h4>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{collaboration.collaboration_type}</Badge>
                <Badge variant="outline">{collaboration.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{collaboration.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  {collaboration.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {collaboration.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {collaboration.current_participants}/{collaboration.max_participants} participants
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {getCompensationDisplay(collaboration)}
                  </div>
                  {collaboration.deadline && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due {new Date(collaboration.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="message">Your Application Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your interest in this collaboration, your relevant experience, and what you can contribute to the project..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}