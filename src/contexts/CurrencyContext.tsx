
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
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load exchange rates
  useEffect(() => {
    const loadExchangeRates = async () => {
      setIsLoading(true);
      try {
        const rates = await fetchExchangeRates('ZAR');
        
        const updatedCurrencies = CURRENCY_CONFIG.map(config => ({
          ...config,
          rate: config.code === 'ZAR' ? 1 : rates[config.code] || 1
        }));
        
        setCurrencies(updatedCurrencies);
        setLastUpdated(new Date());
        
        // Set default currency if none selected
        if (!selectedCurrency) {
          const saved = localStorage.getItem('anong-currency');
          const defaultCurrency = saved 
            ? updatedCurrencies.find(c => c.code === saved) || updatedCurrencies[0]
            : updatedCurrencies[0];
          setSelectedCurrency(defaultCurrency);
        } else {
          // Update the selected currency with new rate
          const updatedSelected = updatedCurrencies.find(c => c.code === selectedCurrency.code);
          if (updatedSelected) {
            setSelectedCurrency(updatedSelected);
          }
        }
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
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

  // Provide default values while loading
  const defaultCurrency = { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 1 };

  return (
    <CurrencyContext.Provider value={{
      currencies,
      selectedCurrency: selectedCurrency || defaultCurrency,
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
