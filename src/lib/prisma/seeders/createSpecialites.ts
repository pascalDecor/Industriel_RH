
module.exports = async function createSpecialites(prisma) {
  console.log("🔹 seed specialites…");
  const noms = [
    "Career Development",
    "Career Development",
    "Hiring Help",
    "Landing a Job",
    "Management Tips",
    "Research and Insights",
    "Workplace Culture",
    "Remote Work Strategies",
    "Salary Trends",
    "Leadership Skills",
    "Employee Engagement",
    "Labour Market News",
    "Onboarding Best Practices",
    "Diversity & Inclusion",
    "Training & Upskilling",
    "Retention Strategies",
    "HR Compliance",
    "Workforce Planning",
    "Industry Innovations",
    "Productivity Hacks",
    "Talent Acquisition",
    "International recruitment",
    "Integration in Québec/Canada",
    "Manufacturing",
    "Construction",
    "Health",
    "Transport"
  ];

  for (const libelle of noms) {
    const sp = await prisma.specialite.findFirst({
      where: { libelle: libelle }
    });
    if (!sp) {
      await prisma.specialite.create({
        data: {
          libelle: libelle
        }
      });
    }
  }
}
