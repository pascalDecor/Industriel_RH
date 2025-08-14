import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG VERIFY AUTH ===');
    
    // Vérifier l'authentification
    const authResult = await verifyAuth(request);
    
    console.log('Auth result:', JSON.stringify(authResult, null, 2));
    
    return NextResponse.json({
      authResult,
      userRole: authResult.user?.role,
      userRoleType: typeof authResult.user?.role,
      success: authResult.success
    });

  } catch (error) {
    console.error('Debug verify auth error:', error);
    return NextResponse.json({ error: 'Server error', details: error }, { status: 500 });
  }
}