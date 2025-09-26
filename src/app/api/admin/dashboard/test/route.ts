import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export async function GET() {
  try {
    // Test simple de connexion Prisma
    console.log('Testing Prisma connection...');

    // Test de base sans conditions complexes
    const applicationCount = await prisma.application.count();
    console.log('Application count:', applicationCount);

    const response = {
      success: true,
      message: 'Prisma connection successful',
      data: {
        applications: applicationCount,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Test API failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}