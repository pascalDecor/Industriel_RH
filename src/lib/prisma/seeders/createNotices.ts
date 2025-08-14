module.exports = async function createNotices(prisma: any) {
  console.log("🔹 seed notices...");
  const notices = [
    {
      content:
        "Our condidate was the perfect motch she felt like a member of our team from day one. Her expertise was exactly what we needed.",
      author: "Payroll administrator",
      stars: 5
    },
    {
      content:
        "Robert Half is doing everything right. I would recommend them to other employers in search of highly skilled candidates.",
      author: "CEO",
      stars: 5
    },
    {
      content:
        "I can contact them and have interviews set to away. This makes it easy for my company.",
      author: "Project manager",
      stars: 5
    }
  ];

  for (const notice of notices) {
    const sp = await prisma.notice.findFirst({
      where: { author: notice.author }
    });
    if (!sp) {
      await prisma.notice.create({
        data: notice
      });
    }
  }
};
