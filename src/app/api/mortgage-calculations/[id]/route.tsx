import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/connect_db';

const UpdateMortgageCalculationSchema = z.object({
  status: z.enum(['pending', 'processed', 'archived']).optional(),
  notes: z.string().optional(),
  recommendations: z.string().optional()
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const mortgageCalculation = await prisma.mortgageCalculation.findUnique({
      where: { id: (await params).id }
    });

    if (!mortgageCalculation) {
      return NextResponse.json({
        success: false,
        message: 'Calcul hypothécaire non trouvé'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: mortgageCalculation
    });

  } catch (error) {
    console.error('Erreur récupération calcul hypothécaire:', error);
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
    const validatedData = UpdateMortgageCalculationSchema.parse(body);

    const mortgageCalculation = await prisma.mortgageCalculation.update({
      where: { id: (await params).id },
      data: validatedData
    });

    return NextResponse.json({
      success: true,
      message: 'Calcul hypothécaire mis à jour avec succès',
      data: mortgageCalculation
    });

  } catch (error) {
    console.error('Erreur mise à jour calcul hypothécaire:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
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
    await prisma.mortgageCalculation.delete({
      where: { id: (await params).id }
    });

    return NextResponse.json({
      success: true,
      message: 'Calcul hypothécaire supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression calcul hypothécaire:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}