
import React from 'react';
import NavigationBanner from '@/components/NavigationBanner';
import PasswordChangeMfa from '@/components/auth/PasswordChangeMfa';

interface PasswordChangePageViewProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PasswordChangePageView = ({ email, onSuccess, onCancel }: PasswordChangePageViewProps) => {
  console.log('🔐 PasswordChangePageView: Rendering password change MFA for:', email);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBanner />
      <div className="flex-1 flex items-center justify-center p-4">
        <PasswordChangeMfa
          email={email}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default PasswordChangePageView;
