import { ProfileCreationWizard } from './profile-creation-wizard';
import { ProfileEditDialog } from './profile-edit-dialog';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface SmartProfileDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SmartProfileDialog({ children, open, onOpenChange }: SmartProfileDialogProps) {
  const { isNewProfile } = useProfileCompletion();
  
  // Show wizard for new/incomplete profiles, edit dialog for complete profiles
  if (isNewProfile) {
    return (
      <ProfileCreationWizard 
        open={open || false} 
        onOpenChange={onOpenChange || (() => {})} 
      />
    );
  }
  
  return (
    <ProfileEditDialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      {children}
    </ProfileEditDialog>
  );
}