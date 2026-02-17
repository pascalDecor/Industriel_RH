import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/connect_db";

function normalizeUrl(input: unknown): string | null {
  if (typeof input !== "string") return null;
  let s = input.trim();
  if (!s) return null;

  // Corriger double protocole déjà stocké (ex: https://https//linkedin/...)
  s = s.replace(/^https:\/\/https\/+/i, "https://");
  s = s.replace(/^https:\/\/http\/+/i, "http://");
  // Corriger typo sans deux-points: https//..., http//..., https/..., http/...
  s = s.replace(/^https\/+/i, "https://");
  s = s.replace(/^http\/+/i, "http://");
  s = s.replace(/^https:\/*/i, "https://");
  s = s.replace(/^http:\/*/i, "http://");

  // Si pas de protocole valide, en ajouter un
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) {
    s = `https://${s}`;
  }

  // Normaliser LinkedIn si le host est "linkedin" (sans .com) ou "www.linkedin"
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

export const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50", 10));
    const search = searchParams.get("search")?.trim() || "";
    const skip = (page - 1) * limit;

    const where: { OR?: { nom?: { contains: string; mode: "insensitive" }; prenom?: { contains: string; mode: "insensitive" }; post?: { contains: string; mode: "insensitive" } }[] } = {};
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: "insensitive" } },
        { prenom: { contains: search, mode: "insensitive" } },
        { post: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, members] = await Promise.all([
      prisma.teamMember.count({ where }),
      prisma.teamMember.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      data: members,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const created = await prisma.teamMember.create({
      data: {
        nom: data.nom ?? "",
        prenom: data.prenom ?? "",
        post: data.post ?? "",
        imageKey: data.imageKey?.trim() || null,
        linkedin: normalizeUrl(data.linkedin),
        twitter: normalizeUrl(data.twitter),
        facebook: normalizeUrl(data.facebook),
        instagram: normalizeUrl(data.instagram),
        website: normalizeUrl(data.website),
        order: typeof data.order === "number" ? data.order : 0,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST team-members error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
