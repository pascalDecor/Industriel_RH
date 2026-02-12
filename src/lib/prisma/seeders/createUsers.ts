const bcrypt = require('bcrypt');

async function createUsers(prisma: any) {
  console.log('🌱 Seeding users...');

  const hashedPassword = await bcrypt.hash('password', 10);

  const userData = {
    name: "Pascal Decor",
    email: "pascalkoevi@gmail.com",
    password: hashedPassword,
    isActive: true
  };

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      console.log(`👤 User ${userData.email} already exists, skipping...`);
      return;
    }

    const user = await prisma.user.create({
      data: userData
    });

    // Créer l'assignation de rôle SUPER_ADMIN
    await prisma.userRoleAssignment.create({
      data: {
        userId: user.id,
        role: 'SUPER_ADMIN',
        isPrimary: true,
        isActive: true
      }
    });

    console.log(`✅ Created user: ${user.name} (${user.email}) with SUPER_ADMIN role`);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
}

module.exports = createUsers;
export {};