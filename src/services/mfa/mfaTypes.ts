
export interface MFASignInData {
  email: string;
  password: string;
}

export interface MFASessionData {
  email: string;
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
