import { NextResponse } from "next/server";
import prisma from '@/lib/connect_db';
import { NextRequest } from 'next/server';

// Cache pour les articles individuels
const articleCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes pour un article individuel

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: articleId } = await params;

        if (!articleId) {
            return NextResponse.json(
                { error: 'Article ID is required' },
                { status: 400 }
            );
        }

        // Vérifier le cache
        const cacheKey = `article:${articleId}`;
        const cached = articleCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json(cached.data);
        }

        // Requête optimisée pour un article complet
        const article = await prisma.article.findUnique({
            where: {
                id: articleId
            },
            select: {
                id: true,
                titre: true,
                contenu: true,
                image: true,
                views: true,
                published: true,
                createdAt: true,
                updatedAt: true,
                // Relations complètes pour l'affichage détaillé
                tags: {
                    select: {
                        id: true,
                        libelle: true
                    },
                    orderBy: {
                        libelle: 'asc'
                    }
                },
                specialites: {
                    select: {
                        id: true,
                        libelle: true
                    },
                    orderBy: {
                        libelle: 'asc'
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!article) {
            return NextResponse.json(
                { error: 'Article not found' },
                { status: 404 }
            );
        }

        // Incrémenter les vues de manière asynchrone (sans attendre)
        prisma.article.update({
            where: { id: articleId },
            data: { views: { increment: 1 } }
        }).catch(error => {
            console.error('Error incrementing views:', error);
        });

        // Mettre en cache
        articleCache.set(cacheKey, { data: article, timestamp: Date.now() });

        // Nettoyer le cache périodiquement
        if (articleCache.size > 50) {
            const entries = Array.from(articleCache.entries());
            const expired = entries.filter(([_, value]) => Date.now() - value.timestamp > CACHE_TTL);
            expired.forEach(([key]) => articleCache.delete(key));
        }

        return NextResponse.json(article);

    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: articleId } = await params;
        const data = await request.json();

        if (!articleId) {
            return NextResponse.json(
                { error: 'Article ID is required' },
                { status: 400 }
            );
        }

        // Préparer les données de mise à jour
        const updateData: any = {
            ...(data.titre && { titre: data.titre }),
            ...(data.contenu && {
                contenu: Array.isArray(data.contenu) ? data.contenu : [data.contenu]
            }),
            ...(data.image !== undefined && { image: data.image }),
            ...(data.published !== undefined && { published: data.published }),
        };

        // Gérer les relations Many-to-Many
        if (data.tags) {
            updateData.tags = {
                set: data.tags.map((tagId: string) => ({ id: tagId }))
            };
        }

        if (data.specialites) {
            updateData.specialites = {
                set: data.specialites.map((specId: string) => ({ id: specId }))
            };
        }

        const updatedArticle = await prisma.article.update({
            where: { id: articleId },
            data: updateData,
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

        // Invalider les caches
        articleCache.delete(`article:${articleId}`);
        // Invalider aussi le cache de la liste d'articles (dans le module principal)

        return NextResponse.json(updatedArticle);

    } catch (error) {
        console.error('Error updating article:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: articleId } = await params;

        if (!articleId) {
            return NextResponse.json(
                { error: 'Article ID is required' },
                { status: 400 }
            );
        }

        await prisma.article.delete({
            where: { id: articleId }
        });

        // Invalider les caches
        articleCache.delete(`article:${articleId}`);

        return NextResponse.json({ message: 'Article deleted successfully' });

    } catch (error) {
        console.error('Error deleting article:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}