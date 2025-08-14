# 🌐 Guide de Traduction Dynamique

## 📋 **Vue d'ensemble**

Ce guide explique comment utiliser le système de traduction dynamique pour les données provenant de la base de données (secteurs, fonctions, villes).

## 🚀 **Utilisation Rapide**

### **Import**
```typescript
import { useDynamicTranslation } from '@/hooks/useDynamicTranslation';
```

### **Dans un Composant**
```typescript
export function MonComposant({ sectors, functions, cities }) {
  const { translateSector, translateFunction, translateCity } = useDynamicTranslation();
  
  return (
    <div>
      {/* ❌ Avant (texte en français uniquement) */}
      <p>{sector.libelle}</p>
      
      {/* ✅ Après (traduction automatique) */}
      <p>{translateSector(sector)}</p>
      
      {/* Exemples avec d'autres types */}
      <p>{translateFunction(fonction)}</p>
      <p>{translateCity(city)}</p>
    </div>
  );
}
```

## 📚 **Exemples Pratiques**

### **1. Liste de Secteurs**
```typescript
function SectorList({ sectors }: { sectors: Sector[] }) {
  const { translateSector } = useDynamicTranslation();
  
  return (
    <ul>
      {sectors.map(sector => (
        <li key={sector.id}>
          <strong>{translateSector(sector)}</strong>
          <p>{sector.description}</p> {/* Description à traduire plus tard */}
        </li>
      ))}
    </ul>
  );
}
```

### **2. Formulaire avec Options Dynamiques**
```typescript
function JobForm({ sectors, functions }: { sectors: Sector[], functions: Function[] }) {
  const { translateSector, translateFunction } = useDynamicTranslation();
  
  return (
    <form>
      <select name="sector">
        {sectors.map(sector => (
          <option key={sector.id} value={sector.id}>
            {translateSector(sector)}
          </option>
        ))}
      </select>
      
      <select name="function">
        {functions.map(func => (
          <option key={func.id} value={func.id}>
            {translateFunction(func)}
          </option>
        ))}
      </select>
    </form>
  );
}
```

### **3. Cards avec Données Mixtes**
```typescript
function JobCard({ job }) {
  const { t } = useTranslation();
  const { translateSector, translateCity } = useDynamicTranslation();
  
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      
      {/* Texte statique traduit */}
      <p>{t('jobs.location')}: {translateCity(job.city)}</p>
      <p>{t('jobs.sector')}: {translateSector(job.sector)}</p>
      
      {/* Mélange de traductions statiques et dynamiques */}
      <p>{t('jobs.experience')}: {job.experienceYears} {t('common.years')}</p>
    </div>
  );
}
```

## 🔧 **Mapping de Traduction Actuel**

### **Secteurs Supportés**
| Français | English |
|----------|---------|
| Fabrication | Manufacturing |
| Construction | Construction |
| Santé | Healthcare |
| Transport | Transportation |
| Agriculture et agroalimentaire | Agriculture & Agro-Food |
| Technologie | Technology |
| Énergie | Energy |
| Aérospatiale | Aerospace |

### **Fonctions Supportées**
| Français | English |
|----------|---------|
| Ingénieur | Engineer |
| Technicien | Technician |
| Opérateur | Operator |
| Superviseur | Supervisor |
| Gestionnaire | Manager |
| Directeur | Director |

### **Villes Supportées**
| Français | English |
|----------|---------|
| Montréal | Montreal |
| Québec | Quebec City |
| Gatineau | Gatineau |
| Sherbrooke | Sherbrooke |
| Trois-Rivières | Trois-Rivières |
| Saguenay | Saguenay |

## ➕ **Ajouter de Nouvelles Traductions**

Pour ajouter de nouvelles traductions, modifier le fichier `src/contexts/LanguageContext.tsx` :

```typescript
dynamic: {
  sectors: {
    // Existants...
    'Nouveau Secteur': 'New Sector',
  },
  functions: {
    // Existants...
    'Nouvelle Fonction': 'New Function',
  },
  cities: {
    // Existantes...
    'Nouvelle Ville': 'New City',
  }
}
```

## ⚠️ **Bonnes Pratiques**

### **✅ À Faire**
- Toujours utiliser `translateSector()` au lieu de `sector.libelle`
- Tester les traductions avec les deux langues
- Ajouter les nouvelles valeurs au mapping quand nécessaire
- Garder les clés de traduction cohérentes

### **❌ À Éviter**
- Utiliser directement `sector.libelle` dans l'interface
- Oublier d'importer le hook
- Traduire les valeurs déjà traduites (double traduction)

## 🔄 **Migration des Composants Existants**

### **Étapes**
1. Identifier les utilisations de `.libelle`
2. Importer `useDynamicTranslation`
3. Remplacer `object.libelle` par `translateType(object)`
4. Tester les deux langues

### **Exemple de Migration**
```typescript
// ❌ AVANT
function OldComponent({ sector }) {
  return <h1>{sector.libelle}</h1>;
}

// ✅ APRÈS
function NewComponent({ sector }) {
  const { translateSector } = useDynamicTranslation();
  return <h1>{translateSector(sector)}</h1>;
}
```

## 🚧 **Roadmap Future**

### **Phase 1: Immédiate** (Actuelle)
- ✅ Système de mapping pour traductions
- ✅ Hook `useDynamicTranslation`
- ✅ Support secteurs, fonctions, villes de base

### **Phase 2: Court terme**
- [ ] Migration de tous les composants existants
- [ ] Ajout de toutes les valeurs manquantes au mapping
- [ ] Tests automatisés pour les traductions

### **Phase 3: Long terme**
- [ ] Structure DB multilingue (libelle_fr, libelle_en)
- [ ] Interface admin pour gérer les traductions
- [ ] Migration automatique des données existantes

## 🐛 **Dépannage**

### **Problème: Texte non traduit**
**Solution**: Vérifier que la valeur existe dans le mapping

### **Problème: Hook non reconnu**
**Solution**: Vérifier l'import du hook

### **Problème: Traduction vide**
**Solution**: La fonction retourne le texte original si pas de traduction trouvée

## 📞 **Support**

Pour des questions ou problèmes, contacter l'équipe de développement.