import { NextResponse, NextRequest } from "next/server"
import prisma from '@/lib/connect_db';
import { getFunctionsCached, setFunctionsCached, invalidateFunctionsCache } from "./cache";

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
        
        const cached = getFunctionsCached(cacheKey);
        if (cached) {
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
            libelle_en: true,
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

        setFunctionsCached(cacheKey, result);
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

        invalidateFunctionsCache();
        return NextResponse.json(functionCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}