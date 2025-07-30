// app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deleteCookie, getCookie } from "@/lib/session";
import { securityLogger, SecurityEventType, SecurityLevel } from "@/lib/securityLogger";
import { verifyAccessToken } from "@/lib/jwt";

export const POST = async (request: NextRequest) => {
  try {
    // Obtenir le token actuel pour logs
    const token = await getCookie("token");
    let userId: string | undefined;
    let email: string | undefined;

    if (token) {
      const payload = await verifyAccessToken(token);
      if (payload) {
        userId = payload.id;
        email = payload.email;
      }
    }

    // Prépare la réponse JSON
    const res = NextResponse.json({ message: "Déconnexion réussie" });

    // Écrase les cookies tokens en les vidant et en expirant immédiatement
    deleteCookie(res, "token");
    deleteCookie(res, "refreshToken");

    // Log de la déconnexion
    securityLogger.log(
      SecurityEventType.LOGOUT,
      SecurityLevel.INFO,
      `Déconnexion${email ? ` de l'utilisateur ${email}` : ''}`,
      request,
      { userId, email }
    );

    return res;
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    
    // Même en cas d'erreur, supprimer les cookies
    const res = NextResponse.json({ message: "Déconnexion réussie" });
    deleteCookie(res, "token");
    deleteCookie(res, "refreshToken");
    
    return res;
  }
};
