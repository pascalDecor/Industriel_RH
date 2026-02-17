/**
 * Seed des rôles et permissions en base (référentiel unique).
 * Crée Role, Permission, RolePermission et remplit roleId sur UserRoleAssignment.
 */
import { PrismaClient } from '@prisma/client';

const ROLES: { code: string; label: string; description: string; level: number }[] = [
  { code: 'SUPER_ADMIN', label: 'Super administrateur', description: 'Accès complet', level: 7 },
  { code: 'HR_DIRECTOR', label: 'Directeur RH', description: 'Direction et approbations', level: 6 },
  { code: 'HR_MANAGER', label: 'Manager RH', description: 'Gestion équipes', level: 5 },
  { code: 'IT_ENGINEER', label: 'Ingénieur IT', description: 'Accès API / technique', level: 4 },
  { code: 'RECRUITER_SENIOR', label: 'Recruteur senior', description: 'Mentorat et validation', level: 4 },
  { code: 'RECRUITER', label: 'Recruteur', description: 'Recrutement standard', level: 3 },
  { code: 'HR_ASSISTANT', label: 'Assistant RH', description: 'Support administratif', level: 2 },
  { code: 'CONSULTANT', label: 'Consultant', description: 'Lecture seule limitée', level: 1 },
];

const PERMISSIONS: { code: string; label: string; category: string }[] = [
  { code: 'applications.create', label: 'Créer candidatures', category: 'APPLICATIONS' },
  { code: 'applications.read', label: 'Lire candidatures', category: 'APPLICATIONS' },
  { code: 'applications.update', label: 'Modifier candidatures', category: 'APPLICATIONS' },
  { code: 'applications.delete', label: 'Supprimer candidatures', category: 'APPLICATIONS' },
  { code: 'applications.assign', label: 'Assigner recruteur', category: 'APPLICATIONS' },
  { code: 'applications.export', label: 'Exporter candidatures', category: 'APPLICATIONS' },
  { code: 'hires.create', label: 'Créer embauches', category: 'HIRES' },
  { code: 'hires.read', label: 'Lire embauches', category: 'HIRES' },
  { code: 'hires.update', label: 'Modifier embauches', category: 'HIRES' },
  { code: 'hires.approve', label: 'Approuver embauches', category: 'HIRES' },
  { code: 'hires.reject', label: 'Rejeter embauches', category: 'HIRES' },
  { code: 'hires.export', label: 'Exporter embauches', category: 'HIRES' },
  { code: 'contacts.read', label: 'Lire contacts', category: 'CONTACTS' },
  { code: 'contacts.update', label: 'Modifier contacts', category: 'CONTACTS' },
  { code: 'contacts.assign', label: 'Assigner contacts', category: 'CONTACTS' },
  { code: 'contacts.export', label: 'Exporter contacts', category: 'CONTACTS' },
  { code: 'contacts.delete', label: 'Supprimer contacts', category: 'CONTACTS' },
  { code: 'articles.create', label: 'Créer articles', category: 'CONTENT' },
  { code: 'articles.read', label: 'Lire articles', category: 'CONTENT' },
  { code: 'articles.update', label: 'Modifier articles', category: 'CONTENT' },
  { code: 'articles.delete', label: 'Supprimer articles', category: 'CONTENT' },
  { code: 'articles.publish', label: 'Publier articles', category: 'CONTENT' },
  { code: 'sectors.manage', label: 'Gérer secteurs', category: 'CONTENT' },
  { code: 'specialities.manage', label: 'Gérer spécialités', category: 'CONTENT' },
  { code: 'newsletters.create', label: 'Créer newsletters', category: 'NEWSLETTERS' },
  { code: 'newsletters.read', label: 'Lire newsletters', category: 'NEWSLETTERS' },
  { code: 'newsletters.update', label: 'Modifier newsletters', category: 'NEWSLETTERS' },
  { code: 'newsletters.delete', label: 'Supprimer newsletters', category: 'NEWSLETTERS' },
  { code: 'newsletters.export', label: 'Exporter newsletters', category: 'NEWSLETTERS' },
  { code: 'newsletters.send', label: 'Envoyer newsletters', category: 'NEWSLETTERS' },
  { code: 'users.create', label: 'Créer utilisateurs', category: 'ADMIN' },
  { code: 'users.read', label: 'Lire utilisateurs', category: 'ADMIN' },
  { code: 'users.update', label: 'Modifier utilisateurs', category: 'ADMIN' },
  { code: 'users.delete', label: 'Supprimer utilisateurs', category: 'ADMIN' },
  { code: 'roles.assign', label: 'Assigner rôles', category: 'ADMIN' },
  { code: 'roles.manage', label: 'Gérer rôles', category: 'ADMIN' },
  { code: 'system.config', label: 'Config système', category: 'SYSTEM' },
  { code: 'system.logs', label: 'Logs système', category: 'SYSTEM' },
  { code: 'reports.basic', label: 'Rapports de base', category: 'REPORTS' },
  { code: 'reports.advanced', label: 'Rapports avancés', category: 'REPORTS' },
  { code: 'analytics.read', label: 'Analytics', category: 'REPORTS' },
  { code: 'api.access', label: 'Accès API', category: 'API' },
  { code: 'dev.tools', label: 'Outils dev', category: 'API' },
  { code: 'database.access', label: 'Accès BDD', category: 'API' },
  { code: 'salary.calculations', label: 'Calculs salariaux', category: 'FINANCE' },
  { code: 'budget.read', label: 'Lire budget', category: 'FINANCE' },
  { code: 'budget.manage', label: 'Gérer budget', category: 'FINANCE' },
];

