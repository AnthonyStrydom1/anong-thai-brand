
import React from 'react';
import NavigationBanner from '@/components/NavigationBanner';
import MfaVerification from '@/components/auth/MfaVerification';

interface MfaPageViewProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const MfaPageView = ({ email, onSuccess, onCancel }: MfaPageViewProps) => {
  console.log('🔐 MfaPageView: Rendering MFA verification component for:', email);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBanner />
      <div className="flex-1 flex items-center justify-center p-4">
        <MfaVerification
          email={email}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default MfaPageView;
