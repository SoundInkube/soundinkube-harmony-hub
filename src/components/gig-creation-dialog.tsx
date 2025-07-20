import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useGigs } from '@/hooks/useGigs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Briefcase, LogIn, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GigCreationDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GigCreationDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: GigCreationDialogProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { createGig } = useGigs();
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [instrumentInput, setInstrumentInput] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: '',
    location: '',
    event_date: '',
    duration_hours: '',
    budget_min: '',
    budget_max: '',
    required_skills: [] as string[],
    required_instruments: [] as string[]
  });

  const eventTypes = [
    'Wedding',
    'Corporate Event',
    'Private Party',
    'Concert',
    'Festival',
    'Recording Session',
    'Music Video',
    'Commercial',
    'Background Music',
    'Teaching/Lesson',
    'Other'
  ];

  const addSkill = () => {
    if (skillInput.trim() && !formData.required_skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        required_skills: [...prev.required_skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter(s => s !== skill)
    }));
  };

  const addInstrument = () => {
    if (instrumentInput.trim() && !formData.required_instruments.includes(instrumentInput.trim())) {
      setFormData(prev => ({
        ...prev,
        required_instruments: [...prev.required_instruments, instrumentInput.trim()]
      }));
      setInstrumentInput('');
    }
  };

  const removeInstrument = (instrument: string) => {
    setFormData(prev => ({
      ...prev,
      required_instruments: prev.required_instruments.filter(i => i !== instrument)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to post a gig."
      });
      return;
    }

    if (profile.user_type !== 'client') {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only clients can post gigs."
      });
      return;
    }

    setLoading(true);
    
    try {
      const gigData = {
        ...formData,
        event_date: new Date(formData.event_date).toISOString(),
        duration_hours: parseFloat(formData.duration_hours),
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : undefined,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : undefined,
        status: 'open'
      };

      const { error } = await createGig(gigData);

      if (error) throw error;

      toast({
        title: "Gig Posted Successfully",
        description: "Your gig has been posted and is now visible to music professionals!"
      });

      setOpen(false);
      setFormData({
        title: '',
        description: '',
        event_type: '',
        location: '',
        event_date: '',
        duration_hours: '',
        budget_min: '',
        budget_max: '',
        required_skills: [],
        required_instruments: []
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Post Gig",
        description: error.message || "Failed to create gig. Please try again."
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Post a New Gig
          </DialogTitle>
          <DialogDescription>
            Create a gig posting to find the perfect music professional for your event or project.
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <LogIn className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Please log in to fully access SoundInkube</h3>
              <p className="text-muted-foreground">
                You need to be logged in to post gigs and access all features.
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Gig Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Wedding Ceremony Violinist Needed"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="event_type">Event Type *</Label>
              <Select 
                value={formData.event_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your event, requirements, and what you're looking for..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration_hours">Duration (hours) *</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 2.5"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="event_date">Event Date *</Label>
              <Input
                id="event_date"
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget_min">Budget Min ($)</Label>
                <Input
                  id="budget_min"
                  type="number"
                  placeholder="e.g., 500"
                  value={formData.budget_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_min: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="budget_max">Budget Max ($)</Label>
                <Input
                  id="budget_max"
                  type="number"
                  placeholder="e.g., 1000"
                  value={formData.budget_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_max: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Required Skills</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a required skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.required_skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Required Instruments</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a required instrument"
                  value={instrumentInput}
                  onChange={(e) => setInstrumentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInstrument())}
                />
                <Button type="button" onClick={addInstrument} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.required_instruments.map((instrument) => (
                  <Badge key={instrument} variant="secondary" className="flex items-center gap-1">
                    {instrument}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeInstrument(instrument)}
                    />
                  </Badge>
                ))}
              </div>
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
                {loading ? 'Posting...' : 'Post Gig'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}