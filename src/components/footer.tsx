"use client";

import Link from "next/link";
import { DynamicImage } from "@/components/ui/DynamicImage";
import { RiFacebookFill } from "react-icons/ri";
import { ImLinkedin2 } from "react-icons/im";
import { FaTwitter } from "react-icons/fa6";
import { BsYoutube } from "react-icons/bs";
import { LuInstagram } from "react-icons/lu";
import { useTranslation } from "@/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { AsyncBuilder } from "./ui/asyncBuilder";
import { HttpService } from "@/utils/http.services";
import { Sector } from "@/models/sector";
import { LoadingSpinner } from "@/lib/load.helper";
import { LocalStorageHelper } from "@/utils/localStorage.helper";
import { EditableText } from "@/app/(admin)/management/translations/components/EditableText";


type footerProps = {
    isTranslateMode?: boolean;
    translations?: { id: string; key: string; fr: string; en: string }[];
    onUpdate?: (id: string, fr: string, en: string) => void;
}

export function Footer({ isTranslateMode = false, translations = [], onUpdate = () => {} }: footerProps) {
    const { t, language } = useTranslation();

    // Prevent link clicks in translate mode
    const handleLinkClick = (e: React.MouseEvent) => {
        if (isTranslateMode) {
            e.preventDefault();
        }
    };

    // Helper function to render text based on mode
    const renderText = (key: string) => {
        if (!isTranslateMode) {
            return t(key);
        }

        const translation = translations.find(tr => tr.key === key);
        if (!translation) {
            return t(key);
        }

        return (
            <EditableText
                translationKey={key}
                currentText={language === 'fr' ? translation.fr : translation.en}
                language={language as 'fr' | 'en'}
                translationId={translation.id}
                onUpdate={onUpdate}
                allTranslations={translations}
                className="hover:bg-yellow-200 hover:text-gray-900"
            />
        );
    };

    // Icône personnalisé pour le marqueur
    const customIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    return (
        <footer className="bg-[#111225] text-white shadow-md   z-50 bottom-0 w-full overflow-hidden " >
            <div className="w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <hr className="border-gray-700 border-1" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-4 align-middle justify-between mt-10">
                    <div className="lg:col-span-2">
                        <h4 className=" font-bold mb-4">{renderText('footer.services')}</h4>
                        <ul className="list-none">
                            {/* <li><Link href="/find-jobs" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm">{renderText('footer.browse_jobs')}</Link></li> */}
                            <li><Link href="/hire-talent" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm">{renderText('footer.international_recruitment')}</Link></li>
                            <li><Link href="/consulting-solutions" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm">{renderText('footer.recruitment_outsourcing')}</Link></li>
                        </ul>
                    </div>
                    <div className="lg:col-span-2">
                        <h4 className=" font-bold mb-4">{renderText('footer.areas_expertise')}</h4>
                        <AsyncBuilder
                            promise={async () => {
                                return HttpService.index<Sector>({
                                    url: '/sectors?limit=5',
                                    fromJson: (json: any) => Sector.fromJSON(json)
                                });
                            }}
                            autoRefreshOnListen={false}
                            autoRefreshOnPromiseChange={false}
                            loadingComponent={<LoadingSpinner color="#0F766E" />}
                            hasData={(data) => (
                                <ul className="list-none">
                                    {data.data.map((sector: any) => (
                                        <li key={sector.id}>
                                            <Link
                                                href="/consulting-solutions"
                                                onClick={(e) => {
                                                    if (isTranslateMode) {
                                                        e.preventDefault();
                                                    } else {
                                                        LocalStorageHelper.setValue("activeSector", JSON.stringify(sector.toJSON()));
                                                    }
                                                }}
                                                className="hover:text-gray-600 text-gray-400 text-sm"
                                            >
                                                {language === 'fr' ? sector.libelle : sector.libelle_en}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <h4 className=" font-bold mb-4">Ressources</h4>
                        <ul className="list-none">
                            <li><Link href="/salary-guide" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm">Guide Salarial</Link></li>
                            <li><Link href="/quebec-tax-calculator" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm">Calculateur Impôt QC</Link></li>
                            <li><Link href="/morgage-calculator" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm">Calculateur Hypothèque</Link></li>
                            {/* <li><Link href="/valid-cnesst" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm">Validation CNESST</Link></li> */}
                        </ul>
                    </div>
                    <div className="lg:col-span-2">
                        <h4 className=" font-bold mb-4">{renderText('footer.about_us')}</h4>
                        <ul className="list-none">
                            <li><Link href="/about" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm">{renderText('footer.about_industrielle')}</Link></li>
                            <li><Link href="/find-jobs" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm">{renderText('footer.careers')}</Link></li>
                            <li><Link href="/contact" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="lg:col-span-4">
                        <h4 className=" font-bold mb-4">{renderText('footer.location')}</h4>
                        <ul className="list-none flex flex-col gap-3">
                            <li>
                                <Link href="#" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <DynamicImage imageKey="icons_location" alt="location" width={20} height={20} />
                                    </div>
                                    <span>5805 Av. de Darlington Montréal,QC H3S 2H6</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="tel:819-919-8683" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <DynamicImage imageKey="icons_phone" alt="phone" width={20} height={20} />
                                    </div>
                                    <span>819-919-8683 (CANADA)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="tel:+22676443636" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <DynamicImage imageKey="icons_phone" alt="phone" width={20} height={20} />
                                    </div>
                                    <span>+(226)76443636 (BURKINA FASO)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <DynamicImage imageKey="icons_horloge" alt="hours" width={20} height={20} />
                                    </div>
                                    <span>{renderText('footer.hours')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="mailto:recrutement@industriellerh.com" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <DynamicImage imageKey="icons_envelop" alt="email" width={20} height={20} />
                                    </div>
                                    <span>recrutement@industriellerh.com</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-10 align-end justify-between mt-10">
                    <div className="lg:col-span-4 flex flex-col items-start md:items-start justify-end">

                        <DynamicImage imageKey="logo_light" alt="logo" width={200} height={60} />
                        <div className="mt-5 flex gap-2">
                            <div className="col-span-1 bg-white hover:bg-blue-100 rounded-md text-blue-800 hover:text-blue-600 w-10 h-10 ">
                                <Link href="#" onClick={handleLinkClick} className="w-full h-full flex justify-center items-center">
                                    <RiFacebookFill size={20} />
                                </Link>
                            </div>
                            <div className="col-span-1 bg-white hover:bg-blue-100 rounded-md text-blue-800 hover:text-blue-600 w-10 h-10 ">
                                <Link href="#" onClick={handleLinkClick} className="w-full h-full flex justify-center items-center">
                                    <ImLinkedin2 size={20} />
                                </Link>
                            </div>
                            <div className="col-span-1 bg-white hover:bg-blue-100 rounded-md text-blue-800 hover:text-blue-600 w-10 h-10 ">
                                <Link href="#" onClick={handleLinkClick} className="w-full h-full flex justify-center items-center">
                                    <FaTwitter size={20} />
                                </Link>
                            </div>
                            <div className="col-span-1 bg-white hover:bg-blue-100 rounded-md text-blue-800 hover:text-blue-600 w-10 h-10 ">
                                <Link href="#" onClick={handleLinkClick} className="w-full h-full flex justify-center items-center">
                                    <BsYoutube size={20} />
                                </Link>
                            </div>
                            <div className="col-span-1 bg-white hover:bg-blue-100 rounded-md text-blue-800 hover:text-blue-600 w-10 h-10 ">
                                <Link href="#" onClick={handleLinkClick} className="w-full h-full flex justify-center items-center">
                                    <LuInstagram size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 flex flex-col items-start md:items-center justify-end">
                        <LanguageSelector />
                    </div>
                    <div className="lg:col-span-4 flex flex-col items-start md:items-center justify-end">
                        <div className="w-full h-40 bg-gray-200 rounded-[15px] overflow-hidden">
                            <MapContainer
                                center={[45.507044, -73.622968]}
                                zoom={13}
                                className="h-full w-full"
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[45.507044, -73.622968]} icon={customIcon}>

                                    <Popup>
                                        <div className="text-center">
                                            <strong>Industrielle RH</strong><br />
                                            5805 Av. de Darlington<br />
                                            Montréal, QC H3S 2H6<br />
                                            <span className="text-blue-600">819-919-8683</span>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-700 border-1 my-10" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 align-middle justify-between mt-10">
                    <div className="md:col-span-1">
                        <ul className="list-none flex flex-col md:flex-row gap-3 md:gap-0 text-sm">
                            <li className="whitespace-nowrap">
                                <Link href="/terme-of-conditions" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-[11px]">{renderText('footer.fraud_alert')}</Link>
                            </li>
                            <li className="whitespace-nowrap md:border-l-2 border-gray-700 md:pl-3 md:ml-3">
                                <Link href="/privacy-policy" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-[11px]">{renderText('footer.privacy_policy')}</Link>
                            </li>
                            <li className="whitespace-nowrap md:border-l-2 border-gray-700 md:pl-3 md:ml-3">
                                <Link href="/terme-of-use" onClick={handleLinkClick} className="hover:text-gray-600 text-gray-400 text-[11px]">{renderText('footer.terms_of_use')}</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="md:col-span-1 text-start md:text-end">
                        <p className="text-[11px] text-gray-400 font-light">
                            {renderText('footer.rights_reserved')} {renderText('footer.quebec_license')}
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
}

