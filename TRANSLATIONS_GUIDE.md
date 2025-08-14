# Guide des traductions - Industrielle RH

## 🌍 Système de traduction FR/EN

Le site utilise un système de traduction React Context qui permet de basculer facilement entre le français et l'anglais.

## 📁 Structure des fichiers

- **Context principal** : `src/contexts/LanguageContext.tsx`
- **Sélecteur de langue** : `src/components/LanguageSelector.tsx`
- **Exemple complet** : `src/components/TranslatedExample.tsx`

## 🚀 Comment utiliser les traductions

### 1. Dans un composant React

```tsx
import { useTranslation } from "@/contexts/LanguageContext";

export default function MonComposant() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <p>{t('home.hero.subtitle')}</p>
      <button>{t('button.learn_more')}</button>
    </div>
  );
}
```

### 2. Avec le contexte complet

```tsx
import { useLanguage } from "@/contexts/LanguageContext";

export default function MonComposant() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <p>Langue actuelle : {language}</p>
      <button onClick={() => setLanguage('en')}>
        {t('language.english')}
      </button>
      <h1>{t('home.hero.title')}</h1>
    </div>
  );
}
```

### 3. Avec des paramètres dynamiques

```tsx
// Dans le contexte, définir :
'welcome.message': 'Bonjour {{name}}, bienvenue !'

// Dans le composant :
const message = t('welcome.message', { name: 'Jean' });
// Résultat : "Bonjour Jean, bienvenue !"
```

## 📝 Ajouter de nouvelles traductions

### 1. Modifier le fichier `LanguageContext.tsx`

```tsx
const translations = {
  fr: {
    // Ajouter vos nouvelles clés ici
    'ma_section.titre': 'Mon titre en français',
    'ma_section.description': 'Ma description en français',
  },
  en: {
    // Ajouter les traductions anglaises correspondantes
    'ma_section.titre': 'My title in English',
    'ma_section.description': 'My description in English',
  }
};
```

### 2. Convention de nommage

Utilisez une structure hiérarchique avec des points :

```tsx
// ✅ Bon
'page.section.element': 'Texte'
'form.field.label': 'Label'
'button.action.save': 'Enregistrer'

// ❌ Éviter
'pageSection': 'Texte'
'save_button': 'Enregistrer'
```

## 🎯 Catégories de traductions disponibles

### Navigation
- `nav.home`, `nav.about`, `nav.contact`, etc.

### Footer
- `footer.services`, `footer.location`, `footer.hours`, etc.

### Page d'accueil
- `home.hero.title`, `home.hero.subtitle`, etc.

### Formulaires
- `form.name`, `form.email`, `form.required`, etc.

### Boutons et actions
- `button.save`, `button.cancel`, `button.learn_more`, etc.

### Messages
- `common.loading`, `common.error`, `common.success`, etc.

### Contact
- `contact.title`, `contact.phone`, `contact.address`, etc.

### Services
- `services.recruitment.title`, `services.consulting.desc`, etc.

### Secteurs
- `sectors.manufacturing`, `sectors.construction`, etc.

### Emplois
- `jobs.title`, `jobs.search_placeholder`, `jobs.apply_now`, etc.

### Calculatrices
- `calculators.tax.title`, `calculators.salary.subtitle`, etc.

## 🔧 Fonctionnalités avancées

### 1. Sauvegarde automatique
La langue choisie est automatiquement sauvegardée dans `localStorage` et restaurée au rechargement.

### 2. Attribut lang du document
L'attribut `lang` du document HTML est automatiquement mis à jour.

### 3. Gestion des erreurs
Si une clé de traduction n'existe pas, la clé elle-même est affichée comme fallback.

## 📱 Sélecteur de langue

Le sélecteur de langue est intégré dans le footer et peut être utilisé ailleurs :

```tsx
import LanguageSelector from "@/components/LanguageSelector";

<LanguageSelector 
  variant="primary" 
  size="md" 
  className="my-custom-class" 
/>
```

## 🚀 Exemple complet

Consultez `src/components/TranslatedExample.tsx` pour voir un exemple complet d'utilisation incluant :
- Hero section traduite
- Formulaire multilingue
- Sections de services
- Gestion des secteurs

## 📋 TODO pour étendre les traductions

1. **Pages principales** :
   - [ ] Page d'accueil complète
   - [ ] Page À propos
   - [ ] Page Contact
   - [ ] Page Emplois

2. **Calculatrices** :
   - [ ] Calculateur d'impôt
   - [ ] Guide salarial
   - [ ] Calculateur hypothécaire
   - [ ] Validation CNESST

3. **Composants** :
   - [ ] Navbar (partiellement fait)
   - [ ] Footer (✅ fait)
   - [ ] Cartes de services
   - [ ] Formulaires de contact

4. **Messages dynamiques** :
   - [ ] Notifications toast
   - [ ] Messages d'erreur de formulaire
   - [ ] Confirmations d'actions

## 🎨 Bonnes pratiques

1. **Cohérence** : Utilisez les mêmes termes pour des concepts similaires
2. **Contexte** : Adaptez les traductions au contexte (formel/informel)
3. **Longueur** : Prévoyez que les textes anglais peuvent être plus longs
4. **Test** : Testez l'interface dans les deux langues
5. **Maintenance** : Documentez les nouvelles clés ajoutées

## 🔍 Dépannage

### Problème : La traduction ne s'affiche pas
- Vérifiez que la clé existe dans les deux langues
- Assurez-vous d'utiliser `useTranslation()` dans le composant
- Vérifiez que le `LanguageProvider` entoure votre composant

### Problème : La langue ne se sauvegarde pas
- Vérifiez que `localStorage` est disponible
- Assurez-vous que le composant est côté client (`"use client"`)

### Problème : Le sélecteur ne fonctionne pas
- Vérifiez que `LanguageSelector` est dans un composant client
- Assurez-vous que le `LanguageProvider` est au bon niveau