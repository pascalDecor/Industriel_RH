import prisma from '@/lib/connect_db';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ db: "connected" });
  } catch (e) {
    return NextResponse.json(
      { db: "error", error: String(e) },
      { status: 500 }
    );
  }
}
