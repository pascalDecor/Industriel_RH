"use client";

import { DynamicImage } from "@/components/ui/DynamicImage";
import { useTranslation } from "@/contexts/LanguageContext";


export default function Team() {
    const { t } = useTranslation();

    return <>
        {/* Catalyst of prosperity for Quebec businesses */}
        <section className="mx-auto w-lvw mb-0 px-10 py-24 bg-gray-200">
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
                {t('about.leadership_team.title')}
            </h2>

            <div className="mx-auto max-w-5xl mb-10 p-10 grid grid-cols-3 gap-4">
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <DynamicImage imageKey="Jerome_youmani_lankoande" alt="Jérôme Youmani Lankoandé" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Jérôme Youmani Lankoandé +
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        {t('about.positions.ceo')}
                    </p>
                </div>
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <DynamicImage imageKey="alice_morin" alt="Alice Morin" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Alice Morin
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        {t('about.positions.it_manager')}
                    </p>
                </div>
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <DynamicImage imageKey="louis_caron" alt="Louis Caron" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Louis Caron
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        {t('about.positions.project_director')}
                    </p>
                </div>

            </div>
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
                {t('about.leadership_team.board_title')}
            </h2>

            <div className="mx-auto max-w-5xl mb-10 p-10 grid grid-cols-3 gap-4">
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <DynamicImage imageKey="paul_farcas" alt="Paul Farcas" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Paul Farcas
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        {t('about.positions.it_systems_director')}
                    </p>
                </div>
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <DynamicImage imageKey="komi_sodoke" alt="Komi Sodoke, PhD" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Komi Sodoke, PhD
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        {t('about.positions.ai_project_director')}
                    </p>
                </div>
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center  bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <DynamicImage imageKey="eloise_emery" alt="Éloïse Emery" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Éloïse Emery
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        {t('about.positions.web_developer')}
                    </p>
                </div>

            </div>
        </section>
    </>
}