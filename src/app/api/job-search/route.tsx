import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/connect_db';

const JobSearchSchema = z.object({
  jobTitle: z.string().min(1, 'Titre du poste requis').max(200),
  location: z.string().min(1, 'Localisation requise').max(200),
  email: z.string().email('Email invalide').max(320).optional(),
  phone: z.string().max(20).optional(),
  experience: z.string().max(50).optional(),
  keywords: z.array(z.string()).default([]),
  salary: z.string().max(50).optional(),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'remote']).optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = JobSearchSchema.parse(body);

    const jobSearch = await prisma.jobSearch.create({
      data: {
        jobTitle: validatedData.jobTitle,
        location: validatedData.location,
        email: validatedData.email,
        phone: validatedData.phone,
        experience: validatedData.experience,
        keywords: validatedData.keywords,
        salary: validatedData.salary,
        jobType: validatedData.jobType
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Recherche d\'emploi enregistrée avec succès',
      data: jobSearch
    });

  } catch (error) {
    console.error('Erreur création recherche emploi:', error);
    
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
    const location = url.searchParams.get('location') || '';
    const jobType = url.searchParams.get('jobType') || '';

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { jobTitle: { contains: search, mode: 'insensitive' as const } },
            { keywords: { has: search } }
          ]
        } : {},
        location ? { location: { contains: location, mode: 'insensitive' as const } } : {},
        jobType ? { jobType: jobType } : {}
      ]
    };

    const [jobSearches, total] = await Promise.all([
      prisma.jobSearch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.jobSearch.count({ where })
    ]);

    return NextResponse.json({
      data: jobSearches,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération recherches emploi:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}