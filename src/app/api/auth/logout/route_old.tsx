import { NextResponse } from "next/server";
import { deleteCookie } from "@/lib/session";

export async function POST() {
  try {
    // Créer une réponse de succès
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Déconnexion réussie' 
      },
      { status: 200 }
    );

    // Supprimer le cookie de session
    deleteCookie(response, "token");

    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors de la déconnexion' 
      },
      { status: 500 }
    );
  }
}