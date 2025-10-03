
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
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const DynamicArticlesGrid = dynamic(() => import("@/components/articles/DynamicArticlesGrid"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

export default function FindJobs() {
    const { t } = useTranslation();

    function handleClick() {
        console.log("Clic !");
    }


    return <>
        {/* <HomeBannerCarroussel /> */}
        {/*Find a job that works for you */}
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
                        {t('find_jobs.hero.title')}
                    </h2>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.15,
                                    delayChildren: 0.3
                                }
                            }
                        }}
                    >
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                            }}
                            className="flex gap-4 align-start items-start"
                        >
                            <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('find_jobs.hero.feature1')}
                            </p>
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                            }}
                            className="flex gap-4 align-start items-start"
                        >
                            <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('find_jobs.hero.feature2')}
                            </p>
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                            }}
                            className="flex gap-4 align-start items-start"
                        >
                            <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('find_jobs.hero.feature3')}
                            </p>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-6 sm:mt-10 !rounded-full text-sm w-full sm:w-auto">
                            {t('find_jobs.hero.submit_cv')}
                        </Button>
                    </motion.div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2"
                >
                    <Image loading="lazy" src={imagePathFinder.find_a_job_that_works_for_you} alt="Salary Guide" />
                </motion.div>
            </div>
        </section>

        {/* How we help you find a job  */}
        <section className="mx-auto w-full mb-0 px-4 sm:px-6 lg:px-10 py-16 sm:py-24 bg-gray-200">
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
                    <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-5 !rounded-full text-sm w-full sm:w-auto">
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
                    <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-5 !rounded-full text-sm w-full sm:w-auto">
                        {t('find_jobs.search_jobs.button')}
                    </Button>
                </motion.div>
            </motion.div>

            {/*   Add specialized talent across your organization */}
            <AddSpecializedTalentAcrossYourOrganization />


            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl font-semibold text mb-10 mt-10 text-black text-center"
            >
                {t('find_jobs.grow_learn.title')}
            </motion.h2>

            <DynamicArticlesGrid
                category="all"
                limit={12}
                showFeaturedBlocks={true}
            />

            {/* <div className="flex justify-center items-center mt-10">
                <Button variant="primary" size="md" onClick={() => redirect("/discover-insights#refine_your_focus")} className="!rounded-full text-sm mx-auto mt-10 w-fit whitespace-nowrap">
                    {t('find_jobs.subscribe_updates')}
                </Button>
            </div> */}
        </section>

        {/*  Search  */}
        {/* <section className="mx-auto w-full py-20">
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
        </section> */}

        <div id="seekers-section" className="-mt-5 absolute"></div>        

        {/*   Explore how we help job seekers */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 my-12 sm:my-20">
            <div className="w-full bg-cover bg-center bg-blue-900 p-6 sm:p-10 rounded-2xl sm:rounded-4xl border">

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-2xl sm:text-3xl font-semibold text mb-8 sm:mb-10 mt-3 sm:mt-5 text-white text-center"
                >
                    {t('find_jobs.help_seekers.title')}
                </motion.h2>


                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.15,
                                delayChildren: 0.3
                            }
                        }
                    }}
                    className="grid grid-cols-1 lg:grid-cols-6 w-full gap-6 sm:gap-10 text-white"
                >
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: -50 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                        }}
                        className="lg:col-span-3"
                    >
                        <div className="flex gap-4 mb-8 sm:mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap flex-shrink-0">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        1
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    {t('find_jobs.step1.title')}
                                </p>
                                <p className="text-sm font-light text text-start">
                                    {t('find_jobs.step1.description')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5">
                                    <Button variant="dark" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="!rounded-full text-sm !font-light !text-white flex items-center gap-3 !pl-4 !pr-1.5 !py-1 justify-center">
                                        {t('find_jobs.step1.apply_button')}
                                        <div className="bg-white p-2 rounded-full">
                                            <FiArrowRight className="text-black" />
                                        </div>
                                    </Button>
                                    <Button variant="light" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 justify-center">
                                        {t('find_jobs.step1.upload_button')}
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-8 sm:mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap flex-shrink-0">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        2
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    {t('find_jobs.step2.title')}
                                </p>
                                <p className="text-sm font-light text text-start">
                                    {t('find_jobs.step2.description')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5">
                                    <Button variant="light" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 justify-center">
                                        {t('find_jobs.step1.upload_button')}
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Image loading="lazy" src={imagePathFinder.explore_how_we_help_job_seekers} alt="  We Source the Talent" className="w-full mb-4 mx-auto" />
                    </motion.div>
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: 50 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                        }}
                        className="lg:col-span-3"
                    >
                        <div className="flex gap-4 mb-8 sm:mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap flex-shrink-0">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        3
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    {t('find_jobs.step3.title')}
                                </p>
                                <p className="text-sm font-light text text-start">
                                    {t('find_jobs.step3.description')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5">
                                    <Button variant="dark" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-[12px] !font-light !text-white flex items-center gap-3 !pl-4 !pr-1.5 !py-1 justify-center">
                                        {t('find_jobs.step3.interview_tips')}
                                        <div className="bg-white p-2 rounded-full">
                                            <FiArrowRight className="text-black" />
                                        </div>
                                    </Button>
                                    <Button variant="light" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-[12px] !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 justify-center">
                                        {t('find_jobs.step3.salary_guide')}
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-8 sm:mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap flex-shrink-0">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        4
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    {t('find_jobs.step4.title')}
                                </p>
                                <p className="text-sm font-light text text-start">
                                    {t('find_jobs.step4.description')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5">
                                    <Button variant="light" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 justify-center">
                                        {t('find_jobs.step4.career_advice')}
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-8 sm:mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap flex-shrink-0">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        5
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1">
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

                                <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <Button variant="dark" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-sm !font-light !text-white flex items-center gap-3 !pl-4 !pr-1.5 !py-1 justify-center">
                                        {t('find_jobs.step5.training_button')}
                                        <div className="bg-white p-2 rounded-full">
                                            <FiArrowRight className="text-black" />
                                        </div>
                                    </Button>
                                    <Button variant="light" size="md" onClick={() => redirect("/discover-insights")} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 justify-center">
                                        {t('find_jobs.step5.legal_button')}
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
        {/*  Explore success stories   */}
        <ExploreSuccessStories />
        {/*  App your way to a new job  */}
        <AppYourWayToNewJob />
    </>
}