import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export const GET = async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await context.params;
        const notice = await prisma.notice.findUnique({
            where: { id: id },
        });

        if (!notice) {
            return NextResponse.json({ error: 'Avis non trouvée' }, { status: 404 });
        }

        return NextResponse.json(notice, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};

export const PUT = async (req: Request, context: { params: Promise<{ id: string }> }) => {
    try {

        const { id } = await context.params;
        const data = await req.json();
        const updated = await prisma.notice.update({
            where: { id: id },
            data: { content: data.content, author: data.author, stars: data.stars, content_en: data.content_en, author_en: data.author_en },
        });
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("PUT error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
};

export const DELETE = async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await context.params;
        await prisma.notice.delete({
            where: { id: id },
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};
