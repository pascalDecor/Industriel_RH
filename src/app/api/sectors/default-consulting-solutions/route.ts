import { NextResponse } from "next/server";
import prisma from "@/lib/connect_db";

/**
 * GET le secteur marqué comme "page consulting-solutions par défaut".
 * Utilisé quand on arrive sur /consulting-solutions sans avoir cliqué sur un secteur (pas dans la liste navbar).
 */
export const GET = async () => {
  try {
    const sector = await prisma.sector.findFirst({
      where: { isDefaultConsultingSolutions: true },
      select: {
        id: true,
        libelle: true,
        libelle_en: true,
        description: true,
        description_en: true,
        alternativeDescriptions: true,
        isActive: true,
        isDefaultConsultingSolutions: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { functions: true, candidats: true, hires: true, Sections: true },
        },
        Sections: {
          select: {
            id: true,
            libelle: true,
            libelle_en: true,
            slug: true,
            description: true,
            description_en: true,
            image: true,
            page: true,
            createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        },
        functions: {
          select: {
            id: true,
            libelle: true,
            libelle_en: true,
            createdAt: true,
            _count: { select: { candidats: true } },
          },
          orderBy: { libelle: "asc" },
        },
      },
    });

    if (!sector) {
      return NextResponse.json(
        { error: "Aucun secteur par défaut pour consulting-solutions" },
        { status: 404 }
      );
    }

    const enrichedSector = {
      ...sector,
      mainImage: sector.Sections?.[0]?.image || "/images/default-sector.jpg",
      fullDescription: sector.description || "",
      alternativeDescriptions: sector.alternativeDescriptions || [],
      stats: {
        totalFunctions: sector._count?.functions || 0,
        totalCandidates: sector._count?.candidats || 0,
        totalHires: sector._count?.hires || 0,
        totalSections: sector._count?.Sections || 0,
      },
    };

    return NextResponse.json(enrichedSector, { status: 200 });
  } catch (error) {
    console.error("GET /api/sectors/default-consulting-solutions:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};
