"use client";

import { FiSearch } from "react-icons/fi";
import Button from "./ui/button";
import { TiLocationOutline } from "react-icons/ti";
import Carousel from "./ui/carroussel";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";
import { useImage } from "@/hooks/useImage";

export default function HomeBannerCarroussel() {
    const { t } = useTranslation();

    // Charger les images de fond dynamiquement
    const banner = useImage('banner');
    const banner1 = useImage('banner_1');
    const banner2 = useImage('banner_2');
    const banner3 = useImage('banner_3');

    // Fonction helper pour extraire l'URL de l'image (gère string et StaticImageData)
    const getImageUrl = (imageSrc: string | { src: string } | any): string => {
        if (typeof imageSrc === 'string') {
            return imageSrc;
        }
        if (imageSrc && typeof imageSrc === 'object' && 'src' in imageSrc) {
            return imageSrc.src;
        }
        return '';
    };

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
        <div
            key={0}
            className="w-full h-[calc(100vh-55px)] min-h-[500px] bg-cover bg-center py-6 sm:py-8 lg:py-10"
            style={{ backgroundImage: `url(${getImageUrl(banner.src)})` }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className="h-full flex items-center"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start justify-start">
                    <div className="max-w-xl  ml-0 lg:ml-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl/18 font-semibold mb-6 sm:mb-8 lg:mb-14 text-white leading-tight">
                            {t('carousel.slide1.title')}
                            <strong className="bg-white text-blue-800 rounded-xl sm:rounded-2xl px-2 sm:px-3 lg:px-4 py-0 font-bold uppercase ml-2 sm:ml-3 mt-2 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl inline-block">
                                {t('carousel.slide1.title_highlight')}
                            </strong>
                        </h2>
                        <p className="text-gray-300 mb-6 sm:mb-8 lg:mb-14 text-sm sm:text-base">
                            {t('carousel.slide1.description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 lg:gap-4">
                            <div className="">
                                <p className="text-gray-400 sm:h-10 text-xs sm:text-sm mb-4 sm:mb-6 lg:mb-10">{t('carousel.slide1.job_seekers')}</p>
                                <Button variant="primary" size="md" onClick={handleClickHireNow} className="!rounded-full border text-xs sm:text-sm w-full sm:w-auto px-10 lg:py-4">
                                {t('carousel.slide1.hire_now')}
                                </Button>
                            </div>
                            <div className="sm:border-l border-gray-500 sm:pl-4 pt-4 sm:pt-0 border-t sm:border-t-0">
                                <p className="text-gray-400 sm:h-10 text-xs sm:text-sm mb-4 sm:mb-6 lg:mb-10">{t('carousel.slide1.businesses')}</p>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    {/* <Button variant="light" size="md" onClick={handleClickPreviewCandidates} className="!rounded-full text-xs sm:text-sm">
                                        {t('carousel.slide1.preview_candidates')}
                                    </Button> */}
                                    <Button variant="light" size="md" onClick={handleClickFindJobs} className="!rounded-full text-xs sm:text-sm lg:py-4">
                                        
                                        {t('carousel.slide1.find_job')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
        // ,
        // <div
        //     key={1}
        //     className="w-full h-[calc(100vh-55px)] min-h-[500px] bg-cover bg-center py-6 sm:py-8 lg:py-10"
        //     style={{ backgroundImage: `url(${getImageUrl(banner1.src)})` }}
        // >
        //     <motion.div
        //         initial={{ opacity: 0, y: 50 }}
        //         whileInView={{ opacity: 1, y: 0 }}
        //         transition={{ duration: 0.6, ease: "easeOut" }}
        //         viewport={{ once: true }}
        //         className="h-full flex items-center"
        //     >
        //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start justify-start">
        //             <div className="max-w-xl  ml-0 lg:ml-16">
        //                 <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-6 sm:mb-8 lg:mb-14 leading-tight">
        //                     {t('carousel.slide2.title')}
        //                     <strong className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold mt-2">
        //                         {t('carousel.slide2.title_highlight')}
        //                     </strong>
        //                 </h2>
        //                 <p className="text-gray-300 mb-6 sm:mb-8 lg:mb-14 text-sm sm:text-base lg:text-lg xl:text-xl">
        //                     {t('carousel.slide2.description')}
        //                 </p>
        //                 <div className="flex flex-col sm:flex-row gap-4 lg:gap-4">
        //                     <div className="">
        //                         <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 lg:mb-10 sm:h-10">{t('carousel.slide1.job_seekers')}</p>
        //                         <Button variant="primary" size="md" onClick={handleClickFindJobs} className="!rounded-full text-xs sm:text-sm w-full sm:w-auto px-10">
        //                             {t('carousel.slide1.find_job')}
        //                         </Button>
        //                     </div>
        //                     <div className="flex-1 sm:border-l border-gray-500 sm:pl-4 pt-4 sm:pt-0 border-t sm:border-t-0">
        //                         <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 lg:mb-10 sm:h-10">{t('carousel.slide1.businesses')}</p>
        //                         <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        //                             {/* <Button variant="light" size="md" onClick={handleClickPreviewCandidates} className="!rounded-full text-xs sm:text-sm">
        //                                 {t('carousel.slide1.preview_candidates')}
        //                             </Button> */}
        //                             <Button variant="light" size="md" onClick={handleClickHireNow} className="!rounded-full text-xs sm:text-sm">
        //                                 {t('carousel.slide1.hire_now')}
        //                             </Button>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </motion.div>
        // </div>,
        // <div
        //     key={2}
        //     className="w-full h-[calc(100vh-55px)] min-h-[500px] bg-cover bg-center py-6 sm:py-8 lg:py-10"
        //     style={{ backgroundImage: `url(${getImageUrl(banner2.src)})` }}
        // >
        //     <motion.div
        //         initial={{ opacity: 0, y: 50 }}
        //         whileInView={{ opacity: 1, y: 0 }}
        //         transition={{ duration: 0.6, ease: "easeOut" }}
        //         viewport={{ once: true }}
        //         className="h-full flex items-center"
        //     >
        //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start justify-start">
        //             <div className="max-w-xl  ml-0 lg:ml-16">
        //                 <h2 className="text-3xl sm:text-3xl lg:text-4xl xl:text-4xl/13 text-gray-800 font-semibold mb-6 sm:mb-8 lg:mb-14 leading-tight">
        //                     {t('carousel.slide3.title')}
        //                     <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl/15 mt-2">{t('carousel.slide3.subtitle')}</span>
        //                     <strong className="inline-block text-base sm:text-lg lg:text-xl xl:text-5xl/18 bg-blue-900 text-white rounded-xl sm:rounded-2xl px-2 sm:px-3 lg:px-4 py-1 sm:py-2 font-bold uppercase mt-3 whitespace-nowrap">
        //                         {t('carousel.slide3.title_highlight')}
        //                     </strong>
        //                 </h2>
        //                 <p className="text-gray-600 mb-6 sm:mb-8 lg:mb-14 text-sm sm:text-base lg:text-lg xl:text-xl">
        //                     {t('carousel.slide3.description')}
        //                 </p>
        //                 <div className="flex flex-col sm:flex-row gap-4 lg:gap-4">
        //                     <div className="">
        //                         <p className="text-blue-800 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 lg:mb-10">{t('carousel.slide1.job_seekers')}</p>
        //                         <Button variant="primary" size="md" onClick={handleClickFindJobs} className="!rounded-full border text-xs sm:text-sm w-full sm:w-auto px-10 lg:py-4 lg:py-4">
        //                             {t('carousel.slide1.find_job')}
        //                         </Button>
        //                     </div>
        //                     <div className="flex-1 sm:border-l border-gray-300 sm:pl-4 pt-4 sm:pt-0 border-t sm:border-t-0">
        //                         <p className="text-gray-800 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 lg:mb-10">{t('carousel.slide1.businesses')}</p>
        //                         <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        //                             {/* <Button variant="light" size="md" onClick={handleClickPreviewCandidates} className="!rounded-full text-xs sm:text-sm border border-gray-300 lg:py-4">
        //                                 {t('carousel.slide1.preview_candidates')}
        //                             </Button> */}
        //                             <Button variant="light" size="md" onClick={handleClickHireNow} className="!rounded-full text-xs sm:text-sm border border-gray-300 lg:py-4">
        //                                 {t('carousel.slide1.hire_now')}
        //                             </Button>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </motion.div>
        // </div>,
        // <div
        //     key={3}
        //     className="w-full h-[calc(100vh-55px)] min-h-[500px] bg-cover bg-center py-6 sm:py-8 lg:py-10"
        //     style={{ backgroundImage: `url(${getImageUrl(banner3.src)})` }}
        // >
        //     <motion.div
        //         initial={{ opacity: 0, y: 50 }}
        //         whileInView={{ opacity: 1, y: 0 }}
        //         transition={{ duration: 0.6, ease: "easeOut" }}
        //         viewport={{ once: true }}
        //         className="h-full flex items-center"
        //     >
        //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start justify-start">
        //             <div className="max-w-xl  ml-0 lg:ml-16">
        //                 <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-4xl/13 text-gray-800 font-semibold mb-6 sm:mb-8 lg:mb-14 leading-tight">
        //                     {t('carousel.slide3.title')}
        //                     <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl/15 mt-2">{t('carousel.slide3.subtitle')}</span>
        //                     <strong className="inline-block text-base sm:text-lg lg:text-xl xl:text-5xl/18 bg-blue-900 text-white rounded-xl sm:rounded-2xl px-2 sm:px-3 lg:px-4 py-1 sm:py-2 font-bold uppercase mt-3 whitespace-nowrap">
        //                         {t('carousel.slide3.title_highlight')}
        //                     </strong>
        //                 </h2>
        //                 <p className="text-gray-600 mb-6 sm:mb-8 lg:mb-14 text-sm sm:text-base lg:text-lg xl:text-xl">
        //                     {t('carousel.slide3.description')}
        //                 </p>
        //                 <div className="flex flex-col sm:flex-row gap-4 lg:gap-4">
        //                     <div className="">
        //                         <p className="text-blue-800 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 lg:mb-10">{t('carousel.slide1.job_seekers')}</p>
        //                         <Button variant="primary" size="md" onClick={handleClickFindJobs} className="!rounded-full border text-xs sm:text-sm w-full sm:w-auto px-10 lg:py-4">
        //                             {t('carousel.slide1.find_job')}
        //                         </Button>
        //                     </div>
        //                     <div className="flex-1 sm:border-l border-gray-300 sm:pl-4 pt-4 sm:pt-0 border-t sm:border-t-0">
        //                         <p className="text-gray-800 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 lg:mb-10">{t('carousel.slide1.businesses')}</p>
        //                         <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        //                             {/* <Button variant="light" size="md" onClick={handleClickPreviewCandidates} className="!rounded-full text-xs sm:text-sm border border-gray-300 lg:py-4">
        //                                 {t('carousel.slide1.preview_candidates')}
        //                             </Button> */}
        //                             <Button variant="light" size="md" onClick={handleClickHireNow} className="!rounded-full text-xs sm:text-sm border border-gray-300 lg:py-4">
        //                                 {t('carousel.slide1.hire_now')}
        //                             </Button>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </motion.div>
        // </div>
    
];



    return (
        <>
            {/*    Carroussel */}
            <section className="w-full">
                <Carousel slides={slides}  classname="w-dvw z-0" />
                {/* Search bar */}
                {/* <div className="bg-blue-800 rounded-full 
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
                </div> */}
                {/* Carousel */}
            </section>

        </>
    );
}  