import { NextResponse } from 'next/server';
import prisma from "@/lib/connect_db";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();

    // Validation des données requises
    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json(
        { error: 'Les champs firstName, lastName et email sont requis.' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email: data.email },
      include: { specialites: true }
    });

    if (existingSubscription) {
      // Si l'abonnement existe déjà et est actif
      if (existingSubscription.status === 'active') {
        return NextResponse.json(
          { error: 'Cet email est déjà abonné à la newsletter.' },
          { status: 409 }
        );
      }

      // Si l'abonnement existe mais est désabonné, le réactiver
      const updatedSubscription = await prisma.newsletter.update({
        where: { email: data.email },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          status: 'active',
          subscribedAt: new Date(),
          unsubscribedAt: null,
          updatedAt: new Date(),
          specialites: {
            set: data.areasOfInterest ? data.areasOfInterest.map((id: string) => ({ id })) : []
          }
        },
        include: {
          specialites: true
        }
      });

      return NextResponse.json(
        {
          message: 'Votre abonnement à la newsletter a été réactivé avec succès !',
          newsletter: updatedSubscription
        },
        { status: 200 }
      );
    }

    // Créer un nouvel abonnement
    const newsletterSubscription = await prisma.newsletter.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        status: 'active',
        subscribedAt: new Date(),
        specialites: {
          connect: data.areasOfInterest ? data.areasOfInterest.map((id: string) => ({ id })) : []
        }
      },
      include: {
        specialites: true
      }
    });

    return NextResponse.json(
      {
        message: 'Votre abonnement à la newsletter a été confirmé avec succès !',
        newsletter: newsletterSubscription
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'inscription à la newsletter:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}