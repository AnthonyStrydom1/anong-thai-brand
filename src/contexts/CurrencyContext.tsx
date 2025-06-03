
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate from ZAR (how much 1 ZAR equals in this currency)
}

interface CurrencyContextType {
  currencies: Currency[];
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  convertPrice: (zarPrice: number) => number;
  formatPrice: (zarPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Major currencies with current rates from ZAR (South African Rand)
// Updated rates based on current exchange rates (June 2024)
const CURRENCIES: Currency[] = [
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1/17.87 }, // 1 USD = 17.87 ZAR, so 1 ZAR = 1/17.87 USD
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 1/19.3 }, // Approximate current rate
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 1/22.5 }, // Approximate current rate
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 10.1 }, // Approximate current rate
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1/11.9 }, // Approximate current rate
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1/13.1 }, // Approximate current rate
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 1/19.8 }, // Approximate current rate
];

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);

  useEffect(() => {
    const saved = localStorage.getItem('anong-currency');
    if (saved) {
      const currency = CURRENCIES.find(c => c.code === saved);
      if (currency) {
        setSelectedCurrency(currency);
      }
    }
  }, []);

  const handleSetCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('anong-currency', currency.code);
  };

  const convertPrice = (zarPrice: number): number => {
    // If ZAR, return as-is
    if (selectedCurrency.code === 'ZAR') {
      return zarPrice;
    }
    // Convert from ZAR to target currency
    return zarPrice * selectedCurrency.rate;
  };

  const formatPrice = (zarPrice: number): string => {
    const convertedPrice = convertPrice(zarPrice);
    
    // Special formatting for JPY (no decimals)
    if (selectedCurrency.code === 'JPY') {
      return `${selectedCurrency.symbol}${Math.round(convertedPrice)}`;
    }
    
    return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currencies: CURRENCIES,
      selectedCurrency,
      setSelectedCurrency: handleSetCurrency,
      convertPrice,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
