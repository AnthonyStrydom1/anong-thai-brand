
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface EditProfileFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onCancel, onSave }) => {
  const { userProfile, updateProfile, isLoading } = useAuth();
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        firstName,
        lastName,
        phone,
      });
      
      toast({
        title: 'Profile updated successfully!',
        description: 'Your changes have been saved.',
      });
      
      onSave();
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-anong-gold"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="block text-sm font-medium text-anong-charcoal mb-2 font-serif">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border-anong-sage/20 bg-anong-warm-cream/50 font-serif"
            placeholder="Enter your first name"
          />
        </div>
        
        <div>
          <Label htmlFor="lastName" className="block text-sm font-medium text-anong-charcoal mb-2 font-serif">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border-anong-sage/20 bg-anong-warm-cream/50 font-serif"
            placeholder="Enter your last name"
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="phone" className="block text-sm font-medium text-anong-charcoal mb-2 font-serif">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-anong-sage/20 bg-anong-warm-cream/50 font-serif"
            placeholder="Enter your phone number"
          />
        </div>
      </div>
      
      <div className="flex space-x-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="gold"
          className="font-serif"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-anong-sage/20 text-anong-charcoal hover:bg-anong-sage/10 font-serif"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
