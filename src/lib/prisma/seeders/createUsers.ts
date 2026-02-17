const bcrypt = require("bcrypt");

const DEFAULT_PASSWORD = "password";

// Roles : SUPER_ADMIN, HR_DIRECTOR, HR_MANAGER, IT_ENGINEER, RECRUITER_SENIOR, RECRUITER, HR_ASSISTANT, CONSULTANT

/** Liste des utilisateurs à créer au seed (email unique, rôle par code) */
const USERS_TO_SEED: Array<{ name: string; email: string; roleCode: string }> =
  [
    {
      name: "Pascal Decor",
      email: "pascalkoevi@gmail.com",
      roleCode: "SUPER_ADMIN",
    },
    {
      name: "John Doe",
      email: "nwinnogme.hien@gmail.com",
      roleCode: "HR_DIRECTOR",
    },
    {
      name: "Jim Beam",
      email: "koevipascaldecor@gmail.com",
      roleCode: "IT_ENGINEER",
    },
  ];

async function createUsers(prisma: any) {
  console.log("🌱 Seeding users...");

  if (USERS_TO_SEED.length === 0) {
    console.log("  (aucun utilisateur dans la liste)");
    return;
  }

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const roleByCode = new Map<string, { id: string }>();

  const getRole = async (code: string) => {
    if (!roleByCode.has(code)) {
      const role = await prisma.role.findUnique({
        where: { code },
        select: { id: true },
      });
      if (!role)
        throw new Error(
          `Role ${code} not found. Run createRolesAndPermissions first.`,
        );
      roleByCode.set(code, role);
    }
    return roleByCode.get(code)!;
  };

  for (const u of USERS_TO_SEED) {
    try {
      const existing = await prisma.user.findUnique({
        where: { email: u.email },
        select: { id: true, name: true },
      });

      if (existing) {
        console.log(`  👤 ${u.email} already exists, skipping...`);
        continue;
      }

      const user = await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          password: hashedPassword,
          isActive: true,
        },
      });

      const role = await getRole(u.roleCode);

      await prisma.userRoleAssignment.create({
        data: {
          userId: user.id,
          role: u.roleCode,
          roleId: role.id,
          isPrimary: true,
          isActive: true,
        },
      });

      console.log(`  ✅ ${user.name} (${user.email}) – rôle ${u.roleCode}`);
    } catch (error) {
      console.error(`  ❌ Error creating user ${u.email}:`, error);
      throw error;
    }
  }
}

module.exports = createUsers;
export default createUsers;
