import { NextResponse } from "next/server"
import prisma from '@/lib/connect_db';
import { withQuery } from "@/lib/prisma/helpers";
import { Hire } from "@prisma/client";
import { validateRecaptcha } from '@/lib/recaptcha';

export const GET = withQuery<Hire, typeof prisma.hire>(
    prisma.hire,
    {
        searchFields: ['lastName', 'firstName', 'email', 'phone', 'company_name', 'company_name', 'company_website', 'details_of_positions'],
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'desc',
        includeFields: ['sectors','civility',],
        filterFields: {  civilityId: 'civilityId',  state: 'state', number_of_positions: 'number_of_positions' },
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

        const recaptchaResult = await validateRecaptcha(recaptchaToken, 'hiring_form');
        if (!recaptchaResult.success) {
            return NextResponse.json(
                { message: 'reCAPTCHA validation failed. Please try again.' },
                { status: 400 }
            );
        }

        data.details_of_positions = [data.details_of_positions];
        console.log("data", data);
        const hireCreated = await prisma.hire.create({
            data: data,
        });
        return NextResponse.json(hireCreated, { status: 201 });
    } catch (error) {
        console.log("POST error:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}