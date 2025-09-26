"use client";

import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Button from "../ui/button";
import { redirect } from "next/navigation";
import { Sector } from "@/models/sector";
import { LoadingSpinner } from "@/lib/load.helper";
import { LocalStorageHelper } from "@/utils/localStorage.helper";
import { useTranslation } from "@/contexts/LanguageContext";
import { useDynamicTranslation } from "@/hooks/useDynamicTranslation";
import { useState } from "react";


export function ConsultingSolutionsExpandedNavbar({sectors}: {sectors: Sector[]}) {
  const { t, language } = useTranslation();
  const [isFrench, setIsFrench] = useState(language === 'fr');
  const { translateSector } = useDynamicTranslation();
 
  return (
    <div className="lg:flex grid grid-cols-12 gap-10 lg:px-10 mb-5 justify-between items-start w-7xl mx-auto">
      <div className="col-span-3 lg:w-3/12">
        <div className="bg-white shadow-lg rounded-2xl p-5 w-full">
          <Image loading="lazy" src={imagePathFinder.consulting_solutions} alt="logo" className="w-1/2" />
          <p className="text-gray-500 text-sm mb-5">
            {t('consulting.navbar.description')}
          </p>
          <Button variant="primary" size="md" onClick={() => redirect("/contact")} className="!rounded-full text-sm px-10">
            {t('nav.contact')}
          </Button>
        </div>
      </div>

      <div className="col-span-7 lg:w-7/12">
        <div className="p-5 w-fit bg-blue-50 shadow-lg rounded-2xl float-right">
          <p className="text-blue-900 text-sm font-bold mb-4 uppercase">
            {t('footer.areas_expertise')}
          </p>
          <div className=" grid grid-rows-5 gap-5">
            {sectors.length > 0 ? sectors.map((sector) => (
              <a onClick={() => LocalStorageHelper.setValue("activeSector", JSON.stringify(sector.toJSON()))} key={sector.id} href={`/consulting-solutions`} className="text-gray-500 text-sm">
                <p className="text-gray-500 text-sm font-bold mb-2">
                  {isFrench ? sector.libelle : sector.libelle_en}
                </p>
                <p className="text-gray-500 text-sm">
                  { isFrench ? sector.description : sector.description_en }
                </p>
              </a>
            )) : <LoadingSpinner color="#0F766E"></LoadingSpinner>}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}

