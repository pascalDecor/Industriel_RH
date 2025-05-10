const { PrismaClient } = require("@prisma/client");


module.exports = async function createSectors(prisma) {
  console.log("🔹 seed sectors…");
  const noms = [
    "Manufacturing",
    "Construction",
    "Healthcare",
    "Transport",
    "Agriculture & Agro-Food"
  ];

  for (const libelle of noms) {
    const sp = await prisma.sector.findFirst({
      where: { libelle: libelle }
    });
    if (!sp) {
      await prisma.sector.create({
        data: {
          libelle: libelle
        }
      });
    }
  }
}
