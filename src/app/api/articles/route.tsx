import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Article } from "@prisma/client";

export const GET = withQuery<Article, typeof prisma.article>(
    prisma.article,
    {
        searchFields: ['titre'],
        complexSearch: {
            relationFields: {
                search: [
                    { relation: 'tags', searchField: 'libelle' },
                    { relation: 'specialites', searchField: 'libelle' }
                ]
            }
        },
        sortFields: ['titre', 'views', 'published', 'createdAt', 'updatedAt', 'authorId'],
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'desc',
        maxLimit: 50,
        filterFields: {
            // published: 'published',
            authorId: 'authorId',
            // specialityname: 'specialites'
        },
        modifyWhere: (where, params) => {
            const specialityname = params.get('specialityname')
            if (specialityname) {
                where.specialites = {
                    some: {
                        libelle: { contains: specialityname, mode: 'insensitive' as const }
                    }
                }
            }
            const published = params.get('published');
            if (published) {
                where.published = published === 'true';
            }
        },
        includeFields: ['tags', 'specialites', 'author'],
        baseSelect: {
            id: true,
            titre: true,
            image: true,
            views: true,
            published: true,
            createdAt: true,
            updatedAt: true,
        },
        conditionalFields: {
            contenu: {
                param: 'includeContent',
                value: 'true'
            }
        },
        cache: {
            enabled: true,
            ttlMs: 5 * 60 * 1000, // 5 minutes
            maxSize: 100,
            keyPrefix: 'articles'
        }
    }
)


// export const POST = async (req: Request) => {
//     try {
//         const data = await req.json();
        
//         // Validation des données requises
//         if (!data.titre || data.titre.trim() === '') {
//             return NextResponse.json({ 
//                 error: 'Le titre est requis' 
//             }, { status: 400 });
//         }
        
//         // Vérifier si l'auteur existe ou utiliser un auteur par défaut
//         let finalAuthorId = null;
//         console.log("AuthorId reçu:", data.authorId);
        
//         if (data.authorId) {
//             const author = await prisma.user.findUnique({
//                 where: { id: data.authorId },
//                 select: { id: true, name: true, email: true }
//             });
//             console.log("Auteur trouvé:", author);
//             if (author) {
//                 finalAuthorId = data.authorId;
//             }
//         }
        
//         // Si aucun auteur valide n'est fourni, essayer de trouver un utilisateur système ou admin
//         if (!finalAuthorId) {
//             console.log("Recherche d'un utilisateur système...");
//             const systemUser = await prisma.user.findFirst({
//                 where: {
//                     OR: [
//                         { email: { contains: 'admin' } },
//                         { email: { contains: 'system' } }
//                     ]
//                 },
//                 select: { id: true, email: true }
//             });
//             console.log("Utilisateur système trouvé:", systemUser);
//             if (systemUser) {
//                 finalAuthorId = systemUser.id;
//             }
//         }

//         // Vérification finale que nous avons un auteur
//         if (!finalAuthorId) {
//             return NextResponse.json({ 
//                 error: 'Aucun auteur valide trouvé. Veuillez vous reconnecter.' 
//             }, { status: 400 });
//         }

//         console.log("Auteur final utilisé:", finalAuthorId);
        
//         // Validation et transformation des données
//         const articleData = {
//             titre: data.titre,
//             contenu: Array.isArray(data.contenu) ? data.contenu : [data.contenu],
//             image: data.image || null,
//             published: data.published || false,
//             // N'inclure authorId que s'il existe
//             ...(finalAuthorId && { authorId: finalAuthorId }),
//             // Connecter les tags existants
//             ...(data.tags && data.tags.length > 0 && {
//                 tags: {
//                     connect: data.tags.map((tagId: string) => ({ id: tagId }))
//                 }
//             }),
//             // Connecter les spécialités existantes
//             ...(data.specialites && data.specialites.length > 0 && {
//                 specialites: {
//                     connect: data.specialites.map((specId: string) => ({ id: specId }))
//                 }
//             })
//         };

//         console.log("Création article avec données:", articleData);
        
//         const articleCreated = await prisma.article.create({
//             data: articleData,
//             // Inclure les relations dans la réponse
//             include: {
//                 tags: {
//                     select: {
//                         id: true,
//                         libelle: true
//                     }
//                 },
//                 specialites: {
//                     select: {
//                         id: true,
//                         libelle: true
//                     }
//                 },
//                 // Relation author optionnelle
//                 author: finalAuthorId ? {
//                     select: {
//                         id: true,
//                         name: true
//                     }
//                 } : false
//             }
//         });

//         // Invalider le cache des articles
//         const keysToDelete = Array.from(cache.keys()).filter(key => key.startsWith('articles:'));
//         keysToDelete.forEach(key => cache.delete(key));
        
//         return NextResponse.json(articleCreated, { status: 201 });
//     } catch (error) {
//         console.error("Erreur création article:", error);
//         return NextResponse.json({ 
//             error: 'Erreur lors de la création de l\'article',
//             details: error instanceof Error ? error.message : 'Unknown error'
//         }, { status: 500 });
//     }
// }



export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        data.contenu = [data.contenu];


         // Validation des données requises
        if (!data.titre || data.titre.trim() === '') {
            return NextResponse.json({ 
                error: 'Le titre est requis' 
            }, { status: 400 });
        }

          // Vérifier si l'auteur existe ou utiliser un auteur par défaut
        let finalAuthorId = null;
        console.log("AuthorId reçu:", data.authorId);
        
        if (data.authorId) {
            const author = await prisma.user.findUnique({
                where: { id: data.authorId },
                select: { id: true, name: true, email: true }
            });
            console.log("Auteur trouvé:", author);
            if (author) {
                finalAuthorId = data.authorId;
            }
        }
        
        // Si aucun auteur valide n'est fourni, essayer de trouver un utilisateur système ou admin
        if (!finalAuthorId) {
            console.log("Recherche d'un utilisateur système...");
            const systemUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: { contains: 'admin' } },
                        { email: { contains: 'system' } }
                    ]
                },
                select: { id: true, email: true }
            });
            console.log("Utilisateur système trouvé:", systemUser);
            if (systemUser) {
                finalAuthorId = systemUser.id;
            }
        }

        // Vérification finale que nous avons un auteur
        if (!finalAuthorId) {
            return NextResponse.json({ 
                error: 'Aucun auteur valide trouvé. Veuillez vous reconnecter.' 
            }, { status: 400 });
        }

        console.log("data", data);
        const articleCreated = await prisma.article.create({
            data: data
        });
        return NextResponse.json(articleCreated, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}