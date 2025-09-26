import { NextResponse } from 'next/server';
import prisma from "@/lib/connect_db";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
      include: { specialites: true }
    });

    if (!newsletter) {
      return NextResponse.json(
        { error: 'Abonnement introuvable.' },
        { status: 404 }
      );
    }

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
};

export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const data = await req.json();

    const newsletter = await prisma.newsletter.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        status: data.status,
        updatedAt: new Date(),
        specialites: {
          set: data.specialiteIds?.map((id: string) => ({ id })) || []
        },
        ...(data.status === 'unsubscribed' && !data.unsubscribedAt ? { unsubscribedAt: new Date() } : {}),
        ...(data.status === 'active' ? { unsubscribedAt: null } : {})
      },
      include: {
        specialites: true
      }
    });

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour.' },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    await prisma.newsletter.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Abonnement supprimé avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression.' },
      { status: 500 }
    );
  }
}