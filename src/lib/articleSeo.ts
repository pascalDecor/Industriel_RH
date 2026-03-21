import prisma from '@/lib/connect_db';

const DEFAULT_OG_IMAGE = '/images/default-article.jpg';
const SITE_NAME = 'Industrielle RH';

/** Dimensions usuelles recommandées par les plateformes (1,91:1) — utilisées seulement pour l’image par défaut connue. */
export const OG_DEFAULT_IMAGE_WIDTH = 1200;
export const OG_DEFAULT_IMAGE_HEIGHT = 630;

export function getSiteBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return String(process.env.NEXT_PUBLIC_APP_URL).replace(/\/$/, '');
  }
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    const withProto = vercel.startsWith('http') ? vercel : `https://${vercel}`;
    return withProto.replace(/\/$/, '');
  }
  return 'https://industriellerh.com';
}

/**
 * Normalise une URL absolue pour les crawlers (Facebook, LinkedIn, X, WhatsApp) :
 * - encodage correct du chemin (espaces, caractères spéciaux)
 * - en production, force https sauf localhost
 */
export function normalizeAbsoluteUrlForSocial(href: string): string {
  try {
    const u = new URL(href);
    const isLocal =
      u.hostname === 'localhost' ||
      u.hostname === '127.0.0.1' ||
      u.hostname.endsWith('.local');
    if (!isLocal && u.protocol === 'http:' && process.env.NODE_ENV === 'production') {
      u.protocol = 'https:';
    }
    return u.toString();
  } catch {
    return href;
  }
}

/** URL absolue pour og:image / Twitter (jamais de lien vers /_next/image — les robots doivent charger le fichier directement). */
export function toAbsoluteAssetUrl(path: string | null | undefined, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '');
  if (!path || path.trim() === '') {
    return normalizeAbsoluteUrlForSocial(new URL(DEFAULT_OG_IMAGE, `${base}/`).href);
  }
  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return normalizeAbsoluteUrlForSocial(trimmed);
  }
  const relative = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return normalizeAbsoluteUrlForSocial(new URL(relative, `${base}/`).href);
}

/** Devine le type MIME pour og:image:type (Facebook / LinkedIn). */
export function guessOgImageMimeType(url: string): string {
  const pathOnly = url.split('?')[0]?.toLowerCase() ?? '';
  if (pathOnly.endsWith('.png')) return 'image/png';
  if (pathOnly.endsWith('.webp')) return 'image/webp';
  if (pathOnly.endsWith('.gif')) return 'image/gif';
  if (pathOnly.endsWith('.svg') || pathOnly.endsWith('.svgz')) return 'image/svg+xml';
  if (pathOnly.endsWith('.avif')) return 'image/avif';
  return 'image/jpeg';
}

export type ResolvedOgImage = {
  /** URL absolue, HTTPS en prod (hors localhost) */
  url: string;
  /** Même URL si HTTPS — pour og:image:secure_url */
  secureUrl?: string;
  type: string;
  /** Dimensions uniquement si connues / pertinentes (évite d’induire les crawlers en erreur sur les uploads libres) */
  width?: number;
  height?: number;
};

/**
 * Prépare les champs image pour Open Graph / Twitter Card.
 * Les apps de partage exigent une URL absolue accessible publiquement (pas d’auth, pas de /_next/image).
 */
