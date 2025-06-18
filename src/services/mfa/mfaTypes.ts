
export interface MFASignInData {
  email: string;
  password: string;
}

export interface MFASessionData {
  email: string;
  password?: string; // Optional for password change flow
  timestamp: number;
  userId?: string;
  challengeId?: string; // Added for password change flow
  type: 'signin' | 'signup' | 'password_change'; // Added password_change
}

export interface MFAAuthResult {
  mfaRequired: boolean;
  user?: any;
  session?: any;
}

export interface MFAResendResult {
  success: boolean;
  error?: string;
  challengeId?: string;
}

export interface MFAVerificationResult {
  success: boolean;
  user?: any;
  session?: any;
  error?: string;
}
