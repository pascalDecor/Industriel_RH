import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { session: null },
        { status: 200 }
      );
    }

    console.log('Authenticated user found userWithRole:', authResult);

    // Retourner les informations de session
    return NextResponse.json({
      session: {
        user: authResult.user
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    return NextResponse.json(
      { session: null },
      { status: 200 }
    );
  }
}