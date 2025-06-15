
export interface OrphanedUser {
  id: string;
  email: string;
  created_at: string;
  raw_user_meta_data: any;
  has_profile: boolean;
  has_customer: boolean;
  has_user_record: boolean;
  user_roles: string[];
}

export interface LinkUserResponse {
  success: boolean;
  actions?: Array<{ action: string }>;
  error?: string;
}
