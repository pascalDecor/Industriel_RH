/**
 * Validates a reCAPTCHA v3 token with Google's API
 * @param token - The reCAPTCHA token to validate
 * @param action - The expected action (optional)
 * @returns Promise with validation result
 */
export async function validateRecaptcha(
  token: string,
  action?: string
): Promise<{
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not defined');
    return {
      success: false,
      'error-codes': ['missing-secret-key'],
    };
  }

  if (!token) {
    return {
      success: false,
      'error-codes': ['missing-input-response'],
    };
  }

  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data = await response.json();

    // For reCAPTCHA v3, check if score is above threshold (0.5 is recommended)
    if (data.success && data.score !== undefined) {
      const scoreThreshold = 0.5;
      if (data.score < scoreThreshold) {
        console.warn(`reCAPTCHA score too low: ${data.score}`);
        return {
          ...data,
          success: false,
          'error-codes': ['score-too-low'],
        };
      }
    }

    // Optionally verify the action matches
    if (action && data.action && data.action !== action) {
      console.warn(
        `reCAPTCHA action mismatch. Expected: ${action}, Got: ${data.action}`
      );
      return {
        ...data,
        success: false,
        'error-codes': ['action-mismatch'],
      };
    }

    return data;
  } catch (error) {
    console.error('Error validating reCAPTCHA:', error);
    return {
      success: false,
      'error-codes': ['network-error'],
    };
  }
}
