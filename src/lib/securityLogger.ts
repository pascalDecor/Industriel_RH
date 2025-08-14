import { NextRequest } from "next/server";

// Types d'événements de sécurité
export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_BLOCKED = 'LOGIN_BLOCKED',
  OTP_SUCCESS = 'OTP_SUCCESS',
  OTP_FAILED = 'OTP_FAILED',
  OTP_BLOCKED = 'OTP_BLOCKED',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  TOKEN_REFRESH_FAILED = 'TOKEN_REFRESH_FAILED',
  LOGOUT = 'LOGOUT',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  CSRF_ATTEMPT = 'CSRF_ATTEMPT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

// Niveaux de sévérité
export enum SecurityLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

// Interface pour les données de log
interface SecurityLogData {
  type: SecurityEventType;
  level: SecurityLevel;
  message: string;
  userId?: string;
  email?: string;
  ip: string;
  userAgent: string;
  path: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Interface pour les métriques de sécurité
interface SecurityMetrics {
  totalEvents: number;
  failedLogins: number;
  blockedAttempts: number;
  suspiciousActivities: number;
  lastEvent?: SecurityLogData;
}

class SecurityLogger {
  private logs: SecurityLogData[] = [];
  private maxLogs = 10000; // Limite de logs en mémoire
  private metrics: SecurityMetrics = {
    totalEvents: 0,
    failedLogins: 0,
    blockedAttempts: 0,
    suspiciousActivities: 0
  };

  /**
   * Extrait les informations de la requête
   */
  private extractRequestInfo(request: NextRequest | Request) {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const path = 'url' in request ? new URL(request.url).pathname : 'unknown';

    return { ip, userAgent, path };
  }

  /**
   * Log un événement de sécurité
   */
  log(
    type: SecurityEventType,
    level: SecurityLevel,
    message: string,
    request: NextRequest | Request,
    options: {
      userId?: string;
      email?: string;
      metadata?: Record<string, any>;
    } = {}
  ) {
    const { ip, userAgent, path } = this.extractRequestInfo(request);
    const { userId, email, metadata } = options;

    const logData: SecurityLogData = {
      type,
      level,
      message,
      userId,
      email,
      ip,
      userAgent,
      path,
      timestamp: new Date().toISOString(),
      metadata
    };

    // Ajouter aux logs
    this.logs.push(logData);
    
    // Maintenir la limite de logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Mettre à jour les métriques
    this.updateMetrics(logData);

    // Log dans la console selon le niveau
    this.consoleLog(logData);

    // En production, envoyer vers un service de logging externe
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalLogger(logData);
    }
  }

  /**
   * Met à jour les métriques de sécurité
   */
  private updateMetrics(logData: SecurityLogData) {
    this.metrics.totalEvents++;
    this.metrics.lastEvent = logData;

    switch (logData.type) {
      case SecurityEventType.LOGIN_FAILED:
      case SecurityEventType.OTP_FAILED:
        this.metrics.failedLogins++;
        break;
      case SecurityEventType.LOGIN_BLOCKED:
      case SecurityEventType.OTP_BLOCKED:
      case SecurityEventType.RATE_LIMIT_EXCEEDED:
        this.metrics.blockedAttempts++;
        break;
      case SecurityEventType.SUSPICIOUS_ACTIVITY:
      case SecurityEventType.CSRF_ATTEMPT:
      case SecurityEventType.UNAUTHORIZED_ACCESS:
        this.metrics.suspiciousActivities++;
        break;
    }
  }

  /**
   * Log dans la console avec formatage
   */
  private consoleLog(logData: SecurityLogData) {
    const logMessage = `[SECURITY] ${logData.timestamp} - ${logData.level} - ${logData.type}: ${logData.message}`;
    const context = {
      ip: logData.ip,
      userAgent: logData.userAgent,
      path: logData.path,
      userId: logData.userId,
      email: logData.email,
      metadata: logData.metadata
    };

    switch (logData.level) {
      case SecurityLevel.CRITICAL:
      case SecurityLevel.ERROR:
        console.error(logMessage, context);
        break;
      case SecurityLevel.WARNING:
        console.warn(logMessage, context);
        break;
      case SecurityLevel.INFO:
      default:
        console.info(logMessage, context);
        break;
    }
  }

