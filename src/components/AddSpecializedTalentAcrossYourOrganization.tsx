
"use client";

import { imagePathFinder } from "@/utils/imagePathFinder";
import { FiArrowRight } from "react-icons/fi";
import Button from "./ui/button";
import Image from 'next/image'
import { HttpService } from "@/utils/http.services";
import { Sector } from "@/models/sector";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";
import { LocalStorageHelper } from "@/utils/localStorage.helper";
import { useRouter } from "next/navigation";

export default function AddSpecializedTalentAcrossYourOrganization() {
    const { t, language } = useTranslation();
    const [isFrench, setIsFrench] = useState(language === 'fr');
    const router = useRouter();

    function handleClickSector(sector: Sector) {
        setSectorActive(sector);
    }

    function handleClickFunction(sectorId: string) {
        if (sectorActive) {
            // Sauvegarder le secteur actif dans le localStorage
            LocalStorageHelper.setValue("activeSector", JSON.stringify(sectorActive.toJSON()));
            // Rediriger vers la page consulting-solutions
            router.push("/consulting-solutions");
        }
    }

    const [sectorActive, setSectorActive] = useState<Sector | undefined>(undefined);
    const [sectors, setSectors] = useState<Sector[]>([]);

    useEffect(() => {
        HttpService.index<Sector>({ url: '/sectors', fromJson: (json: any) => Sector.fromJSON(json), })
            .then((data) => {
                setSectors(data.data);
                if (sectorActive === undefined) {
                    setSectorActive(data.data[0]);
                }
            });

    }, []);



    return (
        <>
            {/*   Add specialized talent across your organization */}


            <section className="mx-auto max-w-7xl mb-10 p-4 sm:p-6 lg:p-10">
                <div className="w-full bg-cover bg-center bg-blue-900 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-4xl border">

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-3xl lg:text-4xl font-semibold text mb-6 sm:mb-8 lg:mb-10 mt-3 sm:mt-4 lg:mt-5 text-white text-center"
                    >
                        {t('specialized_talent.title')}
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap mb-6 sm:mb-8 lg:mb-10 gap-2 sm:gap-3 lg:gap-4 mx-auto items-center justify-center"
                    >
                        {
                            sectorActive &&
                            sectors.map((s) =>
                                <Button key={s.id} variant={sectorActive.id === s.id ? "dark" : "light"} size="md" onClick={() => handleClickSector(s)} className="!rounded-full text-xs sm:text-sm">
                                    {isFrench ? s.libelle : s.libelle_en}
                                </Button>
                            )}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 w-full text-white gap-6 lg:gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="relative order-2 lg:order-1"
                        >
                            <p className="text-xs sm:text-sm font-light text-start mb-3 sm:mb-4">
                                {sectorActive && (isFrench ? sectorActive?.sections.filter((s) => s.page === "home")[0]?.description :
                                    sectorActive?.sections.filter((s) => s.page === "home")[0]?.description_en)} :
                            </p>
                            <p className="text-xs sm:text-sm font-bold text-start mb-3 sm:mb-4">
                                {t('specialized_talent.trending_jobs')}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 mb-4 gap-2">
                                {sectorActive && sectorActive?.functions.map((f) =>
                                    <div key={f.id}>
                                        <p className="text-xs sm:text-sm font-light text-start mb-2 sm:mb-3 underline">
                                            {isFrench ? f.libelle : f.libelle_en}
                                        </p>
                                    </div>)}
                            </div>
                            <div className="relative mb-6 sm:mb-8 lg:mb-10 pt-6 sm:pt-8 lg:pt-10">
                                <motion.img
                                    key={sectorActive?.id}
                                    src={imagePathFinder.light.src}
                                    initial={{
                                        y: 100,
                                        opacity: 0
                                    }}
                                    animate={{
                                        y: 0,
                                        opacity: 1
                                    }}
                                    exit={{
                                        x: -100,
                                        opacity: 0
                                    }}
                                    width={500}
                                    height={500}
                                    alt="We Source the Talent"
                                    className="hidden lg:block absolute bottom-0 -right-30 sm:-right-50 xl:-right-20 w-3/5 xl:w-2/3 z-20"
                                />

                                <Button
                                    variant="light"
                                    size="md"
                                    onClick={() => handleClickFunction(sectorActive?.id ?? "")}
                                    className="!rounded-full text-xs sm:text-sm border border-gray-300 !text-gray-500 flex items-center px-4 sm:px-6 lg:px-10 relative z-30 w-full sm:w-auto sm:mt-20"
                                >
                                    <span className="flex-1 sm:flex-none">
                                        {t('specialized_talent.learn_more', { sector: sectorActive?.libelle || 'Manufacturing' })}
                                    </span>
                                    <div className="bg-blue-700 p-1 rounded-full ml-2 sm:ml-3 flex-shrink-0">
                                        <FiArrowRight className="text-white" />
                                    </div>
                                </Button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="relative p-3 sm:p-4 lg:p-5 order-1 lg:order-2"
                        >
                            <Image
                                loading="lazy"
                                src={imagePathFinder.bg}
                                width={500}
                                height={500}
                                alt="Background"
                                className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-lg"
                            />
                            {sectorActive &&
                                <Image
                                    loading="lazy"
                                    src={sectorActive === undefined ? imagePathFinder.add_specialized_talent_across_your_organization : sectorActive.sections.filter((s) => s.page === "home")[0]?.image}
                                    width={500}
                                    height={500}
                                    alt="Sector illustration"
                                    className="relative z-10 w-full h-auto rounded-lg"
                                />
                            }
                        </motion.div>
                    </div>

                </div>
            </section>

        </>
    );
}  