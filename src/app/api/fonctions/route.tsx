import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Function } from "@prisma/client";

export const GET = withQuery<Function, typeof prisma.function>(
    prisma.function,
    {
        searchFields: ['libelle'],
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'desc',
        filterFields: { sectorId: 'sectorId' },
        // ou pour relation n-n :
        modifyWhere: (where, qp) => {
            const sid = qp.get('sectorId')
            if (sid) {
                where.sectorId = sid
            }
        },
    }
)

export const POST = async (req: Request) => {
    try {
        let data = await req.json();
        const functionCreated = await prisma.function.create({
            data: { libelle: data.libelle, sectorId: data.sectorId }
        });
        return NextResponse.json(functionCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}