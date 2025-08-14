"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { redirect } from "next/navigation";
import { Sector } from "@/models/sector";
import { useTranslation } from "@/contexts/LanguageContext";

const Button = dynamic(() => import("../ui/button"), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-full h-10 w-32" />
});


export function DiscoverInsightsExpandedNavbar({ sectors }: { sectors: Sector[] }) {
  const { t } = useTranslation();
  return (
    <div className="lg:flex grid grid-cols-12 gap-10 lg:px-10 mb-5 justify-between items-start w-7xl mx-auto">
      <div className="col-span-3 lg:w-3/12">
        <div className="bg-white shadow-lg rounded-2xl p-5 w-full">
          <Image
            priority={false}
            loading="lazy"
            src={imagePathFinder.discover_insights}
            alt="logo"
            className="w-1/2"
            width={200}
            height={100}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBobHB0eH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJvBYxun9ubtlOIZhKhFa/buxtrMuZBOgKiDKUQKUGKxgLAaYYJqKQyFQQPL8RoXM8VQRlhYhYVCQUBGOFRDgJBGwwCAYLPJA="
          />
          <p className="text-gray-500 text-sm mb-5">
            {t('discover_insights.navbar.description')}
          </p>
          <Button variant="primary" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-sm px-10">
            {t('discover_insights.navbar.button')}
          </Button>
        </div>
      </div>

      <div className="col-span-2 lg:w-3/12">
        <div className="p-5 w-fit bg-blue-50 shadow-lg rounded-2xl float-right">
          <p className="text-gray-600 text-sm font-bold mb-4 uppercase">
            {t('discover_insights.navbar.trending_topics')}
          </p>
          <div className=" grid grid-rows-5 gap-5">
            <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              {t('discover_insights.navbar.topics.salary_trends')}
            </Link>
            <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              {t('discover_insights.navbar.topics.adaptive_working')}
            </Link>
            <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              {t('discover_insights.navbar.topics.competitive_advantage')}
            </Link>
            <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              {t('discover_insights.navbar.topics.work_life_balance')}
            </Link>
            <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              {t('discover_insights.navbar.topics.diversity_inclusion')}
            </Link>
          </div>
        </div>
      </div>
      <div className="col-span-2 lg:w-3/12">
        <div className="p-5 w-fit bg-blue-50 shadow-lg rounded-2xl float-right">
          <p className="text-gray-600 text-sm font-bold mb-4 uppercase">
            {t('discover_insights.navbar.tools')}
          </p>
          <div className=" grid grid-rows-5 gap-5">
            <Link href={"/quebec-tax-calculator"} className="text-gray-500 text-sm">
              {t('discover_insights.navbar.tools.quebec_tax_calculator')}
            </Link>
            <Link href={"/morgage-calculator"} className="text-gray-500 text-sm">
              {t('discover_insights.navbar.tools.mortgage_calculator')}
            </Link>
            <Link href={"/salary-guide"} className="text-gray-500 text-sm">
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