// Matrice rôle -> codes de permissions (même logique que role-permissions.ts + IT_ENGINEER)
const ROLE_PERMISSION_CODES: Record<string, string[]> = {
  SUPER_ADMIN: PERMISSIONS.map((p) => p.code), // toutes
  HR_DIRECTOR: [
    'applications.read', 'applications.export', 'applications.assign',
    'hires.read', 'hires.approve', 'hires.reject', 'hires.export',
    'contacts.read', 'contacts.export', 'contacts.assign',
    'articles.read', 'articles.publish', 'sectors.manage', 'specialities.manage',
    'users.read', 'roles.assign',
    'reports.advanced', 'analytics.read', 'budget.read', 'budget.manage',
    'salary.calculations', 'api.access',
  ],
  HR_MANAGER: [
    'applications.create', 'applications.read', 'applications.update', 'applications.assign', 'applications.export',
    'hires.create', 'hires.read', 'hires.update', 'hires.export',
    'contacts.read', 'contacts.update', 'contacts.assign', 'contacts.export',
    'articles.create', 'articles.read', 'articles.update', 'articles.publish', 'sectors.manage', 'specialities.manage',
    'users.read', 'users.update',
    'reports.advanced', 'analytics.read', 'salary.calculations', 'budget.read',
  ],
  IT_ENGINEER: ['api.access'],
  RECRUITER_SENIOR: [
    'applications.create', 'applications.read', 'applications.update', 'applications.delete', 'applications.assign', 'applications.export',
    'hires.create', 'hires.read', 'hires.update',
    'contacts.read', 'contacts.update', 'contacts.assign',
    'articles.create', 'articles.read', 'articles.update',
    'users.read',
    'reports.basic', 'analytics.read',
  ],
  RECRUITER: [
    'applications.create', 'applications.read', 'applications.update',
    'hires.create', 'hires.read', 'hires.update',
    'contacts.read', 'contacts.update',
    'articles.read',
    'reports.basic',
  ],
  HR_ASSISTANT: [
    'applications.create', 'applications.read', 'applications.update',
    'hires.read', 'hires.update',
    'contacts.read', 'contacts.update',
    'articles.read',
  ],
  CONSULTANT: [
    'applications.read', 'hires.read', 'contacts.read', 'articles.read', 'reports.basic',
  ],
};

async function createRolesAndPermissions(prisma: PrismaClient) {
  console.log('🌱 Seeding roles and permissions...');

  const permissionIds = new Map<string, string>();
  const roleIds = new Map<string, string>();

  for (const p of PERMISSIONS) {
    const created = await prisma.permission.upsert({
      where: { code: p.code },
      create: { code: p.code, label: p.label, category: p.category },
      update: { label: p.label, category: p.category },
    });
    permissionIds.set(p.code, created.id);
  }
  console.log(`  ✅ ${PERMISSIONS.length} permissions`);

  for (const r of ROLES) {
    const created = await prisma.role.upsert({
      where: { code: r.code },
      create: { code: r.code, label: r.label, description: r.description, level: r.level },
      update: { label: r.label, description: r.description, level: r.level },
    });
    roleIds.set(r.code, created.id);
  }
  console.log(`  ✅ ${ROLES.length} roles`);

  for (const [roleCode, permCodes] of Object.entries(ROLE_PERMISSION_CODES)) {
    const roleId = roleIds.get(roleCode);
    if (!roleId) continue;
    for (const code of permCodes) {
      const permissionId = permissionIds.get(code);
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId, permissionId },
        },
        create: { roleId, permissionId },
        update: {},
      });
    }
  }
  console.log('  ✅ RolePermission links');

  const assignments = await prisma.userRoleAssignment.findMany({
    where: { roleId: null },
    select: { id: true, role: true },
  });
  for (const a of assignments) {
    const roleCode = String(a.role);
    const roleId = roleIds.get(roleCode);
    if (roleId) {
      await prisma.userRoleAssignment.update({
        where: { id: a.id },
        data: { roleId },
      });
    }
  }
  console.log(`  ✅ Updated roleId on ${assignments.length} UserRoleAssignment(s)`);
}

export default createRolesAndPermissions;
module.exports = createRolesAndPermissions;
