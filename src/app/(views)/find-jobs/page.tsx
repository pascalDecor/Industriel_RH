
"use client";

import Button from "@/components/ui/button";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from 'next/image';

import { FiArrowRight, FiCheck, FiSearch } from "react-icons/fi";
import { TiLocationOutline } from "react-icons/ti";
import AppYourWayToNewJob from "@/components/AppYourWayToNewJob";
import ExploreSuccessStories from "@/components/ExploreSuccessStories";
import AddSpecializedTalentAcrossYourOrganization from "@/components/AddSpecializedTalentAcrossYourOrganization";
import { redirect } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";

export default function FindJobs() {
    const { t } = useTranslation();

    function handleClick() {
        console.log("Clic !");
    }


    return <>
        {/* <HomeBannerCarroussel /> */}
        {/*Find a job that works for you */}
        <section className="mx-auto max-w-5xl mb-10 p-10">
            <div className="grid grid-cols-5 items-center gap-4 mt-10">
                <div className="lg:col-span-3 col-span-12  pr-4">
                    <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                        {t('find_jobs.hero.title')}
                    </h2>
                    <div className="flex gap-4 align-start items-start">
                        <div className="bg-blue-700 p-1 rounded-full">
                            <FiCheck className="text-white" />
                        </div>
                        <p className="text-gray-500 text-sm mb-5">
                            {t('find_jobs.hero.feature1')}
                        </p>
                    </div>
                    <div className="flex gap-4 align-start items-start">
                        <div className="bg-blue-700 p-1 rounded-full">
                            <FiCheck className="text-white" />
                        </div>
                        <p className="text-gray-500 text-sm mb-5">
                            {t('find_jobs.hero.feature2')}
                        </p>
                    </div>
                    <div className="flex gap-4 align-start items-start">
                        <div className="bg-blue-700 p-1 rounded-full">
                            <FiCheck className="text-white" />
                        </div>
                        <p className="text-gray-500 text-sm mb-5">
                            {t('find_jobs.hero.feature3')}
                        </p>
                    </div>
                    <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-10 !rounded-full text-sm">
                        {t('find_jobs.hero.submit_cv')}
                    </Button>
                </div>
                <div className="lg:col-span-2 col-span-12">
                    <Image loading="lazy" src={imagePathFinder.find_a_job_that_works_for_you} alt="Salary Guide" />
                </div>
            </div>
        </section>

        {/* How we help you find a job  */}
        <section className="mx-auto w-full mb-0 px-10 py-24 bg-gray-200">
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
            </div>

            {/*   Add specialized talent across your organization */}
            <AddSpecializedTalentAcrossYourOrganization />


            <h2 className="text-3xl font-semibold text mb-10 mt-10 text-black text-center">
                {t('find_jobs.grow_learn.title')}
            </h2>

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
                            64 posts
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
                            72 posts
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
                    <Button variant="primary" size="md" onClick={() => redirect("/discover-insights#refine_your_focus")} className="!rounded-full text-sm mx-auto mt-10 w-fit whitespace-nowrap">
                        {t('find_jobs.subscribe_updates')}
                    </Button>
                </div>
            </div>
        </section>

        {/*  Search  */}
        <section className="mx-auto w-full py-20">
            <div className="max-w-5xl grid grid-cols-12 gap-4 mx-auto px-10">
                <div className="relative col-span-4">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('find_jobs.search.job_placeholder')}
                        className="pl-10 pr-4 py-2 border border-gray-300 w-full
            bg-white text-gray-600 text-sm rounded-full 
            focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <div className="relative col-span-4">
                    <TiLocationOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('find_jobs.search.location_placeholder')}
                        className="pl-10 pr-4 py-2 border border-gray-300  w-full
            bg-white text-gray-600 text-sm rounded-full 
            focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <Button variant="dark"
                    size="md" onClick={handleClick} className="!rounded-full text-sm whitespace-nowrap col-span-4">
                    {t('find_jobs.search.button')}
                </Button>
            </div>
        </section>

        {/*   Explore how we help job seekers */}
        <section className="mx-auto w-5xl  mb-20">
            <div className="w-full bg-cover bg-center bg-blue-900 p-10 rounded-4xl border">

                <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
                    {t('find_jobs.help_seekers.title')}
                </h2>


                <div className="grid grid-cols-6 w-full gap-10 text-white">
                    <div className="col-span-3">
                        <div className="flex gap-4 mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        1
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    {t('find_jobs.step1.title')}
                                </p>
                                <p className="text-sm font-light text text-start">
                                    {t('find_jobs.step1.description')}
                                </p>
                                <div className="flex gap-4 mt-5">
                                    <Button variant="dark" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="!rounded-full text-sm !font-light !text-white flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        {t('find_jobs.step1.apply_button')}
                                        <div className="bg-white p-2 rounded-full">
                                            <FiArrowRight className="text-black" />
                                        </div>
                                    </Button>
                                    <Button variant="light" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        {t('find_jobs.step1.upload_button')}
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        2
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    {t('find_jobs.step2.title')}
                                </p>
                                <p className="text-sm font-light text text-start">
                                    {t('find_jobs.step2.description')}
                                </p>
                                <div className="flex gap-4 mt-5">
                                    <Button variant="light" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        {t('find_jobs.step1.upload_button')}
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Image loading="lazy" src={imagePathFinder.explore_how_we_help_job_seekers} alt="  We Source the Talent" className="w-full mb-4 mx-auto" />
                    </div>
                    <div className="col-span-3">
                        <div className="flex gap-4 mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        3
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    {t('find_jobs.step3.title')}
                                </p>
                                <p className="text-sm font-light text text-start">
                                    {t('find_jobs.step3.description')}
                                </p>
                                <div className="flex gap-4 mt-5">
                                    <Button variant="dark" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-[12px] !font-light !text-white flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        {t('find_jobs.step3.interview_tips')}
                                        <div className="bg-white p-2 rounded-full">
                                            <FiArrowRight className="text-black" />
                                        </div>
                                    </Button>
                                    <Button variant="light" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-[12px] !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        {t('find_jobs.step3.salary_guide')}
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        4
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    {t('find_jobs.step4.title')}
                                </p>
                                <p className="text-sm font-light text text-start">
                                    {t('find_jobs.step4.description')}
                                </p>
                                <div className="flex gap-4 mt-5">
                                    <Button variant="light" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        {t('find_jobs.step4.career_advice')}
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        5
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    {t('find_jobs.step5.title')}
                                </p>
                                <p className="text-sm font-light text text-start mb-4">
                                    {t('find_jobs.step5.description')}
                                </p>
                                <p className="text-sm font-light text text-start mb-4">
                                    <strong className="font-semibold">{t('find_jobs.step5.upskill_title')} </strong>   <br />
                                    {t('find_jobs.step5.upskill_desc')}
                                </p>
                                <p className="text-sm font-light text text-start mb-4">
                                    <strong className="font-semibold">{t('find_jobs.step5.legal_title')} </strong>   <br />
                                    {t('find_jobs.step5.legal_desc')}
                                </p>
                                <p className="text-sm font-light text text-start mb-4">
                                    <strong className="font-semibold">{t('find_jobs.step5.career_advice_title')} </strong>   <br />
                                    {t('find_jobs.step5.career_advice_desc')}
                                </p>

                                <div className="mt-10">
                                    <Button variant="dark" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-sm !font-light !text-white flex items-center gap-3 !pl-4 !pr-1.5 !py-1 mb-4">
                                        {t('find_jobs.step5.training_button')}
                                        <div className="bg-white p-2 rounded-full">
                                            <FiArrowRight className="text-black" />
                                        </div>
                                    </Button>
                                    <Button variant="light" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        {t('find_jobs.step5.legal_button')}
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  Explore success stories   */}
        <ExploreSuccessStories />
        {/*  App your way to a new job  */}
        <AppYourWayToNewJob />
    </>
}