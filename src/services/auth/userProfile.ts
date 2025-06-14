
import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase
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

    if (error) throw error;
    return data;
  }
}

export const userProfileService = new UserProfileService();
