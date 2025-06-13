
import { useState } from 'react';
import { securityService } from '@/services/securityService';
import { toast } from '@/components/ui/use-toast';

interface UseSecureFormOptions {
  onSubmit: (data: any) => Promise<void>;
  resourceType: string;
  action: string;
}

export const useSecureForm = ({ onSubmit, resourceType, action }: UseSecureFormOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSecureSubmit = async (data: any) => {
    // Check rate limiting
    if (!securityService.checkRateLimit(`form_${resourceType}`, 5, 60000)) {
      toast({
        title: 'Rate Limit Exceeded',
        description: 'Too many requests. Please wait before trying again.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Sanitize all string inputs
      const sanitizedData = Object.keys(data).reduce((acc, key) => {
        const value = data[key];
        acc[key] = typeof value === 'string' ? securityService.sanitizeInput(value) : value;
        return acc;
      }, {} as any);

      // Validate email if present
      if (sanitizedData.email && !securityService.isValidEmail(sanitizedData.email)) {
        setErrors({ email: 'Please enter a valid email address' });
        return;
      }

      // Validate password if present
      if (sanitizedData.password) {
        const passwordCheck = securityService.isStrongPassword(sanitizedData.password);
        if (!passwordCheck.isStrong) {
          setErrors({ password: passwordCheck.message });
          return;
        }
      }

      await onSubmit(sanitizedData);

      // Log successful action
      await securityService.logSecurityEvent(
        action,
        resourceType,
        sanitizedData.id || undefined,
        { success: true }
      );

      toast({
        title: 'Success',
        description: `${resourceType} ${action} completed successfully.`
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      // Log failed action
      await securityService.logSecurityEvent(
        action,
        resourceType,
        data.id || undefined,
        { success: false, error: errorMessage }
      );

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });

      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSecureSubmit,
    isSubmitting,
    errors,
    setErrors
  };
};
