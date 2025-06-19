module.exports = async function createCivilities(prisma: {
  civility: {
    findFirst: (arg0: { where: { libelle: string } }) => any;
    create: (arg0: { data: { libelle: string } }) => any;
  };
}) {
  console.log("🔹 seed civilities…");
  const noms = [
    "Monsieur",
    "Madame",
    "Mx.",
    "Autre",
    "Préfère ne pas indiquer"
  ];

  for (const libelle of noms) {
    const sp = await prisma.civility.findFirst({
      where: { libelle: libelle }
    });
    if (!sp) {
      await prisma.civility.create({
        data: {
          libelle: libelle
        }
      });
    }
  }
};
