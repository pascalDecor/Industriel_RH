import { NextRequest, NextResponse } from 'next/server';
import { validateRecaptcha } from '@/lib/recaptcha';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, action } = body;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'reCAPTCHA token is required',
        },
        { status: 400 }
      );
    }

    // Validate the token with Google's API
    const validationResult = await validateRecaptcha(token, action);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'reCAPTCHA validation failed',
          details: validationResult['error-codes'],
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      score: validationResult.score,
      action: validationResult.action,
    });
  } catch (error) {
    console.error('Error in verify-recaptcha route:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
