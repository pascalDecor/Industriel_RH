"use client";

import Button from "@/components/ui/button";
import { SectionProps } from "@/models/props";
import { Section } from "@/models/section";
import { Sector } from "@/models/sector";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { LocalStorageHelper } from "@/utils/localStorage.helper";
import Image from 'next/image';
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import SalaryGuide from "./components/SalaryGuide";
import { useTranslation } from "@/contexts/LanguageContext";
import { useDynamicTranslation } from "@/hooks/useDynamicTranslation";
import HiringTrendsArticles from "@/components/articles/HiringTrendsArticles";

export default function QuebecTaxCalculator() {
  const { t } = useTranslation();
  const { translateFunction } = useDynamicTranslation();
  const [sector, setSector] = useState<Sector | undefined>(undefined);
  const [section2, setSection2] = useState<Section | undefined>(undefined);

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 10 }, (_, i) => `${currentYear - i}`);


  useEffect(() => {
    const data = LocalStorageHelper.getValue("activeSector");
    if (data) {
      const temp = JSON.parse(LocalStorageHelper.getValue("activeSector") ?? "{}");
      const tempSector = Sector.fromJSON(temp as SectionProps);
      setSector(tempSector);
    } else {
      redirect("/");
    }
  }, []);

  useEffect(() => {
    if (sector) {
      setSection2(sector.sections.find(s => s.slug === "consulting_solutions_section_2"));
    }
  }, [sector]);

  return <>
    {/* Discover Your Value */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-5 items-center gap-4 mt-10">
        <div className="lg:col-span-3 col-span-12  pr-4">
          <Image loading="lazy" src={imagePathFinder.salaryIQ} className="h-8 w-auto" alt="Salary Net" />
          <h2 className="text-3xl font-semibold text mb-5 text-gray-800">
            {t('salary_guide.hero.title')}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {t('salary_guide.hero.description')}
          </p>
        </div>
        <div className="lg:col-span-2 col-span-12">
          <Image loading="lazy" src={imagePathFinder.salary_guide_page} alt="Salary Guide" />
        </div>
      </div>
    </section>

    {/*  Quebec Tax Calculator   */}
    <section className="mx-auto w-lvw mb-10 px-10 py-24 bg-gray-200">
      <div className="mx-auto max-w-5xl" >
        <SalaryGuide />
      </div>
    </section>

    <section>
      <div>
        <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
          {t('find_jobs.how_help.title')}
        </h2>

        <div className="max-w-5xl mb-10 mx-auto grid grid-cols-2 gap-10 text-left">
          <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
            <p className="text-sm font-regular text-gray-500 font-bold mb-3">
              {t('find_jobs.upload_resume.title')}
            </p>
            <p className="text-sm font-regular text-gray-500 ">
              {t('find_jobs.upload_resume.description')}
            </p>
            <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-5 !rounded-full text-sm">
              {t('find_jobs.upload_resume.button')}
            </Button>
          </div>
          <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
            <p className="text-sm font-regular text-gray-500 font-bold mb-3">
              {t('find_jobs.search_jobs.title')}
            </p>
            <p className="text-sm font-regular text-gray-500 ">
              {t('find_jobs.search_jobs.description')}
            </p>
            <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-5 !rounded-full text-sm">
              {t('find_jobs.search_jobs.button')}
            </Button>
          </div>
          <div className="col-span-2 text-center">
            <Button variant="dark" size="md" onClick={() => redirect("/contact")} className="mt-5 mx-auto text-center !rounded-full text-sm">
              {t('nav.contact')}
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto w-5xl mb-10 p-10">
      <div className="w-full bg-blue-900  bg-[url(/images/bg_blue.png)] bg-cover bg-center py-15 px-20 rounded-4xl border">
        <div className="grid grid-cols-6 w-full text-white">
          <div className="col-span-3">
            <p className="text-sm font-bold text text-start mb-4">
              {t('salary_guide.trending_jobs.title')}
            </p>
            <div className="grid grid-cols-4 mb-4">
              {sector && sector?.functions.map((f) =>
                <div key={f.id} className="col-span-2">
                  <p className="text-sm font-light text text-start mb-4 underline">
                    {translateFunction(f)}
                  </p>
                </div>
              )}
            </div>
            <Button variant="light" size="md" onClick={() => redirect("/discover-insights#refine_your_focus")} className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex px-5  mt-10">
              {t('salary_guide.trending_jobs.and_many_more')}
              <div className="bg-blue-700 p-1 rounded-full ml-3">
                <FiArrowRight className="text-white" />
              </div>
            </Button>
          </div>
          <div className="col-span-3 p-0">
            <Image loading="lazy" src={section2?.image || imagePathFinder.trending_job_titles} width={500} height={500} alt="  We Source the Talent" className=" mb-4 mx-auto" />
          </div>
        </div>

      </div>
    </section>


    <section className="mx-auto w-lvw mb-10 p-10 ">

      <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
        {t('salary_guide.hiring_trends.title')}
      </h2>
      {/* Articles sur les tendances de l'embauche */}
      <HiringTrendsArticles limit={4} />
    </section>
  </>
}