"use client";

import { useTranslation } from '@/contexts/LanguageContext';

export default function TermsOfUse() {
    const { t } = useTranslation();

    return (
        <div className="px-4 md:px-6 lg:px-10 py-10 max-w-5xl mx-auto text-gray-800 text-sm md:text-base mt-20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-5">
                {t('terms_of_use.title')}
            </h2>
            <p className="mb-5">
                {t('terms_of_use.effective_date')}: {new Date().toLocaleDateString()}
            </p>

            <p className="mb-5">
                {t('terms_of_use.intro')}
            </p>

            <p className="mb-5 font-bold text-base md:text-lg">
                {t('terms_of_use.section1.title')}
            </p>

            <p className="mb-5">
                {t('terms_of_use.section1.content')}
            </p>

            <p className="mb-5 font-bold text-base md:text-lg">
                {t('terms_of_use.section2.title')}
            </p>

            <p className="mb-5">
                {t('terms_of_use.section2.intro')}
            </p>
            <p className="mb-5">
                {t('terms_of_use.section2.agree_not_to')}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {t('terms_of_use.section2.item1')}
                </li>
                <li className="ml-7">
                    {t('terms_of_use.section2.item2')}
                </li>
                <li className="ml-7">
                    {t('terms_of_use.section2.item3')}
                </li>
            </ul>

            <p className="mb-5 font-bold text-base md:text-lg">
                {t('terms_of_use.section3.title')}
            </p>
            <p className="mb-5">
                {t('terms_of_use.section3.content')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('terms_of_use.section4.title')}
            </p>
            <p className="mb-5">
                {t('terms_of_use.section4.content')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('terms_of_use.section5.title')}
            </p>
            <p className="mb-5">
                {t('terms_of_use.section5.content')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('terms_of_use.section6.title')}
            </p>
            <p className="mb-5">
                {t('terms_of_use.section6.content')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('terms_of_use.section7.title')}
            </p>
            <p className="mb-5">
                {t('terms_of_use.section7.content')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('terms_of_use.section8.title')}
            </p>
            <p className="mb-5">
                {t('terms_of_use.section8.content')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('terms_of_use.section9.title')}
            </p>
            <p className="mb-5">
                {t('terms_of_use.section9.content')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('terms_of_use.section10.title')}
            </p>
            <p className="mb-5">
                {t('terms_of_use.section10.content')}<br />
                <a href="mailto:info@industrielle-rh.com" className="text-blue-600 underline">📧 info@industrielle-rh.com</a>
                <br />
                <a href="tel:+819-919-8683" className="text-blue-600 underline">📞 + 819-919-8683</a>
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('terms_of_use.section10.agreement')}
            </p>

        </div>
    );
}
