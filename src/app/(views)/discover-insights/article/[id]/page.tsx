import type { Metadata } from "next";
import ArticleDetailClient from "./article-detail-client";
import {
  buildArticleMetaDescription,
  getArticleSeoById,
  getSiteBaseUrl,
  resolveOgImageForArticle,
  SITE_NAME,
} from "@/lib/articleSeo";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleSeoById(id);

  if (!article) {
    return {
      title: `Article introuvable | ${SITE_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = getSiteBaseUrl();
  const path = `/discover-insights/article/${article.id}`;
  const canonical = `${baseUrl}${path}`;
  const description = buildArticleMetaDescription({
    titre: article.titre,
    contenu: article.contenu,
    contenu_en: article.contenu_en,
    tags: article.tags,
  });

  const og = resolveOgImageForArticle(article.image, baseUrl);
  const title = `${article.titre} | ${SITE_NAME}`;

  const meta: Metadata = {
    title,
    description,
    ...(article.tags.length > 0 && {
      keywords: article.tags.map((t) => t.libelle),
    }),
    alternates: {
      canonical,
    },
    robots: article.published
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: article.titre,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "fr_CA",
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      images: [
        {
          url: og.url,
          ...(og.secureUrl && { secureUrl: og.secureUrl }),
          type: og.type,
          ...(og.width != null &&
            og.height != null && {
              width: og.width,
              height: og.height,
            }),
          alt: article.titre,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.titre,
      description,
      images: [
        {
          url: og.url,
          alt: article.titre,
        },
      ],
    },
  };

  if (article.author?.name) {
    meta.authors = [{ name: article.author.name }];
  }

  return meta;
}

export default function ArticleDetailPage() {
  return <ArticleDetailClient />;
}
