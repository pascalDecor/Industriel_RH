
"use client";

import dynamic from "next/dynamic";
import { DynamicImage } from "@/components/ui/DynamicImage";
import { SectionImagePreview } from "@/app/(admin)/management/secteurs/[id]/sections/updateComponent";

import { FiArrowRight } from "react-icons/fi";
import { Users, FileText, Rocket, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Sector } from "@/models/sector";
import { Section } from "@/models/section";
import { SectionProps } from "@/models/props";
import { useRouter } from "next/navigation";
import { LocalStorageHelper } from "@/utils/localStorage.helper";
import { useTranslation } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";

const EditorContent = dynamic(() => import("@/components/ui/editorContent"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-4 rounded" />
});

const Button = dynamic(() => import("@/components/ui/button"), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-full h-10 w-32" />
});

const ExploreSuccessStories = dynamic(() => import("@/components/ExploreSuccessStories"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const MoveYourCareerForward = dynamic(() => import("./components/move-your-career-forward"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const HiringRequest = dynamic(() => import("./components/hiring-request"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const DynamicArticlesGrid = dynamic(() => import("@/components/articles/DynamicArticlesGrid"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const HiringTrendsArticles = dynamic(() => import("@/components/articles/HiringTrendsArticles"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});




export default function ConsultingSolutions() {
  const { t, language } = useTranslation();
  const [isFrench, setIsFrench] = useState(language === 'fr');
  const [sector, setSector] = useState<Sector | undefined>(undefined);
  const [section1, setSection1] = useState<Section | undefined>(undefined);
  const [section2, setSection2] = useState<Section | undefined>(undefined);
  const [section3, setSection3] = useState<Section | undefined>(undefined);

  const router = useRouter();


  useEffect(() => {
    // Priorité 1 : secteur choisi dans la navbar (localStorage)
    const stored = LocalStorageHelper.getValue("activeSector");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.id) {
          setSector(Sector.fromJSON(parsed as SectionProps));
          return;
        }
      } catch {
        // JSON invalide, on continue vers le défaut API
      }
    }

    // Priorité 2 : secteur par défaut (API) quand on arrive sans avoir cliqué sur un secteur
    fetch("/api/sectors/default-consulting-solutions")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((json) => {
        if (json) {
          setSector(Sector.fromJSON(json as SectionProps));
        } else {
          router.push("/");
        }
      })
      .catch(() => router.push("/"));
  }, [router]);

  useEffect(() => {
    if (sector) {
      setSection1(sector.sections.find(s => s.slug === "consulting_solutions_section_1"));
      setSection2(sector.sections.find(s => s.slug === "consulting_solutions_section_2"));
      setSection3(sector.sections.find(s => s.slug === "consulting_solutions_section_3"));
    }
  }, [sector]);

  useEffect(() => {
    setIsFrench(language === 'fr');
  }, [language]);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch('/api/sectors?limit=10');
        const result = await response.json();
        if (result.data) {
          const sectorTabs = result.data.map((sector: any, index: number) => ({
            id: index.toString(),
            label: sector.libelle.toLowerCase(),
            label_en: sector.libelle_en.toLowerCase(),
            sectorId: sector.id,
            sectorName: sector.libelle
          }));
          setTabsType(sectorTabs);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des secteurs:', error);
      }
    };
    fetchSectors();
  }, []);

  function handleClick() {
    if (sector?.isDefaultConsultingSolutions) {
      router.push('/contact');
    } else {
      router.push('/discover-insights#refine_your_focus');
    }
  }

  const tabs = [
    { id: "0", label: t('consulting.tabs.looking_to_hire') },
    { id: "1", label: t('consulting.tabs.looking_for_job') },
  ];

  const tabsForm = [
    { id: "0", label: t('consulting.tabs.looking_to_hire') },
    { id: "1", label: t('consulting.tabs.looking_for_job') },
  ];

  const [tabsType, setTabsType] = useState([
    { id: "0", label: t('sectors.construction'), label_en: t('sectors.construction') },
    { id: "1", label: t('sectors.manufacturing'), label_en: t('sectors.manufacturing') },
    { id: "2", label: t('sectors.healthcare'), label_en: t('sectors.healthcare') },
  ]);

  const [activeTab, setActiveTab] = useState("0");
  const [activeTabType, setActiveTabType] = useState("1");
  const [activeTabForm, setActiveTabForm] = useState("0");
  const [ctaModal, setCtaModal] = useState<"growth" | "process" | "performance" | null>(null);
  const [hasRecentArticles, setHasRecentArticles] = useState(false);

  useEffect(() => {
    const checkArticles = async () => {
      try {
        const res = await fetch('/api/articles?limit=1&published=true');
        const data = await res.json();
        setHasRecentArticles(Array.isArray(data.data) && data.data.length > 0);
      } catch {
        setHasRecentArticles(false);
      }
    };
    checkArticles();
  }, []);

  return <>
    {/*Your Partner for Manufacturing Workforce Solutions */}
    <section className="mx-auto max-w-5xl mb-10 px-4 sm:px-6 lg:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 lg:gap-4 mt-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-3 lg:pr-4"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text mb-8 sm:mb-14 text-gray-800">
            {isFrench ? section1?.libelle : section1?.libelle_en}
          </h2>
          <div className="text-gray-500 text-sm mb-5">
            <EditorContent content={isFrench ? section1?.description : section1?.description_en} />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <SectionImagePreview image={section1?.image} alt={`Your Partner for ${section1?.libelle ?? ""} Workforce Solutions`} width={500} height={500} className="mb-4 mx-auto max-w-full h-auto" />
        </motion.div>
      </div>
    </section>

    {/* Section CTA expertise + 3 colonnes + subventions */}
    <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-lg sm:text-xl text-black font-medium mb-12 sm:mb-16 leading-relaxed max-w-4xl mx-auto">
          {t('consulting.cta.expertise')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {/* Colonne 1 : Propulsez votre croissance */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setCtaModal("growth")}
            onKeyDown={(e) => e.key === "Enter" && setCtaModal("growth")}
            className="flex flex-col rounded-lg overflow-hidden shadow-md border border-gray-100 cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all"
          >
            <div className="bg-blue-800 px-5 py-6 text-white">
              <h3 className="text-xl font-bold uppercase tracking-tight leading-tight text-center">
                {t('consulting.cta.growth.title').split(' ').slice(0, 1).join(' ')}
              </h3>
              <h3 className="text-lg font-bold uppercase tracking-tight text-center">
                {t('consulting.cta.growth.title').split(' ').slice(1).join(' ')}
              </h3>
            </div>
            <div className="bg-white p-6 flex-1">
              <p className="text-blue-700/90 text-sm font-medium mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 shrink-0" />
                {t('consulting.cta.growth.subtitle')}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-800 shrink-0 mt-0.5" />
                    <span>{t(`consulting.cta.growth.item${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Colonne 2 : Simplifiez vos processus */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setCtaModal("process")}
            onKeyDown={(e) => e.key === "Enter" && setCtaModal("process")}
            className="flex flex-col rounded-lg overflow-hidden shadow-md border border-gray-100 cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all"
          >
            <div className="bg-blue-800 px-5 py-6 text-white">
              <h3 className="text-xl font-bold uppercase tracking-tight leading-tight text-center">
                {t('consulting.cta.process.title').split(' ').slice(0, 1).join(' ')}
              </h3>
              <h3 className="text-lg font-bold uppercase tracking-tight text-center">
                {t('consulting.cta.process.title').split(' ').slice(1).join(' ')}
              </h3>
            </div>
            <div className="bg-white p-6 flex-1">
              <p className="text-blue-700/90 text-sm font-medium mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 shrink-0" />
                {t('consulting.cta.process.subtitle')}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-800 shrink-0 mt-0.5" />
                    <span>{t(`consulting.cta.process.item${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Colonne 3 : Optimisez la performance */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setCtaModal("performance")}
            onKeyDown={(e) => e.key === "Enter" && setCtaModal("performance")}
            className="flex flex-col rounded-lg overflow-hidden shadow-md border border-gray-100 cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all"
          >
            <div className="bg-blue-800 px-5 py-6 text-white">
              <h3 className="text-xl font-bold uppercase tracking-tight leading-tight text-center">
                {t('consulting.cta.performance.title').split(' ').slice(0, 1).join(' ')}
              </h3>
              <h3 className="text-lg font-bold uppercase tracking-tight text-center">
                {t('consulting.cta.performance.title').split(' ').slice(1).join(' ')}
              </h3>
            </div>
            <div className="bg-white p-6 flex-1">
              <p className="text-blue-700/90 text-sm font-medium mb-4 flex items-center gap-2">
                <Rocket className="h-5 w-5 shrink-0" />
                {t('consulting.cta.performance.subtitle')}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-800 shrink-0 mt-0.5" />
                    <span>{t(`consulting.cta.performance.item${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-center text-lg sm:text-xl text-black font-medium mb-12 sm:mb-16 leading-relaxed max-w-4xl mx-auto">
            {t('consulting.cta.grants')}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push('/contact')}
            className="!rounded-full mx-auto font-bold uppercase tracking-wide px-8 py-3 border border-blue-800/80"
          >
            {t('consulting.cta.button')}
          </Button>
        </div>
      </div>
    </section>

    {/* Modal CTA (Propulsez / Simplifiez / Optimisez) */}
    {ctaModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={() => setCtaModal(null)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cta-modal-title"
      >
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-800 text-white shrink-0">
            <h2 id="cta-modal-title" className="text-lg font-bold uppercase">
              {ctaModal === "growth" && t('consulting.cta.growth.title')}
              {ctaModal === "process" && t('consulting.cta.process.title')}
              {ctaModal === "performance" && t('consulting.cta.performance.title')}
            </h2>
            <button
              type="button"
              onClick={() => setCtaModal(null)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-6 space-y-4">
            {ctaModal === "growth" && [1, 2, 3, 4, 5].map((i) => (
              <p
                key={i}
                className={
                  i === 1 ? "text-base sm:text-lg font-semibold text-gray-800 leading-relaxed" :
                  i === 4 ? "text-sm sm:text-base font-semibold text-blue-800 leading-relaxed" :
                  i === 5 ? "text-sm text-gray-600 italic leading-relaxed" :
                  "text-sm sm:text-base text-gray-700 leading-relaxed"
                }
              >
                {t(`consulting.cta.growth.modal.p${i}`)}
              </p>
            ))}
            {ctaModal === "process" && [1, 2, 3, 4, 5].map((i) => (
              <p
                key={i}
                className={
                  i === 1 ? "text-base sm:text-lg font-semibold text-gray-800 leading-relaxed" :
                  i === 5 ? "text-sm text-gray-600 italic leading-relaxed" :
                  "text-sm sm:text-base text-gray-700 leading-relaxed"
                }
              >
                {t(`consulting.cta.process.modal.p${i}`)}
              </p>
            ))}
            {ctaModal === "performance" && [1, 2, 3, 4, 5].map((i) => (
              <p
                key={i}
                className={
                  i === 1 ? "text-base sm:text-lg font-semibold text-gray-800 leading-relaxed" :
                  i === 4 ? "text-sm sm:text-base font-semibold text-blue-800 leading-relaxed" :
                  i === 5 ? "text-sm text-gray-600 italic leading-relaxed" :
                  "text-sm sm:text-base text-gray-700 leading-relaxed"
                }
              >
                {t(`consulting.cta.performance.modal.p${i}`)}
              </p>
            ))}
          </div>
          <div className="px-6 py-4 border-t shrink-0 flex justify-center">
            <Button
              variant="primary"
              size="md"
              onClick={() => { setCtaModal(null); router.push('/contact'); }}
              className="!rounded-full font-bold uppercase w-full sm:w-auto"
            >
              {t('consulting.cta.button')}
            </Button>
          </div>
        </div>
      </div>
    )}

    <div className="flex items-center justify-center px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 py-2 sm:py-3 px-4 sm:px-8 cursor-pointer rounded-t-xl transition-all ${activeTab === tab.id ? "bg-blue-800 font-bold text-white" : "text-gray-700 bg-gray-100"
            }`}
        >
          <span className="text-xs sm:text-sm whitespace-nowrap">{tab.label}</span>
        </button>
      ))}
    </div>
    {/* Ready to hire? We're ready to help  */}
    {
      <section className="mx-auto w-full mb-0 px-4 sm:px-6 lg:px-10 py-16 sm:py-24 bg-gray-200">

        {activeTab === "0" ?
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-semibold text mb-12 sm:mb-20 text-black text-center"
            >
              {t('consulting.ready_to_hire.title')}
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
                className="bg-white rounded-lg p-6 sm:p-10 shadow-lg"
              >
                <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                  {t('hire_talent.solutions.outsourced.title')}
                </p>
                <p className="text-sm font-regular text-gray-500 ">
                  {t('hire_talent.solutions.outsourced.description')}
                </p>
                <Button variant="primary" size="md" onClick={() => router.push("/hire-talent#recruitment_by_outsourcing")} className="mt-5 !rounded-full text-sm w-full sm:w-auto">
                  {t('button.learn_more')}
                </Button>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                }}
                className="bg-white rounded-lg p-6 sm:p-10 shadow-lg"
              >
                <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                  {t('hire_talent.solutions.international.title')}
                </p>
                <p className="text-sm font-regular text-gray-500 ">
                  {t('hire_talent.solutions.international.description')}
                </p>
                <Button variant="primary" size="md" onClick={() => router.push("/hire-talent#international_recruitment")} className="mt-5 !rounded-full text-sm w-full sm:w-auto">
                  {t('button.learn_more')}
                </Button>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                }}
                className="md:col-span-2 text-center"
              >
                <Button variant="dark" size="md" onClick={() => router.push("/contact")} className="mt-5 mx-auto text-center !rounded-full text-sm w-full sm:w-auto">
                  {t('consulting.cta.button')}
                </Button>
              </motion.div>
            </motion.div>
          </div> :
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-semibold text mb-12 sm:mb-20 text-black text-center"
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
                className="bg-white rounded-lg p-6 sm:p-10 shadow-lg"
              >
                <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                  {t('find_jobs.upload_resume.title')}
                </p>
                <p className="text-sm font-regular text-gray-500 ">
                  {t('find_jobs.upload_resume.description')}
                </p>
                <Button variant="primary" size="md" onClick={() => router.push("#move_your_career_forward")} className="mt-5 !rounded-full text-sm w-full sm:w-auto">
                  {t('find_jobs.upload_resume.button')}
                </Button>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                }}
                className="bg-white rounded-lg p-6 sm:p-10 shadow-lg"
              >
                <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                  {t('find_jobs.search_jobs.title')}
                </p>
                <p className="text-sm font-regular text-gray-500 ">
                  {t('find_jobs.search_jobs.description')}
                </p>
                <Button variant="primary" size="md" onClick={() => router.push("#move_your_career_forward")} className="mt-5 !rounded-full text-sm w-full sm:w-auto">
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
                <Button variant="dark" size="md" onClick={handleClick} className="mt-5 mx-auto text-center !rounded-full text-sm w-full sm:w-auto">
                  {t('consulting.cta.button')}
                </Button>
              </motion.div>
            </motion.div>
          </div>}


        <section className="mx-auto max-w-5xl mb-10 px-4 sm:px-6 lg:px-10 py-10">
          <div className="w-full bg-blue-900 bg-[url(/images/bg_blue.png)] bg-cover bg-center py-8 sm:py-12 lg:py-15 px-6 sm:px-10 lg:px-20 rounded-2xl sm:rounded-4xl border">
            <div className="grid grid-cols-1 lg:grid-cols-6 w-full text-white gap-6 lg:gap-0">
              <div className="lg:col-span-3">
                <p className="text-sm font-bold text text-start mb-4">
                  {sector?.isDefaultConsultingSolutions ? "NOS SECTEURS D’ACTIVITÉS": t('specialized_talent.trending_jobs')}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 mb-4 gap-2">
                  {sector && sector?.functions.map((f) =>
                    <div key={f.id} className="col-span-1 sm:col-span-2">
                      <p className="text-sm font-light text text-start mb-4 underline">
                        {isFrench ? f.libelle : f.libelle_en}
                      </p>
                    </div>
                  )}
                </div>
                <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex items-center px-5 mt-6 sm:mt-10 w-full sm:w-auto justify-center sm:justify-start">
                  {sector?.isDefaultConsultingSolutions ? t('consulting.cta.button') : t('consulting.and_many_more')}
                  <div className="bg-blue-700 p-1 rounded-full ml-3">
                    <FiArrowRight className="text-white" />
                  </div>
                </Button>
              </div>
              <div className="lg:col-span-3 p-0 flex items-center justify-center">
                <SectionImagePreview image={section2?.image} alt="  We Source the Talent" width={500} height={500} className="mb-4 mx-auto max-w-full h-auto" />
              </div>
            </div>

          </div>
        </section>


        {/*   Add specialized talent across your organization */}
        {/* <section className="mx-auto w-5xl mb-10 p-10">
          <div className="w-full bg-blue-900  bg-[url(/images/bg_blue.png)] bg-cover bg-center py-15 px-20 rounded-4xl border">
            <div className="grid grid-cols-6 w-full ">
              <div className="col-span-3">
                <p className="text-sm font-bold text text-start mb-4">
                  {t('specialized_talent.trending_jobs')}
                </p>
                <div className="grid grid-cols-4 mb-4">
                  <div className="col-span-2">
                    <p className="text-sm font-light text text-start mb-4 underline">
                      Welders
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-light text text-start mb-4 underline">
                      Machine Operators
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-light text text-start mb-4 underline">
                      Assemblers
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-light text text-start mb-4 underline">
                      Industrial Mechanics
                    </p>
                  </div>
                </div>
                <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex px-5  mt-10">
                  {t('consulting.and_many_more')}
                  <div className="bg-blue-700 p-1 rounded-full ml-3">
                    <FiArrowRight className="text-white" />
                  </div>
                </Button>
              </div>
              <div className="col-span-3 p-0">
                <Image loading="lazy" src={imagePathFinder.trending_job_titles} alt="  We Source the Talent" className=" mb-4 mx-auto" />
              </div>
            </div>

          </div>
        </section> */}


        {/* </section> : <section className="mx-auto w-full mb-0 px-10 py-24 bg-gray-200"> */}


        {/*   Add specialized talent across your organization */}


      </section>}

    {/* Tabs */}

    {hasRecentArticles && (
    <section>

    <h2 className="text-2xl sm:text-3xl font-semibold text my-8 sm:my-14 text-gray-800 text-center">
    {t('blog.recent_articles')}
      </h2>

      <div className="flex flex-wrap mb-10 mt-12 sm:mt-20 mx-auto items-center justify-center px-4 gap-2">
        {tabsType.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabType(tab.id)}
            className={`flex flex-col items-center gap-1 py-2 sm:py-3 px-2 sm:px-3 cursor-pointer transition-all ${activeTabType === tab.id ? "text-base sm:text-xl font-bold text-black uppercase" : "text-gray-500  text-xs sm:text-sm"
              }`}
          >
            <span className="whitespace-nowrap">{isFrench ? tab.label : tab.label_en}</span>
          </button>
        ))}
      </div>



      <DynamicArticlesGrid
        category={tabsType.find(tab => tab.id === activeTabType)?.label.toLowerCase() || "all"}
        sectorId={tabsType.find(tab => tab.id === activeTabType)?.id}
        limit={12}
        showFeaturedBlocks={true}
      />
    </section>
    )}



    {/*Leading agency for manufacturing workforce solutions */}
   { !sector?.isDefaultConsultingSolutions && <section className="mx-auto max-w-5xl mb-10 px-4 sm:px-6 lg:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-6 items-center gap-6 lg:gap-4 mt-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-3 order-2 lg:order-1"
        >
          <SectionImagePreview image={section3?.image} alt={`Leading agency for ${section3?.libelle ?? ""} Workforce Solutions`} width={500} height={500} className="mb-4 mx-auto max-w-full h-auto" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-3 lg:pl-4 order-1 lg:order-2"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text mb-8 sm:mb-14 text-gray-800">
            {isFrench ? section3?.libelle : section3?.libelle_en}
          </h2>
          <div className="text-gray-500 text-sm mb-5">
            <EditorContent content={isFrench ? section3?.description : section3?.description_en} />
          </div>
        </motion.div>
      </div>
    </section>}
    <div className="absolute mt-100" id="move_your_career_forward"></div>
    <div className="flex items-center justify-center px-4">
      {tabsForm.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTabForm(tab.id)}
          className={`flex flex-col items-center gap-1 py-2 sm:py-3 px-4 sm:px-8 cursor-pointer rounded-t-xl transition-all ${activeTabForm === tab.id ? "bg-blue-800 font-bold text-white" : "text-gray-700 bg-gray-100"
            }`}
        >
          <span className="text-xs sm:text-sm whitespace-nowrap">{tab.label}</span>
        </button>
      ))}
    </div>

    {activeTabForm === "1" ? <MoveYourCareerForward /> :
      <HiringRequest />}

    {/*  Explore success stories   */}
    <ExploreSuccessStories className="bg-white" />


    <section className="mx-auto w-lvw mb-10 p-10 ">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl font-semibold text mb-20 text-black text-center"
      >
        {t('consulting.hiring_trends.title')}
      </motion.h2>


      <HiringTrendsArticles limit={4} />
    </section>
  </>
}