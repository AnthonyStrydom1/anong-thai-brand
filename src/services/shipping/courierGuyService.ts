
import { ShippingRate, ShippingAddress } from '../shippingService';

export interface CourierGuyQuoteRequest {
  collection_address: {
    street_address: string;
    suburb: string;
    city: string;
    postal_code: string;
    province: string;
  };
  delivery_address: {
    street_address: string;
    suburb: string;
    city: string;
    postal_code: string;
    province: string;
  };
  parcel_details: {
    submitted_length_cm: number;
    submitted_width_cm: number;
    submitted_height_cm: number;
    submitted_weight_kg: number;
  };
  declared_value: number;
}

export interface CourierGuyShipmentRequest {
  collection_address: CourierGuyQuoteRequest['collection_address'];
  delivery_address: CourierGuyQuoteRequest['delivery_address'];
  parcel_details: CourierGuyQuoteRequest['parcel_details'];
  declared_value: number;
  service_type: string;
  collection_time: string;
  special_instructions?: string;
  reference?: string;
}

export interface CourierGuyWaybill {
  waybill_number: string;
  tracking_url: string;
  collection_date: string;
  estimated_delivery_date: string;
  service_type: string;
}

export class CourierGuyAPIService {
  private apiUrl = 'https://api.thecourierguy.co.za';
  private isEnabled = false; // Will be true when API credentials are available

  constructor() {
    // Check if API credentials are available
    this.checkApiAvailability();
  }

  private checkApiAvailability() {
    // This would check for API credentials in environment variables
    // For now, we'll simulate the check
    this.isEnabled = false; // Set to true when you have API credentials
  }

  async getShippingQuote(request: CourierGuyQuoteRequest): Promise<ShippingRate[]> {
    if (!this.isEnabled) {
      // Fall back to estimated rates when API is not available
      return this.getEstimatedRates(request.delivery_address, request.parcel_details.submitted_weight_kg);
    }

    try {
      // This would be the actual API call
      /*
      const response = await fetch(`${this.apiUrl}/v3/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return this.mapApiQuotesToRates(data);
      */
      
      return this.getEstimatedRates(request.delivery_address, request.parcel_details.submitted_weight_kg);
    } catch (error) {
      console.error('Courier Guy API error:', error);
      // Fall back to estimated rates on API failure
      return this.getEstimatedRates(request.delivery_address, request.parcel_details.submitted_weight_kg);
    }
  }

  async createShipment(request: CourierGuyShipmentRequest): Promise<CourierGuyWaybill | null> {
    if (!this.isEnabled) {
      console.log('Courier Guy API not available - shipment would need to be created manually');
      return null;
    }

    try {
      // This would be the actual API call
      /*
      const response = await fetch(`${this.apiUrl}/v3/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return {
        waybill_number: data.waybill_number,
        tracking_url: data.tracking_url,
        collection_date: data.collection_date,
        estimated_delivery_date: data.estimated_delivery_date,
        service_type: request.service_type,
      };
      */
      
      return null;
    } catch (error) {
      console.error('Courier Guy shipment creation error:', error);
      return null;
    }
  }

  async trackShipment(waybillNumber: string): Promise<any> {
    if (!this.isEnabled) {
      return null;
    }

    try {
      // This would be the actual API call
      /*
      const response = await fetch(`${this.apiUrl}/v3/tracking/${waybillNumber}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
      });

      return await response.json();
      */
      
      return null;
    } catch (error) {
      console.error('Courier Guy tracking error:', error);
      return null;
    }
  }

  private getEstimatedRates(deliveryAddress: any, weight: number): ShippingRate[] {
    const zone = this.determineShippingZone(deliveryAddress.postal_code);
    
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

    return services.map(serviceOption => {
      const baseCost = serviceOption.baseCost[zone];
      const estimatedDays = serviceOption.days[zone];
      const weightSurcharge = weight > 2 ? (weight - 2) * 15 : 0;
      
      return {
        service: serviceOption.service,
        cost: baseCost + weightSurcharge,
        estimatedDays: estimatedDays,
        description: serviceOption.description
      };
    }).sort((a, b) => a.cost - b.cost);
  }

  private determineShippingZone(postalCode: string): 'local' | 'regional' | 'national' {
    const code = parseInt(postalCode);
    
    if (code >= 2000 && code <= 2199) return 'local'; // Johannesburg
    if (code >= 8000 && code <= 8099) return 'local'; // Cape Town
    if (code >= 4000 && code <= 4099) return 'local'; // Durban
    if (code >= 1 && code <= 1999) return 'regional'; // Pretoria area
    
    return 'national';
  }

  generateTrackingUrl(trackingNumber: string): string {
    return `https://www.thecourierguy.co.za/track-and-trace?tracking_number=${trackingNumber}`;
  }

  isApiEnabled(): boolean {
    return this.isEnabled;
  }
}

export const courierGuyAPI = new CourierGuyAPIService();
