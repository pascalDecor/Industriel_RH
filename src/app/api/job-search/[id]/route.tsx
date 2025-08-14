import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/connect_db';

const UpdateJobSearchSchema = z.object({
  status: z.enum(['pending', 'active', 'matched', 'archived']).optional(),
  notes: z.string().optional(),
  matchedJobs: z.array(z.string()).optional()
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jobSearch = await prisma.jobSearch.findUnique({
      where: { id: (await params).id }
    });

    if (!jobSearch) {
      return NextResponse.json({
        success: false,
        message: 'Recherche d\'emploi non trouvée'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: jobSearch
    });

  } catch (error) {
    console.error('Erreur récupération recherche emploi:', error);
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
    const validatedData = UpdateJobSearchSchema.parse(body);

    const jobSearch = await prisma.jobSearch.update({
      where: { id: (await params).id },
      data: validatedData
    });

    return NextResponse.json({
      success: true,
      message: 'Recherche d\'emploi mise à jour avec succès',
      data: jobSearch
    });

  } catch (error) {
    console.error('Erreur mise à jour recherche emploi:', error);
    
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
    await prisma.jobSearch.delete({
      where: { id: (await params).id }
    });

    return NextResponse.json({
      success: true,
      message: 'Recherche d\'emploi supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression recherche emploi:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}