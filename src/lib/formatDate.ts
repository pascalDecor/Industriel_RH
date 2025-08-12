import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

// Variable globale pour stocker la langue actuelle
let currentLanguage: 'fr' | 'en' = 'fr';

// Fonction pour définir la langue globalement
export function setDateLanguage(language: 'fr' | 'en') {
  currentLanguage = language;
}

// Fonction principale qui s'adapte à la langue actuelle
export function formatDateFr(date: Date | string, customPattern?: string) {
  if (!date) return 'Date non disponible';
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  // Vérifier si la date est valide
  if (isNaN(d.getTime())) {
    return 'Date invalide';
  }
  
  const locale = currentLanguage === 'fr' ? fr : enUS;
  
  let pattern = customPattern;
  if (!pattern) {
    pattern = currentLanguage === 'fr' ? "PPP 'à' p" : "PPP 'at' p";
  }
  
  return format(d, pattern, { locale });
}


export function formatDate(date: Date | string, pattern = "PPP") {
    if (!date) return 'Date non disponible';
    
    const d = typeof date === "string" ? new Date(date) : date;
    
    if (isNaN(d.getTime())) {
        return 'Date invalide';
    }
    
    return format(d, pattern);
}

// Formats spécifiques qui s'adaptent à la langue
export function formatDateTimeFr(date: Date | string) {
  if (!date) return 'Date non disponible';
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return 'Date invalide';
  }
  
  const locale = currentLanguage === 'fr' ? fr : enUS;
  const pattern = currentLanguage === 'fr' ? "PPP 'à' p" : "PPP 'at' p";
  return format(d, pattern, { locale });
}

export function formatDateTimeShortFr(date: Date | string) {
  if (!date) return 'Date non disponible';
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return 'Date invalide';
  }
  
  const locale = currentLanguage === 'fr' ? fr : enUS;
  const pattern = currentLanguage === 'fr' ? "dd/MM/yyyy 'à' HH:mm" : "MM/dd/yyyy 'at' HH:mm";
  return format(d, pattern, { locale });
}

export function formatDateOnlyFr(date: Date | string) {
  if (!date) return 'Date non disponible';
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return 'Date invalide';
  }
  
  const locale = currentLanguage === 'fr' ? fr : enUS;
  return format(d, "PPP", { locale });
}

export function formatTimeOnlyFr(date: Date | string) {
  if (!date) return 'Heure non disponible';
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return 'Heure invalide';
  }
  
  const locale = currentLanguage === 'fr' ? fr : enUS;
  return format(d, "p", { locale });
}

// Fonction qui s'adapte à la langue du contexte
export function formatDateByLanguage(
  date: Date | string, 
  language: 'fr' | 'en' = 'fr', 
  includeTime: boolean = true
) {
  if (!date) return language === 'fr' ? 'Date non disponible' : 'Date not available';
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return language === 'fr' ? 'Date invalide' : 'Invalid date';
  }
  
  const locale = language === 'fr' ? fr : enUS;
  
  if (includeTime) {
    const pattern = language === 'fr' ? "PPP 'à' p" : "PPP 'at' p";
    return format(d, pattern, { locale });
  } else {
    return format(d, "PPP", { locale });
  }
}
