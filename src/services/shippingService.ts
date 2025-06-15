
// Legacy shipping service - kept for backward compatibility
// Enhanced version available in shipping/enhancedShippingService.ts

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
  // Courier Guy rate calculator with multiple service options
  calculateShipping(address: ShippingAddress, totalWeight: number = 1): ShippingRate[] {
    const { city, postalCode } = address;
    
    // Determine shipping zone based on postal code
    const zone = this.determineShippingZone(postalCode);
    
    // Base rates for different Courier Guy services
    const services = [
      {
        service: 'courier_guy_overnight',
        description: 'Overnight Express',
        baseCost: { local: 85, regional: 110, national: 150 },
        days: { local: 1, regional: 1, national: 2 }
      },
      {
        service: 'courier_guy_express',
        description: 'Express Delivery',
        baseCost: { local: 65, regional: 85, national: 120 },
        days: { local: 1, regional: 2, national: 3 }
      },
      {
        service: 'courier_guy_standard',
        description: 'Standard Delivery',
        baseCost: { local: 45, regional: 65, national: 95 },
        days: { local: 2, regional: 3, national: 5 }
      }
    ];

    // Calculate rates for all services
    return services.map(serviceOption => {
      const baseCost = serviceOption.baseCost[zone];
      const estimatedDays = serviceOption.days[zone];
      
      // Add weight-based surcharge for heavier items
      const weightSurcharge = totalWeight > 2 ? (totalWeight - 2) * 15 : 0;
      
      return {
        service: serviceOption.service,
        cost: baseCost + weightSurcharge,
        estimatedDays: estimatedDays,
        description: serviceOption.description
      };
    }).sort((a, b) => a.cost - b.cost); // Sort by price, cheapest first
  }

  private determineShippingZone(postalCode: string): 'local' | 'regional' | 'national' {
    const code = parseInt(postalCode);
    
    // Major cities (simplified postal code ranges)
    if (code >= 2000 && code <= 2199) return 'local'; // Johannesburg
    if (code >= 8000 && code <= 8099) return 'local'; // Cape Town
    if (code >= 4000 && code <= 4099) return 'local'; // Durban
    if (code >= 1 && code <= 1999) return 'regional'; // Pretoria area
    
    return 'national'; // Other areas
  }

  generateTrackingUrl(trackingNumber: string): string {
    return `https://www.thecourierguy.co.za/track-and-trace?tracking_number=${trackingNumber}`;
  }
}

export const shippingService = new ShippingService();
