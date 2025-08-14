# Documentation API - Industrielle RH

Cette documentation décrit l'API REST de la plateforme Industrielle RH, une solution complète de recrutement industriel.

## 🚀 Accès à la documentation

### Interface Swagger UI
- **URL de développement**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **URL de production**: [https://industriellerh.ca/api-docs](https://industriellerh.ca/api-docs)

### Spécification OpenAPI
- **Format JSON**: `/api/swagger`
- **Version**: OpenAPI 3.0.3

## 📋 Vue d'ensemble

L'API Industrielle RH propose les fonctionnalités suivantes :

### 🏢 Modules principaux

#### 1. **Contacts** (`/api/contacts`)
Gestion des demandes de contact et d'information
- Création, lecture, mise à jour et suppression des contacts
- Recherche et filtrage par statut et priorité
- Pagination des résultats

#### 2. **Candidatures** (`/api/applications`) 
Gestion des candidatures d'emploi
- Soumission de candidatures avec CV et lettre de motivation
- Suivi des états (nouveau, en cours, accepté, refusé)
- Relations avec secteurs, fonctions, villes et civilités

#### 3. **Recrutements** (`/api/hires`)
Gestion des demandes de recrutement des entreprises
- Création de demandes de recrutement multi-postes
- Gestion des détails de postes et documents de support
- Suivi des secteurs d'activité

#### 4. **Calculs Salariaux** (`/api/salary-calculations`)
Estimations et analyses salariales
- Calculs basés sur poste, secteur, localisation et expérience
- Gestion des compétences et niveaux d'éducation
- Historique des calculs

#### 5. **Calculs d'Impôts** (`/api/tax-calculations`)
Calculs fiscaux pour le Québec
- Estimation des impôts provinciaux et fédéraux
- Gestion des déductions

#### 6. **Calculs Hypothécaires** (`/api/mortgage-calculations`)
Calculs de prêts immobiliers
- Calculs de mensualités hypothécaires
- Gestion des taux d'intérêt et périodes d'amortissement

#### 7. **Validations CNESST** (`/api/cnesst-validations`)
Validations de conformité CNESST
- Vérifications de conformité réglementaire

#### 8. **Référentiels** (`/api/sectors`, `/api/fonctions`, `/api/cities`, `/api/civilities`)
Données de référence du système
- Secteurs d'activité industrielle
- Fonctions et métiers
- Villes du Québec
- Civilités (M., Mme, etc.)

#### 9. **Upload** (`/api/upload`)
Gestion des fichiers
- Upload de CV, lettres de motivation, documents de support
- Formats supportés : PDF, DOC, DOCX

## 🔧 Utilisation

### Format des réponses

Toutes les API retournent des données au format JSON avec la structure suivante :

```json
{
  "data": [...], // Données demandées
  "meta": {      // Métadonnées (pour les listes paginées)
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Codes de statut HTTP

- `200` - Succès
- `201` - Ressource créée
- `400` - Requête invalide
- `404` - Ressource non trouvée
- `500` - Erreur serveur

### Pagination

Les endpoints de liste supportent la pagination via les paramètres :
- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre d'éléments par page (défaut: 10)

### Recherche et filtrage

La plupart des endpoints supportent :
- `search` - Recherche textuelle dans les champs principaux
- Filtres spécifiques selon l'endpoint (status, priority, sectorId, etc.)

## 🔒 Authentification

Certains endpoints peuvent nécessiter une authentification. Le système utilise :
- **JWT Bearer Tokens** pour l'authentification API
- **Sessions** pour l'interface web

## 🌐 Environnements

### Développement
- **Base URL**: `http://localhost:3000/api`
- **Documentation**: `http://localhost:3000/api-docs`

### Production
- **Base URL**: `https://industriellerh.ca/api`
- **Documentation**: `https://industriellerh.ca/api-docs`

## 📊 Modèles de données

### Contact
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string?",
  "jobTitle": "string?",
  "workEmail": "string",
  "workPhone": "string",
  "postalCode": "string?",
  "message": "string",
  "status": "nouveau|en_cours|traite|ferme",
  "priority": "basse|moyenne|haute|urgente",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Application (Candidature)
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "adresse": "string",
  "year_of_experience": "integer",
  "cv": "string",
  "coverLetter": "string?",
  "state": "nouveau|en_cours|accepte|refuse",
  "sectorId": "string",
  "functionId": "string",
  "civilityId": "string",
  "cityId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Hire (Recrutement)
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "number_of_positions": "integer",
  "details_of_positions": "object[]",
  "company_name": "string",
  "company_website": "string?",
  "document_support": "string?",
  "state": "nouveau|en_cours|traite|ferme",
  "civilityId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 🛠️ Installation et développement

### Prérequis
- Node.js 18+
- Next.js 15+
- Prisma (ORM)

### Installation des dépendances Swagger
```bash
npm install swagger-ui-react
```

### Lancement du serveur de développement
```bash
npm run dev
```

### Génération de la documentation
La documentation est automatiquement servie via l'endpoint `/api/swagger` et l'interface `/api-docs`.

## 📞 Support

Pour toute question concernant cette API :
- **Email technique** : tech@industriellerh.ca
- **Email général** : info@industriellerh.ca
- **Téléphone** : 819-919-8693

## 📄 Licence

Cette API est propriétaire à Industrielle RH Inc. Tous droits réservés.

---

**Industrielle RH** - Votre partenaire de confiance en recrutement industriel