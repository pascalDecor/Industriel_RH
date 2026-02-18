"use client";

import Link from "next/link";
import { DynamicImage } from "@/components/ui/DynamicImage";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

import { redirect } from "next/navigation";
import { Sector } from "@/models/sector";
import { useTranslation } from "@/contexts/LanguageContext";
import { useDynamicTranslation } from "@/hooks/useDynamicTranslation";

const Button = dynamic(() => import("../ui/button"), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-full h-10 w-32" />
});

interface TrendingArticle {
  id: string;
  titre: string;
  titre_en?: string;
  views: number;
}

export function DiscoverInsightsExpandedNavbar({ sectors }: { sectors: Sector[] }) {
  const { t } = useTranslation();
  const { translateArticleTitle } = useDynamicTranslation();
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    fetchTrendingArticles();
  }, []);

  const fetchTrendingArticles = async () => {
    try {
      setLoadingTrending(true);
      const response = await fetch('/api/articles?published=true&limit=5&sortBy=views&sortOrder=desc');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTrendingArticles(data.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles trending:', error);
      // En cas d'erreur, garder un tableau vide pour utiliser le fallback statique
      setTrendingArticles([]);
    } finally {
      setLoadingTrending(false);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 lg:px-10 mb-5 max-w-7xl mx-auto">
      <div className="w-full">
        <div className="bg-white shadow-lg rounded-2xl p-5 w-full">
          <DynamicImage
            imageKey="discover_insights"
            alt="Discover insights"
            className="w-1/2 md:w-2/5 mb-3"
          />
          <p className="text-gray-500 text-sm mb-5">
            {t('discover_insights.navbar.description')}
          </p>
          <Button variant="primary" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-sm px-10">
            {t('discover_insights.navbar.button')}
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="p-5 w-full bg-blue-50 shadow-lg rounded-2xl">
          <p className="text-gray-600 text-sm font-bold mb-4 uppercase">
            {t('discover_insights.navbar.trending_topics')}
          </p>
          <div className="flex flex-col gap-5">
            {loadingTrending ? (
              // Skeleton loader
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse bg-gray-200 h-4 rounded"></div>
              ))
            ) : trendingArticles.length > 0 ? (
              // Articles dynamiques
              trendingArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/discover-insights/article/${article.id}`}
                  className="text-gray-500 text-sm hover:text-blue-600 transition-colors line-clamp-1"
                  title={translateArticleTitle(article)}
                >
                  {translateArticleTitle(article)}
                </Link>
              ))
            ) : (
              // Fallback statique en cas d'erreur ou pas d'articles
              <>
                <p className="text-gray-500 text-sm">
                  {t('discover_insights.navbar.no_trending')}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="p-5 w-full bg-blue-50 shadow-lg rounded-2xl">
          <p className="text-gray-600 text-sm font-bold mb-4 uppercase">
            {t('discover_insights.navbar.tools')}
          </p>
          <div className="flex flex-col gap-5">
            <Link href={"/quebec-tax-calculator"} className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
              {t('discover_insights.navbar.tools.quebec_tax_calculator')}
            </Link>
            <Link href={"/morgage-calculator"} className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
              {t('discover_insights.navbar.tools.mortgage_calculator')}
            </Link>
            <Link href={"/salary-guide"} className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
              {t('discover_insights.navbar.tools.salary_guide')}
            </Link>
            {/* <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              Resume Builder
            </Link>
            <Link href={"/valid-cnesst"} className="text-gray-500 text-sm">
              ValidCNESST
            </Link>
            <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              VivreFrais
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}

