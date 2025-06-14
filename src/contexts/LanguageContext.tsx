
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('anong-language');
    return (saved === 'th' || saved === 'en') ? saved : 'en';
  });

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('anong-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'th' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
