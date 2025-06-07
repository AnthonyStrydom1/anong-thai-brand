// src/pages/CreateCustomerPage.tsx
import React from "react";
import CreateCustomerForm from "@/components/CreateCustomerForm";

const CreateCustomerPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem" }}>
      <h1>Create Customer</h1>
      <CreateCustomerForm />
    </div>
  );
};

export default CreateCustomerPage;
