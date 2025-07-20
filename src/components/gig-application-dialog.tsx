import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useGigs } from '@/hooks/useGigs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Briefcase, LogIn, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GigApplicationDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  gig: any;
}

export function GigApplicationDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange, gig }: GigApplicationDialogProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { applyToGig } = useGigs();
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    proposal: '',
    quoted_price: ''
  });

  const getBudgetDisplay = (gig: any) => {
    if (gig.budget_min && gig.budget_max) {
      return `₹${gig.budget_min.toLocaleString('en-IN')} - ₹${gig.budget_max.toLocaleString('en-IN')}`;
    } else if (gig.budget_min) {
      return `₹${gig.budget_min.toLocaleString('en-IN')}+`;
    }
    return 'Budget TBD';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to apply for gigs."
      });
      return;
    }

    if (profile.user_type === 'client') {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Clients cannot apply to gigs. Only music professionals can apply."
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await applyToGig(
        gig.id, 
        formData.proposal, 
        parseFloat(formData.quoted_price)
      );

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your application has been sent to the client!"
      });

      setOpen(false);
      setFormData({
        proposal: '',
        quoted_price: ''
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
            <Briefcase className="h-5 w-5" />
            Apply for "{gig.title}"
          </DialogTitle>
          <DialogDescription>
            Submit your proposal and quoted price for this gig. The client will review all applications.
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <LogIn className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Please log in to fully access SoundInkube</h3>
              <p className="text-muted-foreground">
                You need to be logged in to apply for gigs and access all features.
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
            {/* Gig Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{gig.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{gig.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span>Event: {gig.event_type}</span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {getBudgetDisplay(gig)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span>Location: {gig.location}</span>
                <span>Duration: {gig.duration_hours}h</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="proposal">Your Proposal *</Label>
                <Textarea
                  id="proposal"
                  placeholder="Describe your experience, why you're the right fit for this gig, and any relevant details..."
                  value={formData.proposal}
                  onChange={(e) => setFormData(prev => ({ ...prev, proposal: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="quoted_price">Your Quote (₹) *</Label>
                <Input
                  id="quoted_price"
                  type="number"
                  step="0.01"
                  placeholder={gig.budget_min ? `e.g., ${gig.budget_min}` : "Enter your price"}
                  value={formData.quoted_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, quoted_price: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Client's budget: {getBudgetDisplay(gig)}
                </p>
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