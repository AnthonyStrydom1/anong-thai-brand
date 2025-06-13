
import React from 'react';
import { Helmet } from 'react-helmet';
import NavigationBanner from '@/components/NavigationBanner';
import AdminSetup from '@/components/AdminSetup';

const AdminSetupPage = () => {
  return (
    <>
      <Helmet>
        <title>Admin Setup - Anong Thai</title>
        <meta name="description" content="Set up your first admin user" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <NavigationBanner />
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Admin Setup
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Configure your first admin user to access the admin dashboard
            </p>
          </div>
          
          <AdminSetup />
        </main>
      </div>
    </>
  );
};

export default AdminSetupPage;
