import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/connect_db';

const UpdateJobSearchSchema = z.object({
  jobTitle: z.string().min(1, 'Titre du poste requis').max(200).optional(),
  location: z.string().min(1, 'Localisation requise').max(200).optional(),
  email: z.string().email('Email invalide').max(320).optional(),
  phone: z.string().max(20).optional(),
  experience: z.string().max(50).optional(),
  keywords: z.array(z.string()).optional(),
  salary: z.string().max(50).optional(),
  jobType: z.string().max(50).optional()
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const jobSearch = await prisma.jobSearch.findUnique({
      where: { id: resolvedParams.id }
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
    console.error('Erreur récupération recherche:', error);
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
    const validatedData = UpdateJobSearchSchema.parse(body);

    const jobSearch = await prisma.jobSearch.update({
      where: { id: resolvedParams.id },
      data: validatedData
    });

    return NextResponse.json({
      success: true,
      message: 'Recherche d\'emploi mise à jour avec succès',
      data: jobSearch
    });

  } catch (error) {
    console.error('Erreur mise à jour recherche:', error);
    
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
    const resolvedParams = await params;
    await prisma.jobSearch.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Recherche d\'emploi supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression recherche:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}