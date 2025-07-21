import { useProfile } from './useProfile';

export function useProfileCompletion() {
  const { profile } = useProfile();
  
  const isProfileComplete = () => {
    if (!profile) return false;
    
    // Check basic required fields
    const hasBasicInfo = !!(
      profile.full_name && 
      profile.user_type &&
      profile.bio
    );
    
    // Check if professional users have additional required fields
    const isProfessional = ['artist', 'studio', 'manager', 'label', 'school'].includes(profile.user_type);
    
    if (isProfessional) {
      return hasBasicInfo && !!(profile as any).experience_level;
    }
    
    return hasBasicInfo;
  };

  const isNewProfile = () => {
    if (!profile) return true;
    
    // Consider it new if basic fields are missing
    return !(profile.full_name && profile.bio && profile.user_type);
  };

  const getCompletionPercentage = () => {
    if (!profile) return 0;
    
    const fields = [
      'full_name',
      'bio', 
      'location',
      'avatar_url',
      'user_type'
    ];
    
    const isProfessional = ['artist', 'studio', 'manager', 'label', 'school'].includes(profile.user_type);
    
    if (isProfessional) {
      fields.push('experience_level');
      if ((profile as any).hourly_rate) fields.push('hourly_rate');
    }
    
    const completedFields = fields.filter(field => {
      const value = (profile as any)[field];
      return value && value !== '';
    });
    
    return Math.round((completedFields.length / fields.length) * 100);
  };

  return {
    isProfileComplete: isProfileComplete(),
    isNewProfile: isNewProfile(),
    completionPercentage: getCompletionPercentage()
  };
}