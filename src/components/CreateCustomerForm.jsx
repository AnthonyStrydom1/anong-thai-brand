import React, { useState } from 'react';

const BACKEND_URL = 'https://anong-thai-brand.onrender.com'; // your deployed backend URL

export default function CreateCustomerForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

    try {
      const response = await fetch(`${BACKEND_URL}/create-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create customer');
      } else {
        setMessage('Customer created successfully!');
        setFormData({ fullName: '', email: '' }); // reset form
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
          />
        </label>
        <br /><br />
        <button type="submit">Create</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
