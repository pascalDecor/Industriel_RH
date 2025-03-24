"use client";

import Link from "next/link";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { RiFacebookFill } from "react-icons/ri";
import { ImLinkedin2 } from "react-icons/im";
import { FaTwitter } from "react-icons/fa6";
import { BsYoutube } from "react-icons/bs";
import { LuInstagram } from "react-icons/lu";
import Button from "./button";
import "leaflet/dist/leaflet.css";


export function Footer() {

    function handleClick() {
        alert("Clic !");
    }


    return (
        <footer className="bg-[#111225] text-white shadow-md   z-50 bottom-0 w-full overflow-hidden " >
            <div className="w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <hr className="border-gray-700 border-1" />
                <div className="grid grid-cols-12 gap-4 align-middle justify-between mt-10">
                    <div className="col-span-3">
                        <h4 className=" font-bold mb-4">Services</h4>
                        <ul className="list-none">
                            <li><Link href="/about" className="hover:text-gray-600 text-gray-400 text-sm">Browse Jobs</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">International Recruitment</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Recruitment by Outsourcing</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-3">
                        <h4 className=" font-bold mb-4">Areas of Expertise</h4>
                        <ul className="list-none">
                            <li><Link href="/about" className="hover:text-gray-600 text-gray-400 text-sm">Manufacturing</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Construction</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Healthcare</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Transport</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Agriculture & Agro-Food</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-3">
                        <h4 className=" font-bold mb-4">About Us</h4>
                        <ul className="list-none">
                            <li><Link href="/about" className="hover:text-gray-600 text-gray-400 text-sm">About industrielle RH <br /> Careers with Us </Link></li>
                        </ul>
                    </div>
                    <div className="col-span-3">
                        <h4 className=" font-bold mb-4">Location</h4>
                        <ul className="list-none flex flex-col gap-3">
                            <li>
                                <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <Image src={imagePathFinder.icons_location} alt="logo" width={20} />
                                    </div>
                                    <span>5805 Av. de Darlington Montréal,QC H3S 2H6</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="tel:819-919-8683" className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <Image src={imagePathFinder.icons_phone} alt="logo" width={20} />
                                    </div>
                                    <span>819-919-8683 (CANADA)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="tel:+22676443636" className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <Image src={imagePathFinder.icons_phone} alt="logo" width={20} />
                                    </div>
                                    <span>+(226)76443636 (BURKINA FASO)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <Image src={imagePathFinder.icons_horloge} alt="logo" width={20} />
                                    </div>
                                    <span>Du lundi au vendredi de 8h30 à 17h00</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="mailto:nwinnogme.hien" className="hover:text-gray-600 text-gray-400 text-sm flex gap-2">
                                    <div className="flex items-start">
                                        <Image src={imagePathFinder.icons_envelop} alt="logo" width={20} />
                                    </div>
                                    <span>nwinnogme.hien@gmail.com</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-10 align-end justify-between mt-10">
                    <div className="col-span-4 flex flex-col  items-start justify-end">

                        <Image src={imagePathFinder.logo_light} alt="logo" width={200} />
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
                    <div className="col-span-4 flex flex-col  items-center justify-end">
                        <Button variant="primary" size="md" onClick={handleClick} className="!rounded-full text-[11px] ">
                            <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-[11px] mr-3">
                                Canada (English)
                            </Button>
                            Select a region and language
                        </Button>
                    </div>
                    <div className="col-span-4 flex flex-col  items-center justify-end">
                        <div className="w-full h-40 bg-gray-200 rounded-[15px] overflow-hidden">
                        </div>
                    </div>
                </div>

                <hr className="border-gray-700 border-1 my-10" />

                <div className="grid grid-cols-12 gap-4 align-middle justify-between mt-10">
                    <div className="col-span-6">
                        <ul className="list-none grid grid-cols-12 gap-1 text-sm">
                            <li className="col-span-2">
                                <Link href="/about" className="hover:text-gray-600 text-gray-400 text-[11px]">Fraud Alert</Link>
                            </li>
                            <li className="col-span-3 border-l-2 border-gray-700 pl-3 text-center">
                                <Link href="#" className="hover:text-gray-600 text-gray-400 text-[11px]">Privacy Policy</Link>
                            </li>
                            <li className="col-span-3 border-l-2 border-gray-700 pl-3 text-center">
                                <Link href="#" className="hover:text-gray-600 text-gray-400 text-[11px]">Terms of Use</Link>
                            </li>
                            <li className="col-span-4 border-l-2 border-gray-700 pl-3 text-center">
                                <Link href="#" className="hover:text-gray-600 text-gray-400 text-[11px]">Modern Slavery Report</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-6 text-end">
                        <p className="text-[11px] text-gray-400 font-light">© 2025 Robert Half Canada Inc. All Rights Reserved.
                            Numéro de permis du Québec AP-2000503</p>
                    </div>

                </div>
            </div>
        </footer>
    );
}

