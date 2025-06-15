
import { useState } from 'react';
import { enhancedPaymentService } from '@/services/payments/enhancedPaymentService';
import { toast } from '@/hooks/use-toast';

export const usePaymentProcessing = () => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const processPayment = async (paymentData: {
    orderNumber: string;
    amount: number;
    customerEmail: string;
    customerName: string;
    paymentMethod: string;
  }) => {
    setIsProcessingPayment(true);
    
    try {
      const result = await enhancedPaymentService.processPayment(paymentData);
      
      if (result.success) {
        if (result.paymentUrl) {
          // Redirect to PayFast payment page
          window.open(result.paymentUrl, '_blank');
          
          toast({
            title: "Payment Processing",
            description: "Redirected to secure payment page",
          });
        } else if (result.requiresManualProcessing) {
          toast({
            title: "Payment Instructions Sent",
            description: "Please check your email for payment details",
          });
        }
        
        return {
          success: true,
          paymentId: result.paymentId,
          requiresManualProcessing: result.requiresManualProcessing
        };
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || "Unable to process payment",
          variant: "destructive"
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment processing",
        variant: "destructive"
      });
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getPaymentMethods = () => {
    return enhancedPaymentService.getAvailablePaymentMethods();
  };

  const getPaymentStatus = () => {
    return enhancedPaymentService.getPaymentStatus();
  };

  return {
    processPayment,
    isProcessingPayment,
    getPaymentMethods,
    getPaymentStatus
  };
};
