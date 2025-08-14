import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "@/lib/session";
import { verifyAccessToken } from "@/lib/jwt";
import { securityLogger, SecurityEventType, SecurityLevel } from "@/lib/securityLogger";

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const token = await getCookie("token");
    if (!token) {
      securityLogger.log(
        SecurityEventType.UNAUTHORIZED_ACCESS,
        SecurityLevel.WARNING,
        "Tentative d'accès aux logs de sécurité sans authentification",
        request
      );
      return NextResponse.json(
        { message: "Authentification requise" },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      securityLogger.log(
        SecurityEventType.UNAUTHORIZED_ACCESS,
        SecurityLevel.WARNING,
        "Tentative d'accès aux logs de sécurité avec token invalide",
        request
      );
      return NextResponse.json(
        { message: "Token invalide" },
        { status: 401 }
      );
    }

    // Vérifier les permissions admin
    if (payload.role !== 'admin') {
      securityLogger.log(
        SecurityEventType.UNAUTHORIZED_ACCESS,
        SecurityLevel.ERROR,
        `Tentative d'accès aux logs de sécurité par un non-admin: ${payload.email}`,
        request,
        { userId: payload.id, email: payload.email }
      );
      return NextResponse.json(
        { message: "Accès non autorisé - Admin requis" },
        { status: 403 }
      );
    }

    // Obtenir les paramètres de requête
    const url = new URL(request.url);
    const type = url.searchParams.get('type') as SecurityEventType | null;
    const level = url.searchParams.get('level') as SecurityLevel | null;
    const ip = url.searchParams.get('ip');
    const userId = url.searchParams.get('userId');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    // Obtenir les logs selon les filtres
    let logs;
    if (type) {
      logs = securityLogger.getLogsByType(type, limit);
    } else if (level) {
      logs = securityLogger.getLogsByLevel(level, limit);
    } else if (ip) {
      logs = securityLogger.getLogsByIp(ip, limit);
    } else if (userId) {
      logs = securityLogger.getLogsByUser(userId, limit);
    } else {
      logs = securityLogger.getRecentLogs(limit);
    }

    // Obtenir les métriques
    const metrics = securityLogger.getMetrics();

    // Log de l'accès admin aux logs
    securityLogger.log(
      SecurityEventType.UNAUTHORIZED_ACCESS, // Réutilisation du type pour l'audit
      SecurityLevel.INFO,
      `Consultation des logs de sécurité par l'admin ${payload.email}`,
      request,
      { userId: payload.id, email: payload.email, metadata: { action: 'view_security_logs' } }
    );

    return NextResponse.json({
      logs,
      metrics,
      filters: {
        type,
        level,
        ip,
        userId,
        limit
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des logs:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}