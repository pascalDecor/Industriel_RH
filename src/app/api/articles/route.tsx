import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { NextRequest } from 'next/server';

// Cache simple en mémoire (pour la démo - en production utiliser Redis)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        
        // Paramètres de requête
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(50, parseInt(searchParams.get('limit') || '10', 10));
        const search = searchParams.get('search')?.trim() || '';
        const published = searchParams.get('published');
        const authorId = searchParams.get('authorId');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
        
        const skip = (page - 1) * limit;

        // Clé de cache
        const cacheKey = `articles:${page}:${limit}:${search}:${published}:${authorId}:${sortBy}:${sortOrder}`;
        
        // Vérifier le cache
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json(cached.data);
        }

        // Construction du where optimisé
        const where: any = {};
        
        if (published !== null && published !== undefined) {
            where.published = published === 'true';
        }
        
        if (authorId) {
            where.authorId = authorId;
        }
        
        if (search) {
            where.OR = [
                { titre: { contains: search, mode: 'insensitive' } },
                { 
                    tags: {
                        some: {
                            libelle: { contains: search, mode: 'insensitive' }
                        }
                    }
                },
                {
                    specialites: {
                        some: {
                            libelle: { contains: search, mode: 'insensitive' }
                        }
                    }
                }
            ];
        }

        // Sélection optimisée - ne récupérer que les champs nécessaires
        const select = {
            id: true,
            titre: true,
            image: true,
            views: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            // Contenu optionnel pour la liste (pas toujours nécessaire)
            ...(searchParams.get('includeContent') === 'true' && { contenu: true }),
            // Relations optimisées
            tags: {
                select: {
                    id: true,
                    libelle: true
                }
            },
            specialites: {
                select: {
                    id: true,
                    libelle: true
                }
            },
            author: {
                select: {
                    id: true,
                    name: true
                }
            }
        };

        // Construction de l'orderBy optimisé
        let orderBy: any = {};
        switch (sortBy) {
            case 'titre':
                orderBy = { titre: sortOrder };
                break;
            case 'views':
                orderBy = { views: sortOrder };
                break;
            case 'published':
                orderBy = { published: sortOrder };
                break;
            default:
                orderBy = { createdAt: sortOrder };
        }

        // Exécution parallèle optimisée
        const [total, articles] = await Promise.all([
            // Count optimisé
            prisma.article.count({ where }),
            // FindMany optimisé avec select partiel
            prisma.article.findMany({
                where,
                select,
                orderBy,
                skip,
                take: limit,
            })
        ]);

        const result = {
            data: articles,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1,
            }
        };

        // Mettre en cache
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        
        // Nettoyer le cache périodiquement
        if (cache.size > 100) {
            const entries = Array.from(cache.entries());
            const expired = entries.filter(([_, value]) => Date.now() - value.timestamp > CACHE_TTL);
            expired.forEach(([key]) => cache.delete(key));
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        
        // Validation et transformation des données
        const articleData = {
            titre: data.titre,
            contenu: Array.isArray(data.contenu) ? data.contenu : [data.contenu],
            image: data.image || null,
            published: data.published || false,
            authorId: data.authorId,
            // Connecter les tags existants
            ...(data.tags && data.tags.length > 0 && {
                tags: {
                    connect: data.tags.map((tagId: string) => ({ id: tagId }))
                }
            }),
            // Connecter les spécialités existantes
            ...(data.specialites && data.specialites.length > 0 && {
                specialites: {
                    connect: data.specialites.map((specId: string) => ({ id: specId }))
                }
            })
        };

        console.log("Création article avec données:", articleData);
        
        const articleCreated = await prisma.article.create({
            data: articleData,
            // Inclure les relations dans la réponse
            include: {
                tags: {
                    select: {
                        id: true,
                        libelle: true
                    }
                },
                specialites: {
                    select: {
                        id: true,
                        libelle: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        // Invalider le cache des articles
        const keysToDelete = Array.from(cache.keys()).filter(key => key.startsWith('articles:'));
        keysToDelete.forEach(key => cache.delete(key));
        
        return NextResponse.json(articleCreated, { status: 201 });
    } catch (error) {
        console.error("Erreur création article:", error);
        return NextResponse.json({ 
            error: 'Erreur lors de la création de l\'article',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}