  /**
   * Envoie vers un service de logging externe (à implémenter)
   */
  private sendToExternalLogger(logData: SecurityLogData) {
    // TODO: Implémenter l'envoi vers un service comme LogRocket, Sentry, etc.
    // Exemple avec fetch vers un service de logging
    /*
    try {
      fetch('/api/logging/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });
    } catch (error) {
      console.error('Erreur envoi log externe:', error);
    }
    */
  }

  /**
   * Obtient les logs récents
   */
  getRecentLogs(limit: number = 100): SecurityLogData[] {
    return this.logs.slice(-limit);
  }

  /**
   * Obtient les logs par type
   */
  getLogsByType(type: SecurityEventType, limit: number = 100): SecurityLogData[] {
    return this.logs
      .filter(log => log.type === type)
      .slice(-limit);
  }

  /**
   * Obtient les logs par niveau
   */
  getLogsByLevel(level: SecurityLevel, limit: number = 100): SecurityLogData[] {
    return this.logs
      .filter(log => log.level === level)
      .slice(-limit);
  }

  /**
   * Obtient les logs par IP
   */
  getLogsByIp(ip: string, limit: number = 100): SecurityLogData[] {
    return this.logs
      .filter(log => log.ip === ip)
      .slice(-limit);
  }

  /**
   * Obtient les logs par utilisateur
   */
  getLogsByUser(userId: string, limit: number = 100): SecurityLogData[] {
    return this.logs
      .filter(log => log.userId === userId)
      .slice(-limit);
  }

  /**
   * Obtient les métriques de sécurité
   */
  getMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  /**
   * Détecte les activités suspectes
   */
  detectSuspiciousActivity(ip: string, timeWindowMs: number = 5 * 60 * 1000): boolean {
    const now = Date.now();
    const recentLogs = this.logs.filter(log => 
      log.ip === ip && 
      now - new Date(log.timestamp).getTime() < timeWindowMs
    );

    // Critères de détection d'activité suspecte
    const failedAttempts = recentLogs.filter(log => 
      log.type === SecurityEventType.LOGIN_FAILED || 
      log.type === SecurityEventType.OTP_FAILED
    ).length;

    const differentUserAgents = new Set(recentLogs.map(log => log.userAgent)).size;
    const differentPaths = new Set(recentLogs.map(log => log.path)).size;

    // Suspicieux si :
    // - Plus de 3 échecs de connexion en 5 minutes
    // - Plus de 5 User-Agents différents
    // - Plus de 10 chemins différents tentés
    return failedAttempts > 3 || differentUserAgents > 5 || differentPaths > 10;
  }

  /**
   * Nettoie les anciens logs
   */
  cleanup(olderThanMs: number = 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - olderThanMs;
    this.logs = this.logs.filter(log => 
      new Date(log.timestamp).getTime() > cutoff
    );
  }
}

// Instance globale
export const securityLogger = new SecurityLogger();

// Fonctions helper pour les événements courants
export const logLoginSuccess = (request: NextRequest | Request, userId: string, email: string) => {
  securityLogger.log(
    SecurityEventType.LOGIN_SUCCESS,
    SecurityLevel.INFO,
    `Connexion réussie pour l'utilisateur ${email}`,
    request,
    { userId, email }
  );
};

export const logLoginFailed = (request: NextRequest | Request, email?: string, reason?: string) => {
  securityLogger.log(
    SecurityEventType.LOGIN_FAILED,
    SecurityLevel.WARNING,
    `Échec de connexion${email ? ` pour ${email}` : ''}${reason ? `: ${reason}` : ''}`,
    request,
    { email, metadata: { reason } }
  );
};

export const logRateLimitExceeded = (request: NextRequest | Request, identifier: string) => {
  securityLogger.log(
    SecurityEventType.RATE_LIMIT_EXCEEDED,
    SecurityLevel.ERROR,
    `Limite de taux dépassée pour l'identifiant ${identifier}`,
    request,
    { metadata: { identifier } }
  );
};

export const logSuspiciousActivity = (request: NextRequest | Request, reason: string) => {
  securityLogger.log(
    SecurityEventType.SUSPICIOUS_ACTIVITY,
    SecurityLevel.CRITICAL,
    `Activité suspecte détectée: ${reason}`,
    request,
    { metadata: { reason } }
  );
};