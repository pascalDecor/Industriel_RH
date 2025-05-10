import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Specialite } from "@prisma/client";

export const GET = withQuery<Specialite, typeof prisma.specialite>(
    prisma.specialite,
    {
        searchFields: ['libelle'],
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'desc',
        countFields: ['articles'],
    }
)

export const POST = async (req: Request) => {
    try {
        let data = await req.json();
        const specialiteCreated = await prisma.specialite.create({
            data: { libelle: data.libelle }
        });
        return NextResponse.json(specialiteCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}