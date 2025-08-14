import { NextResponse, NextRequest } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Function } from "@prisma/client";

// Cache pour les fonctions
const functionsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 20 * 60 * 1000; // 20 minutes

export const GET = async (request: NextRequest) => {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10));
        const search = searchParams.get('search')?.trim() || '';
        const sectorId = searchParams.get('sectorId');
        const includeCount = searchParams.get('includeCount') === 'true';
        
        const skip = (page - 1) * limit;
        const cacheKey = `functions:${page}:${limit}:${search}:${sectorId}:${includeCount}`;
        
        // Vérifier le cache
        const cached = functionsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json(cached.data);
        }

        const where: any = {};
        
        if (search) {
            where.libelle = { contains: search, mode: 'insensitive' as const };
        }
        
        if (sectorId) {
            where.sectorId = sectorId;
        }

        // Sélection optimisée
        const select: any = {
            id: true,
            libelle: true,
            sectorId: true,
            createdAt: true,
            updatedAt: true,
        };

        if (includeCount) {
            select.sector = {
                select: {
                    id: true,
                    libelle: true
                }
            };
        }

        const [total, functions] = await Promise.all([
            prisma.function.count({ where }),
            prisma.function.findMany({
                where,
                select,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            })
        ]);

        const result = {
            data: functions,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };

        // Mettre en cache
        functionsCache.set(cacheKey, { data: result, timestamp: Date.now() });

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching functions:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        const functionCreated = await prisma.function.create({
            data: { libelle: data.libelle, sectorId: data.sectorId }
        });

        // Invalider le cache
        const keysToDelete = Array.from(functionsCache.keys()).filter(key => key.startsWith('functions:'));
        keysToDelete.forEach(key => functionsCache.delete(key));

        return NextResponse.json(functionCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}