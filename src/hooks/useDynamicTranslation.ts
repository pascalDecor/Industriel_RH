import { useTranslation } from '@/contexts/LanguageContext';

export function useDynamicTranslation() {
  const { translateDynamic } = useTranslation();
  
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
    translateSector,
    translateFunction,
    translateCity,
    translateDynamic
  };
}