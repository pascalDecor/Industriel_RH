"use client";

import Link from "next/link";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Button from "../ui/button";
import { redirect } from "next/navigation";
import { Sector } from "@/models/sector";
import { LoadingSpinner } from "@/lib/load.helper";
import { useTranslation } from "@/contexts/LanguageContext";
import { useState } from "react";


export function HireTalentExpandedNavbar({ sectors }: { sectors: Sector[] }) {
  const { t, language } = useTranslation();

  const [isFrench, setIsFrench] = useState(language === 'fr');

  return (
    <div className="lg:flex grid grid-cols-12 gap-10 lg:px-10 mb-5 justify-between items-start w-7xl mx-auto">
      <div className="col-span-3 lg:w-3/12">
        <div className="bg-white shadow-lg rounded-2xl p-5 w-full text-start">
          <Image loading="lazy" src={imagePathFinder.hire_talent} alt="logo" className="w-1/2" />
          <p className="text-gray-700 text-sm mb-5 font-semibold">
            {t('hire_talent.nav.description')}
          </p>
          <Button variant="primary" size="md" onClick={() => redirect("/hire-talent")} className="!rounded-full text-sm px-10">
            {t('hire_talent.nav.find_talents')}
          </Button>
        </div>
      </div>
      <div className="col-span-2 lg:w-3/12">
        <div className="p-5 w-full">
          <p className="text-gray-500 text-sm font-bold mb-5">
            {t('hire_talent.nav.staffing')}
          </p>
          <Link href={"/hire-talent#recruitment_by_outsourcing"} className="text-gray-500 text-sm mb-5">
            {t('hire_talent.nav.recruitment_outsourcing')}
          </Link>
          <br />
          <Link href={"/hire-talent#international_recruitment"} className="text-gray-500 text-sm mb-5">
            {t('hire_talent.nav.international_recruitment')}
          </Link>
        </div>
      </div>
      <div className="col-span-2 lg:w-3/12">
        <div className="p-5 w-fit bg-blue-50 shadow-lg rounded-2xl grid grid-rows-5 gap-5 float-right">
          {sectors.length > 0 ? sectors.map((sector) => (
            <Link key={sector.id} href={"/find-jobs"} className="text-gray-500 text-sm">
              {isFrench ? sector.libelle : sector.libelle_en}
            </Link>
          )) : <LoadingSpinner color="#0F766E"></LoadingSpinner>}
        </div>
      </div>
    </div>
  );
}

