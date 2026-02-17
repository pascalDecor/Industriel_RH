/**
 * Seed des membres de l'équipe (page À propos / Leadership team).
 * Correspond aux membres actuellement affichés en dur sur about/page.tsx et about/team.tsx.
 */
const DEFAULT_TEAM_MEMBERS = [
  { nom: "Fontana", prenom: "Nathalie", post: "Co-fondatrice CRHA", imageKey: "nathalie_fontana", order: 1 },
  { nom: "Hein", prenom: "Jamel", post: "Co-fondateur MSc", imageKey: "jamel_hein", order: 2 },
];

async function createTeamMembers(prisma: any) {
  console.log("🔹 seed team members...");
  for (const member of DEFAULT_TEAM_MEMBERS) {
    const existing = await prisma.teamMember.findFirst({
      where: { nom: member.nom, prenom: member.prenom },
    });
    if (!existing) {
      await prisma.teamMember.create({
        data: {
          nom: member.nom,
          prenom: member.prenom,
          post: member.post,
          imageKey: member.imageKey,
          order: member.order,
        },
      });
      console.log(`  ✓ ${member.prenom} ${member.nom}`);
    }
  }
}

module.exports = createTeamMembers;
export default createTeamMembers;
