
interface PayFastCredentials {
  merchantId: string;
  merchantKey: string;
  passphrase?: string;
  sandbox: boolean;
}

interface PayFastPaymentRequest {
  merchantId: string;
  merchantKey: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  amount: number;
  itemName: string;
  itemDescription?: string;
  orderNumber: string;
  customerEmail: string;
  customerFirstName?: string;
  customerLastName?: string;
}

interface PayFastPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  paymentId?: string;
  error?: string;
  requiresManualProcessing?: boolean;
}

export class PayFastService {
  private credentials: PayFastCredentials | null = null;

  constructor() {
    // In production, these would come from Supabase secrets
    this.loadCredentials();
  }

  private loadCredentials() {
    // For now, return null - will be populated when API credentials are added
    this.credentials = null;
  }

  public isApiIntegrationEnabled(): boolean {
    return this.credentials !== null && 
           this.credentials.merchantId !== '' && 
           this.credentials.merchantKey !== '';
  }

  public async createPayment(request: PayFastPaymentRequest): Promise<PayFastPaymentResponse> {
    console.log('🏦 PayFast: Creating payment for order', request.orderNumber);

    if (!this.isApiIntegrationEnabled()) {
      console.log('⚠️ PayFast API not configured, using manual processing');
      return {
        success: true,
        requiresManualProcessing: true,
        paymentId: `MANUAL_${request.orderNumber}_${Date.now()}`
      };
    }

    try {
      // When API is enabled, this would create actual PayFast payment
      const paymentData = this.buildPaymentData(request);
      const paymentUrl = this.generatePaymentUrl(paymentData);

      console.log('✅ PayFast payment created:', paymentUrl);

      return {
        success: true,
        paymentUrl,
        paymentId: paymentData.m_payment_id
      };
    } catch (error) {
      console.error('❌ PayFast payment creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed',
        requiresManualProcessing: true
      };
    }
  }

  private buildPaymentData(request: PayFastPaymentRequest) {
    if (!this.credentials) {
      throw new Error('PayFast credentials not configured');
    }

    const paymentData = {
      merchant_id: this.credentials.merchantId,
      merchant_key: this.credentials.merchantKey,
      return_url: request.returnUrl,
      cancel_url: request.cancelUrl,
      notify_url: request.notifyUrl,
      amount: request.amount.toFixed(2),
      item_name: request.itemName,
      item_description: request.itemDescription || '',
      m_payment_id: request.orderNumber,
      email_address: request.customerEmail,
      name_first: request.customerFirstName || '',
      name_last: request.customerLastName || ''
    };

    // Add signature when API is fully implemented
    return paymentData;
  }

  private generatePaymentUrl(paymentData: any): string {
    const baseUrl = this.credentials?.sandbox 
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';

    const queryString = new URLSearchParams(paymentData).toString();
    return `${baseUrl}?${queryString}`;
  }

  public async verifyPayment(paymentId: string, pfData: any): Promise<boolean> {
    console.log('🔍 PayFast: Verifying payment', paymentId);

    if (!this.isApiIntegrationEnabled()) {
      console.log('⚠️ PayFast API not configured, manual verification required');
      return false;
    }

    try {
      // When API is enabled, this would verify the payment with PayFast
      // For now, return true for testing
      return true;
    } catch (error) {
      console.error('❌ PayFast payment verification failed:', error);
      return false;
    }
  }

  public generatePaymentReference(orderNumber: string): string {
    return `PAY-${orderNumber}-${Date.now()}`;
  }

  public getPaymentMethods(): Array<{id: string, name: string, description: string}> {
    return [
      {
        id: 'eft',
        name: 'EFT/Bank Transfer',
        description: 'Direct bank transfer - manual processing'
      },
      {
        id: 'payfast_card',
        name: 'Credit/Debit Card',
        description: this.isApiIntegrationEnabled() 
          ? 'Secure card payment via PayFast' 
          : 'Card payment - requires PayFast integration'
      },
      {
        id: 'payfast_eft',
        name: 'PayFast EFT',
        description: this.isApiIntegrationEnabled()
          ? 'Instant EFT via PayFast'
          : 'Instant EFT - requires PayFast integration'
      }
    ];
  }
}

export const payFastService = new PayFastService();
