async function createCivilities(prisma: any) {
  console.log("🔹 seed civilities…");
  const civilities = [
    { fr: "Monsieur", en: "Mr." },
    { fr: "Madame", en: "Mrs./Ms." },
    { fr: "Mx.", en: "Mx." },
    { fr: "Autre", en: "Other" },
    { fr: "Préfère ne pas indiquer", en: "Prefer not to say" }
  ];

  for (const civility of civilities) {
    const sp = await prisma.civility.findFirst({
      where: { libelle: civility.fr }
    });
    if (!sp) {
      await prisma.civility.create({
        data: {
          libelle: civility.fr,
          libelle_en: civility.en
        }
      });
    } else if (!sp.libelle_en) {
      // Mettre à jour les civilités existantes sans version anglaise
      await prisma.civility.update({
        where: { id: sp.id },
        data: {
          libelle_en: civility.en
        }
      });
    }
  }
}

module.exports = createCivilities;
export default createCivilities;
