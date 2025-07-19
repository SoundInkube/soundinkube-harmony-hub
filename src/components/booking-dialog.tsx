import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
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
import { Calendar, Clock, DollarSign, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  provider: any;
  providerType?: 'artist' | 'studio' | 'school' | 'label' | 'jampad';
}

export function BookingDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange, provider, providerType = 'artist' }: BookingDialogProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bookingType: 'session',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to make a booking."
      });
      return;
    }

    setLoading(true);
    
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString();

      const bookingData = {
        client_id: profile.id,
        provider_id: provider.profile_id || provider.id,
        provider_type: providerType,
        booking_type: formData.bookingType,
        title: formData.title,
        description: formData.description,
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        notes: formData.notes,
        status: 'pending'
      };

      const { error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) throw error;

      toast({
        title: "Booking Request Sent",
        description: "Your booking request has been sent successfully!"
      });

      setOpen(false);
      setFormData({
        title: '',
        description: '',
        bookingType: 'session',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        notes: ''
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const bookingTypes = {
    artist: [
      { value: 'session', label: 'Recording Session' },
      { value: 'lesson', label: 'Music Lesson' },
      { value: 'event', label: 'Live Performance' },
      { value: 'collaboration', label: 'Collaboration' },
    ],
    studio: [
      { value: 'session', label: 'Recording Session' },
      { value: 'event', label: 'Studio Rental' },
    ],
    school: [
      { value: 'lesson', label: 'Music Course' },
      { value: 'session', label: 'Private Lesson' },
    ],
    label: [
      { value: 'collaboration', label: 'Record Deal Discussion' },
      { value: 'session', label: 'Meeting' },
    ],
    jampad: [
      { value: 'session', label: 'Jam Session' },
      { value: 'practice', label: 'Band Practice' },
      { value: 'rehearsal', label: 'Rehearsal' },
      { value: 'rental', label: 'Equipment Rental' },
    ]
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
            <Calendar className="h-5 w-5" />
            Book {provider.stage_name || provider.studio_name || provider.school_name || provider.label_name || provider.jampad_name}
          </DialogTitle>
          <DialogDescription>
            Fill out the details for your booking request. The provider will receive your request and can accept or decline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Booking Title</Label>
            <Input
              id="title"
              placeholder="e.g., Recording session for my album"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="bookingType">Booking Type</Label>
            <Select 
              value={formData.bookingType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, bookingType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select booking type" />
              </SelectTrigger>
              <SelectContent>
                {bookingTypes[providerType].map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project or requirements..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or questions..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
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
              {loading ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}