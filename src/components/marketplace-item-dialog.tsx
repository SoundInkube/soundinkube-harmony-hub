import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useMarketplace } from '@/hooks/useMarketplace';
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
import { ShoppingBag, LogIn, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceItemDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MarketplaceItemDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: MarketplaceItemDialogProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { createItem } = useMarketplace();
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    currency: 'USD',
    location: '',
    contact_preference: 'message',
    tags: [] as string[]
  });

  const categories = [
    'Guitars & Basses',
    'Keyboards & Pianos',
    'Drums & Percussion',
    'Wind Instruments',
    'String Instruments',
    'Microphones',
    'Audio Interface',
    'Studio Monitors',
    'Headphones',
    'Amplifiers',
    'Effects Pedals',
    'Recording Equipment',
    'DJ Equipment',
    'Sheet Music',
    'Accessories',
    'Other'
  ];

  const conditions = [
    'New',
    'Like New',
    'Excellent',
    'Good',
    'Fair',
    'Poor'
  ];

  const contactPreferences = [
    { value: 'message', label: 'Platform Messages' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' }
  ];

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to list an item."
      });
      return;
    }

    setLoading(true);
    
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        images: [], // Add empty images array
        status: 'available'
      };

      const { error } = await createItem(itemData);

      if (error) throw error;

      toast({
        title: "Item Listed Successfully",
        description: "Your item has been added to the marketplace!"
      });

      setOpen(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        condition: '',
        price: '',
        currency: 'USD',
        location: '',
        contact_preference: 'message',
        tags: []
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to List Item",
        description: error.message || "Failed to create listing. Please try again."
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
            <ShoppingBag className="h-5 w-5" />
            List Item for Sale
          </DialogTitle>
          <DialogDescription>
            Add your music gear or equipment to the marketplace for other musicians to discover.
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <LogIn className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Please log in to fully access SoundInkube</h3>
              <p className="text-muted-foreground">
                You need to be logged in to list items and access all features.
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
              <Label htmlFor="title">Item Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Fender Stratocaster Electric Guitar"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Select 
                  value={formData.condition} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the item, its condition, features, and any included accessories..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1200.00"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State/Country"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="contact_preference">Contact Preference</Label>
                <Select 
                  value={formData.contact_preference} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, contact_preference: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contactPreferences.map((pref) => (
                      <SelectItem key={pref.value} value={pref.value}>
                        {pref.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add tags (brand, model, features...)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
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
                {loading ? 'Listing...' : 'List Item'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}