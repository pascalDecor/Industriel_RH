import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/connect_db';

const CNESSTValidationSchema = z.object({
  companyName: z.string().min(1, 'Nom de l\'entreprise requis').max(200),
  employeeNumber: z.string().min(1, 'Numéro d\'employé requis').max(50),
  incidentDate: z.string().datetime('Date d\'incident invalide'),
  incidentType: z.enum(['accident', 'maladie_professionnelle', 'rechute', 'aggravation']),
  description: z.string().min(1, 'Description requise').max(2000),
  severity: z.enum(['leger', 'modere', 'grave', 'critique']),
  bodyPart: z.string().min(1, 'Partie du corps requise').max(100),
  workLocation: z.string().min(1, 'Lieu de travail requis').max(200),
  validationStatus: z.enum(['pending', 'validated', 'rejected']).default('pending'),
  claimNumber: z.string().max(50).optional(),
  contactEmail: z.string().email('Email invalide').max(320).optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CNESSTValidationSchema.parse(body);

    const cnessValidation = await prisma.cNESSTValidation.create({
      data: {
        companyName: validatedData.companyName,
        email: validatedData.contactEmail || 'unknown@example.com',
        documentPath: '/tmp/placeholder.pdf',
        documentType: 'incident_report',
        validationResult: {
          employeeNumber: validatedData.employeeNumber,
          incidentDate: validatedData.incidentDate,
          incidentType: validatedData.incidentType,
          description: validatedData.description,
          severity: validatedData.severity,
          bodyPart: validatedData.bodyPart,
          workLocation: validatedData.workLocation,
          claimNumber: validatedData.claimNumber
        },
        status: validatedData.validationStatus || 'pending'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Validation CNESST enregistrée avec succès',
      data: cnessValidation
    });

  } catch (error) {
    console.error('Erreur création validation CNESST:', error);
    
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const severity = url.searchParams.get('severity') || '';
    const incidentType = url.searchParams.get('incidentType') || '';

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { companyName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } }
          ]
        } : {},
        status ? { status: status } : {}
      ]
    };

    const [cnessValidations, total] = await Promise.all([
      prisma.cNESSTValidation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.cNESSTValidation.count({ where })
    ]);

    return NextResponse.json({
      data: cnessValidations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération validations CNESST:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}