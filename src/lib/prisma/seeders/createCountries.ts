const { PrismaClient } = require("@prisma/client");


module.exports = async function createCountries(prisma) {
  console.log("🔹 seed countries…");
  const noms = [
    "Canada",
  ];

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
