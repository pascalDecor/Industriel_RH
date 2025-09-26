import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Specialite } from "@prisma/client";

export const GET = withQuery<Specialite, typeof prisma.specialite>(
    prisma.specialite,
    {
        searchFields: ['libelle', 'libelle_en'],
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'desc',
    }
)

export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        const specialiteCreated = await prisma.specialite.create({
            data: { libelle: data.libelle, libelle_en: data.libelle_en },
        });
        return NextResponse.json(specialiteCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}