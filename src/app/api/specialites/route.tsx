import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { NextRequest } from 'next/server';

// Cache pour les spécialités
const specialitesCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10));
        const search = searchParams.get('search')?.trim() || '';
        const includeCount = searchParams.get('includeCount') === 'true' || true;
        
        const skip = (page - 1) * limit;
        const cacheKey = `specialites:${page}:${limit}:${search}:${includeCount}`;
        
        // Vérifier le cache
        const cached = specialitesCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json(cached.data);
        }

        const where = search ? {
            OR: [
                { libelle: { contains: search, mode: 'insensitive' as const } },
                { libelle_en: { contains: search, mode: 'insensitive' as const } }
            ]
        } : {};

        // Sélection optimisée
        const select: any = {
            id: true,
            libelle: true,
            libelle_en: true,
            createdAt: true,
        };

        if (includeCount) {
            select._count = {
                select: {
                    articles : true
                }
            };
        }

        const [total, specialites] = await Promise.all([
            prisma.specialite.count({ where }),
            prisma.specialite.findMany({
                where,
                select,
                orderBy: { libelle: 'asc' },
                skip,
                take: limit,
            })
        ]);

        const result = {
            data: specialites,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };

        // Mettre en cache
        specialitesCache.set(cacheKey, { data: result, timestamp: Date.now() });

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching specialites:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        
        // Validation
        if (!data.libelle || data.libelle.trim() === '') {
            return NextResponse.json(
                { error: 'Le libellé de la spécialité est requis' },
                { status: 400 }
            );
        }

        // Vérifier si la spécialité existe déjà
        const existingSpecialite = await prisma.specialite.findFirst({
            where: {
                libelle: {
                    equals: data.libelle.trim(),
                    mode: 'insensitive'
                },
                libelle_en: {
                    equals: data.libelle_en.trim(),
                    mode: 'insensitive'
                }
            }
        });

        if (existingSpecialite) {
            return NextResponse.json(
                { error: 'Une spécialité avec ce libellé existe déjà' },
                { status: 409 }
            );
        }

        const specialiteCreated = await prisma.specialite.create({
            data: { 
                libelle: data.libelle.trim(),
                libelle_en: data.libelle_en.trim()
            },
            select: {
                id: true,
                libelle: true,
                libelle_en: true,
                createdAt: true,
            }
        });

        // Invalider le cache des spécialités
        const keysToDelete = Array.from(specialitesCache.keys()).filter(key => key.startsWith('specialites:'));
        keysToDelete.forEach(key => specialitesCache.delete(key));

        return NextResponse.json(specialiteCreated, { status: 201 });
    } catch (error) {
        console.error('Error creating specialite:', error);
        return NextResponse.json({ 
            error: 'Erreur lors de la création de la spécialité' 
        }, { status: 500 });
    }
}