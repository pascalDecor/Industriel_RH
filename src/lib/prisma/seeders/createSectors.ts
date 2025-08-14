module.exports = async function createSectors(prisma: any) {
  console.log("🔹 seed sectors…");
  const noms = [
    {
      libelle: "Manufacturing",
      description:
        "Welders, Machine Operators, Assemblers, and Industrial Mechanics."
    },
    {
      libelle: "Construction",
      description:
        "Electricians, Heavy Equipment Operators, and Project Managers."
    },
    {
      libelle: "Healthcare",
      description: "Nurses, Caregivers, and Medical Technicians."
    },
    {
      libelle: "Transport",
      description:
        "Truck Drivers, Warehouse Supervisors, and Logistics Coordinators."
    },
    {
      libelle: "Agriculture & Agro-Food",
      description:
        "Farm Workers, Machine Operators, and Food Processing Technicians"
    }
  ];

  for (const sector of noms) {
    const spf = await prisma.sector.findFirst({
      where: { libelle: sector.libelle }
    });
    if (!spf) {
      const sp = await prisma.sector.create({
        data: {
          libelle: sector.libelle,
          description: sector.description
        }
      });

      switch (sector.libelle) {
        case "Manufacturing":
          await prisma.function.createMany({
            data: [
              {
                libelle: "Agricultural workers",
                sectorId: sp.id
              },
              {
                libelle: "Production worker",
                sectorId: sp.id
              },
              {
                libelle: "Operator",
                sectorId: sp.id
              }
            ]
          });

          await prisma.sectionUI.createMany({
            data: [
              {
                libelle: "home-page",
                slug: "Add_specialized_talent_across_your_organization",
                description:
                  "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/manufacturing.png",
                page: "home",
                sectorId: sp.id
              },
              {
                libelle: "Your Partner for Manufacturing Workforce Solutions",
                slug: "consulting_solutions_section_1",
                description:
                  "We specialize in connecting skilled workers with leading manufacturers. From welders and machine operators to industrial mechanics and quality control specialists, we provide tailored recruitment solutions for permanent and temporary roles.",
                image:
                  "/images/your_partner_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Your Partner for Manufacturing Workforce Solutions",
                slug: "consulting_solutions_section_2",
                description:
                  "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/manufacturing_1.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Leading agency for manufacturing workforce solutions",
                slug: "consulting_solutions_section_3",
                description:
                  "Looking for your next opportunity in manufacturing? We connect skilled professionals like you with leading employers. From welding and machine operation to quality control and industrial maintenance, we'll help you find the perfect role to match your skills and career goals.",
                image:
                  "/images/leading_agency_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              }
            ]
          });
          break;
        case "Construction":
          await prisma.function.createMany({
            data: [
              {
                libelle: "Maneuvers",
                sectorId: sp.id
              },
              {
                libelle: "Operators",
                sectorId: sp.id
              },
              {
                libelle: "Pipefitters",
                sectorId: sp.id
              },
              {
                libelle: "Building painter",
                sectorId: sp.id
              }
            ]
          });
          await prisma.sectionUI.createMany({
            data: [
              {
                libelle: "home-page",
                slug: "Add_specialized_talent_across_your_organization",
                description:
                  "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/construction.png",
                page: "home",
                sectorId: sp.id
              },
              {
                libelle: "Your Partner for Construction Workforce Solutions",
                slug: "consulting_solutions_section_1",
                description:
                  "We specialize in connecting skilled workers with leading manufacturers. From welders and machine operators to industrial mechanics and quality control specialists, we provide tailored recruitment solutions for permanent and temporary roles.",
                image:
                  "/images/your_partner_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Your Partner for Construction Workforce Solutions",
                slug: "consulting_solutions_section_2",
                description:
                  "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/construction_1.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Leading agency for Construction workforce solutions",
                slug: "consulting_solutions_section_3",
                description:
                  "Looking for your next opportunity in manufacturing? We connect skilled professionals like you with leading employers. From welding and machine operation to quality control and industrial maintenance, we'll help you find the perfect role to match your skills and career goals.",
                image:
                  "/images/leading_agency_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              }
            ]
          });
          break;
        case "Healthcare":
          await prisma.function.createMany({
            data: [
              {
                libelle: "Nurses",
                sectorId: sp.id
              },
              {
                libelle: "Beneficiary attendant",
                sectorId: sp.id
              },
              {
                libelle: "Pharmacist",
                sectorId: sp.id
              }
            ]
          });
          await prisma.sectionUI.createMany({
            data: [
              {
                libelle: "home-page",
                slug: "Add_specialized_talent_across_your_organization",
                description:
                  "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/healthcare.png",
                page: "home",
                sectorId: sp.id
              },
              {
                libelle: "Your Partner for Healthcare Workforce Solutions",
                slug: "consulting_solutions_section_1",
                description:
                  "We specialize in connecting skilled workers with leading manufacturers. From welders and machine operators to industrial mechanics and quality control specialists, we provide tailored recruitment solutions for permanent and temporary roles.",
                image:
                  "/images/your_partner_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Your Partner for Healthcare Workforce Solutions",
                slug: "consulting_solutions_section_2",
                description:
                  "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/healthcare_1.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Leading agency for Healthcare workforce solutions",
                slug: "consulting_solutions_section_3",
                description:
                  "Looking for your next opportunity in manufacturing? We connect skilled professionals like you with leading employers. From welding and machine operation to quality control and industrial maintenance, we'll help you find the perfect role to match your skills and career goals.",
                image:
                  "/images/leading_agency_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              }
            ]
          });
          break;
        case "Transport":
          await prisma.function.createMany({
            data: [
              {
                libelle: "Heavy truck driver",
                sectorId: sp.id
              },
              {
                libelle: "Pilot",
                sectorId: sp.id
              },
              {
                libelle: "Auto mechanic",
                sectorId: sp.id
              }
            ]
          });
          await prisma.sectionUI.createMany({
            data: [
              {
                libelle: "home-page",
                slug: "Add_specialized_talent_across_your_organization",
                description:
                  "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/transport.png",
                page: "home",
                sectorId: sp.id
              },
              {
                libelle: "Your Partner for Transport Workforce Solutions",
                slug: "consulting_solutions_section_1",
                description:
                  "We specialize in connecting skilled workers with leading manufacturers. From welders and machine operators to industrial mechanics and quality control specialists, we provide tailored recruitment solutions for permanent and temporary roles.",
                image:
                  "/images/your_partner_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Your Partner for Transport Workforce Solutions",
                slug: "consulting_solutions_section_2",
                description:
                  "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/transport_1.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle: "Leading agency for Transport workforce solutions",
                slug: "consulting_solutions_section_3",
                description:
                  "Looking for your next opportunity in manufacturing? We connect skilled professionals like you with leading employers. From welding and machine operation to quality control and industrial maintenance, we'll help you find the perfect role to match your skills and career goals.",
                image:
                  "/images/leading_agency_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              }
            ]
          });
          break;
        case "Agriculture & Agro-Food":
          await prisma.function.createMany({
            data: [
              {
                libelle: "Welders",
                sectorId: sp.id
              },
              {
                libelle: "Machine Operators",
                sectorId: sp.id
              },
              {
                libelle: "Assemblers",
                sectorId: sp.id
              },
              {
                libelle: "Industrial Mechanics",
                sectorId: sp.id
              }
            ]
          });
          await prisma.sectionUI.createMany({
            data: [
              {
                libelle: "home-page",
                slug: "Add_specialized_talent_across_your_organization",
                description:
                  "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/agriculture_agro_food.png",
                page: "home",
                sectorId: sp.id
              },
              {
                libelle:
                  "Your Partner for Agriculture & Agro-Food Workforce Solutions",
                slug: "consulting_solutions_section_1",
                description:
                  "We specialize in connecting skilled workers with leading manufacturers. From welders and machine operators to industrial mechanics and quality control specialists, we provide tailored recruitment solutions for permanent and temporary roles.",
                image:
                  "/images/your_partner_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle:
                  "Your Partner for Agriculture & Agro-Food Workforce Solutions",
                slug: "consulting_solutions_section_2",
                description:
                  "From entry-level roles to leadership positions, we connect you with top candidates who have the in-demand skills and experience to meet your workforce needs in key sectors",
                image: "/images/sectors/agriculture_agro_food_1.png",
                page: "consulting_solutions",
                sectorId: sp.id
              },
              {
                libelle:
                  "Leading agency for Agriculture & Agro-Food workforce solutions",
                slug: "consulting_solutions_section_3",
                description:
                  "Looking for your next opportunity in manufacturing? We connect skilled professionals like you with leading employers. From welding and machine operation to quality control and industrial maintenance, we'll help you find the perfect role to match your skills and career goals.",
                image:
                  "/images/leading_agency_for_manufacturing_workforce_solutions.png",
                page: "consulting_solutions",
                sectorId: sp.id
              }
            ]
          });
          break;
        default:
          break;
      }
    }
  }
};