export function resolveOgImageForArticle(
  image: string | null | undefined,
  baseUrl: string
): ResolvedOgImage {
  const url = toAbsoluteAssetUrl(image, baseUrl);
  const type = guessOgImageMimeType(url);
  const isDefault =
    !image?.trim() ||
    url.includes(DEFAULT_OG_IMAGE) ||
    url.endsWith('default-article.jpg');

  const resolved: ResolvedOgImage = {
    url,
    type,
    ...(url.startsWith('https://') && { secureUrl: url }),
  };

  if (isDefault) {
    resolved.width = OG_DEFAULT_IMAGE_WIDTH;
    resolved.height = OG_DEFAULT_IMAGE_HEIGHT;
  }

  return resolved;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getEditorBlocks(contenu: unknown): unknown[] {
  if (!contenu) return [];
  if (Array.isArray(contenu)) {
    const first = contenu[0];
    if (
      first &&
      typeof first === 'object' &&
      'blocks' in first &&
      Array.isArray((first as { blocks: unknown[] }).blocks)
    ) {
      return (first as { blocks: unknown[] }).blocks;
    }
    if (contenu.length > 0 && typeof contenu[0] === 'object' && contenu[0] !== null && 'type' in contenu[0]) {
      return contenu as unknown[];
    }
  }
  if (typeof contenu === 'object' && contenu !== null && 'blocks' in contenu) {
    const blocks = (contenu as { blocks: unknown[] }).blocks;
    return Array.isArray(blocks) ? blocks : [];
  }
  return [];
}

function extractTextFromBlock(block: unknown): string {
  if (!block || typeof block !== 'object') return '';
  const b = block as { type?: string; data?: Record<string, unknown> };
  const d = b.data || {};
  switch (b.type) {
    case 'paragraph':
    case 'header':
      return typeof d.text === 'string' ? stripHtml(d.text) : '';
    case 'quote':
      return [d.text, d.caption]
        .filter(Boolean)
        .map((x) => stripHtml(String(x)))
        .join(' ');
    case 'list':
      if (Array.isArray(d.items)) {
        return d.items
          .map((item: unknown) => {
            if (typeof item === 'string') return stripHtml(item);
            if (item && typeof item === 'object' && 'content' in item) {
              return stripHtml(String((item as { content: string }).content));
            }
            if (item && typeof item === 'object' && 'text' in item) {
              return stripHtml(String((item as { text: string }).text));
            }
            return '';
          })
          .join(' ');
      }
      return '';
    case 'code':
      return typeof d.code === 'string' ? d.code.slice(0, 500) : '';
    case 'warning':
      return [d.title, d.message]
        .filter(Boolean)
        .map((x) => stripHtml(String(x)))
        .join(' ');
    case 'checklist':
      if (Array.isArray(d.items)) {
        return d.items
          .map((item: unknown) =>
            item && typeof item === 'object' && 'text' in item
              ? stripHtml(String((item as { text: string }).text))
              : ''
          )
          .join(' ');
      }
      return '';
    default:
      if (typeof d.text === 'string') return stripHtml(d.text);
      if (typeof d.message === 'string') return stripHtml(d.message);
      return '';
  }
}

function excerptFromBlocks(blocks: unknown[], maxLen: number): string {
  const parts: string[] = [];
  for (const block of blocks) {
    const t = extractTextFromBlock(block);
    if (t) parts.push(t);
    if (parts.join(' ').length >= maxLen) break;
  }
  let text = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
}

/**
 * Texte pour meta description / og:description (priorité contenu FR, puis EN, puis tags, puis titre).
 */
export function buildArticleMetaDescription(input: {
  titre: string;
  contenu: unknown;
  contenu_en: unknown;
  tags: { libelle: string }[];
}): string {
  const fr = excerptFromBlocks(getEditorBlocks(input.contenu), 200);
  if (fr) return fr;
  const en = excerptFromBlocks(getEditorBlocks(input.contenu_en), 200);
  if (en) return en;
  if (input.tags.length > 0) {
    return input.tags.map((t) => t.libelle).join(', ').slice(0, 200);
  }
  return `${input.titre} — ${SITE_NAME}`;
}

export type ArticleSeoPayload = {
  id: string;
  titre: string;
  titre_en: string | null;
  image: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  contenu: unknown;
  contenu_en: unknown;
  tags: { libelle: string }[];
  author: { name: string } | null;
};

/** Données minimales pour generateMetadata (Prisma, pas de compteur de vues). */
export async function getArticleSeoById(articleId: string): Promise<ArticleSeoPayload | null> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      titre: true,
      titre_en: true,
      image: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      contenu: true,
      contenu_en: true,
      tags: {
        select: { libelle: true },
        orderBy: { libelle: 'asc' },
      },
      author: {
        select: { name: true },
      },
    },
  });
  return article;
}

export { SITE_NAME, DEFAULT_OG_IMAGE };
