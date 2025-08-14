import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/connect_db';

const UpdateSalaryCalculationSchema = z.object({
  status: z.enum(['pending', 'processed', 'archived']).optional(),
  notes: z.string().optional(),
  recommendations: z.string().optional()
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const salaryCalculation = await prisma.salaryCalculation.findUnique({
      where: { id: (await params).id }
    });

    if (!salaryCalculation) {
      return NextResponse.json({
        success: false,
        message: 'Calcul salarial non trouvé'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: salaryCalculation
    });

  } catch (error) {
    console.error('Erreur récupération calcul salarial:', error);
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
    const validatedData = UpdateSalaryCalculationSchema.parse(body);

    const salaryCalculation = await prisma.salaryCalculation.update({
      where: { id: (await params).id },
      data: validatedData
    });

    return NextResponse.json({
      success: true,
      message: 'Calcul salarial mis à jour avec succès',
      data: salaryCalculation
    });

  } catch (error) {
    console.error('Erreur mise à jour calcul salarial:', error);
    
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
    await prisma.salaryCalculation.delete({
      where: { id: (await params).id }
    });

    return NextResponse.json({
      success: true,
      message: 'Calcul salarial supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression calcul salarial:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}