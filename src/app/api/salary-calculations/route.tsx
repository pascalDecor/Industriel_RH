import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/connect_db';

const SalaryCalculationSchema = z.object({
  jobTitle: z.string().min(1, 'Titre du poste requis').max(200),
  industry: z.string().min(1, 'Secteur d\'activité requis').max(200),
  location: z.string().min(1, 'Localisation requise').max(200),
  experience: z.number().min(0, 'Expérience invalide').max(50),
  education: z.string().max(100).optional(),
  skills: z.array(z.string()).default([]),
  company: z.string().max(200).optional(),
  salaryRange: z.string().min(1, 'Fourchette salariale requise').max(100),
  email: z.string().email('Email invalide').max(320).optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = SalaryCalculationSchema.parse(body);

    const salaryCalculation = await prisma.salaryCalculation.create({
      data: {
        jobTitle: validatedData.jobTitle,
        industry: validatedData.industry,
        location: validatedData.location,
        experience: validatedData.experience,
        education: validatedData.education,
        skills: validatedData.skills,
        company: validatedData.company,
        salaryRange: validatedData.salaryRange,
        email: validatedData.email
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Calcul salarial enregistré avec succès',
      data: salaryCalculation
    });

  } catch (error) {
    console.error('Erreur création calcul salarial:', error);
    
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
    const industry = url.searchParams.get('industry') || '';
    const location = url.searchParams.get('location') || '';

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { jobTitle: { contains: search, mode: 'insensitive' as const } },
            { company: { contains: search, mode: 'insensitive' as const } }
          ]
        } : {},
        industry ? { industry: { contains: industry, mode: 'insensitive' as const } } : {},
        location ? { location: { contains: location, mode: 'insensitive' as const } } : {}
      ]
    };

    const [salaryCalculations, total] = await Promise.all([
      prisma.salaryCalculation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.salaryCalculation.count({ where })
    ]);

    return NextResponse.json({
      data: salaryCalculations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération calculs salariaux:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}