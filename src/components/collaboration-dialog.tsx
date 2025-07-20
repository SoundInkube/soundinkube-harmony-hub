import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useCollaborations } from '@/hooks/useCollaborations';
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
import { Users, LogIn, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollaborationDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CollaborationDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: CollaborationDialogProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { createCollaboration } = useCollaborations();
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
    collaboration_type: '',
    location: '',
    max_participants: '',
    compensation_type: '',
    compensation_amount: '',
    deadline: '',
    required_skills: [] as string[],
    required_instruments: [] as string[]
  });

  const collaborationTypes = [
    'Song Writing',
    'Recording Project',
    'Live Performance',
    'Music Video',
    'Album Production',
    'EP Creation',
    'Cover Songs',
    'Original Composition',
    'Band Formation',
    'Music Contest',
    'Charity Event',
    'Other'
  ];

  const compensationTypes = [
    'Paid',
    'Revenue Share',
    'Credit Only',
    'Free/Passion Project',
    'To Be Discussed'
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
        description: "Please sign in to create a collaboration."
      });
      return;
    }

    setLoading(true);
    
    try {
      const collaborationData = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : undefined,
        compensation_amount: formData.compensation_amount ? parseFloat(formData.compensation_amount) : undefined,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        current_participants: 1,
        status: 'open'
      };

      const { error } = await createCollaboration(collaborationData);

      if (error) throw error;

      toast({
        title: "Collaboration Created",
        description: "Your collaboration request has been posted successfully!"
      });

      setOpen(false);
      setFormData({
        title: '',
        description: '',
        collaboration_type: '',
        location: '',
        max_participants: '',
        compensation_type: '',
        compensation_amount: '',
        deadline: '',
        required_skills: [],
        required_instruments: []
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Create Collaboration",
        description: error.message || "Failed to create collaboration. Please try again."
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
            <Users className="h-5 w-5" />
            Create Collaboration Request
          </DialogTitle>
          <DialogDescription>
            Post a collaboration request to find music professionals to work with on your project.
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <LogIn className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Please log in to fully access SoundInkube</h3>
              <p className="text-muted-foreground">
                You need to be logged in to create collaborations and access all features.
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
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Looking for a guitarist for indie rock album"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="collaboration_type">Collaboration Type *</Label>
              <Select 
                value={formData.collaboration_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, collaboration_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select collaboration type" />
                </SelectTrigger>
                <SelectContent>
                  {collaborationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your project, musical style, goals, and what you're looking for in collaborators..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location/Format</Label>
                <Input
                  id="location"
                  placeholder="e.g., Remote, NYC, or Online"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="compensation_type">Compensation Type</Label>
                <Select 
                  value={formData.compensation_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, compensation_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select compensation" />
                  </SelectTrigger>
                  <SelectContent>
                    {compensationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="compensation_amount">Amount ($)</Label>
                <Input
                  id="compensation_amount"
                  type="number"
                  placeholder="If applicable"
                  value={formData.compensation_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, compensation_amount: e.target.value }))}
                  disabled={formData.compensation_type === 'Credit Only' || formData.compensation_type === 'Free/Passion Project'}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">Project Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
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
                {loading ? 'Creating...' : 'Create Collaboration'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}