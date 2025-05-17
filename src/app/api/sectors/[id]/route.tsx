import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export const GET = async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    try {

        const { id } = await context.params;
        const sector = await prisma.sector.findUnique({
            where: { id: id },
            include: {
                _count: {
                    select: { functions: true },
                },
                Sections : true,
                functions: true
            },
        });

        if (!sector) {
            return NextResponse.json({ error: 'Secteur non trouvée' }, { status: 404 });
        }

        return NextResponse.json(sector, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};

export const PUT = async (req: Request, context: { params: Promise<{ id: string }> }) => {
    try {

        const { id } = await context.params;
        console.log("params", id);
        const data = await req.json();
        const updated = await prisma.sector.update({
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
        await prisma.sector.delete({
            where: { id: id },
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};
