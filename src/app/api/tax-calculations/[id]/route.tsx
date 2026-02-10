import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/connect_db';

const UpdateTaxCalculationSchema = z.object({
  status: z.enum(['pending', 'processed', 'archived']).optional(),
  notes: z.string().optional(),
  recommendations: z.string().optional()
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const taxCalculation = await prisma.taxCalculation.findUnique({
      where: { id: (await params).id }
    });

    if (!taxCalculation) {
      return NextResponse.json({
        success: false,
        message: 'Calcul fiscal non trouvé'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: taxCalculation
    });

  } catch (error) {
    console.error('Erreur récupération calcul fiscal:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const validatedData = UpdateTaxCalculationSchema.parse(body);

    const taxCalculation = await prisma.taxCalculation.update({
      where: { id: (await params).id },
      data: validatedData
    });

    return NextResponse.json({
      success: true,
      message: 'Calcul fiscal mis à jour avec succès',
      data: taxCalculation
    });

  } catch (error) {
    console.error('Erreur mise à jour calcul fiscal:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Données invalides',
        errors: error.issues
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.taxCalculation.delete({
      where: { id: (await params).id }
    });

    return NextResponse.json({
      success: true,
      message: 'Calcul fiscal supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression calcul fiscal:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}