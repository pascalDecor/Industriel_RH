import { useTranslation } from '@/contexts/LanguageContext';

export function useDynamicTranslation() {
  const { translateDynamic, language } = useTranslation();
  
  // Fonction générique pour récupérer le champ localisé
  const getLocalizedField = (obj: any, field: string): string => {
    if (!obj) return '';
    
    if (language === 'en') {
      // Priorité: champ anglais, puis français par défaut
      return obj[`${field}_en`] || obj[field] || '';
    } else {
      // Français par défaut
      return obj[field] || '';
    }
  };
  
  // Fonctions spécifiques pour les articles (nouvelle approche)
  const translateArticleTitle = (article: any): string => {
    return getLocalizedField(article, 'titre');
  };
  
  const translateArticleContent = (article: any): any[] => {
    if (!article) return [];

    if (language === 'en') {
      return article.contenu_en || article.contenu || [];
    } else {
      return article.contenu || [];
    }
  };

  // Fonctions pour les spécialités et tags
  const translateSpecialty = (specialty: any): string => {
    return getLocalizedField(specialty, 'libelle');
  };

  const translateTag = (tag: any): string => {
    return getLocalizedField(tag, 'libelle');
  };
  
  // Fonctions existantes (à migrer plus tard)
  const translateSector = (sector: any): string => {
    if (!sector || !sector.libelle) return '';
    return translateDynamic('sectors', sector.libelle);
  };
  
  const translateFunction = (func: any): string => {
    if (!func || !func.libelle) return '';
    return translateDynamic('functions', func.libelle);
  };
  
  const translateCity = (city: any): string => {
    if (!city || !city.libelle) return '';
    return translateDynamic('cities', city.libelle);
  };
  
  return {
    // Nouvelles fonctions pour articles
    translateArticleTitle,
    translateArticleContent,
    translateSpecialty,
    translateTag,
    getLocalizedField,
    // Anciennes fonctions (compatibilité)
    translateSector,
    translateFunction,
    translateCity,
    translateDynamic
  };
}