
// VAT calculation utilities for South African 15% VAT
// All product prices in our system are VAT-inclusive
const VAT_RATE = 0.15;

export interface VATBreakdown {
  priceIncludingVAT: number;
  priceExcludingVAT: number;
  vatAmount: number;
}

export class VATCalculator {
  // Calculate VAT breakdown from VAT-inclusive price
  // This is our main method since all our product prices are VAT-inclusive
  static calculateFromInclusivePrice(inclusivePrice: number): VATBreakdown {
    const priceExcludingVAT = inclusivePrice / (1 + VAT_RATE);
    const vatAmount = inclusivePrice - priceExcludingVAT;
    
    return {
      priceIncludingVAT: inclusivePrice,
      priceExcludingVAT: Number(priceExcludingVAT.toFixed(2)),
      vatAmount: Number(vatAmount.toFixed(2))
    };
  }

  // Calculate VAT breakdown from VAT-exclusive price (for reference)
  static calculateFromExclusivePrice(exclusivePrice: number): VATBreakdown {
    const vatAmount = exclusivePrice * VAT_RATE;
    const priceIncludingVAT = exclusivePrice + vatAmount;
    
    return {
      priceIncludingVAT: Number(priceIncludingVAT.toFixed(2)),
      priceExcludingVAT: exclusivePrice,
      vatAmount: Number(vatAmount.toFixed(2))
    };
  }

  // Calculate order totals with VAT breakdown
  // Since all our prices are VAT-inclusive, we extract VAT from the inclusive prices
  static calculateOrderTotals(items: Array<{ price: number; quantity: number }>, shippingCost: number = 0) {
    let totalVATAmount = 0;
    let totalExcludingVAT = 0;
    let totalIncludingVAT = 0;

    // Process each item (prices are VAT-inclusive)
    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const breakdown = this.calculateFromInclusivePrice(itemTotal);
      totalVATAmount += breakdown.vatAmount;
      totalExcludingVAT += breakdown.priceExcludingVAT;
      totalIncludingVAT += breakdown.priceIncludingVAT;
    });

    // Shipping is also VAT-inclusive if provided
    const shippingBreakdown = this.calculateFromInclusivePrice(shippingCost);

    return {
      subtotal: Number(totalExcludingVAT.toFixed(2)),
      vatAmount: Number((totalVATAmount + shippingBreakdown.vatAmount).toFixed(2)),
      shippingAmount: Number(shippingCost.toFixed(2)),
      shippingExclVAT: Number(shippingBreakdown.priceExcludingVAT.toFixed(2)),
      shippingVAT: Number(shippingBreakdown.vatAmount.toFixed(2)),
      totalAmount: Number((totalIncludingVAT + shippingCost).toFixed(2)),
      totalExclVAT: Number((totalExcludingVAT + shippingBreakdown.priceExcludingVAT).toFixed(2))
    };
  }

  // Get current VAT rate as percentage
  static getVATRate(): number {
    return VAT_RATE * 100; // Return as percentage (15)
  }

  // Check if price includes VAT (helper method)
  static isPriceVATInclusive(): boolean {
    return true; // All our prices are VAT-inclusive
  }
}
