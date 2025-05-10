import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export const GET = async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    try {

        const { id } = await context.params;
        const application = await prisma.application.findUnique({
            where: { id: id },
        });

        if (!application) {
            return NextResponse.json({ error: 'Candidature non trouvée' }, { status: 404 });
        }

        return NextResponse.json(application, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};

export const PUT = async (req: Request, context: { params: Promise<{ id: string }> }) => {
    try {

        const { id } = await context.params;
        console.log("params", id);
        const data = await req.json();
        const updated = await prisma.application.update({
            where: { id: id },
            data: data,
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
        await prisma.application.delete({
            where: { id: id },
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};
