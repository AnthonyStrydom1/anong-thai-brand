import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // relative path


function UpdateCustomerForm({ customerId }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from('customers')
      .update({ name, email, phone })
      .eq('id', customerId);

    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      alert('Customer updated!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
      <button type="submit">Update</button>
    </form>
  );
}

export default UpdateCustomerForm;
