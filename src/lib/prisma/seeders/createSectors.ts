async function createSectors(prisma: any) {
  console.log("🔹 seed sectors…");
  const sectors = [
    {
      fr: "Fabrication",
      en: "Manufacturing",
      description_fr: "Soudeurs, opérateurs de machines, assembleurs et mécaniciens industriels.",
      description_en: "Welders, Machine Operators, Assemblers, and Industrial Mechanics."
    },
    {
      fr: "Construction", 
      en: "Construction",
      description_fr: "Électriciens, opérateurs d'équipement lourd et chefs de projet.",
      description_en: "Electricians, Heavy Equipment Operators, and Project Managers."
    },
    {
      fr: "Soins de santé",
      en: "Healthcare", 
      description_fr: "Infirmières, préposés aux bénéficiaires et techniciens médicaux.",
      description_en: "Nurses, Caregivers, and Medical Technicians."
    },
    {
      fr: "Transport",
      en: "Transport",
      description_fr: "Camionneurs, superviseurs d'entrepôt et coordinateurs logistiques.",
      description_en: "Truck Drivers, Warehouse Supervisors, and Logistics Coordinators."
    },
    {
      fr: "Agriculture et agroalimentaire",
      en: "Agriculture & Agro-Food",
      description_fr: "Travailleurs agricoles, opérateurs de machines et techniciens de transformation alimentaire.",
      description_en: "Farm Workers, Machine Operators, and Food Processing Technicians"
    }
  ];

  for (const sector of sectors) {
    const spf = await prisma.sector.findFirst({
      where: { libelle: sector.fr }
    });
    if (!spf) {
      const sp = await prisma.sector.create({
        data: {
          libelle: sector.fr,
          libelle_en: sector.en,
          description: sector.description_fr,
          description_en: sector.description_en
        }
      });

      switch (sector.en) {
        case "Manufacturing": {
          const hasFunctions = (await prisma.function.count({ where: { sectorId: sp.id } })) > 0;
          const hasSections = (await prisma.sectionUI.count({ where: { sectorId: sp.id } })) > 0;
          if (!hasFunctions) {
          await prisma.function.createMany({
            data: [
              {
                libelle: "Travailleurs agricoles",
                libelle_en: "Agricultural workers",
                sectorId: sp.id
              },
              {
                libelle: "Ouvrier de production",
                libelle_en: "Production worker",
                sectorId: sp.id
              },
              {
                libelle: "Opérateur",
                libelle_en: "Operator",
                sectorId: sp.id
              }
            ]
          });
          }
          if (!hasSections) {
          await prisma.sectionUI.createMany({
            data: [
              {
                libelle: "Ajoutez des talents spécialisés dans votre organisation",
                libelle_en: "Add specialized talent across your organization",
                slug: "Add_specialized_talent_across_your_organization",
                description:
                  "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
                description_en: "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/manufacturing.png",
                page: "home",
                sectorId: sp.id
              },
              {
                libelle: "Votre partenaire pour les solutions de main-d'œuvre manufacturière",
                libelle_en: "Your Partner for Manufacturing Workforce Solutions",
                slug: "consulting_solutions_section_1",
                description:
                  "Nous nous spécialisons dans la connexion de travailleurs qualifiés avec les principaux fabricants. Des soudeurs et opérateurs de machines aux mécaniciens industriels et spécialistes du contrôle qualité, nous fournissons des solutions de recrutement sur mesure pour des rôles permanents et temporaires.",
                description_en: "We specialize in connecting skilled workers with leading manufacturers. From welders and machine operators to industrial mechanics and quality control specialists, we provide tailored recruitment solutions for permanent and temporary roles.",
                image:
                  "/images/your_partner_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Votre partenaire pour les solutions de main-d'œuvre manufacturière",
                libelle_en: "Your Partner for Manufacturing Workforce Solutions",
                slug: "consulting_solutions_section_2",
                description:
                  "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
                description_en: "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/manufacturing_1.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Agence leader pour les solutions de main-d'œuvre manufacturière",
                libelle_en: "Leading agency for manufacturing workforce solutions",
                slug: "consulting_solutions_section_3",
                description:
                  "Vous cherchez votre prochaine opportunité en fabrication? Nous connectons des professionnels qualifiés comme vous avec des employeurs de premier plan. Du soudage et de l'opération de machines au contrôle qualité et à la maintenance industrielle, nous vous aiderons à trouver le rôle parfait qui correspond à vos compétences et objectifs de carrière.",
                description_en: "Looking for your next opportunity in manufacturing? We connect skilled professionals like you with leading employers. From welding and machine operation to quality control and industrial maintenance, we'll help you find the perfect role to match your skills and career goals.",
                image:
                  "/images/leading_agency_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              }
            ]
          });
          }
          break;
        }
        case "Construction": {
          const hasFunctions = (await prisma.function.count({ where: { sectorId: sp.id } })) > 0;
          const hasSections = (await prisma.sectionUI.count({ where: { sectorId: sp.id } })) > 0;
          if (!hasFunctions) {
          await prisma.function.createMany({
            data: [
              {
                libelle: "Manœuvres",
                libelle_en: "Maneuvers",
                sectorId: sp.id
              },
              {
                libelle: "Opérateurs",
                libelle_en: "Operators",
                sectorId: sp.id
              },
              {
                libelle: "Tuyauteurs",
                libelle_en: "Pipefitters",
                sectorId: sp.id
              },
              {
                libelle: "Peintre en bâtiment",
                libelle_en: "Building painter",
                sectorId: sp.id
              }
            ]
          });
          }
          if (!hasSections) {
          await prisma.sectionUI.createMany({
            data: [
              {
                libelle: "Ajoutez des talents spécialisés dans votre organisation",
                libelle_en: "Add specialized talent across your organization",
                slug: "Add_specialized_talent_across_your_organization",
                description:
                  "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
                description_en: "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/construction.png",
                page: "home",
                sectorId: sp.id
              },
              {
                libelle: "Votre partenaire pour les solutions de main-d'œuvre en construction",
                libelle_en: "Your Partner for Construction Workforce Solutions",
                slug: "consulting_solutions_section_1",
                description:
                  "Nous nous spécialisons dans la connexion de travailleurs qualifiés avec les principaux constructeurs. Des électriciens et opérateurs d'équipement lourd aux chefs de projet, nous fournissons des solutions de recrutement sur mesure pour des rôles permanents et temporaires.",
                description_en: "We specialize in connecting skilled workers with leading manufacturers. From welders and machine operators to industrial mechanics and quality control specialists, we provide tailored recruitment solutions for permanent and temporary roles.",
                image:
                  "/images/your_partner_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Votre partenaire pour les solutions de main-d'œuvre en construction",
                libelle_en: "Your Partner for Construction Workforce Solutions",
                slug: "consulting_solutions_section_2",
                description:
                  "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
                description_en: "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/construction_1.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Agence leader pour les solutions de main-d'œuvre en construction",
                libelle_en: "Leading agency for Construction workforce solutions",
                slug: "consulting_solutions_section_3",
                description:
                  "Vous cherchez votre prochaine opportunité dans la construction? Nous connectons des professionnels qualifiés comme vous avec des employeurs de premier plan. De l'électricité et l'opération d'équipement lourd à la gestion de projet, nous vous aiderons à trouver le rôle parfait qui correspond à vos compétences et objectifs de carrière.",
                description_en: "Looking for your next opportunity in manufacturing? We connect skilled professionals like you with leading employers. From welding and machine operation to quality control and industrial maintenance, we'll help you find the perfect role to match your skills and career goals.",
                image:
                  "/images/leading_agency_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              }
            ]
          });
          }
          break;
        }
        case "Healthcare": {
          const hasFunctions = (await prisma.function.count({ where: { sectorId: sp.id } })) > 0;
          const hasSections = (await prisma.sectionUI.count({ where: { sectorId: sp.id } })) > 0;
          if (!hasFunctions) {
          await prisma.function.createMany({
            data: [
              {
                libelle: "Infirmières",
                libelle_en: "Nurses",
                sectorId: sp.id
              },
              {
                libelle: "Préposé aux bénéficiaires",
                libelle_en: "Beneficiary attendant",
                sectorId: sp.id
              },
              {
                libelle: "Pharmacien",
                libelle_en: "Pharmacist",
                sectorId: sp.id
              }
            ]
          });
          }
          if (!hasSections) {
          await prisma.sectionUI.createMany({
            data: [
              {
                libelle: "Ajoutez des talents spécialisés dans votre organisation",
                libelle_en: "Add specialized talent across your organization",
                slug: "Add_specialized_talent_across_your_organization",
                description:
                  "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
                description_en: "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/healthcare.png",
                page: "home",
                sectorId: sp.id
              },
              {
                libelle: "Votre partenaire pour les solutions de main-d'œuvre en soins de santé",
                libelle_en: "Your Partner for Healthcare Workforce Solutions",
                slug: "consulting_solutions_section_1",
                description:
                  "Nous nous spécialisons dans la connexion de travailleurs qualifiés avec les principaux constructeurs. Des électriciens et opérateurs d'équipement lourd aux chefs de projet, nous fournissons des solutions de recrutement sur mesure pour des rôles permanents et temporaires.",
                description_en: "We specialize in connecting skilled workers with leading manufacturers. From welders and machine operators to industrial mechanics and quality control specialists, we provide tailored recruitment solutions for permanent and temporary roles.",
                image:
                  "/images/your_partner_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Votre partenaire pour les solutions de main-d'œuvre en soins de santé",
                libelle_en: "Your Partner for Healthcare Workforce Solutions",
                slug: "consulting_solutions_section_2",
                description:
                  "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
                description_en: "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/healthcare_1.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Agence leader pour les solutions de main-d'œuvre en soins de santé",
                libelle_en: "Leading agency for Healthcare workforce solutions",
                slug: "consulting_solutions_section_3",
                description:
                  "Vous cherchez votre prochaine opportunité dans la construction? Nous connectons des professionnels qualifiés comme vous avec des employeurs de premier plan. De l'électricité et l'opération d'équipement lourd à la gestion de projet, nous vous aiderons à trouver le rôle parfait qui correspond à vos compétences et objectifs de carrière.",
                description_en: "Looking for your next opportunity in manufacturing? We connect skilled professionals like you with leading employers. From welding and machine operation to quality control and industrial maintenance, we'll help you find the perfect role to match your skills and career goals.",
                image:
                  "/images/leading_agency_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              }
            ]
          });
          }
          break;
        }
        case "Transport": {
          const hasFunctions = (await prisma.function.count({ where: { sectorId: sp.id } })) > 0;
          const hasSections = (await prisma.sectionUI.count({ where: { sectorId: sp.id } })) > 0;
          if (!hasFunctions) {
          await prisma.function.createMany({
            data: [
              {
                libelle: "Chauffeur de camion lourd",
                libelle_en: "Heavy truck driver",
                sectorId: sp.id
              },
              {
                libelle: "Pilote",
                libelle_en: "Pilot",
                sectorId: sp.id
              },
              {
                libelle: "Mécanicien automobile",
                libelle_en: "Auto mechanic",
                sectorId: sp.id
              }
            ]
          });
          }
          if (!hasSections) {
          await prisma.sectionUI.createMany({
            data: [
              {
                libelle: "Ajoutez des talents spécialisés dans votre organisation",
                libelle_en: "Add specialized talent across your organization",
                slug: "Add_specialized_talent_across_your_organization",
                description:
                  "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
                description_en: "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/transport.png",
                page: "home",
                sectorId: sp.id
              },
              {
                libelle: "Votre partenaire pour les solutions de main-d'œuvre en transport",
                libelle_en: "Your Partner for Transport Workforce Solutions",
                slug: "consulting_solutions_section_1",
                description:
                  "Nous nous spécialisons dans la connexion de travailleurs qualifiés avec les principaux constructeurs. Des électriciens et opérateurs d'équipement lourd aux chefs de projet, nous fournissons des solutions de recrutement sur mesure pour des rôles permanents et temporaires.",
                description_en: "We specialize in connecting skilled workers with leading manufacturers. From welders and machine operators to industrial mechanics and quality control specialists, we provide tailored recruitment solutions for permanent and temporary roles.",
                image:
                  "/images/your_partner_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Votre partenaire pour les solutions de main-d'œuvre en transport",
                libelle_en: "Your Partner for Transport Workforce Solutions",
                slug: "consulting_solutions_section_2",
                description:
                  "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
                description_en: "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/transport_1.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Agence leader pour les solutions de main-d'œuvre en transport",
                libelle_en: "Leading agency for Transport workforce solutions",
                slug: "consulting_solutions_section_3",
                description:
                  "Vous cherchez votre prochaine opportunité dans la construction? Nous connectons des professionnels qualifiés comme vous avec des employeurs de premier plan. De l'électricité et l'opération d'équipement lourd à la gestion de projet, nous vous aiderons à trouver le rôle parfait qui correspond à vos compétences et objectifs de carrière.",
                description_en: "Looking for your next opportunity in manufacturing? We connect skilled professionals like you with leading employers. From welding and machine operation to quality control and industrial maintenance, we'll help you find the perfect role to match your skills and career goals.",
                image:
                  "/images/leading_agency_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              }
            ]
          });
          }
          break;
        }
        case "Agriculture & Agro-Food": {
          const hasFunctions = (await prisma.function.count({ where: { sectorId: sp.id } })) > 0;
          const hasSections = (await prisma.sectionUI.count({ where: { sectorId: sp.id } })) > 0;
          if (!hasFunctions) {
          await prisma.function.createMany({
            data: [
              {
                libelle: "Soudeurs",
                libelle_en: "Welders",
                sectorId: sp.id
              },
              {
                libelle: "Opérateurs de machines",
                libelle_en: "Machine Operators",
                sectorId: sp.id
              },
              {
                libelle: "Assembleurs",
                libelle_en: "Assemblers",
                sectorId: sp.id
              },
              {
                libelle: "Mécaniciens industriels",
                libelle_en: "Industrial Mechanics",
                sectorId: sp.id
              }
            ]
          });
          }
          if (!hasSections) {
          await prisma.sectionUI.createMany({
            data: [
              {
                libelle: "Ajoutez des talents spécialisés dans votre organisation",
                libelle_en: "Add specialized talent across your organization",
                slug: "Add_specialized_talent_across_your_organization",
                description:
                  "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
                description_en: "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/agriculture_agro_food.png",
                page: "home",
                sectorId: sp.id
              },
              {
                libelle: "Votre partenaire pour les solutions de main-d'œuvre agricole et agroalimentaire",
                libelle_en: "Your Partner for Agriculture & Agro-Food Workforce Solutions",
                slug: "consulting_solutions_section_1",
                description:
                  "Nous nous spécialisons dans la connexion de travailleurs qualifiés avec les principaux constructeurs. Des électriciens et opérateurs d'équipement lourd aux chefs de projet, nous fournissons des solutions de recrutement sur mesure pour des rôles permanents et temporaires.",
                description_en: "We specialize in connecting skilled workers with leading manufacturers. From welders and machine operators to industrial mechanics and quality control specialists, we provide tailored recruitment solutions for permanent and temporary roles.",
                image:
                  "/images/your_partner_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Votre partenaire pour les solutions de main-d'œuvre agricole et agroalimentaire",
                libelle_en: "Your Partner for Agriculture & Agro-Food Workforce Solutions",
                slug: "consulting_solutions_section_2",
                description:
                  "Des postes d'entrée aux postes de direction, nous vous mettons en contact avec les meilleurs candidats qui ont les compétences et l'expérience recherchées pour répondre aux besoins de votre main-d'œuvre dans les secteurs clés",
                description_en: "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/agriculture_agro_food_1.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Agence leader pour les solutions de main-d'œuvre agricole et agroalimentaire",
                libelle_en: "Leading agency for Agriculture & Agro-Food workforce solutions",
                slug: "consulting_solutions_section_3",
                description:
                  "Vous cherchez votre prochaine opportunité dans la construction? Nous connectons des professionnels qualifiés comme vous avec des employeurs de premier plan. De l'électricité et l'opération d'équipement lourd à la gestion de projet, nous vous aiderons à trouver le rôle parfait qui correspond à vos compétences et objectifs de carrière.",
                description_en: "Looking for your next opportunity in manufacturing? We connect skilled professionals like you with leading employers. From welding and machine operation to quality control and industrial maintenance, we'll help you find the perfect role to match your skills and career goals.",
                image:
                  "/images/leading_agency_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              }
            ]
          });
          }
          break;
        }
        default:
          break;
      }
    }
  }
}

module.exports = createSectors;
export default createSectors;
