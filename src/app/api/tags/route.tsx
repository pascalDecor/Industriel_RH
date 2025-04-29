import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';

export const GET = async (req: Request) => {
    try {
        const tags = await prisma.tag.findMany();
        return NextResponse.json(tags, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

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