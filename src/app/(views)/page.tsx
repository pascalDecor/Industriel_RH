
"use client";

import dynamic from "next/dynamic";
import { FiCheck, FiSearch } from "react-icons/fi";
import LazyImage from "@/components/ui/LazyImage";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { useTranslation } from "@/contexts/LanguageContext";
import { redirect } from "next/navigation";
import Image from "next/image";

const Button = dynamic(() => import("@/components/ui/button"), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-full h-10 w-32" />
});

const AppYourWayToNewJob = dynamic(() => import("@/components/AppYourWayToNewJob"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const PartnersAccreditation = dynamic(() => import("@/components/PartnersAccreditation"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const ExploreSuccessStories = dynamic(() => import("@/components/ExploreSuccessStories"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const AddSpecializedTalentAcrossYourOrganization = dynamic(() => import("@/components/AddSpecializedTalentAcrossYourOrganization"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const HomeBannerCarroussel = dynamic(() => import("@/components/HomeBannerCarroussel"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

export default function Home() {
  const { t } = useTranslation();

  function handleClick() {
    console.log("Clic !");
  }

  return (
    < >
      <HomeBannerCarroussel />
      {/* Hiring trends & insights */}
      <section className="mx-auto max-w-5xl mb-10 p-10">
        <h2 className="text-4xl font-semibold text mb-14 text-gray-800 text-center">
          {t('home.specialized_talent.title')}
        </h2>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 place-items-center">
          <div className="bg-[url(/images/card_fond.png)] 
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4">
            <div className="flex space-x-4">
              <div >
                <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                  {t('home.cards.salary_guide.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('home.cards.salary_guide.desc')}
                </p>
              </div>
              <Image className="flex-1/3 rounded-lg" src={imagePathFinder.salary_guide_1} alt="Salary Guide" width={150} height={100} />
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] 
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4">
            <div className="flex space-x-4">
              <div>
                <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                  {t('home.cards.cv_builder.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('home.cards.cv_builder.desc')}
                </p>
              </div>
              <Image className="w-1/3 h-full rounded-lg" src={imagePathFinder.cv_builder} alt="What jobs are in demand?" width={150} height={100} />
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] 
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4">
            <div className="flex space-x-4">
              <div>
                <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                  {t('home.cards.blog.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('home.cards.blog.desc')}
                </p>
              </div>
              <Image className="w-1/3 rounded-lg" src={imagePathFinder.ir_blog} alt="Robert Half blog" width={150} height={100} />
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] 
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4">
            <div className="flex space-x-4">
              <div>
                <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                  {t('home.cards.tech_skills.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('home.cards.tech_skills.desc')}
                </p>
              </div>
              <Image className="w-1/3 rounded-lg" src={imagePathFinder.navigate_tech_skill} alt="Navigate tech skills gaps" width={150} height={100} />
            </div>
          </div>

        </div>
      </section>

      {/*  Worry-free recruitment for today's and tomorrow's Quebec!  */}
      {/* <section className="mx-auto max-w-5xl mb-10 p-10">
        <div className="flex items-center gap-4">
          <div className="w-3/5 pr-4">
            <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
              {t('home.worry_free.title')}
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              {t('home.worry_free.subtitle')}
            </p>
            <div className="flex gap-4 align-middle items-center">
              <p className="text-gray-500 text-sm whitespace-nowrap">
                {t('home.worry_free.search_label')}
              </p>
              <div className="relative w-60">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('home.worry_free.job_placeholder')}
                  className=" pl-10 pr-4 py-2 border border-gray-400  w-full
                bg-gray-200 text-gray-900 text-sm rounded-full 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>
            <Button variant="primary" size="md" onClick={() => redirect("/hire-talent#")} className="mt-10 !rounded-full text-sm">
              {t('home.worry_free.preview_btn')}
            </Button>
          </div>
          <div className="w-2/5">
            <LazyImage src={imagePathFinder.preview_candidat} alt="Salary Guide" width={400} height={300} />
          </div>
        </div>
      </section> */}

      {/*   How it works */}
      <section className="mx-auto w-5xl mb-10 p-10">
        <div className="w-full bg-[url(/images/how_it_work.png)] bg-cover bg-center bg-blue-900 p-10 rounded-4xl border">

          <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
            {t('home.how_it_works.title')}
          </h2>

          <div className="grid grid-cols-5 gap-4 w-full mb-10 ">
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <LazyImage src={imagePathFinder.describe_your_need} alt="Describe your Need" className="w-10 mb-4 mx-auto" width={40} height={40} />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                {t('home.how_it_works.step1')}
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <LazyImage src={imagePathFinder.we_source_the_talent} alt="We Source the Talent" className="w-10 mb-4 mx-auto" width={40} height={40} />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                {t('home.how_it_works.step2')}
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <LazyImage src={imagePathFinder.select_and_approve} alt="Select and Approve" className="w-10 mb-4 mx-auto" width={40} height={40} />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                {t('home.how_it_works.step3')}
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <LazyImage src={imagePathFinder.seamless_integration} alt="Seamless Integration" className="w-10 mb-4 mx-auto" width={40} height={40} />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                {t('home.how_it_works.step4')}
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <LazyImage src={imagePathFinder.continuous_support} alt="Continuous Support" className="w-10 mb-4 mx-auto" width={40} height={40} />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                {t('home.how_it_works.step5')}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/*  Partner with qualified talent aligned with your company values   */}
      <section className="mx-auto max-w-5xl mb-10 p-10">
        <div className="flex items-center gap-4">
          <div className="w-3/5 pr-4">
            <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
              {t('home.partner_talent.title')}
            </h2>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {t('home.partner_talent.point1')}
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {t('home.partner_talent.point2')}
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {t('home.partner_talent.point3')}
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="primary" size="md" onClick={() => redirect("/hire-talent#")} className="mt-10 !rounded-full text-sm">
                {t('home.partner_talent.find_hire_btn')}
              </Button>
              <Button variant="light" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm border border-gray-300">
                {t('home.partner_talent.learn_more_btn')}
              </Button>
            </div>
          </div>
          <div className="w-2/5">
            <LazyImage src={imagePathFinder.find_your_next_hire} alt="Find your next hire" width={400} height={300} />
          </div>
        </div>
      </section>


      {/*  We are experts in employee recognition   */}
      <section className="mx-auto w-lvw mb-10 p-10 bg-gray-200">
        <div className="flex items-center gap-4 m-auto max-w-5xl p-10">
          <div className="w-3/5 mr-7">
            <LazyImage src={imagePathFinder.we_are_experts_in_employee_recognition} alt="Employee recognition experts" width={400} height={300} />
          </div>
          <div className="w-3/5 pr-4">
            <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
              {t('home.employee_recognition.title')}
            </h2>

            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {t('home.employee_recognition.point1')}
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {t('home.employee_recognition.point2')}
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {t('home.employee_recognition.point3')}
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {t('home.employee_recognition.point4')}
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="primary" size="md" onClick={() => redirect("/hire-talent#")} className="mt-10 !rounded-full text-sm">
                {t('home.employee_recognition.consulting_btn')}
              </Button>
              <Button variant="light" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm border border-gray-300">
                {t('button.learn_more')}
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/*  Shape the career you want   */}
      <section className="mx-auto max-w-5xl mb-10 p-10">
        <div className="flex items-center gap-4">
          <div className="w-3/5 pr-4">
            <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
              {t('home.shape_career.title')}
            </h2>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {t('home.shape_career.point1')}
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {t('home.shape_career.point2')}
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {t('home.shape_career.point3')}
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {t('home.shape_career.point4')}
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="primary" size="md" onClick={() => redirect("/find-jobs#")} className="mt-10 !rounded-full text-sm">
              {t('home.shape_career.job_matches_btn')}
              </Button>
              <Button variant="light" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm border border-gray-300">
                {t('button.learn_more')}
              </Button>
            </div>
          </div>
          <div className="w-3/5">
            <LazyImage src={imagePathFinder.shape_the_career_you_want} alt="Shape your career" width={400} height={300} />
          </div>
        </div>
      </section>

      {/*   Add specialized talent across your organization */}
      <AddSpecializedTalentAcrossYourOrganization />
      {/*  Explore success stories   */}
      <ExploreSuccessStories />
      {/*   Partners & Accreditation */}
      <PartnersAccreditation />
      {/*  App your way to a new job  */}
      <AppYourWayToNewJob />
    </>
  );
}


