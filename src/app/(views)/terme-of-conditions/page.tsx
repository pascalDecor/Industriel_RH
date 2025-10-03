"use client";

import { useTranslation } from '@/contexts/LanguageContext';

export default function FraudAlert() {
    const { t } = useTranslation();

    return (
        <div className="px-4 md:px-6 lg:px-10 py-10 max-w-5xl mx-auto text-gray-800 text-sm md:text-base mt-20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-5">
                {t('fraud_alert.title')}
            </h2>
            <p className="mb-5">
                {t('fraud_alert.intro')}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {t('fraud_alert.never_ask.item1')}
                </li>
                <li className="ml-7">
                    {t('fraud_alert.never_ask.item2')}
                </li>
                <li className="ml-7">
                    {t('fraud_alert.never_ask.item3')}
                </li>
                <li className="ml-7">
                    {t('fraud_alert.never_ask.item4')}
                </li>
                <li className="ml-7">
                    {t('fraud_alert.never_ask.item5')}
                </li>
            </ul>
            <p className="mb-5">
                {t('fraud_alert.no_instant_messaging')}
            </p>
            <p className="mb-5">
                {t('fraud_alert.no_freelance_platforms')}
            </p>
            <p className="mb-5">
                {t('fraud_alert.no_digital_wallets')}
            </p>
            <p className="mb-5">
                {t('fraud_alert.authorized_regions')}
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('fraud_alert.what_to_do.title')}
            </p>
            <p className="mb-5">
                {t('fraud_alert.what_to_do.content')} <a href="mailto:contact@industrielle-rh.com.au" className="text-blue-600 underline">contact@industrielle-rh.com.au</a>
            </p>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('fraud_alert.suspicious_signs.title')}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {t('fraud_alert.suspicious_signs.item1')}
                </li>
                <li className="ml-7">
                    {t('fraud_alert.suspicious_signs.item2')}
                </li>
            </ul>
            <p className="mb-5 font-bold text-base md:text-lg">
                {t('fraud_alert.resources.title')}
            </p>

            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {t('fraud_alert.resources.item1')}{" "}
                    <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" href="https://antifraudcentre-centreantifraude.ca/report-signalez-eng.htm">https://antifraudcentre-centreantifraude.ca/report-signalez-eng.htm</a>
                </li>
                <li className="ml-7">
                    {t('fraud_alert.resources.item2')}{" "}
                    <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" href="https://www.antifraudcentre-centreantifraude.ca/scams-fraudes/victim-victime-eng.htm">https://www.antifraudcentre-centreantifraude.ca/scams-fraudes/victim-victime-eng.htm</a>
                </li>
                <li className="ml-7">
                    {t('fraud_alert.resources.item3')}{" "}
                    <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" href="https://ised-isde.canada.ca/site/office-consumer-affairs/en/identity-theft-spam-and-fraud">https://ised-isde.canada.ca/site/office-consumer-affairs/en/identity-theft-spam-and-fraud</a>
                </li>
                <li className="ml-7">
                    {t('fraud_alert.resources.item4')}{" "}
                    <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" href="https://bc-cb.rcmp-grc.gc.ca/ViewPage.action?siteNodeId=2081&languageId=1&contentId=-1">https://bc-cb.rcmp-grc.gc.ca/ViewPage.action?siteNodeId=2081&languageId=1&contentId=-1</a>
                </li>
            </ul>
        </div>
    );
}
