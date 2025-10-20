"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translateDynamic: (category: 'sectors' | 'functions' | 'cities', originalText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traductions
const translations: Record<Language, Record<string, string>> = {
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
    'nav.discover_insights' :  'Découvrir les insights',
    
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
    'form.select_sectors': 'Sélectionner les secteurs',
    'form.position_details': 'Détails des postes',
    'form.support_document': 'Document à l\'appui de la demande (PDF ou DOC)',
    'form.start': 'COMMENCER',
    
    // Page d'accueil
    'home.hero.title': 'Trouvez le talent industriel qu\'il vous faut',
    'home.hero.subtitle': 'Nous connectons les meilleurs talents avec les entreprises leaders du secteur industriel',
    'home.hero.cta_hire': 'Embaucher des talents',
    'home.hero.cta_jobs': 'Trouver un emploi',
    'home.specialized_talent.title': 'Ajoutez des talents spécialisés dans votre organisation',
    'home.specialized_talent.subtitle': 'Nos experts en recrutement vous aident à trouver les meilleurs candidats',
    'home.how_it_works.title': 'Comment ça fonctionne',
    'home.testimonials.title': 'Ce que disent nos clients',
    'home.latest_jobs.title': 'Derniers emplois',
    'home.view_all_jobs': 'Voir tous les emplois',
    
    // Cards section
    'home.cards.salary_guide.title': 'Guide salarial',
    'home.cards.salary_guide.desc': 'Explorez les dernières données pour des centaines de postes et sachez ce que vous devriez gagner ou payer sur les marchés locaux et nationaux.',
    'home.cards.cv_builder.title': 'Calculateur d\'impôt',
    'home.cards.cv_builder.desc': 'Calculez vos impôts québécois facilement. Estimation précise de vos retenues et remboursements.',
    'home.cards.blog.title': 'Blog IR',
    'home.cards.blog.desc': 'Gardez une longueur d\'avance avec les dernières données, idées, conseils et astuces de certains des experts les plus éminents du secteur des solutions de talents.',
    'home.cards.tech_skills.title': 'Naviguer dans les lacunes de compétences technologiques',
    'home.cards.tech_skills.desc': 'Découvrez des stratégies pour constituer une équipe technologique complète pour soutenir les priorités commerciales.',
    
    // Worry-free recruitment section
    'home.worry_free.title': 'Recrutement sans souci pour le Québec d\'aujourd\'hui et de demain !',
    'home.worry_free.subtitle': 'Nous vous aidons à constituer une équipe solide pour relever les défis du marché concurrentiel du Québec.',
    'home.worry_free.search_label': 'Je recherche un',
    'home.worry_free.job_placeholder': 'Titre du poste',
    'home.worry_free.preview_btn': 'Aperçu des candidats',
    
    // How it works section
    'home.how_it_works.step1': 'Décrivez votre besoin',
    'home.how_it_works.step2': 'Nous trouvons le talent',
    'home.how_it_works.step3': 'Sélectionnez et approuvez',
    'home.how_it_works.step4': 'Intégration transparente',
    'home.how_it_works.step5': 'Support continu',
    
    // Partner with talent section
    'home.partner_talent.title': 'Partenaire avec des talents qualifiés alignés sur les valeurs de votre entreprise',
    'home.partner_talent.point1': 'Accédez au vaste réseau de candidats qualifiés d\'Industrielle RH dans la fabrication, la construction, la santé, la logistique et l\'agriculture.',
    'home.partner_talent.point2': 'Trouvez rapidement des professionnels locaux et internationaux qui ont les bonnes compétences et l\'expertise de l\'industrie.',
    'home.partner_talent.point3': 'Laissez-nous recruter des candidats à tous les niveaux, des postes d\'entrée aux postes de direction.',
    'home.partner_talent.find_hire_btn': 'Trouvez votre prochaine embauche',
    'home.partner_talent.learn_more_btn': 'En savoir plus',
    
    // Employee recognition section
    'home.employee_recognition.title': 'Nous sommes experts en reconnaissance des employés',
    'home.employee_recognition.point1': 'Notre offre comprend des programmes de reconnaissance des employés sur mesure.',
    'home.employee_recognition.point2': 'Formation continue adaptée à vos besoins.',
    'home.employee_recognition.point3': 'Support continu pour assurer l\'intégration et la rétention.',
    'home.employee_recognition.point4': 'Solutions personnalisées pour célébrer les réalisations de votre équipe.',
    'home.employee_recognition.consulting_btn': 'Trouvez votre solution de conseil',
    
    // Shape career section
    'home.shape_career.title': 'Façonnez la carrière que vous voulez',
    'home.shape_career.point1': 'Assistance juridique gratuite.',
    'home.shape_career.point2': 'Obtenez des recommandations d\'emploi personnalisées adaptées à vos compétences et objectifs, que ce soit localement ou internationalement.',
    'home.shape_career.point3': 'Explorez les opportunités dans tous les secteurs pour des rôles contractuels ou permanents.',
    'home.shape_career.point4': 'Profitez d\'une rémunération et d\'avantages compétitifs, ainsi que de programmes de formation et de développement en ligne gratuits pour vous aider à grandir.',
    'home.shape_career.job_matches_btn': 'Obtenez des correspondances d\'emploi',
    
    // À propos
    'about.title': 'À propos d\'Industrielle RH',
    'about.subtitle': 'Votre partenaire de confiance en recrutement industriel',
    'about.mission.title_short': 'Notre mission',
    'about.vision.title_short': 'Notre vision',
    'about.values.title_short': 'Nos valeurs',
    'about.team.title': 'Notre équipe',
    'about.experience': 'ans d\'expérience',
    'about.clients': 'clients satisfaits',
    'about.placements': 'placements réussis',
    
    // Services
    'services.title': 'Nos services',
    'services.recruitment.title': 'Recrutement spécialisé',
    'services.recruitment.desc': 'Trouvez les meilleurs talents pour vos postes industriels',
    'services.consulting.title': 'Conseil en RH',
    'services.consulting.desc': 'Optimisez vos processus de recrutement',
    'services.outsourcing.title': 'Impartition RH',
    'services.outsourcing.desc': 'Confiez-nous vos besoins en recrutement',
    
    // Contact
    'contact.title': 'Contactez-nous',
    'contact.subtitle': 'Prêt à trouver votre prochain talent ?',
    'contact.get_in_touch': 'Entrer en contact',
    'contact.office_hours': 'Heures d\'ouverture',
    'contact.address': 'Adresse',
    'contact.phone': 'Téléphone',
    'contact.email': 'Courriel',
    'contact.send_message': 'Envoyer un message',
    
    // Page Contact spécifique
    'contact.we_accept_mandates': 'Nous acceptons les mandats de recrutement partout au Québec!',
    'contact.based_in_quebec': 'Basé au cœur du Québec, Industrielle RH est votre partenaire de confiance pour le recrutement spécialisé dans les secteurs manufacturier, industriel et autres secteurs clés. Que vous soyez à Montréal, Québec ou ailleurs dans la province, nous sommes prêts à répondre à vos besoins de recrutement.',
    'contact.contact_us': 'Nous contacter',
    'contact.feel_free_reach': 'N\'hésitez pas à nous contacter pour en savoir plus sur nos services de recrutement ou pour nous confier votre mandat.',
    'contact.telephone_label': 'Téléphone',
    'contact.languages_spoken': 'Langues parlées',
    'contact.french_english': 'Français et anglais',
    'contact.your_contact_info': 'Vos informations de contact',
    'contact.first_name_placeholder': 'Prénom',
    'contact.last_name_placeholder': 'Nom de famille',
    'contact.company_name_placeholder': 'Nom de l\'entreprise',
    'contact.job_title_placeholder': 'Votre titre d\'emploi',
    'contact.work_email_placeholder': 'Courriel professionnel',
    'contact.work_phone_placeholder': 'Téléphone professionnel',
    'contact.tell_us_position': 'Parlez-nous du poste',
    'contact.postal_code_placeholder': 'Code postal',
    'contact.explain_need': 'Expliquez votre besoin',
    'contact.describe_recruitment_needs': 'Décrivez vos besoins de recrutement...',
    'contact.submitting': 'Envoi en cours...',
    'contact.submit': 'Envoyer',
    
    // Emplois
    'jobs.title': 'Offres d\'emploi',
    'jobs.search_placeholder': 'Rechercher un emploi...',
    'jobs.filter_by_sector': 'Filtrer par secteur',
    'jobs.filter_by_location': 'Filtrer par lieu',
    'jobs.no_results': 'Aucun emploi trouvé',
    'jobs.apply_now': 'Postuler maintenant',
    'jobs.view_details': 'Voir les détails',
    'jobs.salary': 'Salaire',
    'jobs.location': 'Lieu',
    'jobs.type': 'Type',
    'jobs.experience': 'Expérience',
    'jobs.posted': 'Publié',
    
    // Calculatrices
    'calculators.tax.title': 'Calculateur d\'impôt du Québec',
    'calculators.tax.subtitle': 'Calculez vos impôts facilement',
    'calculators.salary.title': 'Guide salarial',
    'calculators.salary.subtitle': 'Découvrez les salaires du marché',
    'calculators.mortgage.title': 'Calculateur hypothécaire',
    'calculators.mortgage.subtitle': 'Calculez vos paiements hypothécaires',
    'calculators.cnesst.title': 'Validation CNESST',
    'calculators.cnesst.subtitle': 'Vérifiez votre conformité',
    
    // Secteurs
    'sectors.title': 'Secteurs d\'expertise',
    'sectors.manufacturing': 'Fabrication',
    'sectors.construction': 'Construction',
    'sectors.healthcare': 'Santé',
    'sectors.transport': 'Transport',
    'sectors.agriculture': 'Agriculture',
    'sectors.technology': 'Technologie',
    'sectors.energy': 'Énergie',
    'sectors.aerospace': 'Aérospatiale',
    
    // Notifications et messages
    'notification.success': 'Succès !',
    'notification.error': 'Erreur !',
    'notification.warning': 'Attention !',
    'notification.info': 'Information',
    'notification.form_sent': 'Votre message a été envoyé avec succès',
    'notification.form_error': 'Une erreur est survenue lors de l\'envoi',
    'notification.application_sent': 'Votre candidature a été envoyée',
    
    // Boutons et actions
    'button.read_more': 'Lire la suite',
    'button.learn_more': 'En savoir plus',
    'button.get_started': 'Commencer',
    'button.download': 'Télécharger',
    'button.upload': 'Téléverser',
    'button.next': 'Suivant',
    'button.previous': 'Précédent',
    'button.close': 'Fermer',
    'button.back': 'Retour',
    'button.continue': 'Continuer',
    
    // Carrousel bannière d'accueil
    'carousel.slide1.title': 'Débloquez de nouvelles possibilités avec le bon',
    'carousel.slide1.title_highlight': 'Talent',
    'carousel.slide1.description': 'Découvrez des professionnels qualifiés, des emplois très demandés et des solutions sur mesure pour atteindre vos objectifs.',
    'carousel.slide1.job_seekers': 'POUR LES CHERCHEURS D\'EMPLOI',
    'carousel.slide1.businesses': 'POUR LES ENTREPRISES',
    'carousel.slide1.find_job': 'Trouvez votre prochain emploi',
    'carousel.slide1.preview_candidates': 'Aperçu des candidats',
    'carousel.slide1.hire_now': 'Embaucher maintenant',
    
    'carousel.slide2.title': 'Solutions de recrutement',
    'carousel.slide2.title_highlight': 'sur mesure pour chaque secteur',
    'carousel.slide2.description': 'Notre réseau de talents couvre un large éventail de rôles et de qualifications.',
    
    'carousel.slide3.title': 'Recrutement expert',
    'carousel.slide3.subtitle': 'pour vos besoins immédiats et',
    'carousel.slide3.title_highlight': 'à long terme',
    'carousel.slide3.description': 'Ensemble, nous trouverons le talent qui contribuera à votre succès.',
    
    'carousel.search.job_placeholder': 'Titre du poste, compétences ou mots-clés',
    'carousel.search.location_placeholder': 'Ville, province ou code postal',
    'carousel.search.button': 'Rechercher des emplois',
    
    // Section Add specialized talent
    'specialized_talent.title': 'Ajoutez des talents spécialisés dans votre organisation',
    'specialized_talent.trending_jobs': 'Titres d\'emploi en tendance',
    'specialized_talent.learn_more': 'En savoir plus sur nos solutions d\'embauche {{sector}}',
    
    // Section Explore success stories
    'success_stories.title': 'Explorez nos histoires de succès',
    
    // Section Partners & Accreditation
    'partners.title': 'Partenaires et accréditations',
    
    // Section App your way to a new job
    'mobile_app.title': 'Trouvez un emploi via notre app',
    'mobile_app.feature1': 'Recevez instantanément des notifications de correspondances d\'emploi',
    'mobile_app.feature2': 'Filtrez les recherches par compétences et préférences',
    'mobile_app.feature3': 'Postulez en un clic et bien plus encore',
    'mobile_app.download_on': 'Télécharger sur',
    'mobile_app.app_store': 'App Store',
    'mobile_app.google_play': 'Google Play',
    
    // Page À propos
    'about.catalyst.title': 'Catalyseur de prospérité pour les entreprises québécoises',
    'about.catalyst.description': 'Chez Industrielle RH, nous croyons fermement que les personnes sont la pierre angulaire du succès de chaque entreprise. En tant qu\'agence de recrutement spécialisée, nous excellons dans le recrutement local et international, offrant un processus transparent depuis la compréhension de vos besoins jusqu\'à l\'intégration des candidats idéaux dans votre équipe. Guidés par nos valeurs fondamentales de collaboration, d\'innovation et d\'intégrité, nous nous engageons à construire des partenariats durables et à livrer des résultats percutants. Laissez-nous combler le fossé entre le talent et l\'opportunité, permettant à votre entreprise de prospérer et créant une base solide pour une croissance durable.',
    
    // Caractéristiques principales
    'about.expertise.title': 'Expertise',
    'about.expertise.description': 'Nous excellons dans l\'identification précise des meilleurs talents francophones, garantissant une correspondance parfaite avec vos besoins spécifiques. Notre compréhension approfondie des industries garantit des solutions sur mesure pour vos défis de main-d\'œuvre.',
    'about.technology.title': 'Technologie',
    'about.technology.description': 'En utilisant des logiciels de pointe, nous rationalisons la gestion des CV et les procédures d\'immigration, offrant un processus de recrutement efficace et sans tracas pour tous les intervenants.',
    'about.innovative_approach.title': 'Approche innovante',
    'about.innovative_approach.description': 'Notre engagement va au-delà du recrutement. En priorisant l\'intégration sociale et l\'adaptation culturelle, nous assurons une transition en douceur et un succès à long terme pour les employés et les entreprises.',
    'about.reliability.title': 'Fiabilité',
    'about.reliability.description': 'Nous offrons une garantie de six mois sur nos placements, offrant la tranquillité d\'esprit et renforçant notre dévouement à fournir des résultats de qualité et un service inégalé.',
    
    // Mission, Vision et Valeurs
    'about.mission_vision_values.title': 'Mission, Vision et Valeurs',
    'about.mission.title': 'MISSION',
    'about.mission.description': 'Donner aux entreprises les moyens de prospérer dans leurs industries avec les meilleurs talents. Nous visons à simplifier le recrutement, en assurant une intégration transparente des candidats tout en contribuant au succès des entreprises et au bien-être des travailleurs.',
    'about.vision.title': 'VISION',
    'about.vision.description': 'Devenir le partenaire de choix pour les entreprises québécoises dans la recherche et l\'intégration de talents de premier plan du monde entier, favorisant une croissance mutuelle et un impact sociétal.',
    'about.values.title': 'VALEURS',
    'about.values.subtitle': 'Valeurs véhiculées par Industrielle RH',
    
    // Valeurs individuelles
    'about.innovation.title': 'INNOVATION',
    'about.innovation.description': 'L\'entreprise a été créée avec la conviction que nous pouvons apporter des innovations qui contribueront à l\'amélioration de notre société. Nous continuerons à faire de l\'innovation notre raison d\'être.',
    'about.integrity.title': 'INTÉGRITÉ',
    'about.integrity.description': 'L\'intégrité guide toutes nos actions. Nous créons des solutions qui renforcent la transparence dans le monde et développons des partenariats qui reflètent cet engagement.',
    'about.diversity.title': 'DIVERSITÉ',
    'about.diversity.description': 'L\'humanité est au cœur de notre mission. Nous valorisons la diversité des personnes qui travaillent pour nos entreprises clientes. Nous croyons fermement que le talent n\'a ni nationalité ni race.',
    'about.sustainability.title': 'DURABILITÉ',
    'about.sustainability.description': 'IR est déterminée à être, partout où elle opère, une entreprise socialement et environnementalement responsable avec un engagement envers le développement durable.',
    
    // Section recrutement francophone
    'about.francophone_talent.title': 'Embauchez les meilleurs talents francophones du monde entier',
    'about.francophone_talent.description': 'Industrielle RH est dirigée par une équipe de professionnels dévoués spécialisés dans le recrutement et la gestion de la main-d\'œuvre. Notre équipe se compose d\'experts en acquisition de talents, processus d\'immigration, intégration de la main-d\'œuvre et formation professionnelle. Avec une vaste expérience et une solide réputation de professionnalisme, de respect des délais et de durabilité de nos solutions de recrutement, nous nous engageons à aider votre organisation à prospérer en vous connectant avec les meilleurs talents francophones.',
    
    // Équipe de direction
    'about.leadership_team.title': 'Équipe de direction',
    'about.leadership_team.board_title': 'Conseil d\'administration',
    'about.ceo_message.paragraph1': 'Mon ambition derrière la création d\'Industrielle RH est née de mon propre parcours. Ayant occupé plusieurs postes à différents échelons dans le monde industriel et des services, j\'ai pu observer de près les réalités des employeurs, tout comme celles des travailleurs. J\'ai compris les défis auxquels font face les entreprises pour recruter efficacement, et ce que recherchent vraiment les employés pour s\'épanouir.',
    'about.ceo_message.paragraph2': 'Fort de cette expérience, j\'ai voulu créer une entreprise humaine, innovante et tournée vers l\'action, capable d\'accompagner les employeurs dans la recherche de talents fiables, qu\'ils soient d\'ici ou d\'ailleurs. Industrielle RH est le reflet de ma volonté de combler le fossé entre les besoins du marché du travail québécois et les aspirations des candidats, en offrant un service personnalisé, fondé sur le respect, l\'intégrité et une vraie compréhension des enjeux de chacun.',
    'about.ceo_message.paragraph3': 'Je crois fermement que le succès d\'une entreprise passe par la qualité des personnes qui la composent, et chaque jour, je m\'engage à bâtir des ponts solides entre les talents et les opportunités.',
    
    // Postes d'équipe
    'about.positions.ceo': 'Président Directeur Général',
    'about.positions.it_manager': 'Gestionnaire de projet TI',
    'about.positions.project_director': 'Directeur de Projet',
    'about.positions.it_systems_director': 'Directeur des Systèmes d\'Information',
    'about.positions.ai_project_director': 'Directeur de Projet-Intelligence Artificielle',
    'about.positions.web_developer': 'Développeuse Web et Designer UX/UI',
    
    // Page Find Jobs
    'find_jobs.hero.title': 'Trouvez un emploi qui vous convient',
    'find_jobs.hero.feature1': 'Choisissez parmi des centaines d\'emplois',
    'find_jobs.hero.feature2': 'Découvrez de nouvelles opportunités exclusives publiées chaque jour',
    'find_jobs.hero.feature3': 'Laissez nos recruteurs vous aider à trouver un emploi qui vous convient',
    'find_jobs.hero.submit_cv': 'Soumettre votre CV',
    
    // Comment nous vous aidons
    'find_jobs.how_help.title': 'Comment nous vous aidons à trouver un emploi',
    'find_jobs.upload_resume.title': 'Téléversez votre CV',
    'find_jobs.upload_resume.description': 'Ajoutez votre CV le plus récent pour correspondre aux postes ouverts.',
    'find_jobs.upload_resume.button': 'Téléverser le CV',
    'find_jobs.search_jobs.title': 'Rechercher les emplois disponibles',
    'find_jobs.search_jobs.description': 'Choisissez parmi des centaines d\'emplois (avec de nouveaux publiés quotidiennement)',
    'find_jobs.search_jobs.button': 'Rechercher',
    
    // Articles et blog
    'find_jobs.grow_learn.title': 'Grandir, apprendre et se préparer',
    'find_jobs.featured': 'EN VEDETTE',
    'find_jobs.tag_results': 'RÉSULTATS DE TAGS',
    'find_jobs.landing_job': 'Décrocher un emploi',
    'find_jobs.posts_count': '{{count}} publications',
    'find_jobs.what_jobs_demand': 'Quels emplois sont en demande ?',
    'find_jobs.subscribe_updates': 'S\'abonner aux mises à jour',
    
    // Barre de recherche
    'find_jobs.search.job_placeholder': 'Titre du poste, compétences ou mots-clés',
    'find_jobs.search.location_placeholder': 'Ville, province ou code postal',
    'find_jobs.search.button': 'Rechercher des emplois',
    
    // Section aide aux chercheurs d\'emploi
    'find_jobs.help_seekers.title': 'Explorez comment nous aidons les chercheurs d\'emploi',
    'find_jobs.step1.title': 'Commencer votre recherche d\'emploi sans frais',
    'find_jobs.step1.description': 'Postulez simplement ou téléversez votre CV pour accéder à des emplois en demande avec une rémunération et des avantages compétitifs.',
    'find_jobs.step1.apply_button': 'Postuler à des emplois',
    'find_jobs.step1.upload_button': 'Téléverser votre CV',
    
    'find_jobs.step2.title': 'Faire la correspondance',
    'find_jobs.step2.description': 'Les correspondances d\'emploi seront envoyées dans votre boîte de réception et sur votre téléphone.',
    
    'find_jobs.step3.title': 'Vous aider à décrocher l\'emploi',
    'find_jobs.step3.description': 'Nous vous guiderons lors des entretiens, plaiderons pour vous auprès des employeurs intéressés, et négocierons même le salaire en votre nom.',
    'find_jobs.step3.interview_tips': 'Obtenir des conseils d\'entretien',
    'find_jobs.step3.salary_guide': 'Explorer notre guide salarial',
    
    'find_jobs.step4.title': 'Rester concentré sur votre avenir',
    'find_jobs.step4.description': 'Au fur et à mesure que votre carrière se développe, notre formation en ligne gratuite et notre expertise vous aideront à rester au top de vos compétences, à garder votre profil à jour et à offrir des conseils en cours de route.',
    'find_jobs.step4.career_advice': 'Obtenir des conseils de carrière',
    
    'find_jobs.step5.title': 'Vous soutenir tout au long de votre carrière',
    'find_jobs.step5.description': 'Nous allons au-delà de simplement décrocher l\'emploi. Industrielle RH est là pour vous soutenir tout au long de votre parcours professionnel :',
    'find_jobs.step5.upskill_title': 'Se perfectionner avec une formation gratuite :',
    'find_jobs.step5.upskill_desc': 'Accédez aux opportunités de développement professionnel pour grandir et vous adapter dans votre rôle.',
    'find_jobs.step5.legal_title': 'Assistance juridique à vos côtés :',
    'find_jobs.step5.legal_desc': 'Obtenez du soutien pour comprendre vos droits et naviguer dans tous les défis avec confiance.',
    'find_jobs.step5.career_advice_title': 'Conseils de carrière continus :',
    'find_jobs.step5.career_advice_desc': 'Nous vous aidons à optimiser votre profil pour atteindre le succès à long terme.',
    'find_jobs.step5.training_button': 'Explorer nos programmes de formation',
    'find_jobs.step5.legal_button': 'En savoir plus sur notre soutien juridique',
    
    // Navigation étendue
    'find_jobs.nav.control_career': 'Contrôlez votre carrière. Trouvez le bon rôle pour vous et votre famille.',
    'find_jobs.nav.find_next_job': 'Trouvez votre prochain emploi',
    'find_jobs.nav.submit_cv': 'Soumettre votre CV',
    'find_jobs.nav.explore_help': 'Explorez comment nous aidons les chercheurs d\'emploi',

    // Page Hire Talent
    'hire_talent.nav.description': 'Nous sommes là pour vous connecter avec les meilleurs talents à tous les niveaux, des professionnels qualifiés aux dirigeants, adaptés aux besoins de votre industrie.',
    'hire_talent.nav.find_talents': 'Trouvez des talents avec nous',
    'hire_talent.nav.staffing': 'DOTATION EN PERSONNEL',
    'hire_talent.nav.recruitment_outsourcing': 'Recrutement par impartition',
    'hire_talent.nav.international_recruitment': 'Recrutement international',

    // Titre principal
    'hire_talent.hero.title': 'Trouvez votre prochaine embauche',
    'hire_talent.hero.description': 'Prévisualisez les candidats évalués par nos recruteurs et appariés par IA ou fournissez les détails du poste ouvert pour embaucher maintenant. Le choix vous appartient.',
    'hire_talent.hero.preview_candidates': 'Prévisualiser les candidats',
    'hire_talent.hero.hire_now': 'Embaucher maintenant',
    'hire_talent.hero.contact_us': 'Ou contactez-nous au',

    // Solutions de talents
    'hire_talent.solutions.title': 'Explorez nos solutions de talents',
    'hire_talent.solutions.outsourced.title': 'Recrutement Externalisé',
    'hire_talent.solutions.outsourced.description': 'Confiez-nous la gestion de vos besoins en main-d\'œuvre à court ou long terme. Accédez à des professionnels qualifiés prêts à rejoindre vos équipes rapidement pendant que vous vous concentrez sur vos priorités stratégiques.',
    'hire_talent.solutions.international.title': 'Recrutement International',
    'hire_talent.solutions.international.description': 'Trouvez des talents français exceptionnels dans le monde entier pour répondre à vos besoins spécifiques. Nos experts vous accompagnent à chaque étape, de la présélection des candidats à leur intégration transparente.',
    'hire_talent.solutions.learn_more': 'En savoir plus',

    // Comment ça marche
    'hire_talent.how_it_works.title': 'Comment ça fonctionne',
    'hire_talent.how_it_works.step1': 'Nous comprenons vos besoins',
    'hire_talent.how_it_works.step2': 'Nous trouvons les bons candidats',
    'hire_talent.how_it_works.step3': 'Nous gérons le processus de recrutement',
    'hire_talent.how_it_works.step4': 'Garantie de satisfaction de 6 mois',

    // Blog et articles
    'hire_talent.blog.title': 'Grandir, apprendre et se préparer',
    'hire_talent.blog.featured': 'EN VEDETTE',
    'hire_talent.blog.tag_results': 'RÉSULTATS DE TAG',
    'hire_talent.blog.landing_job': 'Décrocher un emploi',
    'hire_talent.blog.posts_count': '{{count}} publications',
    'hire_talent.blog.what_jobs_demand': 'Quels emplois sont en demande ?',
    'hire_talent.blog.subscribe_updates': 'S\'abonner aux mises à jour',

    // Candidats qualifiés
    'hire_talent.candidates.title': 'Voici un échantillon de nos candidats hautement qualifiés',
    'hire_talent.candidates.job_title': 'Titre du poste',
    'hire_talent.candidates.search': 'Rechercher',
    'hire_talent.candidates.reset_search': 'Réinitialiser la recherche',
    'hire_talent.candidates.connect_now': 'Se connecter maintenant',
    'hire_talent.candidates.need_help': 'Besoin d\'aide immédiate ? Appelez',

    // Résumé de recherche
    'hire_talent.search_summary.title': 'Votre résumé de recherche',
    'hire_talent.search_summary.description': 'Les détails de votre résumé de recherche seront fournis à l\'un de nos recruteurs expérimentés.',
    'hire_talent.search_summary.skills': 'Compétences',
    'hire_talent.search_summary.details_provided': 'Détails que vous avez fournis',
    'hire_talent.search_summary.attorney_lawyer': 'Avocat/Juriste',
    'hire_talent.contact_info.title': 'Vos informations de contact',
    'hire_talent.form.first_name': 'Prénom',
    'hire_talent.form.last_name': 'Nom de famille',
    'hire_talent.form.company_name': 'Nom de l\'entreprise',
    'hire_talent.form.job_title': 'Votre titre de poste',
    'hire_talent.form.work_email': 'Courriel professionnel',
    'hire_talent.form.work_phone': 'Téléphone professionnel',
    'hire_talent.form.tell_us_position': 'Parlez-nous du poste',
    'hire_talent.form.postal_code': 'Code postal',
    'hire_talent.form.position_type': 'Type de poste',
    'hire_talent.form.local_recruitment': 'Recrutement local',
    'hire_talent.form.international_recruitment': 'Recrutement international',
    'hire_talent.form.position_description': 'Description du poste',
    'hire_talent.form.submit': 'Soumettre',
    'hire_talent.form.submitting': 'Envoi en cours...',
    'hire_talent.form.success_message': 'Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.',
    'hire_talent.form.error_message': 'Une erreur s\'est produite lors de l\'envoi. Veuillez réessayer.',

    // Section Recrutement par impartition
    'hire_talent.outsourcing.title': 'Recrutement par impartition',
    'hire_talent.outsourcing.hero.title': 'Constituez une équipe solide avec des talents permanents adaptés à vos besoins.',
    'hire_talent.outsourcing.hero.description': 'L\'Impartition du Processus de Recrutement (IPR ou RPO) est une solution très intéressante pour les entreprises qui ont des besoins spécifiques, récurrents et bien définis.',
    'hire_talent.outsourcing.hire_talents': 'Embaucher des talents',

    // Avantages du recrutement externalisé
    'hire_talent.outsourcing.find_talent.title': 'Trouvez les meilleurs talents plus rapidement',
    'hire_talent.outsourcing.find_talent.description': 'Accélérez votre processus d\'embauche et comblez des postes critiques en quelques jours seulement avec nos solutions de recrutement virtuel efficaces.',
    'hire_talent.outsourcing.hire_precision.title': 'Embauchez avec précision et confiance',
    'hire_talent.outsourcing.hire_precision.description': 'Nos recruteurs experts et nos outils d\'appariement pilotés par IA identifient les candidats qui répondent à vos besoins uniques, exigences de compétences et budget.',
    'hire_talent.outsourcing.secure_fit.title': 'Sécurisez la bonne adéquation pour votre équipe',
    'hire_talent.outsourcing.secure_fit.description': 'Tirez parti de notre expertise sectorielle pour élaborer des offres compétitives et attirer les meilleurs candidats qui stimuleront votre succès.',

    // Contact
    'hire_talent.contact.title': 'Dites-nous ce dont vous avez besoin, nous nous occuperons du reste !',
    'hire_talent.contact.description': 'Prenez quelques secondes pour remplir ce formulaire et laissez-nous nous en occuper. Que ce soit pour un rôle spécifique ou des besoins plus larges, nous vous couvrons.',
    'hire_talent.contact.phone': 'Ou contactez-nous par téléphone',

    // Section Recrutement international
    'hire_talent.international.title': 'Recrutement international',
    'hire_talent.international.hero.title': 'Embauchez les meilleurs talents francophones du monde entier',
    'hire_talent.international.hero.description': 'Employeurs, ne laissez pas les problèmes de pénurie de main-d\'œuvre vous ralentir. Nos recruteurs et notre réseau de partenaires nous permettent de vous offrir un accompagnement à 360 degrés afin d\'accueillir rapidement vos nouvelles recrues.',
    'hire_talent.international.solution.title': 'Solution de recrutement tout inclus :',
    'hire_talent.international.solution.subtitle': 'De la recherche à l\'intégration, nous nous occupons de tout !',

    // Services internationaux
    'hire_talent.international.recruitment.title': 'Recrutement international',
    'hire_talent.international.recruitment.description': 'Spécialistes dans l\'embauche de travailleurs étrangers temporaires qualifiés pour des emplois manufacturiers au Québec.',
    'hire_talent.international.legal.title': 'Services juridiques',
    'hire_talent.international.legal.description': 'Nous simplifions le processus avec un soutien juridique expert à chaque étape',
    'hire_talent.international.welcome.title': 'Accueil et intégration',
    'hire_talent.international.welcome.description': 'De l\'arrivée à l\'intégration, nous assurons une expérience transparente pour vos nouveaux employés.',

    // Approche structurée
    'hire_talent.structured.title': 'Approche structurée',
    'hire_talent.structured.step1': 'Évaluation des besoins',
    'hire_talent.structured.step2': 'Sélection des meilleurs talents francophones',
    'hire_talent.structured.step3': 'Gestion du processus administratif',
    'hire_talent.structured.step4': 'Soutien à l\'intégration',
    'hire_talent.structured.step5': 'Garantie et soutien continu',
    'hire_talent.structured.contact_us': 'Contactez-nous',

    // Pourquoi choisir le recrutement international
    'hire_talent.why_international.title': 'Pourquoi choisir le recrutement international ?',
    'hire_talent.why_international.diverse_talent.title': 'Accès à des talents diversifiés',
    'hire_talent.why_international.diverse_talent.description': 'Élargissez vos options avec des professionnels qualifiés du monde entier, apportant de nouvelles perspectives et expertises.',
    'hire_talent.why_international.skill_gaps.title': 'Combler les lacunes de compétences critiques',
    'hire_talent.why_international.skill_gaps.description': 'Répondez à vos besoins en main-d\'œuvre dans les secteurs en forte demande où les talents locaux sont rares.',
    'hire_talent.why_international.competitiveness.title': 'Augmenter la compétitivité',
    'hire_talent.why_international.competitiveness.description': 'Renforcez votre entreprise avec des candidats expérimentés mondialement qui élèvent vos opérations et innovation.',
    'hire_talent.why_international.streamlined.title': 'Processus rationalisés',
    'hire_talent.why_international.streamlined.description': 'Bénéficiez d\'un processus de recrutement entièrement géré, de la recherche à l\'intégration, assurant une expérience transparente.',

    // Page Consulting Solutions
    'consulting.tabs.looking_to_hire': 'Je cherche à embaucher',
    'consulting.tabs.looking_for_job': 'Je cherche un emploi',
    'consulting.ready_to_hire.title': 'Prêt à embaucher ? Nous sommes prêts à vous aider',
    'consulting.and_many_more': 'Et bien d\'autres !',
    'consulting.hiring_trends.title': 'Tendances et perspectives d\'embauche',
    'consulting.hiring_trends.be_salary_smart': 'Soyez intelligent sur les salaires',
    'consulting.hiring_trends.be_salary_smart_desc': 'Obtenez les données que les meilleures entreprises utilisent pour attirer et retenir les talents qualifiés. Commencez avec notre calculateur de salaire.',
    'consulting.hiring_trends.career_development': 'Développement de carrière',
    'consulting.hiring_trends.career_development_desc': 'Obtenez des informations à jour sur les tendances d\'emploi dans votre industrie, y compris les salaires, les compétences et les changements du marché du travail.',
    'consulting.hiring_trends.what_jobs_demand_desc': 'Explorez notre rapport sur la demande de talents qualifiés pour voir quelles spécialisations les employeurs recherchent le plus.',
    'consulting.hiring_trends.landing_job_desc': 'Apprenez à rédiger un CV professionnel, à vous préparer pour un entretien d\'embauche et à faire une impression durable sur les responsables du recrutement.',
    'consulting.move_career.title': 'Faites avancer votre carrière',
    'consulting.move_career.subtitle': 'Soumettez votre candidature spontanée',
    'consulting.hiring_request.subtitle': 'Soumettez votre demande d\'embauche',
    'consulting.navbar.description': 'Découvrez comment nos capacités de conseil peuvent aider à transformer votre entreprise.',
    
    // Page Guide Salarial
    'salary_guide.hero.title': 'Découvrez votre valeur',
    'salary_guide.hero.description': 'Explorez les dernières données pour des centaines de postes et sachez ce que vous devriez gagner ou payer sur les marchés locaux et nationaux.',
    'salary_guide.trending_jobs.title': 'Titres d\'emploi en tendance',
    'salary_guide.trending_jobs.and_many_more': 'Et bien d\'autres !',
    'salary_guide.hiring_trends.title': 'Tendances et perspectives d\'embauche',
    'salary_guide.hiring_trends.be_salary_smart': 'Soyez intelligent sur les salaires',
    'salary_guide.hiring_trends.be_salary_smart_desc': 'Obtenez les données que les meilleures entreprises utilisent pour attirer et retenir les talents qualifiés. Commencez avec notre calculateur de salaire.',
    'salary_guide.hiring_trends.career_development': 'Développement de carrière',
    'salary_guide.hiring_trends.career_development_desc': 'Obtenez des informations à jour sur les tendances d\'emploi dans votre industrie, y compris les salaires, les compétences et les changements du marché du travail.',
    'salary_guide.hiring_trends.what_jobs_demand': 'Quels emplois sont en demande ?',
    'salary_guide.hiring_trends.what_jobs_demand_desc': 'Explorez notre rapport sur la demande de talents qualifiés pour voir quelles spécialisations les employeurs recherchent le plus.',
    'salary_guide.hiring_trends.landing_job': 'Décrocher un emploi',
    'salary_guide.hiring_trends.landing_job_desc': 'Apprenez à rédiger un CV professionnel, à vous préparer pour un entretien d\'embauche et à faire une impression durable sur les responsables du recrutement.',
    
    // Composants SalaryGuide
    'salary_guide.form.job_title': 'Titre du poste',
    'salary_guide.form.job_title_placeholder': 'ex. Ingénieur logiciel',
    'salary_guide.form.location': 'Lieu',
    'salary_guide.form.location_placeholder': 'ex. Montréal, QC',
    'salary_guide.form.experience': 'Années d\'expérience',
    'salary_guide.form.experience_0_1': '0-1 années',
    'salary_guide.form.experience_1_3': '1-3 années',
    'salary_guide.form.experience_3_5': '3-5 années',
    'salary_guide.form.experience_5_10': '5-10 années',
    'salary_guide.form.experience_10_plus': '10+ années',
    'salary_guide.form.search_salary': 'Rechercher salaire',
    'salary_guide.form.analyzing': 'Analyse en cours...',
    'salary_guide.error.title': 'Erreur:',
    'salary_guide.error.try_again': 'Veuillez réessayer avec une requête différente.',
    'salary_guide.start.title': 'Entrez vos détails d\'emploi pour commencer',
    'salary_guide.start.description': 'Nous analyserons des milliers de points de données pour vous fournir des informations salariales précises.',
    'salary_guide.results.experience': 'Expérience:',
    'salary_guide.results.years': 'années',
    'salary_guide.results.export': 'Exporter le rapport',
    'salary_guide.results.salary_range': 'Fourchette salariale',
    'salary_guide.results.median_salary': 'Salaire médian',
    'salary_guide.results.growth_outlook': 'Perspective de croissance',
    'salary_guide.results.per_year': 'par année',
    'salary_guide.results.salary_distribution': 'Répartition des salaires',
    'salary_guide.results.historical_trend': 'Tendance historique',
    'salary_guide.results.industry_comparison': 'Comparaison sectorielle',
    'salary_guide.results.data_updated': '* Tous les chiffres sont arrondis au nombre entier le plus proche. Données mises à jour le:',
    'salary_guide.chart.low': 'Bas (25%)',
    'salary_guide.chart.median': 'Médian (50%)',
    'salary_guide.chart.high': 'Haut (75%)',
    'salary_guide.chart.salary': 'Salaire',
    'salary_guide.industries.finance': 'Finance',
    'salary_guide.industries.technology': 'Technologie',
    'salary_guide.industries.healthcare': 'Soins de santé',
    'salary_guide.industries.education': 'Éducation',
    'salary_guide.industries.retail': 'Commerce de détail',

    // Salary Guide - Header
    'salary_guide.header.title': 'SalaryIQ',
    'salary_guide.header.about': 'À propos',
    'salary_guide.header.how_it_works': 'Comment ça marche',
    'salary_guide.header.resources': 'Ressources',

    // Salary Guide - Footer
    'salary_guide.footer.title': 'SalaryIQ',
    'salary_guide.footer.rights': 'Tous droits réservés',
    'salary_guide.footer.made_with': 'Fait avec',
    'salary_guide.footer.and_ai': 'et l\'IA',
    'salary_guide.footer.disclaimer': 'Avertissement: Les informations salariales sont générées à l\'aide de l\'IA et doivent être utilisées comme estimation seulement. Les salaires réels peuvent varier en fonction de nombreux facteurs, notamment l\'employeur, le lieu, les conditions du marché et les qualifications individuelles.',

    // Page Quebec Tax Calculator
    'quebec_tax_calculator.title': 'Calculez vos impôts avec notre outil',
    'quebec_tax_calculator.description': 'Au Canada, chaque province et territoire a ses propres taux d\'impôt provinciaux en plus des taux d\'impôt fédéraux. Ci-dessous se trouve un calculateur d\'impôt simple pour chaque province et territoire canadien. Ou vous pouvez choisir le calculateur d\'impôt pour une province ou un territoire particulier selon votre résidence.',
    'quebec_tax_calculator.help_section.title': 'Comment nous vous aidons à trouver un emploi',
    'quebec_tax_calculator.help_section.upload_resume.title': 'Téléversez votre CV',
    'quebec_tax_calculator.help_section.upload_resume.description': 'Ajoutez votre CV le plus récent pour correspondre aux postes ouverts.',
    'quebec_tax_calculator.help_section.upload_resume.button': 'Téléverser le CV',
    'quebec_tax_calculator.help_section.search_jobs.title': 'Rechercher les emplois disponibles',
    'quebec_tax_calculator.help_section.search_jobs.description': 'Choisissez parmi des centaines d\'emplois (avec de nouveaux publiés quotidiennement)',
    'quebec_tax_calculator.help_section.search_jobs.button': 'Rechercher',
    'quebec_tax_calculator.help_section.contact_button': 'Nous contacter',
    'quebec_tax_calculator.trending_jobs.title': 'Titres d\'emploi en tendance',
    'quebec_tax_calculator.trending_jobs.more_button': 'Et bien d\'autres !',
    'quebec_tax_calculator.calculator.title': 'Calculez votre revenu net',
    'quebec_tax_calculator.calculator.province_territory': 'Province/Territoire',
    'quebec_tax_calculator.calculator.select_province': 'Sélectionnez une province ou un territoire',
    'quebec_tax_calculator.calculator.tax_year': 'Année d\'imposition',
    'quebec_tax_calculator.calculator.select_tax_year': 'Sélectionnez l\'année d\'imposition',
    'quebec_tax_calculator.calculator.annual_income': 'Revenu annuel',
    'quebec_tax_calculator.calculator.hourly_wage': 'Salaire horaire',
    'quebec_tax_calculator.calculator.annual_gross_income': 'Revenu brut annuel',
    'quebec_tax_calculator.calculator.enter_annual_income': 'Entrez votre revenu brut annuel',
    'quebec_tax_calculator.calculator.enter_hourly_wage': 'Entrez votre salaire horaire',
    'quebec_tax_calculator.calculator.hours_per_week': 'Heures par semaine',
    'quebec_tax_calculator.calculator.enter_hours_per_week': 'Entrez les heures travaillées par semaine',
    'quebec_tax_calculator.calculator.bonuses_premiums': 'Bonus et primes',
    'quebec_tax_calculator.calculator.add_bonus': 'Ajouter un bonus',
    'quebec_tax_calculator.calculator.type': 'Type',
    'quebec_tax_calculator.calculator.percentage_of_base': 'Pourcentage du salaire de base',
    'quebec_tax_calculator.calculator.hourly_premium': 'Prime horaire',
    'quebec_tax_calculator.calculator.travel_allowance': 'Allocation de déplacement',
    'quebec_tax_calculator.calculator.percentage': 'Pourcentage',
    'quebec_tax_calculator.calculator.hourly_rate': 'Taux horaire',
    'quebec_tax_calculator.calculator.rate_per_km': 'Taux par KM',
    'quebec_tax_calculator.calculator.enter_amount': 'Entrez le montant',
    'quebec_tax_calculator.calculator.enter_hours': 'Entrez les heures',
    'quebec_tax_calculator.calculator.kilometers_per_week': 'Kilomètres par semaine',
    'quebec_tax_calculator.calculator.enter_kilometers': 'Entrez les kilomètres',
    'quebec_tax_calculator.calculator.cancel': 'Annuler',
    'quebec_tax_calculator.calculator.add': 'Ajouter',
    'quebec_tax_calculator.calculator.retirement_savings': 'Épargne-retraite',
    'quebec_tax_calculator.calculator.rrsp_contribution': 'Cotisation REER',
    'quebec_tax_calculator.calculator.rrsp_full_name': 'Régime enregistré d\'épargne-retraite (REER)',
    'quebec_tax_calculator.calculator.rrsp_desc_1': 'Réduit votre revenu imposable',
    'quebec_tax_calculator.calculator.rrsp_desc_2': 'Limite : 18% du revenu de l\'année précédente',
    'quebec_tax_calculator.calculator.rrsp_desc_3': 'Maximum {{limit}} pour {{year}}',
    'quebec_tax_calculator.calculator.rrsp_desc_4': 'Croissance à impôt différé jusqu\'au retrait',
    'quebec_tax_calculator.calculator.tfsa_contribution': 'Cotisation CELI',
    'quebec_tax_calculator.calculator.tfsa_full_name': 'Compte d\'épargne libre d\'impôt (CELI)',
    'quebec_tax_calculator.calculator.tfsa_desc_1': 'Cotisations après impôt',
    'quebec_tax_calculator.calculator.tfsa_desc_2': 'Croissance et retraits libres d\'impôt',
    'quebec_tax_calculator.calculator.tfsa_desc_3': 'Limite : {{limit}} pour {{year}}',
    'quebec_tax_calculator.calculator.tfsa_desc_4': 'Retraits flexibles en tout temps',
    'quebec_tax_calculator.calculator.other_deductions': 'Autres déductions',
    'quebec_tax_calculator.calculator.add_deduction': 'Ajouter une déduction',
    'quebec_tax_calculator.calculator.name': 'Nom',
    'quebec_tax_calculator.calculator.name_placeholder': 'ex : Cotisations syndicales',
    'quebec_tax_calculator.calculator.fixed_amount': 'Montant fixe',
    'quebec_tax_calculator.calculator.amount': 'Montant',
    'quebec_tax_calculator.calculator.enter_percentage': 'Entrez le pourcentage',
    'quebec_tax_calculator.calculator.description_optional': 'Description (optionnelle)',
    'quebec_tax_calculator.calculator.add_description': 'Ajouter une description',
    'quebec_tax_calculator.calculator.calculate': 'Calculer',
    'quebec_tax_calculator.calculator.calculating': 'Calcul en cours...',
    'quebec_tax_calculator.calculator.clear': 'Effacer',
    'quebec_tax_calculator.calculator.fill_required_fields': 'Veuillez remplir tous les champs requis avant de calculer',
    'quebec_tax_calculator.calculator.valid_bonus_amount': 'Veuillez entrer un montant de bonus valide',
    'quebec_tax_calculator.calculator.valid_deduction': 'Veuillez entrer un nom et un montant de déduction valides',
    'quebec_tax_calculator.calculator.minimum_wage_alert': 'Le salaire horaire entré ({{hourlyRate}}/h) est inférieur au salaire minimum de {{year}} dans {{province}} ({{minWage}}/h)',
    'quebec_tax_calculator.results.title': 'Résultats du calcul d\'impôt',
    'quebec_tax_calculator.results.below_minimum_wage': 'Votre revenu annuel ({{grossIncome}}) est inférieur au salaire minimum annuel de {{minAnnualSalary}} ({{minWage}}/h) pour {{province}} en {{taxYear}}.',
    'quebec_tax_calculator.results.income_breakdown': 'Ventilation du revenu',
    'quebec_tax_calculator.results.gross_income': 'Revenu brut',
    'quebec_tax_calculator.results.total_deductions': 'Déductions totales',
    'quebec_tax_calculator.results.rrsp_contribution': 'Cotisation REER',
    'quebec_tax_calculator.results.tfsa_contribution': 'Cotisation CELI',
    'quebec_tax_calculator.results.take_home_pay': 'Salaire net',
    'quebec_tax_calculator.results.monthly': 'Mensuel',
    'quebec_tax_calculator.results.bi_weekly': 'Aux deux semaines',
    'quebec_tax_calculator.results.tax_details': 'Détails fiscaux',
    'quebec_tax_calculator.results.federal_tax': 'Impôt fédéral',
    'quebec_tax_calculator.results.provincial_tax': 'Impôt provincial',
    'quebec_tax_calculator.results.cpp_contribution': 'Cotisation RPC',
    'quebec_tax_calculator.results.ei_premium': 'Prime AE',
    'quebec_tax_calculator.results.total_tax_paid': 'Impôt total payé',
    'quebec_tax_calculator.results.retirement_savings': 'Épargne-retraite',
    'quebec_tax_calculator.results.limit_of': '{{amount}} sur {{limit}} limite annuelle',
    'quebec_tax_calculator.results.take_home': 'Salaire net',
    'quebec_tax_calculator.results.disclaimer': '* Tous les calculs sont des estimations basées sur les taux d\'imposition actuels. Veuillez consulter un professionnel fiscal pour des conseils détaillés.',

    // Quebec Tax Calculator - Chart
    'quebec_tax_calculator.chart.take_home_pay': 'Salaire net',
    'quebec_tax_calculator.chart.total_deductions': 'Déductions totales',
    'quebec_tax_calculator.chart.amount': 'Montant',
    'quebec_tax_calculator.chart.percentage': 'Pourcentage',
    'quebec_tax_calculator.chart.take_home_description': 'C\'est votre salaire net après toutes les déductions',
    'quebec_tax_calculator.chart.deductions_description': 'Total de tous les impôts et déductions incluant RPC et AE',
    'quebec_tax_calculator.chart.annual_take_home': 'Salaire net annuel',
    'quebec_tax_calculator.chart.monthly': 'Mensuel',
    'quebec_tax_calculator.chart.bi_weekly': 'Aux deux semaines',
    'quebec_tax_calculator.chart.income_distribution': 'Répartition du revenu',
    'quebec_tax_calculator.chart.total_income': 'Revenu total',
    'quebec_tax_calculator.chart.annual': 'Annuel',

    // Quebec Tax Calculator - Header
    'quebec_tax_calculator.header.title': 'Calculateur de salaire net canadien',

    // Quebec Tax Calculator - Footer
    'quebec_tax_calculator.footer.title': 'Calculateur de salaire net canadien',
    'quebec_tax_calculator.footer.disclaimer': '*Avertissement: Ce calculateur fournit des estimations seulement. Pour des conseils fiscaux précis, veuillez consulter un professionnel fiscal.',

    // Quebec Tax Calculator - Success Send
    'quebec_tax_calculator.success_send.title': 'Demande envoyée avec succès !',
    'quebec_tax_calculator.success_send.description': 'Nous vous contacterons dans les plus brefs délais.',
    'quebec_tax_calculator.success_send.back_home': 'Retour à l\'accueil',
    'quebec_tax_calculator.success_send.alt_image': 'Demande envoyée avec succès',

    // Page Mortgage Calculator
    'mortgage_calculator.title': 'Calculez vos paiements hypothécaires',
    'mortgage_calculator.description': 'Estimez rapidement vos paiements hypothécaires mensuels basés sur le prix d\'achat, la mise de fonds, le taux d\'intérêt et la durée du prêt. Utilisez notre outil simple et efficace pour planifier votre budget immobilier en toute confiance.',
    'mortgage_calculator.help_section.title': 'Comment nous vous aidons à trouver un emploi',
    'mortgage_calculator.help_section.upload_resume.title': 'Téléversez votre CV',
    'mortgage_calculator.help_section.upload_resume.description': 'Ajoutez votre CV le plus récent pour correspondre aux postes ouverts.',
    'mortgage_calculator.help_section.upload_resume.button': 'Téléverser le CV',
    'mortgage_calculator.help_section.search_jobs.title': 'Rechercher les emplois disponibles',
    'mortgage_calculator.help_section.search_jobs.description': 'Choisissez parmi des centaines d\'emplois (avec de nouveaux publiés quotidiennement)',
    'mortgage_calculator.help_section.search_jobs.button': 'Rechercher',
    'mortgage_calculator.help_section.contact_button': 'Nous contacter',
    'mortgage_calculator.trending_jobs.title': 'Titres d\'emploi en tendance',
    'mortgage_calculator.trending_jobs.more_button': 'Et bien d\'autres !',
    'mortgage_calculator.calculator.title': 'Calculateur de paiement hypothécaire',
    'mortgage_calculator.calculator.purchase_price': 'Prix d\'achat',
    'mortgage_calculator.calculator.enter_purchase_price': 'Entrez le prix d\'achat',
    'mortgage_calculator.calculator.down_payment': 'Mise de fonds',
    'mortgage_calculator.calculator.enter_down_payment': 'Entrez la mise de fonds',
    'mortgage_calculator.calculator.interest_rate': 'Taux d\'intérêt',
    'mortgage_calculator.calculator.enter_interest_rate': 'Entrez le taux d\'intérêt',
    'mortgage_calculator.calculator.amortization': 'Amortissement',
    'mortgage_calculator.calculator.payment_frequency': 'Fréquence de paiement',
    'mortgage_calculator.calculator.calculate': 'Calculer',
    'mortgage_calculator.calculator.clear': 'Effacer',
    'mortgage_calculator.calculator.5_years': '5 ans',
    'mortgage_calculator.calculator.10_years': '10 ans',
    'mortgage_calculator.calculator.15_years': '15 ans',
    'mortgage_calculator.calculator.20_years': '20 ans',
    'mortgage_calculator.calculator.25_years': '25 ans',
    'mortgage_calculator.calculator.30_years': '30 ans',
    'mortgage_calculator.calculator.weekly': 'Hebdomadaire',
    'mortgage_calculator.calculator.bi_weekly': 'Aux deux semaines',
    'mortgage_calculator.calculator.monthly': 'Mensuel',
    'mortgage_calculator.calculator.purchase_price_required': 'Le prix d\'achat est requis',
    'mortgage_calculator.calculator.valid_price': 'Veuillez entrer un prix valide',
    'mortgage_calculator.calculator.down_payment_required': 'La mise de fonds est requise',
    'mortgage_calculator.calculator.valid_amount': 'Veuillez entrer un montant valide',
    'mortgage_calculator.calculator.less_than_purchase': 'Doit être inférieur au prix d\'achat',
    'mortgage_calculator.calculator.interest_rate_required': 'Le taux d\'intérêt est requis',
    'mortgage_calculator.calculator.valid_rate': 'Veuillez entrer un taux valide (0-20%)',
    'mortgage_calculator.calculator.interest_rate_tooltip': 'Le taux d\'intérêt annuel pour votre prêt hypothécaire.',
    'mortgage_calculator.calculator.amortization_tooltip': 'La durée totale qu\'il faudra pour rembourser votre hypothèque en entier.',

    // Mortgage Calculator Results
    'mortgage_calculator.results.title': 'Sommaire des paiements',
    'mortgage_calculator.results.bi_weekly_payment': 'Paiement aux deux semaines',
    'mortgage_calculator.results.monthly_payment': 'Paiement mensuel',
    'mortgage_calculator.results.annual_payment': 'Paiement annuel',
    'mortgage_calculator.results.disclaimer': '* Tous les chiffres sont arrondis à l\'entier le plus proche et sont fournis à titre indicatif seulement.',

    // Page Discover Insights
    'discover_insights.hero.title': 'Maîtrisez l\'avenir de votre travail',
    'discover_insights.hero.description': 'Explorez nos recherches exclusives et nos insights pratiques d\'experts de l\'industrie pour transformer votre entreprise ou guider votre carrière.',
    'discover_insights.hero.alt': 'Maîtrisez l\'avenir de votre travail',
    'discover_insights.featured.title': 'Découvrez nos insights exclusifs',
    'discover_insights.articles.title': 'Affinez votre recherche',
    'discover_insights.filters.title': 'Filtrer le contenu par',
    'discover_insights.filters.tags': 'Mots-clés',
    'discover_insights.filters.specialties': 'Spécialisations',
    
    // Navbar Discover Insights
    'discover_insights.navbar.description': 'Prenez des décisions plus éclairées grâce aux dernières tendances d\'embauche et aux insights de carrière.',
    'discover_insights.navbar.button': 'Découvrir les insights',
    'discover_insights.navbar.trending_topics': 'Sujets tendances',
    'discover_insights.navbar.tools': 'Outils',
    'discover_insights.navbar.topics.salary_trends': 'Tendances salariales et d\'embauche',
    'discover_insights.navbar.topics.adaptive_working': 'Travail adaptatif',
    'discover_insights.navbar.topics.competitive_advantage': 'Avantage concurrentiel',
    'discover_insights.navbar.topics.work_life_balance': 'Équilibre travail/vie personnelle',
    'discover_insights.navbar.topics.diversity_inclusion': 'Diversité et inclusion',
    'discover_insights.navbar.tools.quebec_tax_calculator': 'Calculateur d\'impôts du Québec',
    'discover_insights.navbar.tools.mortgage_calculator': 'Calculateur hypothécaire',
    'discover_insights.navbar.tools.salary_guide': 'Guide salarial',
    'discover_insights.filters.clear': 'Effacer les filtres',
    'discover_insights.load_more': 'Charger plus d\'articles',
    'discover_insights.no_articles': 'Aucun article trouvé avec les filtres sélectionnés.',
    'discover_insights.newsletter.title': 'Recevez nos insights dans votre boîte',
    'discover_insights.newsletter.cta': 'S\'abonner aux mises à jour',
    'discover_insights.subscription.title': 'Abonnez-vous à l\'infolettre Industrielle RH',
    'discover_insights.subscription.description': 'En vous abonnant à l\'infolettre d\'Industrielle RH, vous aurez accès à des articles précieux, des ressources et des mises à jour pour vous aider à recruter les meilleurs talents, améliorer l\'intégration de la main-d\'œuvre et rester informé des dernières tendances du secteur du recrutement. Recevez des insights directement dans votre boîte de réception pour soutenir la croissance et le succès de votre entreprise. Pour recevoir les mises à jour d\'Industrielle RH, il suffit d\'entrer votre nom et votre courriel ci-dessous. Vous pouvez retirer votre consentement à tout moment en contactant Industrielle RH Recrutement International Inc.',
    'discover_insights.subscription.form_title': 'Pourquoi attendre ? Inscrivez-vous maintenant',
    'discover_insights.subscription.interests': 'Quel sujet vous intéresse ?',
    'discover_insights.subscription.areas_label': 'Domaines d\'intérêt',
    'discover_insights.subscription.success_message': 'Votre inscription à la newsletter a été confirmée ! Vous recevrez bientôt nos dernières actualités.',
    'discover_insights.subscription.error_message': 'Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.',
    'discover_insights.static.salary_guide': 'Guide salarial 2025',
    'discover_insights.static.salary_guide_desc': 'Explorez les dernières données pour des centaines de postes et sachez ce que vous devriez gagner ou payer sur les marchés locaux et nationaux.',
    'discover_insights.static.jobs_demand': 'Quels emplois sont en demande ?',
    'discover_insights.static.jobs_demand_desc': 'Explorez notre rapport sur la demande de talents qualifiés pour voir quelles spécialisations les employeurs recherchent le plus.',
    'discover_insights.static.engagement': 'Créer l\'engagement des employés',
    'discover_insights.static.engagement_desc': 'Attirez et retenez les meilleurs talents et améliorez votre rentabilité avec nos conseils pour la reconnaissance et les récompenses créatives des employés.',
    
    // Communs
    'common.views': 'vues',
    'common.first_name': 'Prénom',
    'common.last_name': 'Nom de famille',
    'common.email': 'Courriel',
    'common.submit': 'Soumettre',
    'common.submitting': 'Envoi en cours...',
    'common.published_on': 'Publié le',
    'common.updated_on': 'Mis à jour le',
    'common.share_email': 'Partager par email',
    'common.copy_link': 'Copier le lien',
    'common.link_copied': 'Lien copié !',
    'common.by_author': 'Par',
    'common.share': 'Partager',
    'common.copy': 'Copier',
    'common.share_facebook': 'Partager sur Facebook',
    'common.share_linkedin': 'Partager sur LinkedIn',
    'common.share_twitter': 'Partager sur X (Twitter)',
    'common.share_whatsapp': 'Partager sur WhatsApp',
    'common.similar_articles': 'Articles similaires',
    'common.view_all_articles': 'Voir tous les articles',
    'common.no_similar_articles': 'Aucun article similaire trouvé',
    'common.did_you_like_article': 'Vous avez aimé cet article ?',
    'common.discover_more_articles': 'Découvrir plus d\'articles',
    'common.contact_us': 'Nous contacter',

    // Privacy Policy
    'privacy_policy.title': 'Politique de confidentialité',
    'privacy_policy.effective_date': 'Date d\'entrée en vigueur',
    'privacy_policy.intro': 'Chez Industrielle RH, nous valorisons votre vie privée et nous nous engageons à protéger vos informations personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données lorsque vous interagissez avec nos services.',
    'privacy_policy.section1.title': '1. Informations que nous collectons',
    'privacy_policy.section1.intro': 'Nous pouvons collecter les informations personnelles suivantes :',
    'privacy_policy.section1.item1': 'Nom, adresse e-mail, numéro de téléphone.',
    'privacy_policy.section1.item2': 'CV/résumé, expérience professionnelle, formation.',
    'privacy_policy.section1.item3': 'Préférences d\'emploi et qualifications.',
    'privacy_policy.section1.item4': 'Statut d\'immigration ou documents (lorsque requis pour le placement).',
    'privacy_policy.section1.item5': 'Toute autre information que vous choisissez de fournir.',
    'privacy_policy.section2.title': '2. Comment nous utilisons vos informations',
    'privacy_policy.section2.intro': 'Vos informations sont utilisées pour :',
    'privacy_policy.section2.item1': 'Fournir des services de recrutement et de dotation.',
    'privacy_policy.section2.item2': 'Vous mettre en relation avec des employeurs potentiels.',
    'privacy_policy.section2.item3': 'Communiquer des opportunités d\'emploi et des mises à jour.',
    'privacy_policy.section2.item4': 'Respecter les exigences légales et réglementaires.',
    'privacy_policy.section2.item5': 'Améliorer nos services et votre expérience.',
    'privacy_policy.section3.title': '3. Partage de vos informations',
    'privacy_policy.section3.intro': 'Nous pouvons partager vos données avec :',
    'privacy_policy.section3.item1': 'Des employeurs et partenaires cherchant à pourvoir des postes.',
    'privacy_policy.section3.item2': 'Des professionnels juridiques et de l\'immigration (si requis).',
    'privacy_policy.section3.item3': 'Des fournisseurs de services nous aidant à fournir nos services (ex: support informatique).',
    'privacy_policy.section3.item4': 'Les autorités si la loi l\'exige.',
    'privacy_policy.section3.no_sell': 'Nous ne vendons ni ne louons vos informations personnelles.',
    'privacy_policy.section4.title': '4. Vos droits',
    'privacy_policy.section4.intro': 'Vous avez le droit de :',
    'privacy_policy.section4.item1': 'Accéder à vos informations personnelles.',
    'privacy_policy.section4.item2': 'Demander des corrections ou des mises à jour.',
    'privacy_policy.section4.item3': 'Retirer votre consentement à tout moment.',
    'privacy_policy.section4.item4': 'Demander la suppression de vos données, sous réserve des limites légales.',
    'privacy_policy.section4.contact': 'Pour exercer vos droits, contactez-nous à',
    'privacy_policy.section5.title': '5. Sécurité des données',
    'privacy_policy.section5.content': 'Nous prenons des mesures raisonnables pour protéger vos informations contre tout accès non autorisé, perte ou utilisation abusive.',
    'privacy_policy.section6.title': '6. Conservation des données',
    'privacy_policy.section6.content': 'Nous conservons vos données aussi longtemps que nécessaire pour fournir nos services ou comme l\'exige la loi.',
    'privacy_policy.section7.title': '7. Nous contacter',
    'privacy_policy.section7.content': 'Si vous avez des questions sur cette politique de confidentialité ou sur la manière dont nous traitons vos données, veuillez nous contacter :',
    'privacy_policy.section8.title': '8. Mises à jour de cette politique',
    'privacy_policy.section8.content': 'Nous pouvons mettre à jour cette politique de temps à autre. Toutes les modifications seront publiées sur notre site Web avec la date mise à jour.',
    'privacy_policy.section8.agreement': 'En utilisant nos services, vous acceptez cette politique de confidentialité.',

    // Fraud Alert
    'fraud_alert.title': 'Alerte à la fraude',
    'fraud_alert.intro': 'Chez Industrielle RH, votre vie privée et votre sécurité sont une priorité absolue. Nous ne demandons jamais aux chercheurs d\'emploi de :',
    'fraud_alert.never_ask.item1': 'Payer des frais pour obtenir un emploi ou recevoir un paiement de notre part.',
    'fraud_alert.never_ask.item2': 'Avancer de l\'argent ou des chèques à nous ou à un tiers.',
    'fraud_alert.never_ask.item3': 'Encaisser des chèques de sources inconnues.',
    'fraud_alert.never_ask.item4': 'Acheter des produits, des services ou des cartes-cadeaux.',
    'fraud_alert.never_ask.item5': 'Fournir des détails financiers sensibles comme des numéros de carte de crédit ou des codes PIN bancaires.',
    'fraud_alert.no_instant_messaging': 'Nous ne faisons pas d\'offres d\'emploi et ne demandons pas de candidatures via des applications de messagerie instantanée comme Telegram. Nous ne demandons jamais de numéros d\'identification gouvernementaux, tels que les numéros d\'assurance sociale (NAS), ou de détails bancaires/de paiement via ces plateformes.',
    'fraud_alert.no_freelance_platforms': 'Nous ne publions pas d\'offres d\'emploi et ne recrutons pas via des plateformes freelance telles que Fiverr ou Upwork, et nous ne contacterons pas les candidats via ces canaux.',
    'fraud_alert.no_digital_wallets': 'Nous n\'envoyons ni ne demandons d\'argent via des applications mobiles ou des portefeuilles numériques comme GCash, Skrill, Shopify ou Google Pay, et nous ne demandons ni n\'envoyons de paiements en cryptomonnaie.',
    'fraud_alert.authorized_regions': 'Industrielle RH ne recrute que dans les régions où nous sommes légalement autorisés à opérer.',
    'fraud_alert.what_to_do.title': 'Que faire si vous soupçonnez une fraude',
    'fraud_alert.what_to_do.content': 'Si vous recevez des messages suspects prétendant provenir d\'Industrielle RH, veuillez nous contacter immédiatement à',
    'fraud_alert.suspicious_signs.title': 'Les signes suspects incluent des demandes de :',
    'fraud_alert.suspicious_signs.item1': 'Informations personnelles ou financières par e-mail, applications de messagerie ou réseaux sociaux.',
    'fraud_alert.suspicious_signs.item2': 'Paiements en échange d\'offres d\'emploi ou d\'entretiens.',
    'fraud_alert.resources.title': 'Ressources utiles :',
    'fraud_alert.resources.item1': 'Centre antifraude du Canada – Signaler une fraude :',
    'fraud_alert.resources.item2': 'Que faire si vous êtes victime de fraude :',
    'fraud_alert.resources.item3': 'Bureau de la consommation (Canada) – Vol d\'identité et fraude :',
    'fraud_alert.resources.item4': 'GRC – Fraudes et escroqueries :',

    // Terms of Use
    'terms_of_use.title': 'Conditions d\'utilisation',
    'terms_of_use.effective_date': 'Date d\'entrée en vigueur',
    'terms_of_use.intro': 'Bienvenue sur le site Web de Industrielle RH Recrutement International Inc. En accédant à notre site ou en l\'utilisant, vous acceptez les conditions d\'utilisation suivantes. Veuillez les lire attentivement.',
    'terms_of_use.section1.title': '1. Acceptation des conditions',
    'terms_of_use.section1.content': 'En utilisant ce site, vous acceptez de vous conformer à ces conditions. Si vous n\'êtes pas d\'accord, vous ne devez pas utiliser le site.',
    'terms_of_use.section2.title': '2. Utilisation du site',
    'terms_of_use.section2.intro': 'Vous ne pouvez utiliser ce site qu\'à des fins légales et conformément à ces conditions. Le contenu est destiné à un usage personnel et non commercial.',
    'terms_of_use.section2.agree_not_to': 'Vous acceptez de ne pas :',
    'terms_of_use.section2.item1': 'Violer les lois applicables.',
    'terms_of_use.section2.item2': 'Télécharger des informations fausses ou trompeuses.',
    'terms_of_use.section2.item3': 'Perturber la fonctionnalité ou la sécurité du site.',
    'terms_of_use.section3.title': '3. Propriété intellectuelle',
    'terms_of_use.section3.content': 'Tout le contenu de ce site, y compris le texte, les graphiques, les logos et les logiciels, est la propriété d\'Industrielle RH ou de ses concédants de licence. Vous ne pouvez pas reproduire, distribuer ou créer des œuvres dérivées sans notre autorisation écrite.',
    'terms_of_use.section4.title': '4. Contenu utilisateur',
    'terms_of_use.section4.content': 'Si vous soumettez des informations (par exemple, des CV), vous accordez à Industrielle RH une licence pour les utiliser, les stocker et les traiter à des fins de recrutement. Vous êtes responsable de l\'exactitude de tout contenu que vous fournissez.',
    'terms_of_use.section5.title': '5. Liens tiers',
    'terms_of_use.section5.content': 'Notre site peut contenir des liens vers des sites Web externes. Nous ne sommes pas responsables du contenu ou des pratiques de confidentialité de ces tiers.',
    'terms_of_use.section6.title': '6. Clause de non-responsabilité',
    'terms_of_use.section6.content': 'Le site est fourni "tel quel" sans garantie d\'aucune sorte. Nous ne garantissons pas l\'exactitude, l\'exhaustivité ou la fiabilité du contenu du site.',
    'terms_of_use.section7.title': '7. Limitation de responsabilité',
    'terms_of_use.section7.content': 'Industrielle RH n\'est pas responsable des dommages indirects ou consécutifs découlant de votre utilisation du site.',
    'terms_of_use.section8.title': '8. Résiliation',
    'terms_of_use.section8.content': 'Nous pouvons résilier ou suspendre votre accès au site à tout moment, sans préavis, en cas de violation de ces conditions.',
    'terms_of_use.section9.title': '9. Loi applicable',
    'terms_of_use.section9.content': 'Ces conditions sont régies par les lois de la province de Québec, Canada. Tout litige sera résolu devant les tribunaux de Montréal, Québec.',
    'terms_of_use.section10.title': '10. Contact',
    'terms_of_use.section10.content': 'Si vous avez des questions sur ces conditions, veuillez nous contacter à :',
    'terms_of_use.section10.agreement': 'En utilisant notre site, vous acceptez ces conditions d\'utilisation.',
  },
  en: {
    // Footer
    'footer.services': 'Services',
    'footer.browse_jobs': 'Browse Jobs',
    'footer.international_recruitment': 'International Recruitment',
    'footer.recruitment_outsourcing': 'Recruitment by Outsourcing',
    'footer.areas_expertise': 'Areas of Expertise',
    'footer.manufacturing': 'Manufacturing',
    'footer.construction': 'Construction',
    'footer.healthcare': 'Healthcare',
    'footer.transport': 'Transport',
    'footer.agriculture': 'Agriculture & Agro-Food',
    'footer.about_us': 'About Us',
    'footer.about_industrielle': 'About Industrielle RH',
    'footer.careers': 'Careers with Us',
    'footer.location': 'Location',
    'footer.hours': 'Monday to Friday from 8:30 AM to 5:00 PM',
    'footer.select_region': 'Select a region and language',
    'footer.fraud_alert': 'Fraud Alert',
    'footer.privacy_policy': 'Privacy Policy',
    'footer.terms_of_use': 'Terms of Use',
    'footer.rights_reserved': '© 2025 Industrielle RH Inc. All Rights Reserved.',
    'footer.quebec_license': 'Quebec license number AP-2000503',
    
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
    'nav.discover_insights' : 'Discover Insights',
    
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
    'form.civility': 'Civility',
    'form.address': 'Address',
    'form.city': 'City',
    'form.sector': 'Sector',
    'form.function': 'Function',
    'form.years_experience': 'Year(s) of experience',
    'form.cv_format': 'CV (Word only, doc or docx format)*',
    'form.cover_letter_format': 'Cover letter (PDF or DOC)*',
    'form.company_website': 'Company website',
    'form.number_positions': 'Number of positions to be filled',
    'form.select_sectors': 'Select sectors',
    'form.position_details': 'Position details',
    'form.support_document': 'Document in support of the request (PDF or DOC)',
    'form.start': 'TO START',
    
    // Page d'accueil
    'home.hero.title': 'Find the industrial talent you need',
    'home.hero.subtitle': 'We connect top talent with leading companies in the industrial sector',
    'home.hero.cta_hire': 'Hire Talent',
    'home.hero.cta_jobs': 'Find Jobs',
    'home.specialized_talent.title': 'Add specialized talent across your organization',
    'home.specialized_talent.subtitle': 'Our recruitment experts help you find the best candidates',
    'home.how_it_works.title': 'How it works',
    'home.testimonials.title': 'What our clients say',
    'home.latest_jobs.title': 'Latest jobs',
    'home.view_all_jobs': 'View all jobs',
    
    // Cards section
    'home.cards.salary_guide.title': 'Salary Guide',
    'home.cards.salary_guide.desc': 'Explore the latest data for hundreds of positions and know what you should earn or pay in local and national markets.',
    'home.cards.cv_builder.title': 'Tax Calculator',
    'home.cards.cv_builder.desc': 'Calculate your Quebec taxes easily. Accurate estimation of your deductions and refunds.',
    'home.cards.blog.title': 'IR Blog',
    'home.cards.blog.desc': 'Stay one step ahead with the latest data, insights, tips and tricks from some of the foremost experts in the talent solutions business.',
    'home.cards.tech_skills.title': 'Navigate tech skills gaps',
    'home.cards.tech_skills.desc': 'Discover strategies for building a comprehensive tech team to support business priorities.',
    
    // Worry-free recruitment section
    'home.worry_free.title': 'Worry-free recruitment for today\'s and tomorrow\'s Quebec!',
    'home.worry_free.subtitle': 'We help you build a strong team to tackle the challenges of Quebec\'s competitive market.',
    'home.worry_free.search_label': 'I\'m looking for a',
    'home.worry_free.job_placeholder': 'Job Title',
    'home.worry_free.preview_btn': 'Preview candidates',
    
    // How it works section
    'home.how_it_works.step1': 'Describe your Need',
    'home.how_it_works.step2': 'We Source the Talent',
    'home.how_it_works.step3': 'Select and Approve',
    'home.how_it_works.step4': 'Seamless Integration',
    'home.how_it_works.step5': 'Continuous Support',
    
    // Partner with talent section
    'home.partner_talent.title': 'Partner with qualified talent aligned with your company values',
    'home.partner_talent.point1': 'Access Industrielle RH\'s extensive network of qualified candidates in manufacturing, construction, healthcare, logistics, and agriculture.',
    'home.partner_talent.point2': 'Quickly match with local and international professionals who have the right skills and industry expertise.',
    'home.partner_talent.point3': 'Let us recruit candidates at every level, from entry-level to managerial roles.',
    'home.partner_talent.find_hire_btn': 'Find your next hire',
    'home.partner_talent.learn_more_btn': 'Learn more',
    
    // Employee recognition section
    'home.employee_recognition.title': 'We are experts in employee recognition',
    'home.employee_recognition.point1': 'Our offering includes tailored employee recognition programs.',
    'home.employee_recognition.point2': 'Continuing training adapted to your needs.',
    'home.employee_recognition.point3': 'Ongoing support to ensure integration and retention.',
    'home.employee_recognition.point4': 'Personalized solutions to celebrate your team\'s achievements.',
    'home.employee_recognition.consulting_btn': 'Find your consulting solution',
    
    // Shape career section
    'home.shape_career.title': 'Shape the career you want',
    'home.shape_career.point1': 'Free legal assistance.',
    'home.shape_career.point2': 'Get personalized job recommendations tailored to your skills and goals, whether locally or internationally.',
    'home.shape_career.point3': 'Explore opportunities across industries for contract or permanent roles.',
    'home.shape_career.point4': 'Enjoy competitive pay and benefits, along with free online training and development programs to help you grow.',
    'home.shape_career.job_matches_btn': 'Get job matches',
    
    // À propos
    'about.title': 'About Industrielle RH',
    'about.subtitle': 'Your trusted partner in industrial recruitment',
    'about.mission.title_short': 'Our mission',
    'about.vision.title_short': 'Our vision',
    'about.values.title_short': 'Our values',
    'about.team.title': 'Our team',
    'about.experience': 'years of experience',
    'about.clients': 'satisfied clients',
    'about.placements': 'successful placements',
    
    // Services
    'services.title': 'Our services',
    'services.recruitment.title': 'Specialized Recruitment',
    'services.recruitment.desc': 'Find the best talent for your industrial positions',
    'services.consulting.title': 'HR Consulting',
    'services.consulting.desc': 'Optimize your recruitment processes',
    'services.outsourcing.title': 'HR Outsourcing',
    'services.outsourcing.desc': 'Trust us with your recruitment needs',
    
    // Contact
    'contact.title': 'Contact us',
    'contact.subtitle': 'Ready to find your next talent?',
    'contact.get_in_touch': 'Get in touch',
    'contact.office_hours': 'Office hours',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.send_message': 'Send message',
    
    // Contact Page specific
    'contact.we_accept_mandates': 'We accept recruitment mandates across Quebec!',
    'contact.based_in_quebec': 'Based in the heart of Quebec, Industrielle RH is your trusted partner for specialized recruitment in the manufacturing, industrial, and other key sectors. Whether you\'re in Montreal, Quebec City, or anywhere else in the province, we\'re ready to meet your recruitment needs.',
    'contact.contact_us': 'Contact Us',
    'contact.feel_free_reach': 'Feel free to reach out to learn more about our recruitment services or to entrust us with your mandate.',
    'contact.telephone_label': 'Phone',
    'contact.languages_spoken': 'Languages spoken',
    'contact.french_english': 'French & English',
    'contact.your_contact_info': 'Your contact information',
    'contact.first_name_placeholder': 'First Name',
    'contact.last_name_placeholder': 'Last Name',
    'contact.company_name_placeholder': 'Company Name',
    'contact.job_title_placeholder': 'Your Job Title',
    'contact.work_email_placeholder': 'Work Email',
    'contact.work_phone_placeholder': 'Work Phone',
    'contact.tell_us_position': 'Tell us about the position',
    'contact.postal_code_placeholder': 'Postal Code',
    'contact.explain_need': 'Explain your need',
    'contact.describe_recruitment_needs': 'Describe your recruitment needs...',
    'contact.submitting': 'Submitting...',
    'contact.submit': 'Submit',
    
    // Emplois
    'jobs.title': 'Job offers',
    'jobs.search_placeholder': 'Search for a job...',
    'jobs.filter_by_sector': 'Filter by sector',
    'jobs.filter_by_location': 'Filter by location',
    'jobs.no_results': 'No jobs found',
    'jobs.apply_now': 'Apply now',
    'jobs.view_details': 'View details',
    'jobs.salary': 'Salary',
    'jobs.location': 'Location',
    'jobs.type': 'Type',
    'jobs.experience': 'Experience',
    'jobs.posted': 'Posted',
    
    // Calculatrices
    'calculators.tax.title': 'Quebec Tax Calculator',
    'calculators.tax.subtitle': 'Calculate your taxes easily',
    'calculators.salary.title': 'Salary Guide',
    'calculators.salary.subtitle': 'Discover market salaries',
    'calculators.mortgage.title': 'Mortgage Calculator',
    'calculators.mortgage.subtitle': 'Calculate your mortgage payments',
    'calculators.cnesst.title': 'CNESST Validation',
    'calculators.cnesst.subtitle': 'Check your compliance',
    
    // Secteurs
    'sectors.title': 'Areas of expertise',
    'sectors.manufacturing': 'Manufacturing',
    'sectors.construction': 'Construction',
    'sectors.healthcare': 'Healthcare',
    'sectors.transport': 'Transport',
    'sectors.agriculture': 'Agriculture',
    'sectors.technology': 'Technology',
    'sectors.energy': 'Energy',
    'sectors.aerospace': 'Aerospace',
    
    // Notifications et messages
    'notification.success': 'Success!',
    'notification.error': 'Error!',
    'notification.warning': 'Warning!',
    'notification.info': 'Information',
    'notification.form_sent': 'Your message has been sent successfully',
    'notification.form_error': 'An error occurred while sending',
    'notification.application_sent': 'Your application has been sent',
    
    // Boutons et actions
    'button.read_more': 'Read more',
    'button.learn_more': 'Learn more',
    'button.get_started': 'Get started',
    'button.download': 'Download',
    'button.upload': 'Upload',
    'button.next': 'Next',
    'button.previous': 'Previous',
    'button.close': 'Close',
    'button.back': 'Back',
    'button.continue': 'Continue',
    
    // Carrousel bannière d'accueil
    'carousel.slide1.title': 'Unlock new possibilities with the right',
    'carousel.slide1.title_highlight': 'Talent',
    'carousel.slide1.description': 'Discover skilled professionals, high-demand jobs, and tailored solutions to achieve your goals.',
    'carousel.slide1.job_seekers': 'FOR JOB SEEKERS',
    'carousel.slide1.businesses': 'FOR BUSINESSES',
    'carousel.slide1.find_job': 'Find your next job',
    'carousel.slide1.preview_candidates': 'Preview candidates',
    'carousel.slide1.hire_now': 'Hire now',
    
    'carousel.slide2.title': 'Tailored recruitment',
    'carousel.slide2.title_highlight': 'solutions for every sector',
    'carousel.slide2.description': 'Our talent network spans a wide range of roles and qualifications.',
    
    'carousel.slide3.title': 'Expert recruitment',
    'carousel.slide3.subtitle': 'for your immediate and',
    'carousel.slide3.title_highlight': 'long-term needs',
    'carousel.slide3.description': 'Together, we\'ll find the talent that drives your success.',
    
    'carousel.search.job_placeholder': 'Job Title, Skills, or Keywords',
    'carousel.search.location_placeholder': 'City, Province, or Postal Code',
    'carousel.search.button': 'Search Jobs',
    
    // Section Add specialized talent
    'specialized_talent.title': 'Add specialized talent across your organization',
    'specialized_talent.trending_jobs': 'Trending job titles',
    'specialized_talent.learn_more': 'Learn more about our {{sector}} hiring solutions',
    
    // Section Explore success stories
    'success_stories.title': 'Explore success stories',
    
    // Section Partners & Accreditation
    'partners.title': 'Partners & Accreditation',
    
    // Section App your way to a new job
    'mobile_app.title': 'App your way to a new job',
    'mobile_app.feature1': 'Get instantly notified of job matches',
    'mobile_app.feature2': 'Filter searches by skills and preferences',
    'mobile_app.feature3': 'Apply in a tap and much more',
    'mobile_app.download_on': 'Download on the',
    'mobile_app.app_store': 'App Store',
    'mobile_app.google_play': 'Google Play',
    
    // About page
    'about.catalyst.title': 'Catalyst of prosperity for Quebec businesses',
    'about.catalyst.description': 'At Industrielle RH, we firmly believe that people are the cornerstone of every company\'s success. As a specialized staffing agency, we excel in both local and international recruitment, offering a seamless process from understanding your needs to integrating the ideal candidates into your team. Guided by our core values of collaboration, innovation, and integrity, we are committed to building lasting partnerships and delivering impactful results. Let us bridge the gap between talent and opportunity, empowering your business to thrive and creating a solid foundation for sustainable growth.',
    
    // Main features
    'about.expertise.title': 'Expertise',
    'about.expertise.description': 'We excel in accurately identifying top francophone talent, ensuring a seamless match with your specific needs. Our deep understanding of industries guarantees tailored solutions for your workforce challenges.',
    'about.technology.title': 'Technology',
    'about.technology.description': 'Using cutting-edge software, we streamline CV management and immigration procedures, delivering an efficient and hassle-free recruitment process for all stakeholders.',
    'about.innovative_approach.title': 'Innovative Approach',
    'about.innovative_approach.description': 'Our commitment goes beyond recruitment. By prioritizing social integration and cultural adaptation, we ensure a smooth transition and long-term success for employees and companies alike.',
    'about.reliability.title': 'Reliability',
    'about.reliability.description': 'We offer a six-month guarantee on our placements, providing peace of mind and reinforcing our dedication to delivering quality results and unmatched service.',
    
    // Mission, Vision and Values
    'about.mission_vision_values.title': 'Mission, Vision and Values',
    'about.mission.title': 'MISSION',
    'about.mission.description': 'Empowering companies with the best talents to thrive in their industries. We aim to simplify recruitment, ensuring seamless integration of candidates while contributing to the success of businesses and the well-being of workers.',
    'about.vision.title': 'VISION',
    'about.vision.description': 'To become the leading partner for Quebec businesses in sourcing and integrating top-tier talents from around the world, driving mutual growth and societal impact.',
    'about.values.title': 'VALUES',
    'about.values.subtitle': 'Vehicle values by Industrial HR',
    
    // Individual values
    'about.innovation.title': 'INNOVATION',
    'about.innovation.description': 'The company was created with the belief that we can bring innovations that will contribute to improving our society. We will continue to make innovation our reason for existence.',
    'about.integrity.title': 'Integrity',
    'about.integrity.description': 'Integrity guides all our actions. We create solutions that enhance transparency in the world and develop partnerships that reflect this commitment.',
    'about.diversity.title': 'Diversity',
    'about.diversity.description': 'Humanity is at the heart of our mission. We value the diversity of people who work for our client companies. We firmly believe that talent has no nationality or race.',
    'about.sustainability.title': 'Sustainability',
    'about.sustainability.description': 'IR is determined to be, wherever it operates, a socially and environmentally responsible company with a commitment to sustainable development.',
    
    // Francophone talent section
    'about.francophone_talent.title': 'Hire the best francophone talent Worldwide',
    'about.francophone_talent.description': 'Industrielle RH is led by a team of dedicated professionals specializing in recruitment and workforce management. Our team consists of experts in talent acquisition, immigration processes, workforce integration, and professional training. With extensive experience and a solid reputation for professionalism, respect for deadlines, and the sustainability of our recruitment solutions, we are committed to helping your organization thrive by connecting you with the best francophone talent.',
    
    // Leadership team
    'about.leadership_team.title': 'Leadership team',
    'about.leadership_team.board_title': 'Board of Directors',
    'about.ceo_message.paragraph1': 'My ambition behind creating Industrielle RH was born from my own journey. Having held several positions at different levels in the industrial and service sectors, I was able to closely observe the realities of employers, as well as those of workers. I understood the challenges companies face in recruiting effectively, and what employees really seek to thrive.',
    'about.ceo_message.paragraph2': 'Drawing from this experience, I wanted to create a human, innovative, and action-oriented company capable of supporting employers in finding reliable talent, whether local or international. Industrielle RH reflects my desire to bridge the gap between Quebec labor market needs and candidate aspirations, offering personalized service based on respect, integrity, and a true understanding of everyone\'s challenges.',
    'about.ceo_message.paragraph3': 'I firmly believe that a company\'s success depends on the quality of the people who comprise it, and every day, I commit to building solid bridges between talent and opportunities.',
    
    // Team positions
    'about.positions.ceo': 'Chief Executive Officer',
    'about.positions.it_manager': 'IT Project Manager',
    'about.positions.project_director': 'Project Director',
    'about.positions.it_systems_director': 'Information Systems Director',
    'about.positions.ai_project_director': 'Artificial Intelligence Project Director',
    'about.positions.web_developer': 'Web Developer and UX/UI Designer',
    
    // Find Jobs Page
    'find_jobs.hero.title': 'Find a job that works for you',
    'find_jobs.hero.feature1': 'Choose from hundreds of jobs',
    'find_jobs.hero.feature2': 'Discover new and exclusive opportunities posted every day',
    'find_jobs.hero.feature3': 'Let our recruiters help you find a job that is right for you',
    'find_jobs.hero.submit_cv': 'Submit your CV',
    
    // How we help you
    'find_jobs.how_help.title': 'How we help you find a job',
    'find_jobs.upload_resume.title': 'Upload your resume',
    'find_jobs.upload_resume.description': 'Add your latest resume to match with open positions.',
    'find_jobs.upload_resume.button': 'Upload resume',
    'find_jobs.search_jobs.title': 'Search available jobs',
    'find_jobs.search_jobs.description': 'Choose from hundreds of jobs (with new ones posted daily)',
    'find_jobs.search_jobs.button': 'Search',
    
    // Articles and blog
    'find_jobs.grow_learn.title': 'Grow, learn and prepare',
    'find_jobs.featured': 'FEATURED',
    'find_jobs.tag_results': 'TAG RESULTS',
    'find_jobs.landing_job': 'Landing a job',
    'find_jobs.posts_count': '{{count}} posts',
    'find_jobs.what_jobs_demand': 'What jobs are in demand?',
    'find_jobs.subscribe_updates': 'Subscribe to updates',
    
    // Search bar
    'find_jobs.search.job_placeholder': 'Job Title, Skills, or Keywords',
    'find_jobs.search.location_placeholder': 'City, Province, or Postal Code',
    'find_jobs.search.button': 'Search Jobs',
    
    // Job seekers help section
    'find_jobs.help_seekers.title': 'Explore how we help job seekers',
    'find_jobs.step1.title': 'Starting your job search at no cost',
    'find_jobs.step1.description': 'Simply apply or upload your resume to gain access to in-demand jobs with competitive pay and benefits.',
    'find_jobs.step1.apply_button': 'Apply to jobs',
    'find_jobs.step1.upload_button': 'Upload your resume',
    
    'find_jobs.step2.title': 'Making the match',
    'find_jobs.step2.description': 'Job matches will be sent to your inbox and your phone.',
    
    'find_jobs.step3.title': 'Helping you land the job',
    'find_jobs.step3.description': 'We\'ll guide you through interviews, advocate for you with interested employers, and even negotiate salary on your behalf.',
    'find_jobs.step3.interview_tips': 'Get interview tips',
    'find_jobs.step3.salary_guide': 'Explore our salary guide',
    
    'find_jobs.step4.title': 'Staying focused on your future',
    'find_jobs.step4.description': 'As your career develops, our free online training and expertise will help you stay on top of your skills, keep your profile current, and offer insights along the way.',
    'find_jobs.step4.career_advice': 'Get career advice',
    
    'find_jobs.step5.title': 'Supporting you throughout your career',
    'find_jobs.step5.description': 'We go beyond just landing the job. Industrielle RH is here to support you throughout your employment journey:',
    'find_jobs.step5.upskill_title': 'Upskill with free training:',
    'find_jobs.step5.upskill_desc': 'Access professional development opportunities to grow and adapt in your role.',
    'find_jobs.step5.legal_title': 'Legal assistance at your side:',
    'find_jobs.step5.legal_desc': 'Get support to understand your rights and navigate any challenges with confidence.',
    'find_jobs.step5.career_advice_title': 'Continuous career advice:',
    'find_jobs.step5.career_advice_desc': 'We help you optimize your profile to achieve long-term success.',
    'find_jobs.step5.training_button': 'Explore our training programs',
    'find_jobs.step5.legal_button': 'Learn about our legal support',
    
    // Extended navigation
    'find_jobs.nav.control_career': 'Control your career. Find the right role for you and your family.',
    'find_jobs.nav.find_next_job': 'Find your next job',
    'find_jobs.nav.submit_cv': 'Submit Your CV',
    'find_jobs.nav.explore_help': 'Explore how we help job seekers',

    // Hire Talent Page
    'hire_talent.nav.description': 'We\'re here to connect you with top talent across all levels, from skilled professionals to executive leadership, tailored to your industry needs.',
    'hire_talent.nav.find_talents': 'Find talents with us',
    'hire_talent.nav.staffing': 'STAFFING',
    'hire_talent.nav.recruitment_outsourcing': 'Recruitment by outsourcing',
    'hire_talent.nav.international_recruitment': 'International recruitment',

    // Main title
    'hire_talent.hero.title': 'Find your next hire',
    'hire_talent.hero.description': 'Preview recruiter-assessed and AI-matched candidates or provide open role details to hire now. The choice is yours.',
    'hire_talent.hero.preview_candidates': 'Preview candidates',
    'hire_talent.hero.hire_now': 'Hire now',
    'hire_talent.hero.contact_us': 'Or contact us at',

    // Talent solutions
    'hire_talent.solutions.title': 'Explore our talent solutions',
    'hire_talent.solutions.outsourced.title': 'Outsourced Recruitment',
    'hire_talent.solutions.outsourced.description': 'Entrust us with the management of your short- or long-term workforce needs. Access qualified professionals ready to join your teams quickly while you focus on your strategic priorities.',
    'hire_talent.solutions.international.title': 'International Recruitment',
    'hire_talent.solutions.international.description': 'Find exceptional French talent worldwide to meet your specific needs. Our experts support you at every step, from pre-selecting candidates to their seamless integration.',
    'hire_talent.solutions.learn_more': 'Learn more',

    // How it works
    'hire_talent.how_it_works.title': 'How it works',
    'hire_talent.how_it_works.step1': 'We understand your needs',
    'hire_talent.how_it_works.step2': 'We find the right candidates',
    'hire_talent.how_it_works.step3': 'We handle the recruitment process',
    'hire_talent.how_it_works.step4': '6-month satisfaction guarantee',

    // Blog and articles
    'hire_talent.blog.title': 'Grow, learn and prepare',
    'hire_talent.blog.featured': 'FEATURED',
    'hire_talent.blog.tag_results': 'TAG RESULTS',
    'hire_talent.blog.landing_job': 'Landing a job',
    'hire_talent.blog.posts_count': '{{count}} posts',
    'hire_talent.blog.what_jobs_demand': 'What jobs are in demand?',
    'hire_talent.blog.subscribe_updates': 'Subscribe to updates',

    // Qualified candidates
    'hire_talent.candidates.title': 'Here\'s a sample of our highly skilled Candidate',
    'hire_talent.candidates.job_title': 'Job Title',
    'hire_talent.candidates.search': 'Search',
    'hire_talent.candidates.reset_search': 'Reset Search',
    'hire_talent.candidates.connect_now': 'Connect now',
    'hire_talent.candidates.need_help': 'Need immediate help? Call',

    // Search summary
    'hire_talent.search_summary.title': 'Your search summary',
    'hire_talent.search_summary.description': 'The details of your search summary will be provided to one of our experienced recruiters.',
    'hire_talent.search_summary.skills': 'Skills',
    'hire_talent.search_summary.details_provided': 'Details you provided',
    'hire_talent.search_summary.attorney_lawyer': 'Attorney/Lawyer',
    'hire_talent.contact_info.title': 'Your contact information',
    'hire_talent.form.first_name': 'First Name',
    'hire_talent.form.last_name': 'Last Name',
    'hire_talent.form.company_name': 'Company Name',
    'hire_talent.form.job_title': 'Your Job Title',
    'hire_talent.form.work_email': 'Work Email',
    'hire_talent.form.work_phone': 'Work Phone',
    'hire_talent.form.tell_us_position': 'Tell us about the position',
    'hire_talent.form.postal_code': 'Postal Code',
    'hire_talent.form.position_type': 'Position Type',
    'hire_talent.form.local_recruitment': 'Local recruitment',
    'hire_talent.form.international_recruitment': 'International recruitment',
    'hire_talent.form.position_description': 'Tell us about the position',
    'hire_talent.form.submit': 'Submit',
    'hire_talent.form.submitting': 'Submitting...',
    'hire_talent.form.success_message': 'Your request has been sent successfully! We will contact you soon.',
    'hire_talent.form.error_message': 'An error occurred while sending. Please try again.',

    // Outsourcing section
    'hire_talent.outsourcing.title': 'Recruitment by outsourcing',
    'hire_talent.outsourcing.hero.title': 'Build a strong team with permanent talent tailored to your needs.',
    'hire_talent.outsourcing.hero.description': 'Recruitment Process Outsourcing (RPO) is a very interesting solution for companies that have specific, recurring and well-defined needs.',
    'hire_talent.outsourcing.hire_talents': 'Hire talents',

    // Outsourcing benefits
    'hire_talent.outsourcing.find_talent.title': 'Find top talent faster',
    'hire_talent.outsourcing.find_talent.description': 'Accelerate your hiring process and fill critical roles in just a few days with our efficient virtual recruitment solutions.',
    'hire_talent.outsourcing.hire_precision.title': 'Hire with precision & confidence',
    'hire_talent.outsourcing.hire_precision.description': 'Our expert recruiters and AI-driven matching tools identify candidates that meet your unique needs, skills requirements, and budget.',
    'hire_talent.outsourcing.secure_fit.title': 'Secure the right fit for your team',
    'hire_talent.outsourcing.secure_fit.description': 'Leverage our industry expertise to craft competitive offers and attract the top candidates who will drive your success.',

    // Contact
    'hire_talent.contact.title': 'Tell us what you need, we\'ll take care of the rest!',
    'hire_talent.contact.description': 'Take seconds to fill out this form and let us handle it. Whether it\'s for a specific role or broader needs, we\'ve got your back.',
    'hire_talent.contact.phone': 'Or contact us by phone',

    // International recruitment section
    'hire_talent.international.title': 'International recruitment',
    'hire_talent.international.hero.title': 'Hire the best francophone talent Worldwide',
    'hire_talent.international.hero.description': 'Employers, don\'t let labor shortage issues slow you down. Our recruiters and our network of partners allow us to offer you 360-degree support in order to quickly welcome your new recruits.',
    'hire_talent.international.solution.title': 'All-inclusive recruitment solution:',
    'hire_talent.international.solution.subtitle': 'From research to integration, we take care of everything!',

    // International services
    'hire_talent.international.recruitment.title': 'International recruitment',
    'hire_talent.international.recruitment.description': 'Specialists in hiring skilled temporary foreign workers for manufacturing jobs in Quebec.',
    'hire_talent.international.legal.title': 'Legal services',
    'hire_talent.international.legal.description': 'We simplify the process with expert legal support at every stage',
    'hire_talent.international.welcome.title': 'Welcome and integration',
    'hire_talent.international.welcome.description': 'From arrival to onboarding, we ensure a seamless experience for your new employees.',

    // Structured approach
    'hire_talent.structured.title': 'Structured approach',
    'hire_talent.structured.step1': 'Needs assessment',
    'hire_talent.structured.step2': 'Selection of top francophone talent',
    'hire_talent.structured.step3': 'Administrative process management',
    'hire_talent.structured.step4': 'Integration support',
    'hire_talent.structured.step5': 'Guarantee and ongoing Support',
    'hire_talent.structured.contact_us': 'Contact Us',

    // Why choose international recruitment
    'hire_talent.why_international.title': 'Why choose international recruitment?',
    'hire_talent.why_international.diverse_talent.title': 'Access to diverse talent',
    'hire_talent.why_international.diverse_talent.description': 'Broaden your options with skilled professionals from around the world, bringing fresh perspectives and expertise.',
    'hire_talent.why_international.skill_gaps.title': 'Fill critical skill gaps',
    'hire_talent.why_international.skill_gaps.description': 'Meet your workforce needs in high-demand sectors where local talent is scarce.',
    'hire_talent.why_international.competitiveness.title': 'Boost competitiveness',
    'hire_talent.why_international.competitiveness.description': 'Strengthen your business with globally experienced candidates who elevate your operations and innovation.',
    'hire_talent.why_international.streamlined.title': 'Streamlined processes',
    'hire_talent.why_international.streamlined.description': 'Benefit from a fully managed recruitment process, from sourcing to integration, ensuring a seamless experience.',

    // Consulting Solutions Page
    'consulting.tabs.looking_to_hire': 'I\'m looking to hire',
    'consulting.tabs.looking_for_job': 'I\'m looking for a job',
    'consulting.ready_to_hire.title': 'Ready to hire? We\'re ready to help',
    'consulting.and_many_more': 'And many more!',
    'consulting.hiring_trends.title': 'Hiring trends & insights',
    'consulting.hiring_trends.be_salary_smart': 'Be salary smart',
    'consulting.hiring_trends.be_salary_smart_desc': 'Get the data top companies use to attract and retain skilled talent. Start with our salary calculator.',
    'consulting.hiring_trends.career_development': 'Career development',
    'consulting.hiring_trends.career_development_desc': 'Get up-to-date information on employment trends in your industry, including salaries, skills and changes to the labor market.',
    'consulting.hiring_trends.what_jobs_demand_desc': 'Explore our Demand for Skilled Talent report to see what specializations employers need most.',
    'consulting.hiring_trends.landing_job_desc': 'Learn how to write a professional resume, prep for a job interview and make a lasting impression on hiring managers.',
    'consulting.move_career.title': 'Move your career forward',
    'consulting.move_career.subtitle': 'Submit your spontaneous application',
    'consulting.hiring_request.subtitle': 'Submit your hiring Request',
    'consulting.navbar.description': 'See how our consulting capabilities can help transform your business.',
    
    // Salary Guide Page
    'salary_guide.hero.title': 'Discover Your Value',
    'salary_guide.hero.description': 'Explore the latest data for hundreds of positions and know what you should earn or pay in local and national markets.',
    'salary_guide.trending_jobs.title': 'Trending job titles',
    'salary_guide.trending_jobs.and_many_more': 'And many more!',
    'salary_guide.hiring_trends.title': 'Hiring trends & insights',
    'salary_guide.hiring_trends.be_salary_smart': 'Be salary smart',
    'salary_guide.hiring_trends.be_salary_smart_desc': 'Get the data top companies use to attract and retain skilled talent. Start with our salary calculator.',
    'salary_guide.hiring_trends.career_development': 'Career development',
    'salary_guide.hiring_trends.career_development_desc': 'Get up-to-date information on employment trends in your industry, including salaries, skills and changes to the labor market.',
    'salary_guide.hiring_trends.what_jobs_demand': 'What jobs are in demand?',
    'salary_guide.hiring_trends.what_jobs_demand_desc': 'Explore our Demand for Skilled Talent report to see what specializations employers need most.',
    'salary_guide.hiring_trends.landing_job': 'Landing a job',
    'salary_guide.hiring_trends.landing_job_desc': 'Learn how to write a professional resume, prep for a job interview and make a lasting impression on hiring managers.',
    
    // SalaryGuide Components
    'salary_guide.form.job_title': 'Job Title',
    'salary_guide.form.job_title_placeholder': 'e.g. Software Engineer',
    'salary_guide.form.location': 'Location',
    'salary_guide.form.location_placeholder': 'e.g. New York, NY',
    'salary_guide.form.experience': 'Years of Experience',
    'salary_guide.form.experience_0_1': '0-1 years',
    'salary_guide.form.experience_1_3': '1-3 years',
    'salary_guide.form.experience_3_5': '3-5 years',
    'salary_guide.form.experience_5_10': '5-10 years',
    'salary_guide.form.experience_10_plus': '10+ years',
    'salary_guide.form.search_salary': 'Search Salary',
    'salary_guide.form.analyzing': 'Analyzing...',
    'salary_guide.error.title': 'Error:',
    'salary_guide.error.try_again': 'Please try again with a different search query.',
    'salary_guide.start.title': 'Enter your job details to get started',
    'salary_guide.start.description': 'We\'ll analyze thousands of data points to provide you with accurate salary insights.',
    'salary_guide.results.experience': 'Experience:',
    'salary_guide.results.years': 'years',
    'salary_guide.results.export': 'Export Report',
    'salary_guide.results.salary_range': 'Salary Range',
    'salary_guide.results.median_salary': 'Median Salary',
    'salary_guide.results.growth_outlook': 'Growth Outlook',
    'salary_guide.results.per_year': 'per year',
    'salary_guide.results.salary_distribution': 'Salary Distribution',
    'salary_guide.results.historical_trend': 'Historical Trend',
    'salary_guide.results.industry_comparison': 'Industry Comparison',
    'salary_guide.results.data_updated': '* All numbers are rounded to the nearest integer. Data last updated:',
    'salary_guide.chart.low': 'Low (25%)',
    'salary_guide.chart.median': 'Median (50%)',
    'salary_guide.chart.high': 'High (75%)',
    'salary_guide.chart.salary': 'Salary',
    'salary_guide.industries.finance': 'Finance',
    'salary_guide.industries.technology': 'Technology',
    'salary_guide.industries.healthcare': 'Healthcare',
    'salary_guide.industries.education': 'Education',
    'salary_guide.industries.retail': 'Retail',

    // Salary Guide - Header
    'salary_guide.header.title': 'SalaryIQ',
    'salary_guide.header.about': 'About',
    'salary_guide.header.how_it_works': 'How it works',
    'salary_guide.header.resources': 'Resources',

    // Salary Guide - Footer
    'salary_guide.footer.title': 'SalaryIQ',
    'salary_guide.footer.rights': 'All rights reserved',
    'salary_guide.footer.made_with': 'Made with',
    'salary_guide.footer.and_ai': 'and AI',
    'salary_guide.footer.disclaimer': 'Disclaimer: Salary information is generated using AI and should be used as an estimation only. Actual salaries may vary based on many factors including employer, location, market conditions, and individual qualifications.',

    // Quebec Tax Calculator Page
    'quebec_tax_calculator.title': 'Calculate your taxes with our tool',
    'quebec_tax_calculator.description': 'In Canada each province and territory has its own provincial income tax rates besides federal tax rates. Below there is simple income tax calculator for every Canadian province and territory. Or you can choose income tax calculator for particular province or territory depending on your residence.',
    'quebec_tax_calculator.help_section.title': 'How we help you find a job',
    'quebec_tax_calculator.help_section.upload_resume.title': 'Upload your resume',
    'quebec_tax_calculator.help_section.upload_resume.description': 'Add your latest resume to match with open positions.',
    'quebec_tax_calculator.help_section.upload_resume.button': 'Upload resume',
    'quebec_tax_calculator.help_section.search_jobs.title': 'Search available jobs',
    'quebec_tax_calculator.help_section.search_jobs.description': 'Choose from hundreds of jobs (with new ones posted daily)',
    'quebec_tax_calculator.help_section.search_jobs.button': 'Search',
    'quebec_tax_calculator.help_section.contact_button': 'Contact US',
    'quebec_tax_calculator.trending_jobs.title': 'Trending job titles',
    'quebec_tax_calculator.trending_jobs.more_button': 'And many more!',
    'quebec_tax_calculator.calculator.title': 'Calculate Your Net Income',
    'quebec_tax_calculator.calculator.province_territory': 'Province/Territory',
    'quebec_tax_calculator.calculator.select_province': 'Select province or territory',
    'quebec_tax_calculator.calculator.tax_year': 'Tax Year',
    'quebec_tax_calculator.calculator.select_tax_year': 'Select tax year',
    'quebec_tax_calculator.calculator.annual_income': 'Annual Income',
    'quebec_tax_calculator.calculator.hourly_wage': 'Hourly Wage',
    'quebec_tax_calculator.calculator.annual_gross_income': 'Annual Gross Income',
    'quebec_tax_calculator.calculator.enter_annual_income': 'Enter your annual gross income',
    'quebec_tax_calculator.calculator.enter_hourly_wage': 'Enter your hourly wage',
    'quebec_tax_calculator.calculator.hours_per_week': 'Hours per Week',
    'quebec_tax_calculator.calculator.enter_hours_per_week': 'Enter hours worked per week',
    'quebec_tax_calculator.calculator.bonuses_premiums': 'Bonuses & Premiums',
    'quebec_tax_calculator.calculator.add_bonus': 'Add Bonus',
    'quebec_tax_calculator.calculator.type': 'Type',
    'quebec_tax_calculator.calculator.percentage_of_base': 'Percentage of Base',
    'quebec_tax_calculator.calculator.hourly_premium': 'Hourly Premium',
    'quebec_tax_calculator.calculator.travel_allowance': 'Travel Allowance',
    'quebec_tax_calculator.calculator.percentage': 'Percentage',
    'quebec_tax_calculator.calculator.hourly_rate': 'Hourly Rate',
    'quebec_tax_calculator.calculator.rate_per_km': 'Rate per KM',
    'quebec_tax_calculator.calculator.enter_amount': 'Enter amount',
    'quebec_tax_calculator.calculator.enter_hours': 'Enter hours',
    'quebec_tax_calculator.calculator.kilometers_per_week': 'Kilometers per Week',
    'quebec_tax_calculator.calculator.enter_kilometers': 'Enter kilometers',
    'quebec_tax_calculator.calculator.cancel': 'Cancel',
    'quebec_tax_calculator.calculator.add': 'Add',
    'quebec_tax_calculator.calculator.retirement_savings': 'Retirement Savings',
    'quebec_tax_calculator.calculator.rrsp_contribution': 'RRSP Contribution',
    'quebec_tax_calculator.calculator.rrsp_full_name': 'Registered Retirement Savings Plan (RRSP)',
    'quebec_tax_calculator.calculator.rrsp_desc_1': 'Reduces your taxable income',
    'quebec_tax_calculator.calculator.rrsp_desc_2': 'Limit: 18% of previous year\'s income',
    'quebec_tax_calculator.calculator.rrsp_desc_3': 'Maximum {{limit}} for {{year}}',
    'quebec_tax_calculator.calculator.rrsp_desc_4': 'Tax-deferred growth until withdrawal',
    'quebec_tax_calculator.calculator.tfsa_contribution': 'TFSA Contribution',
    'quebec_tax_calculator.calculator.tfsa_full_name': 'Tax-Free Savings Account (TFSA)',
    'quebec_tax_calculator.calculator.tfsa_desc_1': 'After-tax contributions',
    'quebec_tax_calculator.calculator.tfsa_desc_2': 'Tax-free growth and withdrawals',
    'quebec_tax_calculator.calculator.tfsa_desc_3': 'Limit: {{limit}} for {{year}}',
    'quebec_tax_calculator.calculator.tfsa_desc_4': 'Flexible withdrawals anytime',
    'quebec_tax_calculator.calculator.other_deductions': 'Other Deductions',
    'quebec_tax_calculator.calculator.add_deduction': 'Add Deduction',
    'quebec_tax_calculator.calculator.name': 'Name',
    'quebec_tax_calculator.calculator.name_placeholder': 'e.g., Union Dues',
    'quebec_tax_calculator.calculator.fixed_amount': 'Fixed Amount',
    'quebec_tax_calculator.calculator.amount': 'Amount',
    'quebec_tax_calculator.calculator.enter_percentage': 'Enter percentage',
    'quebec_tax_calculator.calculator.description_optional': 'Description (optional)',
    'quebec_tax_calculator.calculator.add_description': 'Add a description',
    'quebec_tax_calculator.calculator.calculate': 'Calculate',
    'quebec_tax_calculator.calculator.calculating': 'Calculating...',
    'quebec_tax_calculator.calculator.clear': 'Clear',
    'quebec_tax_calculator.calculator.fill_required_fields': 'Please fill all required fields before calculating',
    'quebec_tax_calculator.calculator.valid_bonus_amount': 'Please enter a valid bonus amount',
    'quebec_tax_calculator.calculator.valid_deduction': 'Please enter a valid deduction name and amount',
    'quebec_tax_calculator.calculator.minimum_wage_alert': 'The entered hourly wage ({{hourlyRate}}/hr) is below the {{year}} minimum wage in {{province}} ({{minWage}}/hr)',

    // Quebec Tax Calculator - Results
    'quebec_tax_calculator.results.title': 'Tax Calculation Results',
    'quebec_tax_calculator.results.below_minimum_wage': 'Your annual income ({{grossIncome}}) is below the annual minimum wage of {{minAnnualSalary}} ({{minWage}}/h) for {{province}} in {{taxYear}}.',
    'quebec_tax_calculator.results.income_breakdown': 'Income Breakdown',
    'quebec_tax_calculator.results.gross_income': 'Gross Income',
    'quebec_tax_calculator.results.total_deductions': 'Total Deductions',
    'quebec_tax_calculator.results.rrsp_contribution': 'RRSP Contribution',
    'quebec_tax_calculator.results.tfsa_contribution': 'TFSA Contribution',
    'quebec_tax_calculator.results.take_home_pay': 'Take Home Pay',
    'quebec_tax_calculator.results.monthly': 'Monthly',
    'quebec_tax_calculator.results.bi_weekly': 'Bi-weekly',
    'quebec_tax_calculator.results.tax_details': 'Tax Details',
    'quebec_tax_calculator.results.federal_tax': 'Federal Tax',
    'quebec_tax_calculator.results.provincial_tax': 'Provincial Tax',
    'quebec_tax_calculator.results.cpp_contribution': 'CPP Contribution',
    'quebec_tax_calculator.results.ei_premium': 'EI Premium',
    'quebec_tax_calculator.results.total_tax_paid': 'Total Tax Paid',
    'quebec_tax_calculator.results.retirement_savings': 'Retirement Savings',
    'quebec_tax_calculator.results.limit_of': '{{amount}} of {{limit}} annual limit',
    'quebec_tax_calculator.results.take_home': 'Take Home',
    'quebec_tax_calculator.results.disclaimer': '* All calculations are estimates based on current tax rates. Please consult a tax professional for detailed advice.',

    // Quebec Tax Calculator - Chart
    'quebec_tax_calculator.chart.take_home_pay': 'Take Home Pay',
    'quebec_tax_calculator.chart.total_deductions': 'Total Deductions',
    'quebec_tax_calculator.chart.amount': 'Amount',
    'quebec_tax_calculator.chart.percentage': 'Percentage',
    'quebec_tax_calculator.chart.take_home_description': 'This is your take-home pay after all deductions',
    'quebec_tax_calculator.chart.deductions_description': 'Total of all taxes and deductions including CPP and EI',
    'quebec_tax_calculator.chart.annual_take_home': 'Annual Take-Home Pay',
    'quebec_tax_calculator.chart.monthly': 'Monthly',
    'quebec_tax_calculator.chart.bi_weekly': 'Bi-weekly',
    'quebec_tax_calculator.chart.income_distribution': 'Income Distribution',
    'quebec_tax_calculator.chart.total_income': 'Total Income',
    'quebec_tax_calculator.chart.annual': 'Annual',

    // Quebec Tax Calculator - Header
    'quebec_tax_calculator.header.title': 'Canadian Net Salary Calculator',

    // Quebec Tax Calculator - Footer
    'quebec_tax_calculator.footer.title': 'Canadian Net Salary Calculator',
    'quebec_tax_calculator.footer.disclaimer': '*Disclaimer: This calculator provides estimates only. For accurate tax advice, please consult a tax professional.',

    // Quebec Tax Calculator - Success Send
    'quebec_tax_calculator.success_send.title': 'Successfully sent your request!',
    'quebec_tax_calculator.success_send.description': 'We\'ll get back to you as soon as possible.',
    'quebec_tax_calculator.success_send.back_home': 'Back to Home page',
    'quebec_tax_calculator.success_send.alt_image': 'Successfully sent your request',

    // Mortgage Calculator Page
    'mortgage_calculator.title': 'Calculate your Mortgage Payment',
    'mortgage_calculator.description': 'Quickly estimate your monthly mortgage payments based on the purchase price, down payment, interest rate, and loan term. Use our simple and effective tool to plan your real estate budget with confidence.',
    'mortgage_calculator.help_section.title': 'How we help you find a job',
    'mortgage_calculator.help_section.upload_resume.title': 'Upload your resume',
    'mortgage_calculator.help_section.upload_resume.description': 'Add your latest resume to match with open positions.',
    'mortgage_calculator.help_section.upload_resume.button': 'Upload resume',
    'mortgage_calculator.help_section.search_jobs.title': 'Search available jobs',
    'mortgage_calculator.help_section.search_jobs.description': 'Choose from hundreds of jobs (with new ones posted daily)',
    'mortgage_calculator.help_section.search_jobs.button': 'Search',
    'mortgage_calculator.help_section.contact_button': 'Contact US',
    'mortgage_calculator.trending_jobs.title': 'Trending job titles',
    'mortgage_calculator.trending_jobs.more_button': 'And many more!',
    'mortgage_calculator.calculator.title': 'Mortgage Payment Calculator',
    'mortgage_calculator.calculator.purchase_price': 'Purchase Price',
    'mortgage_calculator.calculator.enter_purchase_price': 'Enter purchase price',
    'mortgage_calculator.calculator.down_payment': 'Down Payment',
    'mortgage_calculator.calculator.enter_down_payment': 'Enter down payment',
    'mortgage_calculator.calculator.interest_rate': 'Interest Rate',
    'mortgage_calculator.calculator.enter_interest_rate': 'Enter interest rate',
    'mortgage_calculator.calculator.amortization': 'Amortization',
    'mortgage_calculator.calculator.payment_frequency': 'Payment Frequency',
    'mortgage_calculator.calculator.calculate': 'Calculate',
    'mortgage_calculator.calculator.clear': 'Clear',
    'mortgage_calculator.calculator.5_years': '5 years',
    'mortgage_calculator.calculator.10_years': '10 years',
    'mortgage_calculator.calculator.15_years': '15 years',
    'mortgage_calculator.calculator.20_years': '20 years',
    'mortgage_calculator.calculator.25_years': '25 years',
    'mortgage_calculator.calculator.30_years': '30 years',
    'mortgage_calculator.calculator.weekly': 'Weekly',
    'mortgage_calculator.calculator.bi_weekly': 'Bi-Weekly',
    'mortgage_calculator.calculator.monthly': 'Monthly',
    'mortgage_calculator.calculator.purchase_price_required': 'Purchase price is required',
    'mortgage_calculator.calculator.valid_price': 'Please enter a valid price',
    'mortgage_calculator.calculator.down_payment_required': 'Down payment is required',
    'mortgage_calculator.calculator.valid_amount': 'Please enter a valid amount',
    'mortgage_calculator.calculator.less_than_purchase': 'Must be less than purchase price',
    'mortgage_calculator.calculator.interest_rate_required': 'Interest rate is required',
    'mortgage_calculator.calculator.valid_rate': 'Please enter a valid rate (0-20%)',
    'mortgage_calculator.calculator.interest_rate_tooltip': 'The annual interest rate for your mortgage loan.',
    'mortgage_calculator.calculator.amortization_tooltip': 'The total length of time it will take to pay off your mortgage in full.',

    // Mortgage Calculator Results
    'mortgage_calculator.results.title': 'Payment Summary',
    'mortgage_calculator.results.bi_weekly_payment': 'Bi-Weekly Payment',
    'mortgage_calculator.results.monthly_payment': 'Monthly Payment',
    'mortgage_calculator.results.annual_payment': 'Annual Payment',
    'mortgage_calculator.results.disclaimer': '* All numbers are rounded to the nearest integer and are for estimation purposes only.',

    // Discover Insights Page
    'discover_insights.hero.title': 'Own the future of your work',
    'discover_insights.hero.description': 'Explore our exclusive research and actionable insights from industry-leading specialists to help transform your business or guide your career.',
    'discover_insights.hero.alt': 'Own the future of your work',
    'discover_insights.featured.title': 'Explore exclusive insights',
    'discover_insights.articles.title': 'Refine your focus',
    'discover_insights.filters.title': 'Filter content by',
    'discover_insights.filters.tags': 'Tags',
    'discover_insights.filters.specialties': 'Specializations',
    
    // Discover Insights Navbar
    'discover_insights.navbar.description': 'Make smarter decisions with the latest hiring trends and career insights.',
    'discover_insights.navbar.button': 'Discover Insights',
    'discover_insights.navbar.trending_topics': 'Trending Topics',
    'discover_insights.navbar.tools': 'Tools',
    'discover_insights.navbar.topics.salary_trends': 'Salary and hiring trends',
    'discover_insights.navbar.topics.adaptive_working': 'Adaptive working',
    'discover_insights.navbar.topics.competitive_advantage': 'Competitive advantage',
    'discover_insights.navbar.topics.work_life_balance': 'Work/life balance',
    'discover_insights.navbar.topics.diversity_inclusion': 'Diversity and inclusion',
    'discover_insights.navbar.tools.quebec_tax_calculator': 'Quebec tax calculator',
    'discover_insights.navbar.tools.mortgage_calculator': 'Mortgage calculator',
    'discover_insights.navbar.tools.salary_guide': 'Salary guide',
    'discover_insights.filters.clear': 'Clear filters',
    'discover_insights.load_more': 'Load more articles',
    'discover_insights.no_articles': 'No articles found with the selected filters.',
    'discover_insights.newsletter.title': 'Get insights in your inbox',
    'discover_insights.newsletter.cta': 'Subscribe to updates',
    'discover_insights.subscription.title': 'Subscribe to the Industrielle RH Newsletter',
    'discover_insights.subscription.description': 'By subscribing to the Industrielle RH newsletter, you\'ll gain access to valuable articles, resources, and updates to help you recruit top talent, enhance workforce integration, and stay informed about the latest in the recruitment industry. Get insights directly in your inbox to support your company\'s growth and success. To receive updates from Industrielle RH, simply enter your name and email below. You can withdraw your consent at any time by contacting Industrielle RH Recrutement International Inc.',
    'discover_insights.subscription.form_title': 'Why wait? Sign up now',
    'discover_insights.subscription.interests': 'Which topic are you interested in?',
    'discover_insights.subscription.areas_label': 'Areas of Interest',
    'discover_insights.subscription.success_message': 'Your newsletter subscription has been confirmed! You will receive our latest updates soon.',
    'discover_insights.subscription.error_message': 'An error occurred during subscription. Please try again.',
    'discover_insights.static.salary_guide': '2025 Salary Guide',
    'discover_insights.static.salary_guide_desc': 'Explore the latest data for hundreds of positions and know what you should earn or pay in local and national markets.',
    'discover_insights.static.jobs_demand': 'What jobs are in demand?',
    'discover_insights.static.jobs_demand_desc': 'Explore our Demand for Skilled Talent report to see what specializations employers need most.',
    'discover_insights.static.engagement': 'Build employee engagement',
    'discover_insights.static.engagement_desc': 'Attract and retain top talent and boost your bottom line-with our tips for creative employee recognition and rewards.',
    
    // Common
    'common.views': 'views',
    'common.first_name': 'First Name',
    'common.last_name': 'Last Name',
    'common.email': 'Email',
    'common.submit': 'Submit',
    'common.submitting': 'Submitting...',
    'common.published_on': 'Published on',
    'common.updated_on': 'Updated on',
    'common.share_email': 'Share by email',
    'common.copy_link': 'Copy link',
    'common.link_copied': 'Link copied!',
    'common.by_author': 'By',
    'common.share': 'Share',
    'common.copy': 'Copy',
    'common.share_facebook': 'Share on Facebook',
    'common.share_linkedin': 'Share on LinkedIn',
    'common.share_twitter': 'Share on X (Twitter)',
    'common.share_whatsapp': 'Share on WhatsApp',
    'common.similar_articles': 'Similar Articles',
    'common.view_all_articles': 'View All Articles',
    'common.no_similar_articles': 'No similar articles found',
    'common.did_you_like_article': 'Did you like this article?',
    'common.discover_more_articles': 'Discover More Articles',
    'common.contact_us': 'Contact Us',

    // Privacy Policy
    'privacy_policy.title': 'Privacy Policy',
    'privacy_policy.effective_date': 'Effective date',
    'privacy_policy.intro': 'Industrielle RH cares about your privacy. This privacy policy explains how we collect, use, and protect your data when you interact with our services.',
    'privacy_policy.section1.title': '1. Information we collect',
    'privacy_policy.section1.intro': 'We can collect personal information as follows:',
    'privacy_policy.section1.item1': 'Name, email address, phone number.',
    'privacy_policy.section1.item2': 'CV/resume, experience profile, job title, and skills.',
    'privacy_policy.section1.item3': 'Position preferences, qualifications, and job functions.',
    'privacy_policy.section1.item4': 'Status of immigration or documents (if required for the position).',    
    'privacy_policy.section1.item5': 'Any other information you choose to provide.',
    'privacy_policy.section2.title': '2. How we use your information',
    'privacy_policy.section2.intro': 'Your information is used for:',
    'privacy_policy.section2.item1': 'Providing services to recruitment and hiring teams.',
    'privacy_policy.section2.item2': 'Hiring employees based on your qualifications.',
    'privacy_policy.section2.item3': 'Communicating with employers interested in you.',
    'privacy_policy.section2.item4': 'Respecting your rights and freedoms under any circumstances.',
    'privacy_policy.section2.item5': 'Improving our services and your experience.',
    'privacy_policy.section3.title': '3. How we protect your information',
    'privacy_policy.section3.intro': 'We can protect your information from unauthorized access, loss, or misuse.',
    'privacy_policy.section3.item1': 'We use industry-standard security measures to protect your information, including encryption and firewalls.',
    'privacy_policy.section3.item2': 'We limit access to your information to authorized personnel only.',
    'privacy_policy.section3.item3': 'We use third-party service providers to help us protect your information.',
    'privacy_policy.section3.item4': 'We comply with all applicable laws and regulations, including the General Data Protection Regulation (GDPR).',
    'privacy_policy.section3.no_sell': 'We do not sell, rent, or lease your personal information.',
    'privacy_policy.section4.title': '4. Your rights',
    'privacy_policy.section4.intro': 'You have the right to:',
    'privacy_policy.section4.item1': 'Access your personal information.',
    'privacy_policy.section4.item2': 'Request corrections or updates.',
    'privacy_policy.section4.item3': 'Request deletion of your account.',
    'privacy_policy.section4.item4': 'Request to restrict processing of your personal information, except in accordance with applicable law.',
    'privacy_policy.section4.contact': 'To exercise your rights, contact:',
    'privacy_policy.section5.title': '5. Security of data',
    'privacy_policy.section5.content': 'We take reasonable measures to protect your personal information from unauthorized access, disclosure, or destruction.',    
    'privacy_policy.section6.title': '6. Data retention',
    'privacy_policy.section6.content': 'We retain your personal information for as long as necessary to provide our services or as required by law.',
    'privacy_policy.section7.title': '7. Contact',
    'privacy_policy.section7.content': 'If you have any questions about this privacy policy or the way we handle your personal information, please contact:',    
    'privacy_policy.section8.title': '8. Updates to this policy',
    'privacy_policy.section8.content': 'We may update this policy from time to time. All updates will be posted on our website with the date of update.',
    'privacy_policy.section8.agreement': 'By using our services, you agree to this privacy policy.',
    'privacy_policy.footer': '© 2024 Industrielle RH. All rights reserved.',

    // Terms of use
    'terms_of_use.title': 'Terms of Service',
    'terms_of_use.effective_date': 'Effective date',  
    'terms_of_use.intro': 'Welcome to the Industrielle RH website. By accessing our website or using our services, you agree to these terms of service. Please read them carefully.',
    'terms_of_use.section1.title': '1. Acceptance of these terms',
    'terms_of_use.section1.content': 'By using this website, you agree to these terms of service. If you do not agree, you should not use the website.',
    'terms_of_use.section2.title': '2. Use of the website',
    'terms_of_use.section2.intro': 'You may use this website only in accordance with these terms of service. The content is intended for personal use and not commercial use.',
    'terms_of_use.section2.agree_not_to': 'You agree not to:',
    'terms_of_use.section2.item1': 'Violence or threats of violence of any kind.',
    'terms_of_use.section2.item2': 'Defamation, slander, libel, or any form of harassment or intimidation of any kind.',
    'terms_of_use.section2.item3': 'Impersonation or misrepresentation of any person or entity.',
    'terms_of_use.section2.item4': 'Use of the website for any illegal or unauthorized purpose.',
    'terms_of_use.section2.item5': 'Attempting to interfere with the proper functioning of the website or its servers.',    
    'terms_of_use.section3.title': '3. Intellectual property',
    'terms_of_use.section3.content': 'All content on this website, including text, graphics, logos, and software, is the property of Industrielle RH or its licensors. You may not reproduce, distribute, or create derivative works without our prior written consent.',
    'terms_of_use.section4.title': '4. User content',
    'terms_of_use.section4.content': 'If you submit information (such as CV), you agree to use it only for recruitment purposes. You are responsible for accurate information submitted.',
    'terms_of_use.section5.title': '5. Links to third-party websites',
    'terms_of_use.section5.content': 'Our website may contain links to third-party websites. We are not responsible for the content or policies of these third-party websites.',
    'terms_of_use.section6.title': '6. Disclaimer',
    'terms_of_use.section6.content': 'The website is provided "as is" without warranty of any kind. We disclaim all warranties, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the website will meet your requirements or that you will achieve any results you may intend.',
    'terms_of_use.section7.title': '7. Limitation of liability',
    'terms_of_use.section7.content': 'Industrielle RH is not liable for any indirect, consequential, or incidental damages arising out of your use of the website.',
    'terms_of_use.section8.title': '8. Termination',
    'terms_of_use.section8.content': 'We may terminate or suspend your access to the website at any time, without prior notice, for any reason including but not limited to breach of these terms of service.',
    'terms_of_use.section9.title': '9. Law',
    'terms_of_use.section9.content': 'These terms of service are governed by the laws of the province of Québec, Canada. Any dispute will be resolved in accordance with the laws of Québec.',
    'terms_of_use.section10.title': '10. Contact',
    'terms_of_use.section10.content': 'If you have any questions about these terms of service, please contact:',
    'terms_of_use.section10.agreement': 'By using our website, you agree to these terms of service.',    
    'terms_of_use.footer': '© 2024 Industrielle RH. All rights reserved.',  

    // Fraud Alert
    'fraud_alert.title': 'Fraud Alert',
    'fraud_alert.intro': 'Industrielle RH cares about your privacy. We will never ask candidates to:',
    'fraud_alert.never_ask.item1': 'Pay for expenses or charges to us or to a third party.',
    'fraud_alert.never_ask.item2': 'Advance money or charges without our consent.',
    'fraud_alert.never_ask.item3': 'Forgery documents or signatures.',
    'fraud_alert.never_ask.item4': 'Provide financial information or access to bank accounts, such as credit card numbers, without our consent.',
    'fraud_alert.never_ask.item5': 'Provide any other information that you choose to provide.',
    'fraud_alert.no_instant_messaging': 'We do not provide job-related instant messaging or phone calls as a means of communication with candidates.',
    'fraud_alert.no_freelance_platforms': 'We do not post job openings or recruitment calls on freelance platforms such as Fiverr or Upwork, and we will not contact candidates via these channels.',
    'fraud_alert.no_digital_wallets': 'We do not post or contact candidates via digital wallets such as Google Pay, Apple Pay, or PayPal, and we will not contact candidates via cryptocurrency wallets.',
    'fraud_alert.authorized_regions': 'Industrielle RH does not recruit only in Quebec.',
    'fraud_alert.what_to_do.title': 'What to do if you suspect fraud',
    'fraud_alert.what_to_do.content': 'If you receive suspicious claims of fraud, please contact us immediately at',
    'fraud_alert.suspicious_signs.title': 'Suspicious signs include requests for:',
    'fraud_alert.suspicious_signs.item1': 'Personal or financial information by email, applications, or social media.',
    'fraud_alert.suspicious_signs.item2': 'Payment in exchange for job openings or interviews.',
    'fraud_alert.resources.title': 'Useful resources:',
    'fraud_alert.resources.item1': 'Center for Fraud and Identity Theft (Canada) – Significant Fraud:',
    'fraud_alert.resources.item2': 'Fraud Prevention and Investigation Centre (Canada) – Fraud Investigation:',
    'fraud_alert.resources.item3': 'Canadian Fraud and Identity Theft Centre (CIFTC) – Fraud Investigation:',
    'fraud_alert.resources.item4': 'GRC – Fraud and Misrepresentation:',
    'fraud_alert.footer': '© 2024 Industrielle RH. All rights reserved.',

  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [dbTranslations, setDbTranslations] = useState<Record<Language, Record<string, string>> | null>(null);
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);

  // Charger les traductions depuis la base de données
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch('/api/translations');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.translations) {
            setDbTranslations(data.translations);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des traductions:', error);
        // En cas d'erreur, on utilisera les traductions statiques
      } finally {
        setIsLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, []);

  // Charger la langue depuis localStorage au démarrage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Sauvegarder la langue dans localStorage quand elle change
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Optionnel: mettre à jour l'attribut lang du document
    document.documentElement.lang = lang;
  };

  // Fonction de traduction
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Utiliser les traductions de la DB si disponibles, sinon fallback vers les traductions statiques
    const activeTranslations = dbTranslations || translations;
    let text = activeTranslations[language][key] || translations[language][key] || key;

    // Remplacer les paramètres s'ils existent
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{{${param}}}`, String(value));
      });
    }

    return text;
  };

  // Fonction pour traduire les champs dynamiques
  const translateDynamic = (category: 'sectors' | 'functions' | 'cities', originalText: string): string => {
    const activeTranslations = dbTranslations || translations;
    const dynamicTranslations = activeTranslations[language].dynamic as any;
    const translation = dynamicTranslations?.[category]?.[originalText];
    return translation || originalText;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    translateDynamic,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook pour obtenir seulement la fonction de traduction
export function useTranslation() {
  const { t, translateDynamic, language } = useLanguage();
  return { t, translateDynamic, language };
}