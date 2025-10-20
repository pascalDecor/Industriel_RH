"use client";

import Button from "@/components/ui/button";
import { SectionProps } from "@/models/props";
import { Section } from "@/models/section";
import { Sector } from "@/models/sector";

import { LocalStorageHelper } from "@/utils/localStorage.helper";
import Image from 'next/image';
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import MorgageCalculator from "./components/Calculator";
import HiringTrendsArticles from "@/components/articles/HiringTrendsArticles";
import { useTranslation } from "@/contexts/LanguageContext";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { DynamicImage } from "@/components/ui/DynamicImage";

export default function QuebecTaxCalculator() {
  const { t } = useTranslation();
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
    {/* Calculate your Morgage Payment */}
    <section className="mx-auto max-w-5xl mb-10 px-4 md:px-6 lg:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 mt-10">
        <div className="lg:col-span-3 lg:pr-4">
          <DynamicImage imageKey="mortgage_calc" alt="Salary Net" className="h-8 w-auto" />
          <h2 className="text-2xl md:text-3xl font-semibold text mb-5 text-gray-800">
            {t('mortgage_calculator.title')}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {t('mortgage_calculator.description')}
          </p>
        </div>
        <div className="lg:col-span-2 h-full">
          <DynamicImage imageKey="morgage_calculator"   alt="Mortgage Calculator"  />
        </div>
      </div>
    </section>

    {/*  Mortgage Calculator   */}
    <section className="mx-auto w-full mb-10 px-4 md:px-6 lg:px-10 py-16 md:py-24 bg-gray-200">
      <div className="mx-auto max-w-5xl" >
        <MorgageCalculator />
      </div>
    </section>

    <section className="px-4 md:px-6 lg:px-10 py-10">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text mb-10 md:mb-20 text-black text-center">
          {t('mortgage_calculator.help_section.title')}
        </h2>

        <div className="max-w-5xl mb-10 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-left">
          <div className="bg-white rounded-lg p-6 md:p-10 shadow-lg">
            <p className="text-sm font-regular text-gray-500 font-bold mb-3">
              {t('mortgage_calculator.help_section.upload_resume.title')}
            </p>
            <p className="text-sm font-regular text-gray-500 ">
              {t('mortgage_calculator.help_section.upload_resume.description')}
            </p>
            <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-5 !rounded-full text-sm">
              {t('mortgage_calculator.help_section.upload_resume.button')}
            </Button>
          </div>
          <div className="bg-white rounded-lg p-6 md:p-10 shadow-lg">
            <p className="text-sm font-regular text-gray-500 font-bold mb-3">
              {t('mortgage_calculator.help_section.search_jobs.title')}
            </p>
            <p className="text-sm font-regular text-gray-500 ">
              {t('mortgage_calculator.help_section.search_jobs.description')}
            </p>
            <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-5 !rounded-full text-sm">
              {t('mortgage_calculator.help_section.search_jobs.button')}
            </Button>
          </div>
          <div className="md:col-span-2 text-center">
            <Button variant="dark" size="md" onClick={() => redirect("/contact")} className="mt-5 mx-auto text-center !rounded-full text-sm">
              {t('mortgage_calculator.help_section.contact_button')}
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-5xl mb-10 px-4 md:px-6 lg:px-10 py-10">
      <div className="w-full bg-blue-900 bg-[url(/images/bg_blue.png)] bg-cover bg-center py-10 md:py-15 px-6 md:px-12 lg:px-20 rounded-2xl md:rounded-4xl border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full text-white">
          <div>
            <p className="text-sm font-bold text text-start mb-4">
              {t('mortgage_calculator.trending_jobs.title')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {sector && sector?.functions.map((f) =>
                <div key={f.id}>
                  <p className="text-sm font-light text text-start mb-2 underline">
                    {f.libelle}
                  </p>
                </div>
              )}
            </div>
            <Button variant="light" size="md" onClick={() => redirect("/discover-insights#refine_your_focus")} className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex items-center px-5 mt-6 md:mt-10">
              {t('mortgage_calculator.trending_jobs.more_button')}
              <div className="bg-blue-700 p-1 rounded-full ml-3">
                <FiArrowRight className="text-white" />
              </div>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            {section2?.image ? (
              <Image loading="lazy" src={section2.image} width={500} height={500} alt="We Source the Talent" className="mb-4 mx-auto max-w-full h-auto" />
            ) : (
              <DynamicImage imageKey="trending_job_titles" alt="We Source the Talent" className="mb-4 mx-auto max-w-full h-auto" />
            )}
          </div>
        </div>
      </div>
    </section>


    <section className="mx-auto w-full mb-10 px-4 md:px-6 lg:px-10 py-10">
      <h2 className="text-2xl md:text-3xl font-semibold text mb-10 md:mb-20 text-black text-center">
        {t('salary_guide.hiring_trends.title')}
      </h2>
      <HiringTrendsArticles limit={4} />
    </section>
  </>
}