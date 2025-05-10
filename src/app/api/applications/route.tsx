import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Application } from "@prisma/client";

export const GET = withQuery<Application, typeof prisma.application>(
    prisma.application,
    {
        searchFields: ['lastName', 'firstName', 'email', 'phone'],
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'desc',
        includeFields: ['sector', 'function', 'civility', 'city'],
        filterFields: { sectorId: 'sectorId', functionId: 'functionId', civilityId: 'civilityId', cityId: 'cityId', state: 'state' },
    }
)

export const POST = async (req: Request) => {
    try {
        let data = await req.json();
        const applicationCreated = await prisma.application.create({
            data: data,
        });
        return NextResponse.json(applicationCreated, { status: 201 });
    } catch (error) {
        console.log("POST error:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}