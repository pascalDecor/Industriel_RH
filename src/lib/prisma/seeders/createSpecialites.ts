module.exports = async function createSpecialites(prisma: any) {
  console.log("🔹 seed specialites…");
  const specialites = [
    { fr: "Développement de carrière", en: "Career Development" },
    { fr: "Aide à l'embauche", en: "Hiring Help" },
    { fr: "Trouver un emploi", en: "Landing a Job" },
    { fr: "Conseils de gestion", en: "Management Tips" },
    { fr: "Recherche et analyses", en: "Research and Insights" },
    { fr: "Culture d'entreprise", en: "Workplace Culture" },
    { fr: "Stratégies de télétravail", en: "Remote Work Strategies" },
    { fr: "Tendances salariales", en: "Salary Trends" },
    { fr: "Compétences de leadership", en: "Leadership Skills" },
    { fr: "Engagement des employés", en: "Employee Engagement" },
    { fr: "Actualités du marché du travail", en: "Labour Market News" },
    { fr: "Meilleures pratiques d'intégration", en: "Onboarding Best Practices" },
    { fr: "Diversité et inclusion", en: "Diversity & Inclusion" },
    { fr: "Formation et perfectionnement", en: "Training & Upskilling" },
    { fr: "Stratégies de rétention", en: "Retention Strategies" },
    { fr: "Conformité RH", en: "HR Compliance" },
    { fr: "Planification de la main-d'œuvre", en: "Workforce Planning" },
    { fr: "Innovations de l'industrie", en: "Industry Innovations" },
    { fr: "Astuces de productivité", en: "Productivity Hacks" },
    { fr: "Acquisition de talents", en: "Talent Acquisition" },
    { fr: "Recrutement international", en: "International recruitment" },
    { fr: "Intégration au Québec/Canada", en: "Integration in Québec/Canada" },
    { fr: "Fabrication", en: "Manufacturing" },
    { fr: "Construction", en: "Construction" },
    { fr: "Santé", en: "Health" },
    { fr: "Transport", en: "Transport" }
  ];

  for (const specialite of specialites) {
    const sp = await prisma.specialite.findFirst({
      where: { libelle: specialite.fr }
    });
    if (!sp) {
      await prisma.specialite.create({
        data: {
          libelle: specialite.fr,
          libelle_en: specialite.en
        }
      });
    } else if (!sp.libelle_en) {
      // Mettre à jour les spécialités existantes sans version anglaise
      await prisma.specialite.update({
        where: { id: sp.id },
        data: {
          libelle_en: specialite.en
        }
      });
    }
  }
};

export {};
