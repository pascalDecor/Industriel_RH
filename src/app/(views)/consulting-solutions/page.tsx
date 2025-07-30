
"use client";

import Button from "@/components/ui/button";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from 'next/image';

import { FiArrowRight } from "react-icons/fi";
import ExploreSuccessStories from "@/components/ExploreSuccessStories";
import { useEffect, useState } from "react";
import MoveYourCareerForward from "./components/move-your-career-forward";
import HiringRequest from "./components/hiring-request";
import { Sector } from "@/models/sector";
import { LocalStorageHelper } from "@/utils/localStorage.helper";
import { Section } from "@/models/section";
import { SectionProps } from "@/models/props";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";




export default function ConsultingSolutions() {
  const { t } = useTranslation();
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

  const tabsType = [
    { id: "0", label: t('sectors.construction') },
    { id: "1", label: t('sectors.manufacturing') },
    { id: "2", label: t('sectors.healthcare') },
  ];

  const [activeTab, setActiveTab] = useState("0");
  const [activeTabType, setActiveTabType] = useState("1");
  const [activeTabForm, setActiveTabForm] = useState("0");

  return <>
    {/*Your Partner for Manufacturing Workforce Solutions */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-5 items-center gap-4 mt-10">
        <div className="lg:col-span-3 col-span-12  pr-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {section1?.libelle}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {section1?.description}
          </p>
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
                        {f.libelle}
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
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="max-w-5xl mb-10 mx-auto grid grid-cols-12 gap-4 text-left">
        <div className="col-span-3">
          <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
            <Image loading="lazy" src={imagePathFinder.card_image_1} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                {"6 Tips to Ease Hiring in Canada's Tight Labour Market"}
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                Having trouble navigating the tight labour market for hiring skilled talent in Canada? Here are six tips Canadian ...
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
            <Image loading="lazy" src={imagePathFinder.card_image_2} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                {"Starting a New Job? Don't Make These 5 Mistakes"}
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                {"Just starting a nen job? Don't relex yet. Read our tips on avoiding five of the most common mistakes that new ..."}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className=" bg-blue-900 text-white rounded-lg p-10 shadow-lg mb-4">
            <p className="text-sm font-regular font-bold mb-3">
              {t('find_jobs.featured')}
            </p>
            <p className="text-sm font-regular ">
              {t('find_jobs.what_jobs_demand')}
            </p>
          </div>
          <div className=" bg-black text-white rounded-lg p-10 shadow-lg mb-4">
            <p className="text-sm font-regular font-bold mb-3">
              {t('find_jobs.tag_results')}
            </p>
            <p className="text-sm font-regular mb-10">
              {t('find_jobs.landing_job')}
            </p>
            <p className="text-sm font-regular">
              {t('find_jobs.posts_count', { count: '64' })}
            </p>
          </div>
          <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
            <Image loading="lazy" src={imagePathFinder.card_image_3} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                Benefits of Using a Recruitment Agency in Canada to Hire Talent in 2025
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                Wondering about the benefits of using employment agencies to recruit employees? This article walks Canadian businesses through the benefits of ...
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
            <Image loading="lazy" src={imagePathFinder.card_image_4} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                December 2024 Labour Force Survey: Canadian Employment Rises b...
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                {"Canada's unemployment rate fell to 6.7 percent in December eccording to Statistics Canada's newest..."}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
            <Image loading="lazy" src={imagePathFinder.card_image_5} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                {"Why More Canadians Should Be Setting Career New Year's Resolutions"}
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                {" Considering making career new year's resolutions? This guide features eight factors Canadians should consider ..."}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className=" bg-blue-900 text-white rounded-lg p-10 shadow-lg mb-4">
            <p className="text-sm font-regular font-bold mb-3">
              {t('find_jobs.featured')}
            </p>
            <p className="text-sm font-regular ">
              {t('find_jobs.what_jobs_demand')}
            </p>
          </div>
          <div className=" bg-black text-white rounded-lg p-10 shadow-lg mb-4">
            <p className="text-sm font-regular font-bold mb-3">
              {t('find_jobs.tag_results')}
            </p>
            <p className="text-sm font-regular mb-10">
              {t('find_jobs.landing_job')}
            </p>
            <p className="text-sm font-regular">
              {t('find_jobs.posts_count', { count: '72' })}
            </p>
          </div>
          <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
            <Image loading="lazy" src={imagePathFinder.card_image_6} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                New Year, New Career: 7 Canada-Centric Job Search Tips for 2025
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                New year, new career! Professionals across Canada wondering how to find a job in 2025 should check out our 7 job search tips for 2025 to ensure they start the year off right.                            </p>
            </div>
          </div>
        </div>
        <div className="col-span-12 flex justify-center items-center">
          <Button variant="primary" size="md" onClick={() => router.push("/discover-insights#refine_your_focus")} className="!rounded-full text-sm mx-auto mt-10 w-fit whitespace-nowrap">
            {t('find_jobs.subscribe_updates')}
          </Button>
        </div>
      </div>
    </section>



    {/*Leading agency for manufacturing workforce solutions */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-6 items-center gap-4 mt-10">
        <div className="lg:col-span-3 col-span-6">
          <Image loading="lazy" src={section3?.image || imagePathFinder.leading_agency_for_manufacturing_workforce_solutions} width={500} height={500} alt={section3?.libelle ?? "Leading agency for manufacturing workforce solutions"} />
        </div>
        <div className="lg:col-span-3 col-span-6  pl-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {section3?.libelle}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {section3?.description}
          </p>
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


      <div className="max-w-5xl mb-10 mx-auto grid grid-cols-12 gap-8 text-left">
        <div className="col-span-3">
          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image loading="lazy" src={imagePathFinder.be_salary_smart} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                {t('consulting.hiring_trends.be_salary_smart')}
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                {t('consulting.hiring_trends.be_salary_smart_desc')}
              </p>
            </div>
          </div>

        </div>
        <div className="col-span-3">

          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image loading="lazy" src={imagePathFinder.career_development} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                {t('consulting.hiring_trends.career_development')}
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                {t('consulting.hiring_trends.career_development_desc')}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image loading="lazy" src={imagePathFinder.What_jobs_are_in_demand} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                {t('find_jobs.what_jobs_demand')}
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                {t('consulting.hiring_trends.what_jobs_demand_desc')}
              </p>
            </div>
          </div>

        </div>
        <div className="col-span-3">
          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image loading="lazy" src={imagePathFinder.landing_a_job} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                {t('find_jobs.landing_job')}
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                {t('consulting.hiring_trends.landing_job_desc')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  </>
}