import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/connect_db';

const UpdateCNESSTValidationSchema = z.object({
  validationStatus: z.enum(['pending', 'validated', 'rejected']).optional(),
  claimNumber: z.string().max(50).optional(),
  notes: z.string().optional(),
  adminComments: z.string().optional()
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const cnessValidation = await prisma.cNESSTValidation.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!cnessValidation) {
      return NextResponse.json({
        success: false,
        message: 'Validation CNESST non trouvée'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: cnessValidation
    });

  } catch (error) {
    console.error('Erreur récupération validation CNESST:', error);
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
    const resolvedParams = await params;
    const body = await request.json();
    const validatedData = UpdateCNESSTValidationSchema.parse(body);

    const cnessValidation = await prisma.cNESSTValidation.update({
      where: { id: resolvedParams.id },
      data: validatedData
    });

    return NextResponse.json({
      success: true,
      message: 'Validation CNESST mise à jour avec succès',
      data: cnessValidation
    });

  } catch (error) {
    console.error('Erreur mise à jour validation CNESST:', error);
    
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
    const resolvedParams = await params;
    await prisma.cNESSTValidation.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Validation CNESST supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression validation CNESST:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}