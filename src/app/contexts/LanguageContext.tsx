import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language, TranslationKey } from "../i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKey;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();

  // Check if browser language is Indonesian
  if (browserLang.startsWith("id")) {
    return "id";
  }

  // Default to English for all other languages
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage first
    const saved = localStorage.getItem("language");
    if (saved === "id" || saved === "en") {
      return saved;
    }
    // Otherwise detect from browser
    return detectBrowserLanguage();
  });

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem("language", language);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
