import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export const GET = async (_req: Request, { params }: { params: { id: string } }) => {
    try {
        const specialite = await prisma.specialite.findUnique({
            where: { id: params.id },
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

export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        console.log("params", params);
        const { id } = await params
        const data = await req.json();
        const updated = await prisma.specialite.update({
            where: { id: id },
            data : {libelle : data.libelle}
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("PUT error:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
};


export const DELETE = async (_req: Request, { params }: { params: { id: string } }) => {
    try {
        await prisma.specialite.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
};
