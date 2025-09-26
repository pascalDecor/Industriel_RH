import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export const GET = async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    try {

        const { id } = await context.params;
        const specialite = await prisma.specialite.findUnique({
            where: { id: id },
            include: {
                _count: {
                    select: { articles: true },
                },
            },
        });

        if (!specialite) {
            return NextResponse.json({ error: 'Spécialité non trouvée' }, { status: 404 });
        }

        return NextResponse.json(specialite, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};

export const PUT = async (req: Request, context: { params: Promise<{ id: string }> }) => {
    try {

        const { id } = await context.params;
        console.log("params", id);
        const data = await req.json();
        const updated = await prisma.specialite.update({
            where: { id: id },
            data: { libelle: data.libelle, libelle_en: data.libelle_en }
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
        await prisma.specialite.delete({
            where: { id: id },
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};
