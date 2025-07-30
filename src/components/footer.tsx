"use client";

import Link from "next/link";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { RiFacebookFill } from "react-icons/ri";
import { ImLinkedin2 } from "react-icons/im";
import { FaTwitter } from "react-icons/fa6";
import { BsYoutube } from "react-icons/bs";
import { LuInstagram } from "react-icons/lu";
import { useTranslation } from "@/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";


export function Footer() {
    const { t } = useTranslation();


    return (
        <footer className="bg-[#111225] text-white shadow-md   z-50 bottom-0 w-full overflow-hidden " >
            <div className="w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <hr className="border-gray-700 border-1" />
                <div className="grid grid-cols-12 gap-4 align-middle justify-between mt-10">
                    <div className="col-span-3">
                        <h4 className=" font-bold mb-4">{t('footer.services')}</h4>
                        <ul className="list-none">
                            <li><Link href="/find-jobs" className="hover:text-gray-600 text-gray-400 text-sm">{t('footer.browse_jobs')}</Link></li>
                            <li><Link href="/hire-talent" className="hover:text-gray-600 text-gray-400 text-sm">{t('footer.international_recruitment')}</Link></li>
                            <li><Link href="/hire-talent" className="hover:text-gray-600 text-gray-400 text-sm">{t('footer.recruitment_outsourcing')}</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-3">
                        <h4 className=" font-bold mb-4">{t('footer.areas_expertise')}</h4>
                        <ul className="list-none">
                            <li><Link href="/about" className="hover:text-gray-600 text-gray-400 text-sm">{t('footer.manufacturing')}</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">{t('footer.construction')}</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">{t('footer.healthcare')}</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">{t('footer.transport')}</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">{t('footer.agriculture')}</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-3">
                        <h4 className=" font-bold mb-4">{t('footer.about_us')}</h4>
                        <ul className="list-none">
                            <li><Link href="/about" className="hover:text-gray-600 text-gray-400 text-sm">{t('footer.about_industrielle')}</Link></li>
                            <li><Link href="/about" className="hover:text-gray-600 text-gray-400 text-sm">{t('footer.careers')}</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-3">
                        <h4 className=" font-bold mb-4">{t('footer.location')}</h4>
                        <ul className="list-none flex flex-col gap-3">
                            <li>
                                <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <Image loading="lazy" src={imagePathFinder.icons_location} alt="logo" width={20} />
                                    </div>
                                    <span>5805 Av. de Darlington Montréal,QC H3S 2H6</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="tel:819-919-8683" className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <Image loading="lazy" src={imagePathFinder.icons_phone} alt="logo" width={20} />
                                    </div>
                                    <span>819-919-8683 (CANADA)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="tel:+22676443636" className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <Image loading="lazy" src={imagePathFinder.icons_phone} alt="logo" width={20} />
                                    </div>
                                    <span>+(226)76443636 (BURKINA FASO)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <Image loading="lazy" src={imagePathFinder.icons_horloge} alt="logo" width={20} />
                                    </div>
                                    <span>{t('footer.hours')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="mailto:recrutement@industriellerh.com" className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <Image loading="lazy" src={imagePathFinder.icons_envelop} alt="logo" width={20} />
                                    </div>
                                    <span>recrutement@industriellerh.com</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-10 align-end justify-between mt-10">
                    <div className="col-span-4 flex flex-col  items-start justify-end">

                        <Image loading="lazy" src={imagePathFinder.logo_light} alt="logo" width={200} />
                        <div className="mt-5 flex gap-2">
                            <div className="col-span-1 bg-white hover:bg-blue-100 rounded-md text-blue-800 hover:text-blue-600 w-10 h-10 ">
                                <Link href="#" className="w-full h-full flex justify-center items-center">
                                    <RiFacebookFill size={20} />
                                </Link>
                            </div>
                            <div className="col-span-1 bg-white hover:bg-blue-100 rounded-md text-blue-800 hover:text-blue-600 w-10 h-10 ">
                                <Link href="#" className="w-full h-full flex justify-center items-center">
                                    <ImLinkedin2 size={20} />
                                </Link>
                            </div>
                            <div className="col-span-1 bg-white hover:bg-blue-100 rounded-md text-blue-800 hover:text-blue-600 w-10 h-10 ">
                                <Link href="#" className="w-full h-full flex justify-center items-center">
                                    <FaTwitter size={20} />
                                </Link>
                            </div>
                            <div className="col-span-1 bg-white hover:bg-blue-100 rounded-md text-blue-800 hover:text-blue-600 w-10 h-10 ">
                                <Link href="#" className="w-full h-full flex justify-center items-center">
                                    <BsYoutube size={20} />
                                </Link>
                            </div>
                            <div className="col-span-1 bg-white hover:bg-blue-100 rounded-md text-blue-800 hover:text-blue-600 w-10 h-10 ">
                                <Link href="#" className="w-full h-full flex justify-center items-center">
                                    <LuInstagram size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4 flex flex-col items-center justify-end">
                        <LanguageSelector />
                    </div>
                    <div className="col-span-4 flex flex-col  items-center justify-end">
                    <div className="w-full h-40 bg-gray-200 rounded-[15px] overflow-hidden">
                            <MapContainer className="h-full w-full">
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[48.8566, 2.3522]}>
                                    <Popup>Paris, France</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-700 border-1 my-10" />

                <div className="grid grid-cols-12 gap-4 align-middle justify-between mt-10">
                    <div className="col-span-6">
                        <ul className="list-none grid grid-cols-12 gap-1 text-sm">
                            <li className="col-span-2 whitespace-nowrap">
                                <Link href="/terme-of-conditions" className="hover:text-gray-600 text-gray-400 text-[11px]">{t('footer.fraud_alert')}</Link>
                            </li>
                            <li className="col-span-2 whitespace-nowrap border-l-2 border-gray-700 pl-3 text-center">
                                <Link href="/privacy-policy" className="hover:text-gray-600 text-gray-400 text-[11px]">{t('footer.privacy_policy')}</Link>
                            </li>
                            <li className="col-span-2 whitespace-nowrap border-l-2 border-gray-700 pl-3 text-center">
                                <Link href="/terme-of-use" className="hover:text-gray-600 text-gray-400 text-[11px]">{t('footer.terms_of_use')}</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-6 text-end">
                        <p className="text-[11px] text-gray-400 font-light">
                            {t('footer.rights_reserved')} {t('footer.quebec_license')}
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
}

