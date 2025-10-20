/**
 * Script de migration des traductions
 *
 * Ce script importe toutes les traductions existantes depuis le LanguageContext
 * vers la base de données.
 *
 * Usage: npx tsx scripts/migrate-translations.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Traductions à importer (copié depuis LanguageContext.tsx)
// NOTE: Vous devrez copier manuellement l'objet translations complet depuis LanguageContext.tsx
// ou utiliser un import si possible

// Pour l'instant, voici un exemple de structure
const translationsToImport: Record<string, Record<string, string>> = {
  fr: {
    // Footer
    'footer.services': 'Services',
    'footer.browse_jobs': 'Parcourir les emplois',
    'footer.international_recruitment': 'Recrutement international',
    'footer.recruitment_outsourcing': 'Recrutement par impartition',
    'footer.areas_expertise': 'Domaines d\'expertise',
    'footer.manufacturing': 'Fabrication',
    'footer.construction': 'Construction',
    'footer.healthcare': 'Santé',
    'footer.transport': 'Transport',
    'footer.agriculture': 'Agriculture et agroalimentaire',
    'footer.about_us': 'À propos de nous',
    'footer.about_industrielle': 'À propos d\'Industrielle RH',
    'footer.careers': 'Carrières avec nous',
    'footer.location': 'Emplacement',
    'footer.hours': 'Du lundi au vendredi de 8h30 à 17h00',
    'footer.select_region': 'Sélectionner une région et une langue',
    'footer.fraud_alert': 'Alerte à la fraude',
    'footer.privacy_policy': 'Politique de confidentialité',
    'footer.terms_of_use': 'Conditions d\'utilisation',
    'footer.rights_reserved': '© 2025 Industrielle RH Inc. Tous droits réservés.',
    'footer.quebec_license': 'Numéro de licence Québec AP-2000503',

    // Langues
    'language.french': 'Français',
    'language.english': 'Anglais',
    'language.canada_french': 'Canada (Français)',
    'language.canada_english': 'Canada (English)',

    // Navigation commune
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.hire_talent': 'Embaucher des talents',
    'nav.find_jobs': 'Trouver un emploi',
    'nav.consulting': 'Solutions-conseil',
    'nav.salary_guide': 'Guide salarial',
    'nav.tax_calculator': 'Calculateur d\'impôt',
    'nav.mortgage_calculator': 'Calculateur hypothécaire',
    'nav.cnesst_validation': 'Validation CNESST',
    'nav.discover_insights': 'Découvrir les insights',

    // Messages communs
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.view_more': 'Voir plus',
    'common.view_less': 'Voir moins',
    'common.retry': 'Réessayer',
    'common.error_loading_articles': 'Impossible de charger les articles',

    // Formulaires
    'form.name': 'Nom',
    'form.email': 'Courriel',
    'form.phone': 'Téléphone',
    'form.message': 'Message',
    'form.send': 'Envoyer',
    'form.required': 'Requis',
    'form.first_name': 'Prénom',
    'form.last_name': 'Nom de famille',
    'form.company': 'Entreprise',
    'form.position': 'Poste',
    'form.subject': 'Sujet',
    'form.submit': 'Soumettre',
    'form.civility': 'Civilité',
    'form.address': 'Adresse',
    'form.city': 'Ville',
    'form.sector': 'Secteur',
    'form.function': 'Fonction',
    'form.years_experience': 'Années d\'expérience',
    'form.cv_format': 'CV (Word uniquement, format doc ou docx)*',
    'form.cover_letter_format': 'Lettre de motivation (PDF ou DOC)*',
    'form.company_website': 'Site web de l\'entreprise',
    'form.number_positions': 'Nombre de postes à pourvoir',
  },
  en: {
    // Footer
    'footer.services': 'Services',
    'footer.browse_jobs': 'Browse Jobs',
    'footer.international_recruitment': 'International Recruitment',
    'footer.recruitment_outsourcing': 'Recruitment Outsourcing',
    'footer.areas_expertise': 'Areas of Expertise',
    'footer.manufacturing': 'Manufacturing',
    'footer.construction': 'Construction',
    'footer.healthcare': 'Healthcare',
    'footer.transport': 'Transportation',
    'footer.agriculture': 'Agriculture and Agri-Food',
    'footer.about_us': 'About Us',
    'footer.about_industrielle': 'About Industrielle RH',
    'footer.careers': 'Careers with Us',
    'footer.location': 'Location',
    'footer.hours': 'Monday to Friday, 8:30 AM to 5:00 PM',
    'footer.select_region': 'Select a region and language',
    'footer.fraud_alert': 'Fraud Alert',
    'footer.privacy_policy': 'Privacy Policy',
    'footer.terms_of_use': 'Terms of Use',
    'footer.rights_reserved': '© 2025 Industrielle RH Inc. All rights reserved.',
    'footer.quebec_license': 'Quebec License Number AP-2000503',

    // Langues
    'language.french': 'French',
    'language.english': 'English',
    'language.canada_french': 'Canada (Français)',
    'language.canada_english': 'Canada (English)',

    // Navigation commune
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.hire_talent': 'Hire Talent',
    'nav.find_jobs': 'Find Jobs',
    'nav.consulting': 'Consulting Solutions',
    'nav.salary_guide': 'Salary Guide',
    'nav.tax_calculator': 'Tax Calculator',
    'nav.mortgage_calculator': 'Mortgage Calculator',
    'nav.cnesst_validation': 'CNESST Validation',
    'nav.discover_insights': 'Discover Insights',

    // Messages communs
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.view_more': 'View More',
    'common.view_less': 'View Less',
    'common.retry': 'Retry',
    'common.error_loading_articles': 'Unable to load articles',

    // Formulaires
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.message': 'Message',
    'form.send': 'Send',
    'form.required': 'Required',
    'form.first_name': 'First Name',
    'form.last_name': 'Last Name',
    'form.company': 'Company',
    'form.position': 'Position',
    'form.subject': 'Subject',
    'form.submit': 'Submit',
    'form.civility': 'Title',
    'form.address': 'Address',
    'form.city': 'City',
    'form.sector': 'Sector',
    'form.function': 'Function',
    'form.years_experience': 'Years of Experience',
    'form.cv_format': 'Resume (Word only, doc or docx format)*',
    'form.cover_letter_format': 'Cover Letter (PDF or DOC)*',
    'form.company_website': 'Company Website',
    'form.number_positions': 'Number of Positions',
  }
};

async function main() {
  console.log('🚀 Début de la migration des traductions...\n');

  // Extraire toutes les clés uniques
  const keys = Object.keys(translationsToImport.fr);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const key of keys) {
    try {
      const frText = translationsToImport.fr[key];
      const enText = translationsToImport.en[key];

      // Vérifier si la traduction existe déjà
      const existingTranslation = await prisma.translation.findUnique({
        where: { key }
      });

      if (existingTranslation) {
        console.log(`⏭️  Traduction déjà existante: ${key}`);
        skippedCount++;
        continue;
      }

      // Extraire la catégorie depuis la clé (ex: "footer.services" -> "footer")
      const category = key.includes('.') ? key.split('.')[0] : null;

      // Créer la traduction
      await prisma.translation.create({
        data: {
          key,
          category,
          fr: frText,
          en: enText,
          description: null
        }
      });

      console.log(`✅ Traduction importée: ${key}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erreur lors de l'import de ${key}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Résumé de la migration:');
  console.log(`   ✅ Succès: ${successCount}`);
  console.log(`   ⏭️  Ignorées: ${skippedCount}`);
  console.log(`   ❌ Erreurs: ${errorCount}`);
  console.log(`   📝 Total: ${keys.length}`);

  console.log('\n✨ Migration terminée !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur fatale:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
