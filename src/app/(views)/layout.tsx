import ClientShell from "./ClientShell"; // 👇 un composant client

export const metadata = {
  title: "Industrielle RH",
  description:
    "Solutions de recrutement, d'embauche et de conseil en ressources humaines. Trouvez des emplois ou recrutez des talents avec Industrielle RH.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientShell>{children}</ClientShell>;
}
