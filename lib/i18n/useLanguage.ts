import { useState, useEffect } from "react";
import { Language, translations } from "./translations";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = localStorage.getItem("discipline_language");
    if (saved === "az" || saved === "en") {
      setLanguage(saved as Language);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("discipline_language", lang);
  };

  const t = mounted ? translations[language] : translations.en;

  return { language, changeLanguage, t, mounted };
}
