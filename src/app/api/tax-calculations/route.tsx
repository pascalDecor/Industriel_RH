import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/connect_db';

const TaxCalculationSchema = z.object({
  province: z.string().min(1, 'Province requise').max(50),
  annualSalary: z.number().min(0, 'Salaire invalide').max(10000000),
  filingStatus: z.enum(['single', 'married', 'head_of_household']),
  deductions: z.array(z.string()).default([]),
  dependents: z.number().min(0, 'Nombre de personnes à charge invalide').max(20),
  federalTax: z.number().min(0, 'Impôt fédéral invalide').max(10000000),
  provincialTax: z.number().min(0, 'Impôt provincial invalide').max(10000000),
  totalTax: z.number().min(0, 'Impôt total invalide').max(10000000),
  netSalary: z.number().min(0, 'Salaire net invalide').max(10000000),
  email: z.string().email('Email invalide').max(320).optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = TaxCalculationSchema.parse(body);

    const taxCalculation = await prisma.taxCalculation.create({
      data: {
        province: validatedData.province,
        annualIncome: validatedData.annualSalary,
        filingStatus: validatedData.filingStatus,
        effectiveRate: 0,
        marginalRate: 0,
        federalTax: validatedData.federalTax,
        provincialTax: validatedData.provincialTax,
        totalTax: validatedData.totalTax,
        netIncome: validatedData.netSalary,
        email: validatedData.email
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Calcul fiscal enregistré avec succès',
      data: taxCalculation
    });

  } catch (error) {
    console.error('Erreur création calcul fiscal:', error);
    
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
    const province = url.searchParams.get('province') || '';
    const filingStatus = url.searchParams.get('filingStatus') || '';

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          email: { contains: search, mode: 'insensitive' as const }
        } : {},
        province ? { province: { contains: province, mode: 'insensitive' as const } } : {},
        filingStatus ? { filingStatus: filingStatus } : {}
      ]
    };

    const [taxCalculations, total] = await Promise.all([
      prisma.taxCalculation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.taxCalculation.count({ where })
    ]);

    return NextResponse.json({
      data: taxCalculations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération calculs fiscaux:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}