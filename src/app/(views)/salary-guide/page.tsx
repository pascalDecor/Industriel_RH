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
import SalaryGuide from "./components/SalaryGuide";
import { useTranslation } from "@/contexts/LanguageContext";
import { useDynamicTranslation } from "@/hooks/useDynamicTranslation";
import HiringTrendsArticles from "@/components/articles/HiringTrendsArticles";
import { motion } from "framer-motion";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { DynamicImage } from "@/components/ui/DynamicImage";

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
    <section className="mx-auto max-w-5xl mb-10 px-4 md:px-6 lg:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 mt-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-3 lg:pr-4"
        >
          <DynamicImage imageKey="salaryIQ" alt="Salary Net" className="h-8 w-auto" />
          <h2 className="text-2xl md:text-3xl font-semibold text mb-5 text-gray-800">
            {t('salary_guide.hero.title')}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {t('salary_guide.hero.description')}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <DynamicImage imageKey="salary_guide_page" alt="Salary Guide" />
        </motion.div>
      </div>
    </section>

    {/*  Salary Guide Calculator   */}
    <section className="mx-auto w-full mb-10 px-4 md:px-6 lg:px-10 py-16 md:py-24 bg-gray-200">
      <div className="mx-auto max-w-5xl" >
        <SalaryGuide />
      </div>
    </section>

    <section className="px-4 md:px-6 lg:px-10 py-10">
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-semibold text mb-10 md:mb-20 text-black text-center"
        >
          {t('find_jobs.how_help.title')}
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="max-w-5xl mb-10 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-left"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
            }}
            className="w-full bg-white rounded-lg p-6 md:p-10 shadow-lg"
          >
            <p className="text-sm font-regular text-gray-500 font-bold mb-3">
              {t('find_jobs.upload_resume.title')}
            </p>
            <p className="text-sm font-regular text-gray-500 ">
              {t('find_jobs.upload_resume.description')}
            </p>
            <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-5 !rounded-full text-sm">
              {t('find_jobs.upload_resume.button')}
            </Button>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
            }}
            className="w-full bg-white rounded-lg p-6 md:p-10 shadow-lg"
          >
            <p className="text-sm font-regular text-gray-500 font-bold mb-3">
              {t('find_jobs.search_jobs.title')}
            </p>
            <p className="text-sm font-regular text-gray-500 ">
              {t('find_jobs.search_jobs.description')}
            </p>
            <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-5 !rounded-full text-sm">
              {t('find_jobs.search_jobs.button')}
            </Button>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
            }}
            className="md:col-span-2 text-center"
          >
            <Button variant="dark" size="md" onClick={() => redirect("/contact")} className="mt-5 mx-auto text-center !rounded-full text-sm">
              {t('nav.contact')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>

    <section className="mx-auto max-w-5xl mb-10 px-4 md:px-6 lg:px-10 py-10">
      <div className="w-full bg-blue-900 bg-[url(/images/bg_blue.png)] bg-cover bg-center py-10 md:py-15 px-6 md:px-12 lg:px-20 rounded-2xl md:rounded-4xl border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full text-white">
          <div>
            <p className="text-sm font-bold text text-start mb-4">
              {t('salary_guide.trending_jobs.title')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {sector && sector?.functions.map((f) =>
                <div key={f.id}>
                  <p className="text-sm font-light text text-start mb-2 underline">
                    {translateFunction(f)}
                  </p>
                </div>
              )}
            </div>
            <Button variant="light" size="md" onClick={() => redirect("/discover-insights#refine_your_focus")} className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex items-center px-5 mt-6 md:mt-10">
              {t('salary_guide.trending_jobs.and_many_more')}
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

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-semibold text mb-10 md:mb-20 text-black text-center"
      >
        {t('salary_guide.hiring_trends.title')}
      </motion.h2>
      {/* Articles sur les tendances de l'embauche */}
      <HiringTrendsArticles limit={4} />
    </section>
  </>
}