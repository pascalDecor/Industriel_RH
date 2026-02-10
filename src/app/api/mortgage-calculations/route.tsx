import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/connect_db';

const MortgageCalculationSchema = z.object({
  propertyValue: z.number().min(1000, 'Valeur de propriété invalide').max(100000000),
  downPayment: z.number().min(0, 'Mise de fonds invalide').max(100000000),
  interestRate: z.number().min(0, 'Taux d\'intérêt invalide').max(100),
  loanTerm: z.number().min(1, 'Durée du prêt invalide').max(50),
  monthlyPayment: z.number().min(0, 'Paiement mensuel invalide').max(1000000),
  totalInterest: z.number().min(0, 'Intérêts totaux invalides').max(100000000),
  totalPayment: z.number().min(0, 'Paiement total invalide').max(100000000),
  propertyTax: z.number().min(0, 'Taxe foncière invalide').max(1000000),
  insurance: z.number().min(0, 'Assurance invalide').max(1000000),
  email: z.string().email('Email invalide').max(320).optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = MortgageCalculationSchema.parse(body);

    const mortgageCalculation = await prisma.mortgageCalculation.create({
      data: {
        homePrice: validatedData.propertyValue,
        downPayment: validatedData.downPayment,
        interestRate: validatedData.interestRate,
        loanTerm: validatedData.loanTerm,
        monthlyPayment: validatedData.monthlyPayment,
        totalInterest: validatedData.totalInterest,
        totalPayment: validatedData.totalPayment,
        propertyTax: validatedData.propertyTax,
        insurance: validatedData.insurance,
        email: validatedData.email
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Calcul hypothécaire enregistré avec succès',
      data: mortgageCalculation
    });

  } catch (error) {
    console.error('Erreur création calcul hypothécaire:', error);
    
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          email: { contains: search, mode: 'insensitive' as const }
        } : {}
      ]
    };

    const [mortgageCalculations, total] = await Promise.all([
      prisma.mortgageCalculation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.mortgageCalculation.count({ where })
    ]);

    return NextResponse.json({
      data: mortgageCalculations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération calculs hypothécaires:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 });
  }
}