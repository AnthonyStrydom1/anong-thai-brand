async verifyAndSignIn(code: string) {
  console.log('🔍 MFA Verification Service: Starting verification with code:', code);
  
  const sessionData = mfaSessionManager.getSessionData();
  if (!sessionData) {
    console.log('❌ MFA Verification Service: No session data found');
    throw new Error('No pending MFA verification. Please sign in again.');
  }

  console.log('📋 MFA Verification Service: Found session data for:', sessionData.email);

  // Check session timeout - keep at 15 minutes
  const sessionAge = Date.now() - sessionData.timestamp;
  const maxAge = 15 * 60 * 1000; // 15 minutes
  
  if (sessionAge > maxAge) {
    console.log('⏰ MFA Verification Service: Session expired');
    mfaSessionManager.clearSession();
    throw new Error('MFA session expired. Please sign in again.');
  }

  try {
    // Verify the MFA code first
    await this.verifyCode(code, sessionData);

    // If verification successful, complete sign in
    if (!sessionData.password) {
      throw new Error('Invalid session data - missing credentials');
    }

    const data = await this.signInWithCredentials(sessionData.email, sessionData.password);

    // CRITICAL FIX: Wait for auth state to stabilize before clearing MFA session
    console.log('✅ MFA Verification Service: Login successful, waiting for auth state...');
    
    // Wait for the auth state to properly update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verify the session is actually established
    const { data: { session } } = await supabase.auth.getSession();
    console.log('📊 MFA Verification Service: Current session:', session?.user?.email);
    
    if (session) {
      console.log('✅ MFA Verification Service: Auth session confirmed, clearing MFA session');
      mfaSessionManager.clearSession();
      
      // Dispatch success event instead of cleared event
      console.log('📡 MFA Verification Service: Dispatching mfa-verification-success event');
      window.dispatchEvent(new CustomEvent('mfa-verification-success', { 
        detail: { user: session.user } 
      }));
    } else {
      console.warn('⚠️ MFA Verification Service: No session found after sign-in');
      throw new Error('Authentication failed - please try again');
    }

    return data;
  } catch (error: any) {
    console.error('❌ MFA Verification Service: Verification failed:', error);
    
    // Only clear session on session expiration, not on invalid codes
    if (error.message?.includes('expired') || error.message?.includes('session')) {
      mfaSessionManager.clearSession();
      window.dispatchEvent(new CustomEvent('mfa-session-cleared'));
    }
    
    throw error;
  }
}