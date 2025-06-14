
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { enhancedSecurityService } from '../services/enhancedSecurityService';
import { useSecurityAudit } from '../hooks/useSecurityAudit';

interface UpdateCustomerFormProps {
  customerId: string;
}

function UpdateCustomerForm({ customerId }: UpdateCustomerFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logSecurityEvent } = useSecurityAudit();

  const validateAndSanitizeInput = (field: string, value: string) => {
    // Clear previous error
    setValidationErrors(prev => ({ ...prev, [field]: '' }));

    // Sanitize input
    const sanitized = enhancedSecurityService.sanitizeInput(value, {
      maxLength: field === 'name' ? 100 : field === 'email' ? 254 : 20,
      stripScripts: true
    });

    // Validate email specifically
    if (field === 'email') {
      const emailValidation = enhancedSecurityService.validateEmail(sanitized);
      if (!emailValidation.isValid) {
        setValidationErrors(prev => ({ ...prev, email: emailValidation.message }));
        return value; // Return original to show user what they typed
      }
    }

    // Check for SQL injection
    const sqlValidation = enhancedSecurityService.containsSqlInjection(sanitized);
    if (!sqlValidation.isValid) {
      setValidationErrors(prev => ({ ...prev, [field]: 'Invalid characters detected' }));
      logSecurityEvent('sql_injection_attempt', 'customer_update', customerId, {
        field,
        suspiciousValue: value.substring(0, 50)
      }, false);
      return value; // Return original to show user what they typed
    }

    return sanitized;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting
    if (!enhancedSecurityService.checkRateLimit('customer_update', {
      maxRequests: 5,
      windowMs: 300000 // 5 minutes
    })) {
      alert('Too many update requests. Please wait before trying again.');
      return;
    }

    // Validate all fields
    const hasErrors = Object.values(validationErrors).some(error => error !== '');
    if (hasErrors) {
      alert('Please fix validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Final validation
      const nameValidation = enhancedSecurityService.containsSqlInjection(name);
      const emailValidation = enhancedSecurityService.validateEmail(email);
      const phoneValidation = enhancedSecurityService.containsSqlInjection(phone);

      if (!nameValidation.isValid || !emailValidation.isValid || !phoneValidation.isValid) {
        throw new Error('Invalid input detected');
      }

      const { error } = await supabase
        .from('customers')
        .update({ 
          fullname: name, 
          email: email, 
          phone: phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId);

      if (error) {
        await logSecurityEvent('customer_update_failed', 'customer', customerId, {
          error: error.message
        }, false);
        throw error;
      }

      await logSecurityEvent('customer_updated', 'customer', customerId, {
        fieldsUpdated: ['name', 'email', 'phone']
      });

      alert('Customer updated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      alert('Update failed: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <input 
          value={name} 
          onChange={e => setName(validateAndSanitizeInput('name', e.target.value))} 
          placeholder="Name" 
          required
          maxLength={100}
          className={`w-full p-2 border rounded ${validationErrors.name ? 'border-red-500' : 'border-gray-300'}`}
          disabled={isSubmitting}
        />
        {validationErrors.name && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
        )}
      </div>
      
      <div>
        <input 
          value={email} 
          onChange={e => setEmail(validateAndSanitizeInput('email', e.target.value))} 
          placeholder="Email" 
          type="email"
          required
          maxLength={254}
          className={`w-full p-2 border rounded ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
          disabled={isSubmitting}
        />
        {validationErrors.email && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
        )}
      </div>
      
      <div>
        <input 
          value={phone} 
          onChange={e => setPhone(validateAndSanitizeInput('phone', e.target.value))} 
          placeholder="Phone" 
          type="tel"
          maxLength={20}
          className={`w-full p-2 border rounded ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
          disabled={isSubmitting}
        />
        {validationErrors.phone && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Updating...' : 'Update'}
      </button>
    </form>
  );
}

export default UpdateCustomerForm;
