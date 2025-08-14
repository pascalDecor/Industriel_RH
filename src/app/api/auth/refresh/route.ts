import { NextRequest, NextResponse } from "next/server";
import { getCookie, setCookie, deleteCookie } from "@/lib/session";
import { verifyRefreshToken, generateTokens } from "@/lib/jwt";
import { securityLogger, SecurityEventType, SecurityLevel } from "@/lib/securityLogger";

export async function POST(request: NextRequest) {
  try {
    // Récupérer le refresh token depuis les cookies
    const refreshToken = await getCookie("refreshToken");
    
    if (!refreshToken) {
      securityLogger.log(
        SecurityEventType.TOKEN_REFRESH_FAILED,
        SecurityLevel.WARNING,
        "Tentative de refresh sans token",
        request
      );
      return NextResponse.json(
        { message: "Token de rafraîchissement manquant" },
        { status: 401 }
      );
    }

    // Vérifier la validité du refresh token
    const payload = await verifyRefreshToken(refreshToken);
    
    if (!payload) {
      securityLogger.log(
        SecurityEventType.TOKEN_REFRESH_FAILED,
        SecurityLevel.ERROR,
        "Token de refresh invalide",
        request
      );
      // Supprimer les cookies invalides
      const response = NextResponse.json(
        { message: "Token de rafraîchissement invalide" },
        { status: 401 }
      );
      deleteCookie(response, "token");
      deleteCookie(response, "refreshToken");
      return response;
    }

    // Générer de nouveaux tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens({
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    });

    // Créer la réponse avec les nouveaux tokens
    const response = NextResponse.json({
      message: "Tokens rafraîchis avec succès",
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role
      }
    });

    // Définir les nouveaux cookies
    setCookie(response, "token", accessToken, 15 * 60); // 15 minutes
    setCookie(response, "refreshToken", newRefreshToken, 7 * 24 * 60 * 60); // 7 jours

    // Log du refresh réussi
    securityLogger.log(
      SecurityEventType.TOKEN_REFRESH,
      SecurityLevel.INFO,
      `Token rafraîchi avec succès pour l'utilisateur ${payload.email}`,
      request,
      { userId: payload.id, email: payload.email }
    );

    return response;

  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    
    // En cas d'erreur, supprimer tous les cookies
    const response = NextResponse.json(
      { message: "Erreur lors du rafraîchissement" },
      { status: 500 }
    );
    deleteCookie(response, "token");
    deleteCookie(response, "refreshToken");
    
    return response;
  }
}