import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Application } from "@prisma/client";
import { validateRecaptcha } from '@/lib/recaptcha';

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
        const { recaptchaToken, ...data } = await req.json();

        if (!recaptchaToken) {
            return NextResponse.json(
                { message: 'reCAPTCHA token is required' },
                { status: 400 }
            );
        }

        const recaptchaResult = await validateRecaptcha(recaptchaToken, 'application_form');
        if (!recaptchaResult.success) {
            return NextResponse.json(
                { message: 'reCAPTCHA validation failed. Please try again.' },
                { status: 400 }
            );
        }

        const applicationCreated = await prisma.application.create({
            data: data,
        });
        return NextResponse.json(applicationCreated, { status: 201 });
    } catch (error) {
        console.log("POST error:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}