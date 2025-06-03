
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";

const CurrencySelector = () => {
  const { currencies, selectedCurrency, setSelectedCurrency } = useCurrency();
  const { language } = useLanguage();

  const translations = {
    en: {
      currency: "Currency"
    },
    th: {
      currency: "สกุลเงิน"
    }
  };

  const t = translations[language];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-anong-charcoal/70 font-medium">{t.currency}:</span>
      <Select 
        value={selectedCurrency.code} 
        onValueChange={(code) => {
          const currency = currencies.find(c => c.code === code);
          if (currency) setSelectedCurrency(currency);
        }}
      >
        <SelectTrigger className="w-24 h-8 text-xs border-anong-gold/30 focus:border-anong-gold">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              {currency.symbol} {currency.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
