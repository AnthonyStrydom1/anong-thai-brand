
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function CreateCustomerForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      console.log('Creating customer with:', formData);

      // First check if customer already exists
      const { data: existingCustomer, error: checkError } = await supabase
        .from('customers')
        .select('id, email')
        .eq('email', formData.email)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing customer:', checkError);
        throw new Error('Failed to check existing customer: ' + checkError.message);
      }

      if (existingCustomer) {
        setError(`A customer with email ${formData.email} already exists.`);
        return;
      }

      // Check if user exists in auth but not in customers
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.log('Could not check auth users (this is normal for non-admin users)');
      }

      const existingAuthUser = authUsers?.users?.find(user => user.email === formData.email);

      if (existingAuthUser) {
        console.log('User exists in auth, creating customer record for existing user');
        
        // Create customer record for existing auth user
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            user_id: existingAuthUser.id,
            fullname: formData.fullName,
            email: formData.email,
            first_name: formData.fullName.split(' ')[0] || '',
            last_name: formData.fullName.split(' ').slice(1).join(' ') || '',
          })
          .select()
          .single();

        if (customerError) {
          console.error('Error creating customer for existing user:', customerError);
          throw new Error('Failed to create customer record: ' + customerError.message);
        }

        console.log('Customer record created for existing user:', newCustomer);
        setMessage('Customer record created successfully for existing user!');
        setFormData({ fullName: '', email: '' });
        
        toast({
          title: "Success!",
          description: "Customer record created successfully for existing user.",
        });
        return;
      }

      // If user doesn't exist in auth, create both auth user and customer
      // Note: The handle_new_user trigger will automatically create the customer record
      // but we want to make sure it doesn't create admin user records
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'TempPassword123!', // Temporary password - user should reset
        options: {
          data: {
            first_name: formData.fullName.split(' ')[0] || '',
            last_name: formData.fullName.split(' ').slice(1).join(' ') || '',
            // Add a flag to indicate this is a customer creation, not admin
            customer_creation: true
          }
        }
      });

      if (signUpError) {
        console.error('Auth signup error:', signUpError);
        
        if (signUpError.message.includes('already registered') || 
            signUpError.message.includes('already exists')) {
          setError(`User with email ${formData.email} already exists. Please try a different email or contact support.`);
        } else {
          throw new Error('Failed to create user account: ' + signUpError.message);
        }
        return;
      }

      if (signUpData.user) {
        console.log('New user created, customer record should be created by trigger');
        setMessage('Customer created successfully! A temporary password has been set - the user should reset their password.');
        setFormData({ fullName: '', email: '' });
        
        toast({
          title: "Success!",
          description: "Customer created successfully with temporary password.",
        });
      }

    } catch (err) {
      console.error('Unexpected error:', err);
      setError(err.message || 'Failed to create customer');
      
      toast({
        title: "Error",
        description: err.message || 'Failed to create customer',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Create Customer</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:<br />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </label>
        <br /><br />
        <label>
          Email:<br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </label>
        <br /><br />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
