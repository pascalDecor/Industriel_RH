"use client";

import { DynamicImage } from "@/components/ui/DynamicImage";
import Button from "../ui/button";
import { redirect } from "next/navigation";
import { Sector } from "@/models/sector";
import { LoadingSpinner } from "@/lib/load.helper";
import { LocalStorageHelper } from "@/utils/localStorage.helper";
import { useTranslation } from "@/contexts/LanguageContext";
import { useDynamicTranslation } from "@/hooks/useDynamicTranslation";
import { useState } from "react";


export function ConsultingSolutionsExpandedNavbar({ sectors }: { sectors: Sector[] }) {
  const { t, language } = useTranslation();
  const [isFrench, setIsFrench] = useState(language === 'fr');
  const { translateSector } = useDynamicTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-6 lg:px-10 mb-5 max-w-7xl mx-auto">
      <div className="lg:col-span-4 w-full">
        <div className="bg-white shadow-lg rounded-2xl p-5 w-full">
          <DynamicImage imageKey="consulting_solutions" alt="Consulting solutions" className="w-1/2 md:w-2/5 mb-3" />
          <p className="text-gray-500 text-sm mb-5">
            {t('consulting.navbar.description')}
          </p>
          <Button variant="primary" size="md" onClick={() => redirect("/contact")} className="!rounded-full text-sm px-10">
            {t('nav.contact')}
          </Button>
        </div>
      </div>

      <div className="lg:col-span-8 w-full">
        <div className="p-5 w-full bg-blue-50 shadow-lg rounded-2xl">
          <p className="text-blue-900 text-sm font-bold mb-4 uppercase">
            {t('footer.areas_expertise')}
          </p>
          <div className="flex flex-col gap-5">
            {sectors.length > 0 ? sectors.map((sector) => (
              <a onClick={() => LocalStorageHelper.setValue("activeSector", JSON.stringify(sector.toJSON()))} key={sector.id} href={`/consulting-solutions`} className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
                <p className="text-gray-500 text-sm font-bold mb-2">
                  {isFrench ? sector.libelle : sector.libelle_en}
                </p>
                <p className="text-gray-500 text-sm">
                  {isFrench ? sector.description : sector.description_en}
                </p>
              </a>
            )) : <LoadingSpinner color="#0F766E"></LoadingSpinner>}
          </div>
        </div>
      </div>
    </div>
  );
}

