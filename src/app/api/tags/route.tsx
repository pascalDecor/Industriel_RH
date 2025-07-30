import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { NextRequest } from 'next/server';

// Cache pour les tags
const tagsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10));
        const search = searchParams.get('search')?.trim() || '';
        const includeCount = searchParams.get('includeCount') === 'true';
        
        const skip = (page - 1) * limit;
        const cacheKey = `tags:${page}:${limit}:${search}:${includeCount}`;
        
        // Vérifier le cache
        const cached = tagsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json(cached.data);
        }

        const where = search ? {
            libelle: { contains: search, mode: 'insensitive' }
        } : {};

        // Sélection optimisée
        const select: any = {
            id: true,
            libelle: true,
            createdAt: true,
        };

        if (includeCount) {
            select._count = {
                select: {
                    articles: true
                }
            };
        }

        const [total, tags] = await Promise.all([
            prisma.tag.count({ where }),
            prisma.tag.findMany({
                where,
                select,
                orderBy: { libelle: 'asc' },
                skip,
                take: limit,
            })
        ]);

        const result = {
            data: tags,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };

        // Mettre en cache
        tagsCache.set(cacheKey, { data: result, timestamp: Date.now() });

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        
        // Validation
        if (!data.libelle || data.libelle.trim() === '') {
            return NextResponse.json(
                { error: 'Le libellé du tag est requis' },
                { status: 400 }
            );
        }

        // Vérifier si le tag existe déjà
        const existingTag = await prisma.tag.findFirst({
            where: {
                libelle: {
                    equals: data.libelle.trim(),
                    mode: 'insensitive'
                }
            }
        });

        if (existingTag) {
            return NextResponse.json(
                { error: 'Un tag avec ce libellé existe déjà' },
                { status: 409 }
            );
        }

        const tagCreated = await prisma.tag.create({
            data: {
                libelle: data.libelle.trim()
            },
            select: {
                id: true,
                libelle: true,
                createdAt: true,
            }
        });

        // Invalider le cache des tags
        const keysToDelete = Array.from(tagsCache.keys()).filter(key => key.startsWith('tags:'));
        keysToDelete.forEach(key => tagsCache.delete(key));

        return NextResponse.json(tagCreated, { status: 201 });
    } catch (error) {
        console.error('Error creating tag:', error);
        return NextResponse.json({ 
            error: 'Erreur lors de la création du tag' 
        }, { status: 500 });
    }
}