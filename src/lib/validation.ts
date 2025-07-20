// Input validation and sanitization utilities

export const sanitizeText = (input: string, maxLength: number = 255): string => {
  return input.trim().slice(0, maxLength);
};

export const sanitizeHtml = (input: string): string => {
  // Basic HTML sanitization - remove potentially dangerous tags
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<link\b[^<]*>/gi, '')
    .replace(/<meta\b[^<]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Indian phone number validation (+91 followed by 10 digits)
  const indianPhoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return indianPhoneRegex.test(phone.replace(/\s+/g, ''));
};

export const validateSocialMediaUsername = (username: string, platform: 'instagram' | 'twitter' | 'youtube'): boolean => {
  if (!username || username.length === 0) return false;
  
  switch (platform) {
    case 'instagram':
      // Instagram usernames: 1-30 characters, alphanumeric, dots, underscores
      return /^[a-zA-Z0-9._]{1,30}$/.test(username);
    case 'twitter':
      // Twitter usernames: 1-15 characters, alphanumeric, underscores
      return /^[a-zA-Z0-9_]{1,15}$/.test(username);
    case 'youtube':
      // YouTube channel names: 1-30 characters, alphanumeric, hyphens, underscores
      return /^[a-zA-Z0-9_-]{1,30}$/.test(username);
    default:
      return false;
  }
};

export const validateProfileData = (data: Record<string, any>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.phone && !validatePhoneNumber(data.phone)) {
    errors.push('Invalid phone number format. Use Indian format: +91XXXXXXXXXX');
  }
  
  if (data.website && !validateUrl(data.website)) {
    errors.push('Invalid website URL');
  }
  
  if (data.full_name && (data.full_name.length < 2 || data.full_name.length > 100)) {
    errors.push('Full name must be between 2 and 100 characters');
  }
  
  if (data.bio && data.bio.length > 500) {
    errors.push('Bio must be less than 500 characters');
  }
  
  // Check for potentially dangerous content in text fields
  const textFields = ['full_name', 'bio', 'location', 'company_name'];
  textFields.forEach(field => {
    if (data[field] && typeof data[field] === 'string') {
      const sanitized = sanitizeHtml(data[field]);
      if (sanitized !== data[field]) {
        errors.push(`${field} contains invalid characters`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeProfileData = (data: Record<string, any>): Record<string, any> => {
  const sanitized = { ...data };
  
  // Sanitize text fields
  const textFields = ['full_name', 'bio', 'location', 'company_name', 'username'];
  textFields.forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeHtml(sanitizeText(sanitized[field]));
    }
  });
  
  // Validate and sanitize phone number
  if (sanitized.phone) {
    sanitized.phone = sanitized.phone.replace(/\s+/g, '');
    if (!sanitized.phone.startsWith('+91') && sanitized.phone.startsWith('91')) {
      sanitized.phone = '+' + sanitized.phone;
    } else if (!sanitized.phone.startsWith('+91') && !sanitized.phone.startsWith('91')) {
      sanitized.phone = '+91' + sanitized.phone;
    }
  }
  
  return sanitized;
};