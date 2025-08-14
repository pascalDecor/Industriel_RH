interface RateLimitAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

class RateLimiter {
  private attempts = new Map<string, RateLimitAttempt>();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly blockDurationMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000, blockDurationMs = 30 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
    
    // Nettoyage périodique des anciennes entrées
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  /**
   * Vérifie si une IP peut faire une tentative
   */
  canAttempt(identifier: string): { allowed: boolean; resetTime?: number } {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      return { allowed: true };
    }

    // Vérifier si l'IP est bloquée
    if (attempt.blockedUntil && now < attempt.blockedUntil) {
      return { 
        allowed: false, 
        resetTime: attempt.blockedUntil 
      };
    }

    // Réinitialiser si la fenêtre de temps est écoulée
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.delete(identifier);
      return { allowed: true };
    }

    // Vérifier le nombre de tentatives
    if (attempt.count >= this.maxAttempts) {
      // Bloquer l'IP
      attempt.blockedUntil = now + this.blockDurationMs;
      return { 
        allowed: false, 
        resetTime: attempt.blockedUntil 
      };
    }

    return { allowed: true };
  }

  /**
   * Enregistre une tentative
   */
  recordAttempt(identifier: string, success: boolean = false) {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (success) {
      // Supprimer l'entrée en cas de succès
      this.attempts.delete(identifier);
      return;
    }

    if (!attempt) {
      this.attempts.set(identifier, {
        count: 1,
        lastAttempt: now
      });
    } else {
      // Réinitialiser si la fenêtre est expirée
      if (now - attempt.lastAttempt > this.windowMs) {
        this.attempts.set(identifier, {
          count: 1,
          lastAttempt: now
        });
      } else {
        attempt.count++;
        attempt.lastAttempt = now;
      }
    }
  }

  /**
   * Nettoie les anciennes entrées
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, attempt] of this.attempts.entries()) {
      // Supprimer les entrées expirées
      if (
        (attempt.blockedUntil && now > attempt.blockedUntil) ||
        (now - attempt.lastAttempt > this.windowMs * 2)
      ) {
        this.attempts.delete(key);
      }
    }
  }

  /**
   * Obtient les statistiques pour un identifier
   */
  getStats(identifier: string) {
    const attempt = this.attempts.get(identifier);
    if (!attempt) {
      return { attempts: 0, blocked: false };
    }

    const now = Date.now();
    return {
      attempts: attempt.count,
      blocked: attempt.blockedUntil ? now < attempt.blockedUntil : false,
      resetTime: attempt.blockedUntil
    };
  }
}

// Instance globale pour les tentatives de connexion
export const loginRateLimit = new RateLimiter(5, 15 * 60 * 1000, 30 * 60 * 1000); // 5 tentatives par 15 minutes, bloqué 30 minutes

// Instance pour les tentatives OTP
export const otpRateLimit = new RateLimiter(3, 10 * 60 * 1000, 15 * 60 * 1000); // 3 tentatives par 10 minutes, bloqué 15 minutes

/**
 * Obtient l'identifiant unique d'une requête (IP + User-Agent)
 */
export function getRequestIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Hasher l'IP + User-Agent pour plus de sécurité
  return Buffer.from(`${ip}-${userAgent}`).toString('base64').slice(0, 32);
}

/**
 * Middleware helper pour vérifier le rate limiting
 */
export function checkRateLimit(
  rateLimiter: RateLimiter, 
  identifier: string
): { success: boolean; error?: string; resetTime?: number } {
  const { allowed, resetTime } = rateLimiter.canAttempt(identifier);
  
  if (!allowed) {
    const resetDate = resetTime ? new Date(resetTime) : new Date();
    return {
      success: false,
      error: `Trop de tentatives. Réessayez après ${resetDate.toLocaleTimeString('fr-FR')}`,
      resetTime
    };
  }
  
  return { success: true };
}