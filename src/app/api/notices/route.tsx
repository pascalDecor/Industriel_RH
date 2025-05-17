import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Notice } from "@prisma/client";

export const GET = withQuery<Notice, typeof prisma.notice>(
    prisma.notice,
    {
        searchFields: ['content', 'author'],
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'desc',
    }
)

export const POST = async (req: Request) => {
    try {
        let data = await req.json();
        const noticeCreated = await prisma.notice.create({
            data: { content: data.content, author: data.author, stars: data.stars },
        });
        return NextResponse.json(noticeCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}