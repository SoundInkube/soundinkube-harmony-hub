import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Loader2, Image } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface GalleryUploadProps {
  bucketName: string;
  currentImages?: string[];
  onImagesUpdated: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

export function GalleryUpload({
  bucketName,
  currentImages = [],
  onImagesUpdated,
  maxImages = 10,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}: GalleryUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
    
    return null;
  };

  const uploadFile = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/gallery/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        variant: "destructive",
        title: "Too Many Images",
        description: `You can only upload up to ${maxImages} images. Currently have ${images.length}.`
      });
      return;
    }

    // Validate all files first
    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        toast({
          variant: "destructive",
          title: "Invalid File",
          description: `${file.name}: ${validationError}`
        });
        return;
      }
    }

    setUploading(true);
    
    try {
      const uploadPromises = files.map(file => uploadFile(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onImagesUpdated(newImages);

      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded ${files.length} image(s)!`
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload images. Please try again."
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesUpdated(newImages);
    
    toast({
      title: "Image Removed",
      description: "Image has been removed from your gallery."
    });
  };

  const handleAddClick = () => {
    if (images.length >= maxImages) {
      toast({
        variant: "destructive",
        title: "Gallery Full",
        description: `You can only have up to ${maxImages} images in your gallery.`
      });
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        multiple
        className="hidden"
        disabled={uploading}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <img
              src={imageUrl}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border-2 border-border"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRemoveImage(index)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {images.length < maxImages && (
          <div
            onClick={handleAddClick}
            className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground text-center">
                  Add Image
                </p>
              </>
            )}
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        {images.length} of {maxImages} images • Max {maxSizeMB}MB each • {acceptedTypes.map(t => t.split('/')[1]).join(', ').toUpperCase()}
      </p>
    </div>
  );
}