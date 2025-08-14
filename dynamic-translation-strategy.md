# Stratégies de Traduction pour les Champs Dynamiques

## 🎯 **Problème Identifié**
Les données venant de la DB (secteurs, fonctions, villes) ont seulement un champ `libelle` en français, mais nous avons besoin de support multilingue.

## 📊 **Option 1: Structure DB Multilingue (RECOMMANDÉE)**

### Modification des Modèles de Base de Données

```typescript
// Nouveau modèle Sector avec support multilingue
export interface SectorProps {
  id: string;
  libelle_fr: string;      // Français
  libelle_en: string;      // Anglais
  description_fr?: string;
  description_en?: string;
  // ... autres champs
}

// Fonction helper dans le contexte Language
export function getLocalizedField(object: any, fieldName: string, language: Language): string {
  const localizedField = `${fieldName}_${language}`;
  return object[localizedField] || object[`${fieldName}_fr`] || object[fieldName] || '';
}
```

### Utilisation dans les Composants

```typescript
// Dans un composant
const { t, language } = useTranslation();

// Au lieu de: sector.libelle
// Utiliser:
const sectorName = getLocalizedField(sector, 'libelle', language);

// Ou créer une méthode dans le modèle
class Sector {
  getLibelle(language: Language): string {
    return getLocalizedField(this.props, 'libelle', language);
  }
}
```

## 📋 **Option 2: Mapping de Traduction (SOLUTION IMMÉDIATE)**

Pour les données existantes, créer un mapping de traduction :

```typescript
// Dans LanguageContext.tsx
const dynamicTranslations = {
  sectors: {
    'Fabrication': {
      fr: 'Fabrication',
      en: 'Manufacturing'
    },
    'Construction': {
      fr: 'Construction', 
      en: 'Construction'
    },
    'Santé': {
      fr: 'Santé',
      en: 'Healthcare'
    },
    'Transport': {
      fr: 'Transport',
      en: 'Transportation'
    },
    'Agriculture et agroalimentaire': {
      fr: 'Agriculture et agroalimentaire',
      en: 'Agriculture & Agro-Food'
    }
  },
  functions: {
    'Ingénieur': {
      fr: 'Ingénieur',
      en: 'Engineer'
    },
    'Technicien': {
      fr: 'Technicien', 
      en: 'Technician'
    }
    // ... autres fonctions
  },
  cities: {
    'Montréal': {
      fr: 'Montréal',
      en: 'Montreal'
    },
    'Québec': {
      fr: 'Québec',
      en: 'Quebec City'
    }
    // ... autres villes
  }
};

// Fonction helper
export function translateDynamicField(
  category: 'sectors' | 'functions' | 'cities',
  originalText: string,
  language: Language
): string {
  const translation = dynamicTranslations[category][originalText];
  return translation ? translation[language] : originalText;
}
```

## 🔧 **Option 3: Hook Personnalisé (HYBRIDE)**

Créer un hook pour gérer les traductions dynamiques :

```typescript
// hooks/useDynamicTranslation.ts
export function useDynamicTranslation() {
  const { language } = useTranslation();
  
  const translateSector = (sector: Sector): string => {
    // Version 1: Si DB multilingue disponible
    if (sector.libelle_en && language === 'en') {
      return sector.libelle_en;
    }
    
    // Version 2: Mapping de fallback
    return translateDynamicField('sectors', sector.libelle, language);
  };
  
  const translateFunction = (func: FonctionProps): string => {
    return translateDynamicField('functions', func.libelle, language);
  };
  
  const translateCity = (city: any): string => {
    return translateDynamicField('cities', city.libelle, language);
  };
  
  return {
    translateSector,
    translateFunction,
    translateCity
  };
}
```

### Utilisation dans les Composants

```typescript
// Dans un composant
const { translateSector, translateFunction } = useDynamicTranslation();

// Affichage
<p>{translateSector(sector)}</p>
<p>{translateFunction(fonction)}</p>
```

## 🚀 **Migration Progressive**

### Phase 1: Implémentation Immédiate (Mapping)
1. Créer le mapping de traduction pour les données existantes
2. Implémenter le hook `useDynamicTranslation`
3. Remplacer progressivement `sector.libelle` par `translateSector(sector)`

### Phase 2: Migration DB (Long terme)
1. Ajouter les colonnes multilingues en DB
2. Migrer les données existantes
3. Modifier les modèles TypeScript
4. Basculer vers l'utilisation native des champs multilingues

## 💡 **Recommandation**

**Pour l'immédiat**: Option 2 (Mapping) avec Option 3 (Hook)
- Permet de traduire rapidement les données existantes
- Aucune modification de DB requise
- Facilite la migration future

**Pour le long terme**: Option 1 (DB Multilingue)
- Solution la plus robuste et maintenable
- Permet aux administrateurs d'ajouter du contenu multilingue
- Performance optimale