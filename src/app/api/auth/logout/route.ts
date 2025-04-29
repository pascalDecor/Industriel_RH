// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { deleteCookie } from "@/lib/session";

export const POST = async () => {
  // Prépare la réponse JSON
  const res = NextResponse.json({ message: "Déconnexion réussie" });

  // Écrase le cookie token en le vidant et en expirant immédiatement
  deleteCookie(res,"token");
  return res;
};
