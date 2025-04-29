import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';

export const GET = async (req: Request) => {
    try {
        const articles = await prisma.article.findMany();
        return NextResponse.json(articles, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

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