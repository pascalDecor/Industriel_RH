import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Sector } from "@prisma/client";

export const GET = withQuery<Sector, typeof prisma.sector>(
    prisma.sector,
    {
        searchFields: ['libelle', 'description'],
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'desc',
        countFields: ['functions'],
        includeFields: [ 'Sections', 'functions' ]
    }
)

export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        const sectorCreated = await prisma.sector.create({
            data: { libelle: data.libelle, description: data.description }
        });
        return NextResponse.json(sectorCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}