import { NextResponse } from 'next/server';
import { Contact } from '@prisma/client';
import { withQuery } from "@/lib/prisma/helpers";
import prisma from "@/lib/connect_db";



export const GET = withQuery<Contact, typeof prisma.contact>(
  prisma.contact,
  {
    searchFields: ['firstName', 'lastName', 'companyName', 'workEmail', 'status', 'priority', 'message', 'postalCode', 'jobTitle', 'workPhone'],
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'desc',
    filterFields: { status: 'status', priority: 'priority' },
  }
)

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const contactCreated = await prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        workEmail: data.workEmail,
        status: data.status,
        priority: data.priority,
        message: data.message,
        postalCode: data.postalCode,
        jobTitle: data.jobTitle,
        workPhone: data.workPhone
      }
    });
    return NextResponse.json(contactCreated, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}


