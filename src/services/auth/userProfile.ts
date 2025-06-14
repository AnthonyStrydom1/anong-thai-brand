
import { supabase } from "@/integrations/supabase/client";
import { supabaseService } from "@/services/supabaseService";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export class UserProfileService {
  async getUserProfile(userId: string): Promise<AuthUser | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name || undefined,
      lastName: data.last_name || undefined,
      phone: data.phone || undefined,
    };
  }

  async updateUserProfile(userId: string, updates: Partial<Omit<AuthUser, 'id' | 'email'>>) {
    console.log('🔄 Updating user profile:', { userId, updates });
    
    // Update profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        phone: updates.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (profileError) {
      console.error('❌ Profile update error:', profileError);
      throw profileError;
    }

    console.log('✅ Profile updated:', profileData);

    // Also update customer record if it exists
    try {
      const customer = await supabaseService.getCustomerByUserId(userId);
      if (customer) {
        console.log('👤 Updating linked customer record:', customer.id);
        await supabaseService.updateCustomer(customer.id, {
          first_name: updates.firstName,
          last_name: updates.lastName,
          fullname: updates.firstName && updates.lastName ? `${updates.firstName} ${updates.lastName}` : customer.fullname,
          phone: updates.phone,
        });
        console.log('✅ Customer record synced');
      }
    } catch (customerError) {
      console.warn('⚠️ Could not sync customer record:', customerError);
      // Don't throw error for customer sync failure
    }

    return profileData;
  }
}

export const userProfileService = new UserProfileService();
