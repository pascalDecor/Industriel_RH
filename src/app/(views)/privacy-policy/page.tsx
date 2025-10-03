"use client";

import { useTranslation } from '@/contexts/LanguageContext';

export default function PrivacyPolicy() {
    const { t } = useTranslation();

    return (
        <div className="px-4 md:px-6 lg:px-10 py-10 max-w-5xl mx-auto text-gray-800 text-sm md:text-base mt-20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-5">
                {t('privacy_policy.title')}
            </h2>
            <p className="mb-5">
                {t('privacy_policy.effective_date')}: {new Date().toLocaleDateString()}
            </p>
            <p className="mb-5">
                {t('privacy_policy.intro')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('privacy_policy.section1.title')}
            </p>
            <p className="mb-5">
                {t('privacy_policy.section1.intro')}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {t('privacy_policy.section1.item1')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section1.item2')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section1.item3')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section1.item4')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section1.item5')}
                </li>
            </ul>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('privacy_policy.section2.title')}
            </p>
            <p className="mb-5">
                {t('privacy_policy.section2.intro')}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {t('privacy_policy.section2.item1')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section2.item2')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section2.item3')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section2.item4')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section2.item5')}
                </li>
            </ul>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('privacy_policy.section3.title')}
            </p>
            <p className="mb-5">
                {t('privacy_policy.section3.intro')}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {t('privacy_policy.section3.item1')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section3.item2')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section3.item3')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section3.item4')}
                </li>
            </ul>
            <p className="mb-5">
                {t('privacy_policy.section3.no_sell')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('privacy_policy.section4.title')}
            </p>
            <p className="mb-5">
                {t('privacy_policy.section4.intro')}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {t('privacy_policy.section4.item1')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section4.item2')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section4.item3')}
                </li>
                <li className="ml-7">
                    {t('privacy_policy.section4.item4')}
                </li>
            </ul>

            <p className="mb-5">
                {t('privacy_policy.section4.contact')} <a href="mailto:privacy@industrielle-rh.com" className="text-blue-600 underline">privacy@industrielle-rh.com</a>.
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('privacy_policy.section5.title')}
            </p>
            <p className="mb-5">
                {t('privacy_policy.section5.content')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('privacy_policy.section6.title')}
            </p>
            <p className="mb-5">
                {t('privacy_policy.section6.content')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('privacy_policy.section7.title')}
            </p>
            <p className="mb-5">
                {t('privacy_policy.section7.content')} <br />
                <a href="mailto:privacy@industrielle-rh.com" className="text-blue-600 underline">📧 privacy@industrielle-rh.com</a>
                <br />
                <a href="tel:+819-919-8683" className="text-blue-600 underline">📞 + 819-919-8683</a>
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('privacy_policy.section8.title')}
            </p>

            <p className="mb-5">
                {t('privacy_policy.section8.content')} <br />
                {t('privacy_policy.section8.agreement')}
            </p>

        </div>
    );
}
