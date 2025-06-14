
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enhancedSecurityService } from "@/services/enhancedSecurityService";
import { useState } from "react";

interface ContactInfoFormProps {
  formData: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  translations: {
    contactInfo: string;
    email: string;
    shippingAddress: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
}

export const ContactInfoForm = ({ formData, onInputChange, translations }: ContactInfoFormProps) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSecureInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear previous validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Sanitize input
    const sanitizedValue = enhancedSecurityService.sanitizeInput(value, {
      maxLength: name === 'address' ? 200 : 100,
      stripScripts: true
    });

    // Validate specific fields
    if (name === 'email') {
      const emailValidation = enhancedSecurityService.validateEmail(sanitizedValue);
      if (!emailValidation.isValid) {
        setValidationErrors(prev => ({ ...prev, email: emailValidation.message }));
      }
    }

    // Check for SQL injection patterns
    const sqlValidation = enhancedSecurityService.containsSqlInjection(sanitizedValue);
    if (!sqlValidation.isValid) {
      setValidationErrors(prev => ({ ...prev, [name]: 'Invalid characters detected' }));
      return; // Don't update if contains suspicious content
    }

    // Create sanitized event
    const sanitizedEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue
      }
    };

    onInputChange(sanitizedEvent as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <>
      {/* Contact Information */}
      <Card className="anong-card">
        <CardHeader>
          <CardTitle className="anong-subheading text-xl text-anong-black">
            {translations.contactInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email" className="anong-body text-anong-black">
              {translations.email}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleSecureInputChange}
              className={`anong-input ${validationErrors.email ? 'border-red-500' : ''}`}
              maxLength={254}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="anong-card">
        <CardHeader>
          <CardTitle className="anong-subheading text-xl text-anong-black">
            {translations.shippingAddress}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="anong-body text-anong-black">
                {translations.firstName}
              </Label>
              <Input
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleSecureInputChange}
                className={`anong-input ${validationErrors.firstName ? 'border-red-500' : ''}`}
                maxLength={50}
              />
              {validationErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" className="anong-body text-anong-black">
                {translations.lastName}
              </Label>
              <Input
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleSecureInputChange}
                className={`anong-input ${validationErrors.lastName ? 'border-red-500' : ''}`}
                maxLength={50}
              />
              {validationErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="address" className="anong-body text-anong-black">
              {translations.address}
            </Label>
            <Input
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleSecureInputChange}
              className={`anong-input ${validationErrors.address ? 'border-red-500' : ''}`}
              maxLength={200}
            />
            {validationErrors.address && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="anong-body text-anong-black">
                {translations.city}
              </Label>
              <Input
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleSecureInputChange}
                className={`anong-input ${validationErrors.city ? 'border-red-500' : ''}`}
                maxLength={100}
              />
              {validationErrors.city && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
              )}
            </div>
            <div>
              <Label htmlFor="postalCode" className="anong-body text-anong-black">
                {translations.postalCode}
              </Label>
              <Input
                id="postalCode"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleSecureInputChange}
                className={`anong-input ${validationErrors.postalCode ? 'border-red-500' : ''}`}
                maxLength={20}
              />
              {validationErrors.postalCode && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.postalCode}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone" className="anong-body text-anong-black">
              {translations.phone}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleSecureInputChange}
              className={`anong-input ${validationErrors.phone ? 'border-red-500' : ''}`}
              maxLength={20}
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
