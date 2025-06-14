
// VAT calculation utilities for South African 15% VAT
const VAT_RATE = 0.15;

export interface VATBreakdown {
  priceIncludingVAT: number;
  priceExcludingVAT: number;
  vatAmount: number;
}

export class VATCalculator {
  // Calculate VAT breakdown from VAT-inclusive price
  static calculateFromInclusivePrice(inclusivePrice: number): VATBreakdown {
    const priceExcludingVAT = inclusivePrice / (1 + VAT_RATE);
    const vatAmount = inclusivePrice - priceExcludingVAT;
    
    return {
      priceIncludingVAT: inclusivePrice,
      priceExcludingVAT: Number(priceExcludingVAT.toFixed(2)),
      vatAmount: Number(vatAmount.toFixed(2))
    };
  }

  // Calculate order totals with VAT breakdown
  static calculateOrderTotals(items: Array<{ price: number; quantity: number }>, shippingCost: number = 0) {
    let totalVATAmount = 0;
    let totalExcludingVAT = 0;
    let totalIncludingVAT = 0;

    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const breakdown = this.calculateFromInclusivePrice(itemTotal);
      totalVATAmount += breakdown.vatAmount;
      totalExcludingVAT += breakdown.priceExcludingVAT;
      totalIncludingVAT += breakdown.priceIncludingVAT;
    });

    // Shipping is VAT inclusive too
    const shippingBreakdown = this.calculateFromInclusivePrice(shippingCost);

    return {
      subtotal: Number(totalExcludingVAT.toFixed(2)),
      vatAmount: Number((totalVATAmount + shippingBreakdown.vatAmount).toFixed(2)),
      shippingAmount: Number(shippingCost.toFixed(2)),
      totalAmount: Number((totalIncludingVAT + shippingCost).toFixed(2))
    };
  }
}
