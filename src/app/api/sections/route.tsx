import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { SectionUI } from "@prisma/client";

export const GET = withQuery<SectionUI, typeof prisma.sectionUI>(
    prisma.sectionUI,
    {
        searchFields: ['libelle', 'description', 'libelle_en', 'description_en'],
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'desc',
    }
)

export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        const sectionUICreated = await prisma.sectionUI.create({
            data: data
        });
        return NextResponse.json(sectionUICreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}