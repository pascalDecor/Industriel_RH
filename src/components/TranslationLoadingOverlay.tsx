"use client";

import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Affiche un voile de chargement pendant le fetch des traductions (API),
 * le temps que `t()` ne renvoie plus de chaînes vides.
 */
export function TranslationLoadingOverlay() {
  const { isLoadingTranslations } = useLanguage();
  if (!isLoadingTranslations) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-white/85 backdrop-blur-[2px]"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-11 w-11 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600"
          aria-hidden
        />
        <span className="sr-only">Chargement du contenu</span>
      </div>
    </div>
  );
}
