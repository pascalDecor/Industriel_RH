import { NextResponse, NextRequest } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Sector } from "@prisma/client";
import { getDefaultSectorSections } from '@/lib/prisma/defaultSectorSections';

export const GET = async (request: NextRequest) => {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10));
        const search = searchParams.get('search')?.trim() || '';
        const includeCount = searchParams.get('includeCount') === 'true';
        const includeInactive = searchParams.get('includeInactive') === 'true';
        const includeDefaultConsultingSolutions = searchParams.get('includeDefaultConsultingSolutions') === 'true';

        const skip = (page - 1) * limit;

        const whereSearch = search ? {
            OR: [
                { libelle: { contains: search, mode: 'insensitive' as const } },
                { description: { contains: search, mode: 'insensitive' as const } }
            ]
        } : {};
        const where = {
            ...whereSearch,
            ...(includeInactive ? {} : { isActive: true }),
            ...(includeDefaultConsultingSolutions ? {} : { isDefaultConsultingSolutions: false }),
        };

        // Sélection optimisée
        const select: any = {
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
            // Toujours inclure les fonctions pour l'affichage front
            functions: {
                select: {
                    id: true,
                    libelle: true,
                    libelle_en: true,
                }
            },
            // Inclure les sections avec images pour l'affichage
            Sections: {
                select: {
                    id: true,
                    libelle: true,
                    libelle_en: true,
                    slug: true,
                    description: true,
                    description_en: true,
                    image: true,
                    page: true
                }
            }
        };

        if (includeCount) {
            select._count = {
                select: {
                    functions: true,
                    Sections: true,
                    candidats: true,
                    hires: true
                }
            };
        }

        const [total, sectors] = await Promise.all([
            prisma.sector.count({ where }),
            prisma.sector.findMany({
                where,
                select,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            })
        ]);

        const result = {
            data: sectors,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching sectors:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        const sectorCreated = await prisma.sector.create({
            data: {
                libelle: data.libelle,
                libelle_en: data.libelle_en ?? null,
                description: data.description ?? null,
                description_en: data.description_en ?? null,
            },
        });

        // Créer les sections par défaut (home + consulting_solutions) comme dans le seed
        const defaultSections = getDefaultSectorSections(
            sectorCreated.id,
            sectorCreated.libelle,
            sectorCreated.libelle_en
        );
        await prisma.sectionUI.createMany({
            data: defaultSections,
        });

        return NextResponse.json(sectorCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}