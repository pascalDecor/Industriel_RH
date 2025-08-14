"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import { setDateLanguage } from "@/lib/formatDate";

/**
 * Hook qui synchronise automatiquement la langue des fonctions de formatage de date
 * avec la langue du contexte LanguageContext
 * Gère correctement l'hydration SSR
 */
export function useDateLanguage() {
  const { language } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      setDateLanguage(language);
    }
  }, [language, isHydrated]);

  return language;
}