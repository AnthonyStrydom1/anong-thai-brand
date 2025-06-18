
export interface MFASignInData {
  email: string;
  password: string;
}

export interface MFASessionData {
  email: string;
  password: string;
  timestamp: number;
  userId?: string;
  type: 'signin' | 'signup';
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
