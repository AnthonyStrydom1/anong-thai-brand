const updateCustomer = async () => {
  const response = await fetch('/api/update-customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'customer-id-123',  // replace with actual customer id
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '1234567890',
    }),
  });

  const data = await response.json();

  if (response.ok) {
    alert(data.message);
  } else {
    console.error('Error:', data.message);
  }
};
