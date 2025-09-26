
"use client";

import dynamic from "next/dynamic";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from 'next/image';

import { FiArrowRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Sector } from "@/models/sector";
import { LocalStorageHelper } from "@/utils/localStorage.helper";
import { Section } from "@/models/section";
import { SectionProps } from "@/models/props";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";

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
    const data = LocalStorageHelper.getValue("activeSector");
    if (data) {
      const temp = JSON.parse(LocalStorageHelper.getValue("activeSector") ?? "{}");
      const tempSector = Sector.fromJSON(temp as SectionProps);
      setSector(tempSector);
    } else {
      router.push("/");
    }
  }, []);

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
    console.log("Clic !");
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

  return <>
    {/*Your Partner for Manufacturing Workforce Solutions */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-5 items-center gap-4 mt-10">
        <div className="lg:col-span-3 col-span-12  pr-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {isFrench ? section1?.libelle : section1?.libelle_en}
          </h2>
          <div className="text-gray-500 text-sm mb-5">
            <EditorContent content={isFrench ? section1?.description : section1?.description_en} />
          </div>
        </div>
        <div className="lg:col-span-2 col-span-12">
          <Image loading="lazy" src={section1?.image || imagePathFinder.your_partner_for_manufacturing_workforce_solutions} width={500} height={500} alt="Your Partner for Manufacturing Workforce Solutions" />
        </div>
      </div>
    </section>

    <div className="flex items-center justify-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 py-3 px-8 cursor-pointer rounded-t-xl transition-all ${activeTab === tab.id ? "bg-blue-800 font-bold text-white" : "text-gray-700 bg-gray-100"
            }`}
        >
          <span className="text-sm">{tab.label}</span>
        </button>
      ))}
    </div>
    {/* Ready to hire? We're ready to help  */}
    {
      <section className="mx-auto w-full mb-0 px-10 py-24 bg-gray-200">

        {activeTab === "0" ?
          <div>
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
              {t('consulting.ready_to_hire.title')}
            </h2>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-2 gap-10 text-left">
              <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
                <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                  {t('hire_talent.solutions.outsourced.title')}
                </p>
                <p className="text-sm font-regular text-gray-500 ">
                  {t('hire_talent.solutions.outsourced.description')}
                </p>
                <Button variant="primary" size="md" onClick={() => router.push("/hire-talent#recruitment_by_outsourcing")} className="mt-5 !rounded-full text-sm">
                  {t('button.learn_more')}
                </Button>
              </div>
              <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
                <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                  {t('hire_talent.solutions.international.title')}
                </p>
                <p className="text-sm font-regular text-gray-500 ">
                  {t('hire_talent.solutions.international.description')}
                </p>
                <Button variant="primary" size="md" onClick={() => router.push("/hire-talent#international_recruitment")} className="mt-5 !rounded-full text-sm">
                  {t('button.learn_more')}
                </Button>
              </div>
              <div className="col-span-2 text-center">
                <Button variant="dark" size="md" onClick={() => router.push("/contact")} className="mt-5 mx-auto text-center !rounded-full text-sm">
                  {t('nav.contact')}
                </Button>
              </div>
            </div>
          </div> :
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
                <Button variant="primary" size="md" onClick={() => router.push("#move_your_career_forward")} className="mt-5 !rounded-full text-sm">
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
                <Button variant="primary" size="md" onClick={() => router.push("#move_your_career_forward")} className="mt-5 !rounded-full text-sm">
                  {t('find_jobs.search_jobs.button')}
                </Button>
              </div>
              <div className="col-span-2 text-center">
                <Button variant="dark" size="md" onClick={handleClick} className="mt-5 mx-auto text-center !rounded-full text-sm">
                  {t('nav.contact')}
                </Button>
              </div>
            </div>
          </div>}


        <section className="mx-auto w-5xl mb-10 p-10">
          <div className="w-full bg-blue-900  bg-[url(/images/bg_blue.png)] bg-cover bg-center py-15 px-20 rounded-4xl border">
            <div className="grid grid-cols-6 w-full text-white">
              <div className="col-span-3">
                <p className="text-sm font-bold text text-start mb-4">
                  {t('specialized_talent.trending_jobs')}
                </p>
                <div className="grid grid-cols-4 mb-4">
                  {sector && sector?.functions.map((f) =>
                    <div key={f.id} className="col-span-2">
                      <p className="text-sm font-light text text-start mb-4 underline">
                        {isFrench ? f.libelle : f.libelle_en}
                      </p>
                    </div>
                  )}
                </div>
                <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex px-5  mt-10">
                  {t('consulting.and_many_more')}
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

    <section>

      <div className="flex mb-10 mt-20 mx-auto items-center justify-center">
        {tabsType.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabType(tab.id)}
            className={`flex flex-col items-center gap-1 py-3 px-3 cursor-pointer  transition-all ${activeTabType === tab.id ? "text-xl font-bold text-black uppercase" : "text-gray-500 bg-gray-100 text-sm"
              }`}
          >
            <span>{isFrench ? tab.label : tab.label_en}</span>
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



    {/*Leading agency for manufacturing workforce solutions */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-6 items-center gap-4 mt-10">
        <div className="lg:col-span-3 col-span-6">
          <Image loading="lazy" src={section3?.image || imagePathFinder.leading_agency_for_manufacturing_workforce_solutions} width={500} height={500} alt={section3?.libelle ?? "Leading agency for manufacturing workforce solutions"} />
        </div>
        <div className="lg:col-span-3 col-span-6  pl-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {isFrench ? section3?.libelle : section3?.libelle_en}
          </h2>
          <div className="text-gray-500 text-sm mb-5">
            <EditorContent content={isFrench ? section3?.description : section3?.description_en} />
          </div>
        </div>
      </div>
    </section>
    <div className="absolute mt-100" id="move_your_career_forward"></div>
    <div className="flex items-center justify-center">
      {tabsForm.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTabForm(tab.id)}
          className={`flex flex-col items-center gap-1 py-3 px-8 cursor-pointer rounded-t-xl transition-all ${activeTabForm === tab.id ? "bg-blue-800 font-bold text-white" : "text-gray-700 bg-gray-100"
            }`}
        >
          <span className="text-sm">{tab.label}</span>
        </button>
      ))}
    </div>

    {activeTabForm === "1" ? <MoveYourCareerForward /> :
      <HiringRequest />}

    {/*  Explore success stories   */}
    <ExploreSuccessStories className="bg-white" />


    <section className="mx-auto w-lvw mb-10 p-10 ">

      <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
        {t('consulting.hiring_trends.title')}
      </h2>


      <HiringTrendsArticles limit={4} />
    </section>
  </>
}