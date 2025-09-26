import { NextResponse, NextRequest } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Notice } from "@prisma/client";

// Cache pour les avis
const noticesCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export const GET = async (request: NextRequest) => {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(100, parseInt(searchParams.get('limit') || '20', 10));
        const search = searchParams.get('search')?.trim() || '';
        const stars = searchParams.get('stars');
        
        const skip = (page - 1) * limit;
        const cacheKey = `notices:${page}:${limit}:${search}:${stars}`;
        
        // Vérifier le cache
        const cached = noticesCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json(cached.data);
        }

        const where: any = {};
        
        if (search) {
            where.OR = [
                { content: { contains: search, mode: 'insensitive' as const } },
                { author: { contains: search, mode: 'insensitive' as const } }
            ];
        }
        
        if (stars) {
            where.stars = parseInt(stars);
        }

        const [total, notices] = await Promise.all([
            prisma.notice.count({ where }),
            prisma.notice.findMany({
                where,
                select: {
                    id: true,
                    content: true,
                    content_en: true,
                    author: true,
                    author_en: true,
                    stars: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            })
        ]);

        const result = {
            data: notices,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };

        // Mettre en cache
        noticesCache.set(cacheKey, { data: result, timestamp: Date.now() });

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching notices:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        const noticeCreated = await prisma.notice.create({
            data: { content: data.content, author: data.author, stars: data.stars },
        });

        // Invalider le cache
        const keysToDelete = Array.from(noticesCache.keys()).filter(key => key.startsWith('notices:'));
        keysToDelete.forEach(key => noticesCache.delete(key));

        return NextResponse.json(noticeCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}