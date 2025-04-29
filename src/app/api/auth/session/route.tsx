import { NextResponse } from "next/server";
import { deleteCookie, getCookie } from "@/lib/session";
import { jwToken } from "@/lib/jwt";
import prisma from '@/lib/connect_db';

export async function GET() {
    // 1. Récupère le token depuis les cookies
    const token = await getCookie("token");
    if (!token) {
        // pas de cookie → session nulle
        return NextResponse.json({ session: null }, { status: 200 });
    }

    try {
        // 2. Vérifie le JWT
        const { userId } = jwToken.verify(token) as { userId: string };

        // 3. Récupère l’utilisateur en base
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            // user supprimé entre-temps
            return NextResponse.json({ session: null }, { status: 200 });
        }
        // 4. Renvoie payload → front : { session: { user, token } }
        return NextResponse.json(
            { session: { user, token } },
            { status: 200 }
        );
    } catch (err) {
        console.log(err);
        const res = NextResponse.json({ session: null }, { status: 200 });
        deleteCookie(res, "token");
        return res;
    }
}
