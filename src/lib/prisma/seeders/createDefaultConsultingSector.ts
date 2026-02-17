import { getDefaultSectorSections } from "../defaultSectorSections";

/**
 * Crée le secteur "page consulting-solutions par défaut" s'il n'existe pas.
 * Ce secteur n'apparaît pas dans la liste navbar mais est affiché quand on
 * arrive sur /consulting-solutions sans avoir cliqué sur un secteur.
 */
async function createDefaultConsultingSector(prisma: any) {
  console.log("🔹 seed secteur par défaut consulting-solutions…");
  const existing = await prisma.sector.findFirst({
    where: { isDefaultConsultingSolutions: true },
  });
  if (existing) {
    console.log("   Secteur par défaut consulting-solutions déjà présent.");
    return;
  }
  const sector = await prisma.sector.create({
    data: {
      libelle: "Consulting Solutions (par défaut)",
      libelle_en: "Default Consulting Solutions",
      description: "Contenu affiché sur la page Solutions de conseil lorsqu'aucun secteur n'est sélectionné.",
      description_en: "Content displayed on the Consulting Solutions page when no sector is selected.",
      isActive: true,
      isDefaultConsultingSolutions: true,
    },
  });
  const defaultSections = getDefaultSectorSections(
    sector.id,
    sector.libelle,
    sector.libelle_en
  );
  await prisma.sectionUI.createMany({
    data: defaultSections,
  });
  console.log("   Secteur par défaut consulting-solutions créé.");
}

export default createDefaultConsultingSector;
