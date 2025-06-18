
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { supabaseService } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';

interface EditProfileFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onCancel, onSave }) => {
  const { userProfile, updateProfile, isLoading, user } = useAuth();
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    console.log('🔄 EditProfileForm: Starting profile update...');
    console.log('📝 EditProfileForm: Form data:', { firstName, lastName, phone });
    console.log('👤 EditProfileForm: Current user:', user?.id);
    console.log('📋 EditProfileForm: Current profile:', userProfile);
    
    setIsSubmitting(true);
    
    try {
      console.log('📝 Updating profile with data:', { firstName, lastName, phone });
      
      // Update the auth profile first
      await updateProfile({
        firstName,
        lastName,
        phone,
      });
      
      console.log('✅ EditProfileForm: Auth profile updated successfully');
      
      // Also update the customer record if it exists
      if (user) {
        console.log('🔍 EditProfileForm: Looking for customer record...');
        const customer = await supabaseService.getCurrentUserCustomer();
        if (customer) {
          console.log('👤 Updating customer record:', customer.id);
          await supabaseService.updateCustomer(customer.id, {
            first_name: firstName,
            last_name: lastName,
            fullname: `${firstName} ${lastName}`,
            phone: phone,
          });
          console.log('✅ Customer record updated successfully');
        } else {
          console.log('ℹ️ EditProfileForm: No customer record found');
        }
      }
      
      toast({
        title: 'Profile updated successfully!',
        description: 'Your changes have been saved.',
      });
      
      console.log('✅ EditProfileForm: Profile update completed successfully');
      onSave();
    } catch (error: any) {
      console.error('❌ Profile update error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
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
    console.log('⏳ EditProfileForm: Profile data loading...');
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-anong-gold"></div>
      </div>
    );
  }

  console.log('🎯 EditProfileForm: Rendering form with:', { 
    firstName, 
    lastName, 
    phone, 
    isSubmitting,
    userProfile 
  });

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
            onChange={(e) => {
              console.log('📝 EditProfileForm: First name changed to:', e.target.value);
              setFirstName(e.target.value);
            }}
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
            onChange={(e) => {
              console.log('📝 EditProfileForm: Last name changed to:', e.target.value);
              setLastName(e.target.value);
            }}
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
            onChange={(e) => {
              console.log('📝 EditProfileForm: Phone changed to:', e.target.value);
              setPhone(e.target.value);
            }}
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
          onClick={(e) => {
            console.log('🔘 EditProfileForm: Save button clicked');
            // The form onSubmit will handle the actual submission
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            console.log('❌ EditProfileForm: Cancel button clicked');
            onCancel();
          }}
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
