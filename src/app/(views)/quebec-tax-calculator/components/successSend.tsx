"use client";

import Button from "@/components/ui/button";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { redirect } from "next/navigation";
import Image from 'next/image';
import { useTranslation } from "@/contexts/LanguageContext";

export default function SuccessSend() {
    const { t } = useTranslation();

    return <div className="mx-auto mb-0 p-5 rounded-2xl bg-blue-200 text-center">
        <Image loading="lazy" src={imagePathFinder.check} alt={t('quebec_tax_calculator.success_send.alt_image')} className="mx-auto w-30 mb-3" />
        <h2 className="text-3xl font-semibold text mb-2 text-gray-800">
            {t('quebec_tax_calculator.success_send.title')}
        </h2>
        <p className="text-gray-800 mb-7">
            {t('quebec_tax_calculator.success_send.description')}
        </p>
        <Button className="mx-auto mb-3 !rounded-full" onClick={() => redirect("/")}>
            {t('quebec_tax_calculator.success_send.back_home')}
        </Button>
    </div>
}