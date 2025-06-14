
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
              onChange={onInputChange}
              className="anong-input"
            />
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
                onChange={onInputChange}
                className="anong-input"
              />
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
                onChange={onInputChange}
                className="anong-input"
              />
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
              onChange={onInputChange}
              className="anong-input"
            />
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
                onChange={onInputChange}
                className="anong-input"
              />
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
                onChange={onInputChange}
                className="anong-input"
              />
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
              onChange={onInputChange}
              className="anong-input"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
