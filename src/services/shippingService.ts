
// Courier Guy shipping service
export interface ShippingRate {
  service: string;
  cost: number;
  estimatedDays: number;
  description: string;
}

export interface ShippingAddress {
  city: string;
  postalCode: string;
}

export class ShippingService {
  // Courier Guy rate calculator (simplified - in production you'd use their API)
  calculateShipping(address: ShippingAddress, totalWeight: number = 1): ShippingRate[] {
    const { city, postalCode } = address;
    
    // Basic shipping rates based on location (these would come from Courier Guy API)
    const baseRates = {
      local: { cost: 65, days: 1, description: "Overnight Express" },
      regional: { cost: 85, days: 2, description: "2-Day Express" },
      national: { cost: 120, days: 3, description: "3-Day Standard" }
    };

    // Determine shipping zone based on postal code (simplified logic)
    const zone = this.determineShippingZone(postalCode);
    const rate = baseRates[zone];

    // Add weight-based surcharge for heavier items
    const weightSurcharge = totalWeight > 2 ? (totalWeight - 2) * 15 : 0;

    return [{
      service: 'courier_guy',
      cost: rate.cost + weightSurcharge,
      estimatedDays: rate.days,
      description: rate.description
    }];
  }

  private determineShippingZone(postalCode: string): 'local' | 'regional' | 'national' {
    const code = parseInt(postalCode);
    
    // Major cities (simplified postal code ranges)
    if (code >= 2000 && code <= 2199) return 'local'; // Johannesburg
    if (code >= 8000 && code <= 8099) return 'local'; // Cape Town
    if (code >= 4000 && code <= 4099) return 'local'; // Durban
    if (code >= 0000 && code <= 1999) return 'regional'; // Pretoria area
    
    return 'national'; // Other areas
  }

  generateTrackingUrl(trackingNumber: string): string {
    return `https://www.thecourierguy.co.za/track-and-trace?tracking_number=${trackingNumber}`;
  }
}

export const shippingService = new ShippingService();
