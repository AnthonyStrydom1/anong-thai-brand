
import React, { useEffect } from "react";
import CreateCustomerForm from "@/components/CreateCustomerForm";
import NavigationBanner from "@/components/NavigationBanner";

const CreateCustomerPage: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBanner />
      <div className="flex-1" style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem" }}>
        <h1>Create Customer</h1>
        <CreateCustomerForm />
      </div>
    </div>
  );
};

export default CreateCustomerPage;
