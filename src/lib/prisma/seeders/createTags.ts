const { PrismaClient } = require("@prisma/client");

module.exports = async function createTags(prisma) {
  console.log("🔹 seed tags");
  const noms = [
    "News",
    "Technology",
    "Business",
    "Health",
    "Education",
    "Culture",
    "Sports",
    "Politics",
    "Economy",
    "Science",
    "Entertainment",
    "Travel",
    "Food",
    "Lifestyle",
    "Environment",
    "Art",
    "Music",
    "Movies",
    "Fashion",
    "Design",
    "Opinion",
    "Interview",
    "Tutorial",
    "Analysis",
    "Guide"
  ];

  for (const libelle of noms) {
    const sp = await prisma.tag.findFirst({
      where: { libelle: libelle }
    });
    if (!sp) {
      await prisma.tag.create({
        data: {
          libelle: libelle
        }
      });
    }
  }
};
