import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Article } from "@prisma/client";


export const GET = withQuery<Article, typeof prisma.article>(
    prisma.article,
    {
        searchFields: ['titre'],
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'desc',
        includeFields: ['specialites', 'tags'],
    }
)


export const POST = async (req: Request) => {
    try {
        let data = await req.json();
        data.contenu = [data.contenu];

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