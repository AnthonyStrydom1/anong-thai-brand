
export interface MFASignInData {
  email: string;
  password: string;
}

export interface MFASessionData {
  email: string;
  password: string;
  timestamp: number;
  userId?: string;
}

export interface MFAAuthResult {
  mfaRequired: boolean;
}

export interface MFAResendResult {
  success: boolean;
}
