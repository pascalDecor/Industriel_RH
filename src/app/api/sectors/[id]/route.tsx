import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/connect_db';

// Cache pour un secteur spécifique
const sectorCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 45 * 60 * 1000; // 45 minutes

export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    try {
        // Gestion sécurisée des paramètres
        let id: string;
        try {
            const params = await context.params;
            id = params.id;
            
            // Validation de l'ID
            if (!id || typeof id !== 'string' || id.trim() === '') {
                return NextResponse.json({ error: 'ID du secteur invalide' }, { status: 400 });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des paramètres:', error);
            return NextResponse.json({ error: 'Paramètres de requête invalides' }, { status: 400 });
        }

        const cacheKey = `sector:${id}:details`;
        
        // Vérifier le cache
        const cached = sectorCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json(cached.data);
        }

        // Requête avec gestion d'erreur détaillée
        let sector;
        try {
            sector = await prisma.sector.findUnique({
                where: { id: id },
                select: {
                    id: true,
                    libelle: true,
                    description: true,
                    alternativeDescriptions: true,
                    createdAt: true,
                    updatedAt: true,
                    // Compter les relations
                    _count: {
                        select: { 
                            functions: true,
                            candidats: true,
                            hires: true,
                            Sections: true 
                        },
                    },
                    // Sections avec images et descriptions complètes
                    Sections: {
                        select: {
                            id: true,
                            libelle: true,
                            slug: true,
                            description: true,
                            image: true,
                            page: true,
                            createdAt: true
                        },
                        orderBy: { createdAt: 'asc' }
                    },
                    // Fonctions avec détails
                    functions: {
                        select: {
                            id: true,
                            libelle: true,
                            createdAt: true,
                            _count: {
                                select: {
                                    candidats: true
                                }
                            }
                        },
                        orderBy: { libelle: 'asc' }
                    }
                },
            });
        } catch (dbError) {
            console.error('Erreur base de données lors de la récupération du secteur:', dbError);
            return NextResponse.json({ 
                error: 'Erreur lors de l\'accès à la base de données',
                details: process.env.NODE_ENV === 'development' ? (dbError as Error).message : undefined
            }, { status: 500 });
        }

        if (!sector) {
            return NextResponse.json({ error: 'Secteur non trouvé' }, { status: 404 });
        }

        // Enrichissement sécurisé des données
        let enrichedSector;
        try {
            enrichedSector = {
                ...sector,
                // Image principale du secteur (première section ou fallback)
                mainImage: sector.Sections?.[0]?.image || '/images/default-sector.jpg',
                // Description étendue
                fullDescription: sector.description || '',
                alternativeDescriptions: sector.alternativeDescriptions || [],
                // Statistiques
                stats: {
                    totalFunctions: sector._count?.functions || 0,
                    totalCandidates: sector._count?.candidats || 0,
                    totalHires: sector._count?.hires || 0,
                    totalSections: sector._count?.Sections || 0
                }
            };
        } catch (enrichError) {
            console.error('Erreur lors de l\'enrichissement des données:', enrichError);
            return NextResponse.json({ 
                error: 'Erreur lors du traitement des données',
                details: process.env.NODE_ENV === 'development' ? (enrichError as Error).message : undefined
            }, { status: 500 });
        }

        // Mise en cache sécurisée
        try {
            sectorCache.set(cacheKey, { data: enrichedSector, timestamp: Date.now() });
        } catch (cacheError) {
            console.warn('Impossible de mettre en cache:', cacheError);
            // Ne pas faire échouer la requête pour un problème de cache
        }

        return NextResponse.json(enrichedSector, { status: 200 });
    } catch (error) {
        // Gestion d'erreur globale améliorée
        console.error('Erreur générale dans GET /api/sectors/[id]:', {
            error: error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        return NextResponse.json({ 
            error: 'Erreur interne du serveur',
            timestamp: new Date().toISOString(),
            details: process.env.NODE_ENV === 'development' ? {
                message: error instanceof Error ? error.message : 'Unknown error',
                type: error?.constructor?.name || 'Unknown'
            } : undefined
        }, { status: 500 });
    }
};

export const PUT = async (req: Request, context: { params: Promise<{ id: string }> }) => {
    try {
        // Gestion sécurisée des paramètres
        let id: string;
        try {
            const params = await context.params;
            id = params.id;
            
            if (!id || typeof id !== 'string' || id.trim() === '') {
                return NextResponse.json({ error: 'ID du secteur invalide' }, { status: 400 });
            }
        } catch (error) {
            return NextResponse.json({ error: 'Paramètres de requête invalides' }, { status: 400 });
        }

        // Validation des données d'entrée
        let data;
        try {
            data = await req.json();
            
            if (!data.libelle || typeof data.libelle !== 'string' || data.libelle.trim() === '') {
                return NextResponse.json({ error: 'Libellé requis et non vide' }, { status: 400 });
            }
        } catch (parseError) {
            return NextResponse.json({ error: 'Données JSON invalides' }, { status: 400 });
        }
        const updated = await prisma.sector.update({
            where: { id: id },
            data: { 
                libelle: data.libelle.trim(),
                description: data.description || null,
                alternativeDescriptions: Array.isArray(data.alternativeDescriptions) ? data.alternativeDescriptions : []
            }
        });

        // Invalider le cache
        const keysToDelete = Array.from(sectorCache.keys()).filter(key => 
            key.startsWith('sector:') || key.includes(id)
        );
        keysToDelete.forEach(key => sectorCache.delete(key));

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("PUT error:", {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
        
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Erreur inconnue",
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
};

export const DELETE = async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    try {
        // Gestion sécurisée des paramètres
        let id: string;
        try {
            const params = await context.params;
            id = params.id;
            
            if (!id || typeof id !== 'string' || id.trim() === '') {
                return NextResponse.json({ error: 'ID du secteur invalide' }, { status: 400 });
            }
        } catch (error) {
            return NextResponse.json({ error: 'Paramètres de requête invalides' }, { status: 400 });
        }
        await prisma.sector.delete({
            where: { id: id },
        });

        // Invalider le cache
        const keysToDelete = Array.from(sectorCache.keys()).filter(key => 
            key.startsWith('sector:') || key.includes(id)
        );
        keysToDelete.forEach(key => sectorCache.delete(key));

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("DELETE error:", {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
        
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Erreur inconnue",
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
};
