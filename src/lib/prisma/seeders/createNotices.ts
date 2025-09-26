module.exports = async function createNotices(prisma: any) {
  console.log("🔹 seed notices...");
  const notices = [
    {
      content: "Notre candidate était le match parfait, elle s'est sentie comme un membre de notre équipe dès le premier jour. Son expertise était exactement ce dont nous avions besoin.",
      content_en: "Our candidate was the perfect match she felt like a member of our team from day one. Her expertise was exactly what we needed.",
      author: "Administrateur de paie",
      author_en: "Payroll administrator",
      stars: 5
    },
    {
      content: "Robert Half fait tout comme il faut. Je les recommanderais à d'autres employeurs à la recherche de candidats hautement qualifiés.",
      content_en: "Robert Half is doing everything right. I would recommend them to other employers in search of highly skilled candidates.",
      author: "PDG",
      author_en: "CEO",
      stars: 5
    },
    {
      content: "Je peux les contacter et avoir des entretiens organisés immédiatement. Cela facilite les choses pour mon entreprise.",
      content_en: "I can contact them and have interviews set up right away. This makes it easy for my company.",
      author: "Chef de projet",
      author_en: "Project manager",
      stars: 5
    }
  ];

  for (const notice of notices) {
    const sp = await prisma.notice.findFirst({
      where: { author: notice.author }
    });
    if (!sp) {
      await prisma.notice.create({
        data: {
          content: notice.content,
          content_en: notice.content_en,
          author: notice.author,
          author_en: notice.author_en,
          stars: notice.stars
        }
      });
    } else if (!sp.content_en || !sp.author_en) {
      // Mettre à jour les notices existantes sans versions anglaises
      await prisma.notice.update({
        where: { id: sp.id },
        data: {
          content_en: notice.content_en,
          author_en: notice.author_en
        }
      });
    }
  }
};
