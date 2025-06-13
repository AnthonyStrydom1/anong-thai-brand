
import React, { useEffect } from 'react';
import AdminSetup from '@/components/AdminSetup';
import NavigationBanner from '@/components/NavigationBanner';

const AdminSetupPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBanner />
      <div className="flex-1">
        <AdminSetup />
      </div>
    </div>
  );
};

export default AdminSetupPage;
