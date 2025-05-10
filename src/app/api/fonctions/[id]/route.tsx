import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export const GET = async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    try {

        const { id } = await context.params;
        const fonction = await prisma.function.findUnique({
            where: { id: id },
            include: {
                _count: {
                    select: { candidats : true },
                },
            },
        });

        if (!fonction) {
            return NextResponse.json({ error: 'Fonctions non trouvée' }, { status: 404 });
        }

        return NextResponse.json(fonction, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};

export const PUT = async (req: Request, context: { params: Promise<{ id: string }> }) => {
    try {

        const { id } = await context.params;
        console.log("params", id);
        const data = await req.json();
        const updated = await prisma.function.update({
            where: { id: id },
            data: { libelle: data.libelle }
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
        await prisma.function.delete({
            where: { id: id },
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};
