module.exports = async function createCountries(prisma: {
  country: {
    findFirst: (arg0: { where: { libelle: string } }) => any;
    create: (arg0: { data: { libelle: string } }) => any;
  };
}) {
  console.log("🔹 seed countries…");
  const noms = ["Canada"];

  for (const libelle of noms) {
    const sp = await prisma.country.findFirst({
      where: { libelle: libelle }
    });
    if (!sp) {
      await prisma.country.create({
        data: {
          libelle: libelle
        }
      });
    }
  }
};
