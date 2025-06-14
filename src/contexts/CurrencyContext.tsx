import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchExchangeRates } from '@/services/currencyService';

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
  isLoading: boolean;
  lastUpdated: Date | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Base currency configuration
const CURRENCY_CONFIG = [
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
];

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with ZAR as default, override with saved preference later
  const zarCurrency = { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 1 };
  
  const [currencies, setCurrencies] = useState<Currency[]>([zarCurrency]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(zarCurrency);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load exchange rates
  useEffect(() => {
    const loadExchangeRates = async () => {
      setIsLoading(true);
      try {
        console.log('Loading exchange rates...');
        const rates = await fetchExchangeRates('ZAR');
        console.log('Exchange rates loaded:', rates);
        
        const updatedCurrencies = CURRENCY_CONFIG.map(config => ({
          ...config,
          rate: config.code === 'ZAR' ? 1 : rates[config.code] || 1
        }));
        
        setCurrencies(updatedCurrencies);
        setLastUpdated(new Date());
        
        // Check for saved currency preference
        const saved = localStorage.getItem('anong-currency');
        if (saved) {
          const savedCurrency = updatedCurrencies.find(c => c.code === saved);
          if (savedCurrency) {
            console.log('Setting saved currency:', savedCurrency);
            setSelectedCurrency(savedCurrency);
          }
        } else {
          // Ensure ZAR is selected by default
          const zarCurrency = updatedCurrencies.find(c => c.code === 'ZAR');
          if (zarCurrency) {
            console.log('Setting default ZAR currency:', zarCurrency);
            setSelectedCurrency(zarCurrency);
          }
        }
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
        // Keep ZAR as default even if rates fail to load
        setSelectedCurrency(zarCurrency);
      } finally {
        setIsLoading(false);
      }
    };

    loadExchangeRates();
    
    // Update rates every 30 minutes
    const interval = setInterval(loadExchangeRates, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSetCurrency = (currency: Currency) => {
    console.log('Currency changed to:', currency);
    setSelectedCurrency(currency);
    localStorage.setItem('anong-currency', currency.code);
  };

  const convertPrice = (zarPrice: number): number => {
    if (!selectedCurrency || selectedCurrency.code === 'ZAR') {
      return zarPrice;
    }
    return zarPrice * selectedCurrency.rate;
  };

  const formatPrice = (zarPrice: number): string => {
    if (!selectedCurrency) return `R${zarPrice.toFixed(2)}`;
    
    const convertedPrice = convertPrice(zarPrice);
    
    // Special formatting for JPY (no decimals)
    if (selectedCurrency.code === 'JPY') {
      return `${selectedCurrency.symbol}${Math.round(convertedPrice)}`;
    }
    
    return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currencies,
      selectedCurrency,
      setSelectedCurrency: handleSetCurrency,
      convertPrice,
      formatPrice,
      isLoading,
      lastUpdated
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
