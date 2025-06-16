
import { payFastService } from './payFastService';

interface PaymentRequest {
  orderNumber: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  paymentMethod: string;
  returnUrl?: string;
  cancelUrl?: string;
}

interface PaymentResult {
  success: boolean;
  paymentUrl?: string;
  paymentId?: string;
  requiresManualProcessing?: boolean;
  paymentInstructions?: string;
  error?: string;
}

export class EnhancedPaymentService {
  public async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    console.log('💳 Processing payment:', request.paymentMethod, 'for order', request.orderNumber);

    switch (request.paymentMethod) {
      case 'eft':
        return this.processEftPayment(request);
      
      case 'payfast_card':
      case 'payfast_eft':
        return this.processPayFastPayment(request);
      
      default:
        return {
          success: false,
          error: 'Unsupported payment method'
        };
    }
  }

  private async processEftPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Manual EFT processing - same as current implementation
    return {
      success: true,
      requiresManualProcessing: true,
      paymentId: `EFT_${request.orderNumber}`,
      paymentInstructions: `
        Please transfer R${request.amount.toFixed(2)} to:
        Bank: Standard Bank
        Account: Anong Thai Brand
        Account Number: 123456789
        Branch Code: 051001
        Reference: ${request.orderNumber}
      `
    };
  }

  private async processPayFastPayment(request: PaymentRequest): Promise<PaymentResult> {
    const payFastRequest = {
      merchantId: '', // Will be populated from credentials
      merchantKey: '', // Will be populated from credentials
      returnUrl: request.returnUrl || `${window.location.origin}/checkout/success`,
      cancelUrl: request.cancelUrl || `${window.location.origin}/checkout/cancel`,
      notifyUrl: `${window.location.origin}/api/payfast/notify`, // Webhook endpoint
      amount: request.amount,
      itemName: `Order ${request.orderNumber}`,
      itemDescription: `Payment for order ${request.orderNumber}`,
      orderNumber: request.orderNumber,
      customerEmail: request.customerEmail,
      customerFirstName: request.customerName.split(' ')[0],
      customerLastName: request.customerName.split(' ').slice(1).join(' ')
    };

    return await payFastService.createPayment(payFastRequest);
  }

  public getAvailablePaymentMethods() {
    return payFastService.getPaymentMethods();
  }

  public isPaymentGatewayEnabled(): boolean {
    return payFastService.isApiIntegrationEnabled();
  }

  public getPaymentStatus() {
    const isEnabled = this.isPaymentGatewayEnabled();
    
    return {
      isEnabled,
      gateway: 'PayFast',
      message: isEnabled 
        ? "PayFast integration active - accepting card and instant EFT payments"
        : "Manual payment processing - PayFast integration available"
    };
  }
}

export const enhancedPaymentService = new EnhancedPaymentService();
