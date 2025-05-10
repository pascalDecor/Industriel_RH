import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { Tag } from "@prisma/client";
import { withQuery } from "@/lib/prisma/helpers";

export const GET = withQuery<Tag, typeof prisma.tag>(
    prisma.tag,
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
        const tagCreated = await prisma.tag.create({
            data: data
        });
        return NextResponse.json(tagCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}