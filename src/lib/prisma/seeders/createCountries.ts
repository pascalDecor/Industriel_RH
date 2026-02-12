async function createCountries(prisma: any) {
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
}

module.exports = createCountries;
export default createCountries;
