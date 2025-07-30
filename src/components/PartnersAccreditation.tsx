"use client";

import { imagePathFinder } from "@/utils/imagePathFinder";
import { useTranslation } from "@/contexts/LanguageContext";
import Image from 'next/image'

export default function PartnersAccreditation() {
    const { t } = useTranslation();

    return (
        <>
            {/*   Partners & Accreditation */}
            <section className="mx-auto w-5xl mb-10 p-10">
                <div className="w-full bg-[url(/images/partners_accreditation.png)] bg-cover bg-center bg-blue-900 p-10 rounded-4xl border">

                    <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
                        {t('partners.title')}
                    </h2>

                    <div className="grid grid-cols-5 gap-4 w-full mb-10 ">
                        <div className="col-span-1 bg-white rounded-2xl p-3 text-center flex flex-col items-center justify-center">
                            <Image loading="lazy" src={imagePathFinder.partners_desjardins} alt="Describe your Need" className="w-full my-auto" />
                        </div>
                        <div className="col-span-1 bg-white rounded-2xl p-3 text-center flex flex-col items-center justify-center">
                            <Image loading="lazy" src={imagePathFinder.partners_CRIC} alt="  We Source the Talent" className="w-full my-auto" />

                        </div>
                        <div className="col-span-1 bg-white rounded-2xl p-3 text-center flex flex-col items-center justify-center">
                            <Image loading="lazy" src={imagePathFinder.partners_cnesst} alt="Select and Approve" className="w-full my-auto" />

                        </div>
                        <div className="col-span-1 bg-white rounded-2xl p-3 text-center flex flex-col items-center justify-center">
                            <Image loading="lazy" src={imagePathFinder.partners_pme_mtl} alt="Seamless Integration" className="w-full my-auto" />

                        </div>
                        <div className="col-span-1 bg-white rounded-2xl p-3 text-center flex flex-col items-center justify-center">
                            <Image loading="lazy" src={imagePathFinder.partners_stride} alt="Continuous Support" className="w-full my-auto" />
                        </div>

                    </div>

                </div>
            </section>
        </>
    );
}