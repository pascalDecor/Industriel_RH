/**
 * L'accès à /api-docs est contrôlé par le proxy (proxy.ts racine et src/proxy.ts) :
 * token requis + rôle parmi SUPER_ADMIN, HR_DIRECTOR, HR_MANAGER, IT_ENGINEER.
 */
export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
