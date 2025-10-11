"use client";

import Link from "next/link";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Button from "../ui/button";
import { Sector } from "@/models/sector";
import { LoadingSpinner } from "@/lib/load.helper";
import { useTranslation } from "@/contexts/LanguageContext";
import { useState } from "react";


export function FindJobsExpandedNavbar({ sectors }: { sectors: Sector[] }) {
  const { t, language } = useTranslation();
  const [isFrench, setIsFrench] = useState(language === 'fr');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 lg:px-10 mb-5 max-w-7xl mx-auto">
      <div className="w-full">
        <div className="bg-white shadow-lg rounded-2xl p-5 w-full">
          <Image loading="lazy" src={imagePathFinder.find_jobs} alt="logo" className="w-1/2 md:w-2/5" />
          <p className="text-gray-500 text-sm mb-5">
            {t('find_jobs.nav.control_career')}
          </p>
          <Button variant="primary" size="md" onClick={() => null} className="!rounded-full text-sm px-10">
            {t('find_jobs.nav.find_next_job')}
          </Button>
        </div>
      </div>
      <div className="w-full">
        <div className="p-5 w-full">
          <p className="text-gray-500 text-sm font-bold mb-5">
            {t('find_jobs.nav.submit_cv')}
          </p>
          <a href="/find-jobs#seekers-section" className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
            {t('find_jobs.nav.explore_help')}
          </a>
        </div>
      </div>
      <div className="w-full">
        <div className="p-5 w-full bg-blue-50 shadow-lg rounded-2xl flex flex-col gap-5">
          {sectors.length > 0 ? sectors.map((sector) => (
            <Link key={sector.id} href={"/find-jobs"} className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
              { isFrench ? sector.libelle : sector.libelle_en }
            </Link>
          )) : <LoadingSpinner color="#0F766E"></LoadingSpinner>}
        </div>
      </div>
    </div>
  );
}

