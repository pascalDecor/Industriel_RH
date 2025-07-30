"use client";

import { FiSearch } from "react-icons/fi";
import Button from "./ui/button";
import { TiLocationOutline } from "react-icons/ti";
import Carousel from "./ui/carroussel";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";

export default function HomeBannerCarroussel() {
    const { t } = useTranslation();

    function handleClickFindJobs() {
        redirect("/find-jobs#");
    }

    function handleClickPreviewCandidates() {
        redirect("/hire-talent#");
    }
    function handleClickHireNow() {
        redirect("/hire-talent#contact-infos");
    }

    function handleClicSearchJobs() {
        console.log("Clic !");
    }


    const slides = [
        <div key={0} className="w-full h-[calc(100vh-55px)] bg-[url(/images/banner.png)] bg-cover bg-center py-10 ">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <div className="max-w-4xl mx-auto my-auto 
                flex flex-col items-start justify-start">
                    <div className="max-w-xl mt-20">
                        <h2 className="text-6xl/18 font-semibold text mb-14 text-white">{t('carousel.slide1.title')}
                            <strong className="bg-white text-blue-800 rounded-2xl px-4 py-0 font-bold uppercase ml-3 mt-3">{t('carousel.slide1.title_highlight')}</strong>
                        </h2>
                        <p className="text-gray-300 mb-14">
                            {t('carousel.slide1.description')}</p>
                        <div className="flex gap-4">
                            <div>
                                <p className="text-gray-400 text-sm ">{t('carousel.slide1.job_seekers')}</p>
                                <Button variant="primary" size="md" onClick={handleClickFindJobs} className="mt-10 !rounded-full border text-sm">
                                    {t('carousel.slide1.find_job')}
                                </Button>
                            </div>
                            <div className="border-l border-gray-500 pl-4">
                                <p className="text-gray-400 text-sm ">{t('carousel.slide1.businesses')}</p>
                                <div className="flex mt-10 gap-3 ">
                                    <Button variant="light" size="md" onClick={handleClickPreviewCandidates} className="!rounded-full text-sm">
                                        {t('carousel.slide1.preview_candidates')}
                                    </Button>
                                    <Button variant="light" size="md" onClick={handleClickHireNow} className="!rounded-full text-sm">
                                        {t('carousel.slide1.hire_now')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
        ,
        <div key={1} className="w-full h-[calc(100vh-55px)] bg-[url(/images/banner_1.png)] bg-cover bg-center py-10 ">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <div className="max-w-4xl mx-auto my-auto flex flex-col items-start justify-start">
                    <div className="max-w-xl mt-20">
                        <h2 className="text-4xl text-white text mb-14">{t('carousel.slide2.title')} <strong className="text-7xl font-semibold"> {t('carousel.slide2.title_highlight')}</strong>  </h2>
                        <p className="text-gray-300 mb-14 text-xl">
                            {t('carousel.slide2.description')}</p>
                        <div className="flex gap-4">
                            <div>
                                <p className="text-gray-400 text-sm ">{t('carousel.slide1.job_seekers')}</p>
                                <Button variant="primary" size="md" onClick={handleClickFindJobs} className="mt-10 !rounded-full text-sm">
                                    {t('carousel.slide1.find_job')}
                                </Button>
                            </div>
                            <div className="border-l border-gray-500 pl-4">
                                <p className="text-gray-400 text-sm ">{t('carousel.slide1.businesses')}</p>
                                <div className="flex mt-10 gap-3 ">
                                    <Button variant="light" size="md" onClick={handleClickPreviewCandidates} className="!rounded-full text-sm">
                                        {t('carousel.slide1.preview_candidates')}
                                    </Button>
                                    <Button variant="light" size="md" onClick={handleClickHireNow} className="!rounded-full text-sm">
                                        {t('carousel.slide1.hire_now')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>,
        <div key={2} className="w-full h-[calc(100vh-55px)] bg-[url(/images/banner_2.png)] bg-cover bg-center py-10 ">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <div className="max-w-4xl mx-auto my-auto 
            flex flex-col items-start justify-start">
                    <div className="max-w-xl mt-20">
                        <h2 className="text-6xl/13 text-gray-800 font-semibold mb-14">
                            {t('carousel.slide3.title')}
                            <span className="text-5xl/18">{t('carousel.slide3.subtitle')}</span> <br /><strong className="text-6xl/18 bg-blue-900 text-white rounded-2xl px-4 font-bold uppercase mt-3 whitespace-nowrap">{t('carousel.slide3.title_highlight')}</strong>
                        </h2>
                        <p className="text-gray-600 mb-14 text-xl">
                            {t('carousel.slide3.description')}</p>
                        <div className="flex gap-4">
                            <div>
                                <p className="text-blue-800 text-sm font-semibold">{t('carousel.slide1.job_seekers')}</p>
                                <Button variant="primary" size="md" onClick={handleClickFindJobs} className="mt-10 !rounded-full border text-sm">
                                    {t('carousel.slide1.find_job')}
                                </Button>
                            </div>
                            <div className="border-l border-gray-300 pl-4">
                                <p className="text-gray-800 text-sm font-semibold">{t('carousel.slide1.businesses')}</p>
                                <div className="flex mt-10 gap-3 ">
                                    <Button variant="light" size="md" onClick={handleClickPreviewCandidates} className="!rounded-full text-sm border border-gray-300">
                                        {t('carousel.slide1.preview_candidates')}
                                    </Button>
                                    <Button variant="light" size="md" onClick={handleClickHireNow} className="!rounded-full text-sm border border-gray-300">
                                        {t('carousel.slide1.hire_now')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>,
        <div key={3} className="w-full h-[calc(100vh-55px)] bg-[url(/images/banner_3.png)] bg-cover bg-center py-10 ">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <div className="max-w-4xl mx-auto my-auto 
         flex flex-col items-start justify-start">
                    <div className="max-w-xl mt-20">
                        <h2 className="text-6xl/13 text-gray-800 font-semibold mb-14">
                            {t('carousel.slide3.title')}
                            <span className="text-5xl/18">{t('carousel.slide3.subtitle')}</span> <br /><strong className="text-6xl/18 bg-blue-900 text-white rounded-2xl px-4 font-bold uppercase mt-3 whitespace-nowrap">{t('carousel.slide3.title_highlight')}</strong>
                        </h2>
                        <p className="text-gray-600 mb-14 text-xl">
                            {t('carousel.slide3.description')}</p>
                        <div className="flex gap-4">
                            <div>
                                <p className="text-blue-800 text-sm font-semibold">{t('carousel.slide1.job_seekers')}</p>
                                <Button variant="primary" size="md" onClick={handleClickFindJobs} className="mt-10 !rounded-full border text-sm">
                                    {t('carousel.slide1.find_job')}
                                </Button>
                            </div>
                            <div className="border-l border-gray-300 pl-4">
                                <p className="text-gray-800 text-sm font-semibold">{t('carousel.slide1.businesses')}</p>
                                <div className="flex mt-10 gap-3 ">
                                    <Button variant="light" size="md" onClick={handleClickPreviewCandidates} className="!rounded-full text-sm border border-gray-300">
                                        {t('carousel.slide1.preview_candidates')}
                                    </Button>
                                    <Button variant="light" size="md" onClick={handleClickHireNow} className="!rounded-full text-sm border border-gray-300">
                                        {t('carousel.slide1.hire_now')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    ];



    return (
        <>
            {/*    Carroussel */}
            <section className="w-full">
                <Carousel slides={slides} classname="w-dvw z-0" />
                {/* Search bar */}
                <div className="bg-blue-800 rounded-full 
                      p-5 flex gap-4 w-1/2 -mt-24
                      absolute mx-auto z-10"
                    style={{
                        marginLeft: "50%",
                        transform: "translateX(-50%)"
                    }}>

                    <div className="relative w-full">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('carousel.search.job_placeholder')}
                            className=" pl-10 pr-4 py-2 border w-full
                        bg-white text-gray-600 text-sm rounded-full 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    <div className="relative w-full">
                        <TiLocationOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('carousel.search.location_placeholder')}
                            className=" pl-10 pr-4 py-2 border  w-full
                        bg-white text-gray-600 text-sm rounded-full 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    <Button variant="dark"
                        size="md" onClick={handleClicSearchJobs} className="!rounded-full text-sm whitespace-nowrap">
{t('carousel.search.button')}
                    </Button>
                </div>
                {/* Carousel */}
            </section>

        </>
    );
}  