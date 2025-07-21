import { useState } from 'react';
import { ProfileCreationWizard } from './profile-creation-wizard';
import { ProfileEditDialog } from './profile-edit-dialog';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface SmartProfileDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SmartProfileDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: SmartProfileDialogProps) {
  const { isNewProfile } = useProfileCompletion();
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  
  // Show wizard for new/incomplete profiles, edit dialog for complete profiles
  if (isNewProfile) {
    return (
      <ProfileCreationWizard 
        open={isOpen} 
        onOpenChange={setOpen} 
      />
    );
  }
  
  return (
    <ProfileEditDialog 
      open={isOpen} 
      onOpenChange={setOpen}
    >
      {children}
    </ProfileEditDialog>
  );
}