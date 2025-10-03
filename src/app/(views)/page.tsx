
"use client";

import dynamic from "next/dynamic";
import { FiCheck, FiSearch } from "react-icons/fi";
import LazyImage from "@/components/ui/LazyImage";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { useTranslation } from "@/contexts/LanguageContext";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
      <section className="mx-auto max-w-5xl mb-10 p-4 sm:p-6 lg:p-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text mb-8 sm:mb-10 lg:mb-14 text-gray-800 text-center">
          {t('home.specialized_talent.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center">
          <Link href="/salary-guide" className="bg-[url(/images/card_fond.png)] w-full
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <h6 className="text-blue-800 text-sm sm:text-base mb-3 font-semibold">
                  {t('home.cards.salary_guide.title')}
                </h6>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {t('home.cards.salary_guide.desc')}
                </p>
              </div>
              <div className="flex-shrink-0 self-center sm:self-start">
                <Image className="w-full sm:w-32 lg:w-36 rounded-lg" src={imagePathFinder.salary_guide_1} alt="Salary Guide" width={150} height={100} />
              </div>
            </div>
          </Link>
          <Link href="/quebec-tax-calculator" className="bg-[url(/images/card_fond.png)] w-full
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <h6 className="text-blue-800 text-sm sm:text-base mb-3 font-semibold">
                  {t('home.cards.cv_builder.title')}
                </h6>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {t('home.cards.cv_builder.desc')}
                </p>
              </div>
              <div className="flex-shrink-0 self-center sm:self-start">
                <Image className="w-full sm:w-32 lg:w-36 rounded-lg" src={imagePathFinder.quebec_tax_calculator} alt="Quebec Tax Calculator" width={150} height={100} />
              </div>
            </div>
          </Link>
          <Link href="/discover-insights" className="bg-[url(/images/card_fond.png)] w-full
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <h6 className="text-blue-800 text-sm sm:text-base mb-3 font-semibold">
                  {t('home.cards.blog.title')}
                </h6>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {t('home.cards.blog.desc')}
                </p>
              </div>
              <div className="flex-shrink-0 self-center sm:self-start">
                <Image className="w-full sm:w-32 lg:w-36 rounded-lg" src={imagePathFinder.ir_blog} alt="IR blog" width={150} height={100} />
              </div>
            </div>
          </Link>
          <Link href="/discover-insights" className="bg-[url(/images/card_fond.png)] w-full
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <h6 className="text-blue-800 text-sm sm:text-base mb-3 font-semibold">
                  {t('home.cards.tech_skills.title')}
                </h6>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {t('home.cards.tech_skills.desc')}
                </p>
              </div>
              <div className="flex-shrink-0 self-center sm:self-start">
                <Image className="w-full sm:w-32 lg:w-36 rounded-lg" src={imagePathFinder.navigate_tech_skill} alt="Navigate tech skills gaps" width={150} height={100} />
              </div>
            </div>
          </Link>

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
      <section className="mx-auto max-w-7xl mb-10 p-4 sm:p-6 lg:p-10">
        <div className="w-full bg-[url(/images/how_it_work.png)] bg-cover bg-center bg-blue-900 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-4xl border">

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text mb-6 sm:mb-8 lg:mb-10 mt-3 sm:mt-4 lg:mt-5 text-white text-center">
            {t('home.how_it_works.title')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full mb-6 sm:mb-8 lg:mb-10">
            <Link href="/hire-talent" className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <LazyImage src={imagePathFinder.describe_your_need} alt="Describe your Need" className="w-8 sm:w-10 mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" width={40} height={40} />
              <p className="text-xs sm:text-sm font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors duration-300">
                {t('home.how_it_works.step1')}
              </p>
            </Link>
            <Link href="/consulting-solutions" className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <LazyImage src={imagePathFinder.we_source_the_talent} alt="We Source the Talent" className="w-8 sm:w-10 mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" width={40} height={40} />
              <p className="text-xs sm:text-sm font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors duration-300">
                {t('home.how_it_works.step2')}
              </p>
            </Link>
            <Link href="/hire-talent" className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <LazyImage src={imagePathFinder.select_and_approve} alt="Select and Approve" className="w-8 sm:w-10 mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" width={40} height={40} />
              <p className="text-xs sm:text-sm font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors duration-300">
                {t('home.how_it_works.step3')}
              </p>
            </Link>
            <Link href="/consulting-solutions" className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <LazyImage src={imagePathFinder.seamless_integration} alt="Seamless Integration" className="w-8 sm:w-10 mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" width={40} height={40} />
              <p className="text-xs sm:text-sm font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors duration-300">
                {t('home.how_it_works.step4')}
              </p>
            </Link>
            <Link href="/consulting-solutions" className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <LazyImage src={imagePathFinder.continuous_support} alt="Continuous Support" className="w-8 sm:w-10 mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" width={40} height={40} />
              <p className="text-xs sm:text-sm font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors duration-300">
                {t('home.how_it_works.step5')}
              </p>
            </Link>

          </div>

        </div>
      </section>

      {/*  Partner with qualified talent aligned with your company values   */}
      <section className="mx-auto max-w-5xl mb-10 p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          <div className="w-full lg:w-3/5 lg:pr-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text mb-8 sm:mb-10 lg:mb-14 text-gray-800">
              {t('home.partner_talent.title')}
            </h2>
            <div className="flex gap-3 sm:gap-4 align-start items-start mb-4 sm:mb-5">
              <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                <FiCheck className="text-white text-sm" />
              </div>
              <p className="text-gray-500 text-sm">
                {t('home.partner_talent.point1')}
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4 align-start items-start mb-4 sm:mb-5">
              <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                <FiCheck className="text-white text-sm" />
              </div>
              <p className="text-gray-500 text-sm">
                {t('home.partner_talent.point2')}
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4 align-start items-start mb-6 sm:mb-8">
              <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                <FiCheck className="text-white text-sm" />
              </div>
              <p className="text-gray-500 text-sm">
                {t('home.partner_talent.point3')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="md" onClick={() => redirect("/hire-talent#")} className="!rounded-full text-sm">
                {t('home.partner_talent.find_hire_btn')}
              </Button>
              <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300">
                {t('home.partner_talent.learn_more_btn')}
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-2/5 mt-6 lg:mt-0">
            <LazyImage src={imagePathFinder.find_your_next_hire} alt="Find your next hire" width={400} height={300} className="w-full h-auto" />
          </div>
        </div>
      </section>


      {/*  We are experts in employee recognition   */}
      <section className="mx-auto w-full mb-10 p-4 sm:p-6 lg:p-10 bg-gray-200">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 m-auto max-w-5xl lg:p-10">
          <div className="w-full lg:w-3/5 lg:mr-7 order-2 lg:order-1">
            <LazyImage src={imagePathFinder.we_are_experts_in_employee_recognition} alt="Employee recognition experts" width={400} height={300} className="w-full h-auto" />
          </div>
          <div className="w-full lg:w-3/5 lg:pr-4 order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text mb-8 sm:mb-10 lg:mb-14 text-gray-800">
              {t('home.employee_recognition.title')}
            </h2>

            <div className="flex gap-3 sm:gap-4 align-start items-start mb-4 sm:mb-5">
              <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                <FiCheck className="text-white text-sm" />
              </div>
              <p className="text-gray-500 text-sm">
                {t('home.employee_recognition.point1')}
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4 align-start items-start mb-4 sm:mb-5">
              <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                <FiCheck className="text-white text-sm" />
              </div>
              <p className="text-gray-500 text-sm">
                {t('home.employee_recognition.point2')}
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4 align-start items-start mb-4 sm:mb-5">
              <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                <FiCheck className="text-white text-sm" />
              </div>
              <p className="text-gray-500 text-sm">
                {t('home.employee_recognition.point3')}
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4 align-start items-start mb-6 sm:mb-8">
              <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                <FiCheck className="text-white text-sm" />
              </div>
              <p className="text-gray-500 text-sm">
                {t('home.employee_recognition.point4')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="md" onClick={() => redirect("/hire-talent#")} className="!rounded-full text-sm">
                {t('home.employee_recognition.consulting_btn')}
              </Button>
              <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300">
                {t('button.learn_more')}
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/*  Shape the career you want   */}
      <section className="mx-auto max-w-5xl mb-10 p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          <div className="w-full lg:w-3/5 lg:pr-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text mb-8 sm:mb-10 lg:mb-14 text-gray-800">
              {t('home.shape_career.title')}
            </h2>
            <div className="flex gap-3 sm:gap-4 align-start items-start mb-4 sm:mb-5">
              <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                <FiCheck className="text-white text-sm" />
              </div>
              <p className="text-gray-500 text-sm">
                {t('home.shape_career.point1')}
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4 align-start items-start mb-4 sm:mb-5">
              <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                <FiCheck className="text-white text-sm" />
              </div>
              <p className="text-gray-500 text-sm">
                {t('home.shape_career.point2')}
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4 align-start items-start mb-4 sm:mb-5">
              <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                <FiCheck className="text-white text-sm" />
              </div>
              <p className="text-gray-500 text-sm">
                {t('home.shape_career.point3')}
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4 align-start items-start mb-6 sm:mb-8">
              <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                <FiCheck className="text-white text-sm" />
              </div>
              <p className="text-gray-500 text-sm">
                {t('home.shape_career.point4')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="md" onClick={() => redirect("/find-jobs#")} className="!rounded-full text-sm">
              {t('home.shape_career.job_matches_btn')}
              </Button>
              <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300">
                {t('button.learn_more')}
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-3/5 mt-6 lg:mt-0">
            <LazyImage src={imagePathFinder.shape_the_career_you_want} alt="Shape your career" width={400} height={300} className="w-full h-auto" />
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


