import { NextResponse } from 'next/server';
import { Contact } from '@prisma/client';
import { withQuery } from "@/lib/prisma/helpers";
import prisma from "@/lib/connect_db";
import { validateRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/mail';


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
    const { recaptchaToken, ...data } = await req.json();

    if (!recaptchaToken) {
      return NextResponse.json(
        { message: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    const recaptchaResult = await validateRecaptcha(recaptchaToken, 'contact_form');
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { message: 'reCAPTCHA validation failed. Please try again.' },
        { status: 400 }
      );
    }

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

    const contactSummaryRecipient =
      data.source === 'contact_page'
        ? (process.env.CONTACT_PAGE_SUMMARY_EMAIL || process.env.CONTACT_SUMMARY_EMAIL)
        : process.env.CONTACT_SUMMARY_EMAIL;
    if (contactSummaryRecipient) {
      const subject = `Nouveau contact - ${data.firstName} ${data.lastName}`;
      const textContent = `
Un nouveau contact a ete soumis.

Nom: ${data.firstName} ${data.lastName}
Entreprise: ${data.companyName}
Poste: ${data.jobTitle}
Email professionnel: ${data.workEmail}
Telephone: ${data.workPhone}
Code postal: ${data.postalCode}
Message:
${data.message}
      `.trim();

      const htmlContent = `
<h2>Nouveau contact recu</h2>
<p><strong>Nom:</strong> ${data.firstName} ${data.lastName}</p>
<p><strong>Entreprise:</strong> ${data.companyName}</p>
<p><strong>Poste:</strong> ${data.jobTitle}</p>
<p><strong>Email professionnel:</strong> ${data.workEmail}</p>
<p><strong>Telephone:</strong> ${data.workPhone}</p>
<p><strong>Code postal:</strong> ${data.postalCode}</p>
<p><strong>Message:</strong><br/>${data.message}</p>
      `.trim();

      const emailSent = await sendMail(
        contactSummaryRecipient,
        subject,
        textContent,
        htmlContent
      );

      if (!emailSent) {
        console.error('Echec de l envoi de l email de resume du contact.');
      }
    } else {
      console.warn('CONTACT_SUMMARY_EMAIL n est pas defini. Email de resume non envoye.');
    }

    return NextResponse.json(contactCreated, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

