
interface ExchangeRateResponse {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
}

const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

export const fetchExchangeRates = async (baseCurrency: string = 'ZAR'): Promise<Record<string, number>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ExchangeRateResponse = await response.json();
    
    if (!data.success && data.success !== undefined) {
      throw new Error('API returned unsuccessful response');
    }
    
    return data.rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // Return fallback rates if API fails
    return {
      USD: 0.056,
      EUR: 0.052,
      GBP: 0.044,
      JPY: 10.1,
      AUD: 0.084,
      CAD: 0.076,
      CHF: 0.051
    };
  }
};
