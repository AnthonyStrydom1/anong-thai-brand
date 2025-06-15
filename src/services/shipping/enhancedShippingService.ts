
import { courierGuyAPI, CourierGuyQuoteRequest, CourierGuyShipmentRequest } from './courierGuyService';
import { ShippingRate, ShippingAddress } from '../shippingService';

export interface EnhancedShippingAddress extends ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
}

export interface ShipmentDetails {
  orderId: string;
  orderNumber: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  declaredValue: number;
  specialInstructions?: string;
}

export class EnhancedShippingService {
  private defaultCollectionAddress = {
    street_address: "123 Business Street", // Replace with your actual address
    suburb: "Business Park",
    city: "Johannesburg",
    postal_code: "2000",
    province: "Gauteng"
  };

  async getShippingRates(
    deliveryAddress: EnhancedShippingAddress, 
    weight: number = 1,
    dimensions = { length: 30, width: 20, height: 15 }
  ): Promise<ShippingRate[]> {
    
    const quoteRequest: CourierGuyQuoteRequest = {
      collection_address: this.defaultCollectionAddress,
      delivery_address: {
        street_address: deliveryAddress.address,
        suburb: "", // Could be extracted from address
        city: deliveryAddress.city,
        postal_code: deliveryAddress.postalCode,
        province: this.getProvinceFromPostalCode(deliveryAddress.postalCode)
      },
      parcel_details: {
        submitted_length_cm: dimensions.length,
        submitted_width_cm: dimensions.width,
        submitted_height_cm: dimensions.height,
        submitted_weight_kg: weight
      },
      declared_value: 1000 // Default declared value, should be actual order value
    };

    return await courierGuyAPI.getShippingQuote(quoteRequest);
  }

  async createShipment(
    deliveryAddress: EnhancedShippingAddress,
    shipmentDetails: ShipmentDetails,
    selectedService: string
  ) {
    const shipmentRequest: CourierGuyShipmentRequest = {
      collection_address: this.defaultCollectionAddress,
      delivery_address: {
        street_address: deliveryAddress.address,
        suburb: "",
        city: deliveryAddress.city,
        postal_code: deliveryAddress.postalCode,
        province: this.getProvinceFromPostalCode(deliveryAddress.postalCode)
      },
      parcel_details: {
        submitted_length_cm: shipmentDetails.dimensions.length,
        submitted_width_cm: shipmentDetails.dimensions.width,
        submitted_height_cm: shipmentDetails.dimensions.height,
        submitted_weight_kg: shipmentDetails.weight
      },
      declared_value: shipmentDetails.declaredValue,
      service_type: selectedService,
      collection_time: "09:00", // Default collection time
      special_instructions: shipmentDetails.specialInstructions,
      reference: shipmentDetails.orderNumber
    };

    const waybill = await courierGuyAPI.createShipment(shipmentRequest);
    
    if (waybill) {
      console.log('✅ Shipment created successfully:', waybill);
      return {
        success: true,
        waybillNumber: waybill.waybill_number,
        trackingUrl: waybill.tracking_url,
        estimatedDelivery: waybill.estimated_delivery_date
      };
    } else {
      console.log('ℹ️ Manual shipment creation required');
      return {
        success: false,
        requiresManualCreation: true,
        message: 'Shipment will need to be created manually with Courier Guy'
      };
    }
  }

  async trackShipment(waybillNumber: string) {
    return await courierGuyAPI.trackShipment(waybillNumber);
  }

  private getProvinceFromPostalCode(postalCode: string): string {
    const code = parseInt(postalCode);
    
    if (code >= 1000 && code <= 2999) return 'Gauteng';
    if (code >= 3000 && code <= 4999) return 'KwaZulu-Natal';
    if (code >= 5000 && code <= 6999) return 'Free State';
    if (code >= 7000 && code <= 8999) return 'Western Cape';
    if (code >= 9000 && code <= 9999) return 'Northern Cape';
    
    return 'Gauteng'; // Default
  }

  isApiIntegrationEnabled(): boolean {
    return courierGuyAPI.isApiEnabled();
  }

  generateTrackingUrl(trackingNumber: string): string {
    return courierGuyAPI.generateTrackingUrl(trackingNumber);
  }
}

export const enhancedShippingService = new EnhancedShippingService();
