
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const CurrencySelector = () => {
  const { currencies, selectedCurrency, setSelectedCurrency, isLoading } = useCurrency();
  const { language } = useLanguage();

  const translations = {
    en: {
      currency: "Currency",
      loading: "Loading rates..."
    },
    th: {
      currency: "สกุลเงิน",
      loading: "กำลังโหลดอัตราแลกเปลี่ยน..."
    }
  };

  const t = translations[language];

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Select 
          value={selectedCurrency.code} 
          onValueChange={(code) => {
            const currency = currencies.find(c => c.code === code);
            if (currency) setSelectedCurrency(currency);
          }}
          disabled={isLoading}
        >
          <SelectTrigger className="w-20 h-8 text-xs border-anong-gold/30 focus:border-anong-gold bg-transparent text-white/80 hover:text-anong-gold">
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <SelectValue />
            )}
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
    </div>
  );
};

export default CurrencySelector;
