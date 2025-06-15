
export interface MFASignInData {
  email: string;
  password: string;
}

export interface MFASessionData {
  email: string;
  password?: string; // Added for signin flow
  userId?: string; // Added for user identification
  challengeId?: string;
  type: 'signin' | 'password_change';
  timestamp: number;
}

export interface MFAAuthResult {
  mfaRequired: boolean;
  user?: any;
  session?: any;
}

export interface MFAResendResult {
  success: boolean;
}
