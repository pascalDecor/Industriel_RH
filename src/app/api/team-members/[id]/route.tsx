import { NextResponse } from "next/server";
import prisma from "@/lib/connect_db";

function normalizeUrl(input: unknown): string | null {
  if (typeof input !== "string") return null;
  let s = input.trim();
  if (!s) return null;

  s = s.replace(/^https:\/\/https\/+/i, "https://");
  s = s.replace(/^https:\/\/http\/+/i, "http://");
  s = s.replace(/^https\/+/i, "https://");
  s = s.replace(/^http\/+/i, "http://");
  s = s.replace(/^https:\/*/i, "https://");
  s = s.replace(/^http:\/*/i, "http://");

  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) {
    s = `https://${s}`;
  }

  try {
    const url = new URL(s);
    const host = url.hostname.toLowerCase();
    if (host === "linkedin" || host === "www.linkedin") {
      const path = url.pathname.replace(/^\/+/, "").replace(/\/+$/, "") || "";
      const normalizedPath =
        path.startsWith("in/") || path.startsWith("company/") || path.startsWith("school/")
          ? `/${path}`
          : path
            ? `/in/${path}`
            : "/in/";
      return `https://www.linkedin.com${normalizedPath}`;
    }
  } catch {
    // noop
  }

  return s;
}

export const GET = async (_req: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params;
    const member = await prisma.teamMember.findUnique({
      where: { id },
    });
    if (!member) {
      return NextResponse.json({ error: "Membre non trouvé" }, { status: 404 });
    }
    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params;
    const data = await req.json();
    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(data.nom !== undefined && { nom: data.nom }),
        ...(data.prenom !== undefined && { prenom: data.prenom }),
        ...(data.post !== undefined && { post: data.post }),
        ...(data.imageKey !== undefined && { imageKey: data.imageKey?.trim() || null }),
        ...(data.linkedin !== undefined && { linkedin: normalizeUrl(data.linkedin) }),
        ...(data.twitter !== undefined && { twitter: normalizeUrl(data.twitter) }),
        ...(data.facebook !== undefined && { facebook: normalizeUrl(data.facebook) }),
        ...(data.instagram !== undefined && { instagram: normalizeUrl(data.instagram) }),
        ...(data.website !== undefined && { website: normalizeUrl(data.website) }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH team-members error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (_req: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params;
    await prisma.teamMember.delete({
      where: { id },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
