/**
 * Sections par défaut créées automatiquement à la création d'un secteur
 * (aligné sur la structure du seed createSectors)
 */
export function getDefaultSectorSections(
  sectorId: string,
  libelle: string,
  libelle_en: string | null
) {
  const sectorLabelEn = libelle_en || libelle;
  return [
    {
      libelle: "Ajoutez des talents spécialisés dans votre organisation",
      libelle_en: "Add specialized talent across your organization",
      slug: "Add_specialized_talent_across_your_organization",
      description:
        "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
      description_en:
        "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
      image: "/images/sectors/manufacturing.png",
      page: "home",
      sectorId,
    },
    {
      libelle: `Votre partenaire pour les solutions de main-d'œuvre ${libelle.toLowerCase()}`,
      libelle_en: `Your Partner for ${sectorLabelEn} Workforce Solutions`,
      slug: "consulting_solutions_section_1",
      description:
        "Nous nous spécialisons dans la connexion de travailleurs qualifiés avec les principaux employeurs. Nous fournissons des solutions de recrutement sur mesure pour des rôles permanents et temporaires.",
      description_en:
        "We specialize in connecting skilled workers with leading employers. We provide tailored recruitment solutions for permanent and temporary roles.",
      image: "/images/your_partner_for_manufacturing_workforce_solutions.png",
      page: "consulting_solutions",
      sectorId,
    },
    {
      libelle: `Votre partenaire pour les solutions de main-d'œuvre ${libelle.toLowerCase()}`,
      libelle_en: `Your Partner for ${sectorLabelEn} Workforce Solutions`,
      slug: "consulting_solutions_section_2",
      description:
        "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
      description_en:
        "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
      image: "/images/sectors/manufacturing_1.png",
      page: "consulting_solutions",
      sectorId,
    },
    {
      libelle: `Agence leader pour les solutions de main-d'œuvre ${libelle.toLowerCase()}`,
      libelle_en: `Leading agency for ${sectorLabelEn} workforce solutions`,
      slug: "consulting_solutions_section_3",
      description:
        "Vous cherchez votre prochaine opportunité ? Nous connectons des professionnels qualifiés comme vous avec des employeurs de premier plan. Nous vous aiderons à trouver le rôle parfait qui correspond à vos compétences et objectifs de carrière.",
      description_en:
        "Looking for your next opportunity? We connect skilled professionals like you with leading employers. We'll help you find the perfect role to match your skills and career goals.",
      image: "/images/leading_agency_for_manufacturing_workforce_solutions.png",
      page: "consulting_solutions",
      sectorId,
    },
  ];
}
