module.exports = async function createTags(prisma: any) {
  console.log("🔹 seed tags");
  const tags = [
    { fr: "Actualités", en: "News" },
    { fr: "Technologie", en: "Technology" },
    { fr: "Affaires", en: "Business" },
    { fr: "Santé", en: "Health" },
    { fr: "Éducation", en: "Education" },
    { fr: "Culture", en: "Culture" },
    { fr: "Sports", en: "Sports" },
    { fr: "Politique", en: "Politics" },
    { fr: "Économie", en: "Economy" },
    { fr: "Science", en: "Science" },
    { fr: "Divertissement", en: "Entertainment" },
    { fr: "Voyage", en: "Travel" },
    { fr: "Nourriture", en: "Food" },
    { fr: "Style de vie", en: "Lifestyle" },
    { fr: "Environnement", en: "Environment" },
    { fr: "Art", en: "Art" },
    { fr: "Musique", en: "Music" },
    { fr: "Films", en: "Movies" },
    { fr: "Mode", en: "Fashion" },
    { fr: "Design", en: "Design" },
    { fr: "Opinion", en: "Opinion" },
    { fr: "Entrevue", en: "Interview" },
    { fr: "Tutoriel", en: "Tutorial" },
    { fr: "Analyse", en: "Analysis" },
    { fr: "Guide", en: "Guide" }
  ];

  for (const tag of tags) {
    const sp = await prisma.tag.findFirst({
      where: { libelle: tag.fr }
    });
    if (!sp) {
      await prisma.tag.create({
        data: {
          libelle: tag.fr,
          libelle_en: tag.en
        }
      });
    } else if (!sp.libelle_en) {
      // Mettre à jour les tags existants sans version anglaise
      await prisma.tag.update({
        where: { id: sp.id },
        data: {
          libelle_en: tag.en
        }
      });
    }
  }
};

export {};
