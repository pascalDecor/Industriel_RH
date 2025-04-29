import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';

export const GET = async (req: Request) => {
    try {
        const specialites = await prisma.specialite.findMany({
            include: {
                _count: {
                    select: { articles: true },
                },
            }
        });
        return NextResponse.json(specialites, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        let data = await req.json();
        const specialiteCreated = await prisma.specialite.create({
            data: { libelle: data.libelle }
        });
        return NextResponse.json(specialiteCreated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}