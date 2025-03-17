"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";


export function Footer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-[#111225] text-white shadow-md container  z-50 bottom-0 w-full" style={{ width: "100vw" }}>
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
                        <ul className="list-none">
                            <li><Link href="/about" className="hover:text-gray-600 text-gray-400 text-sm d-flex gap-2">
                                <Image src={imagePathFinder.icons_location} alt="logo" width={20} />
                                <span>5805 Av. de Darlington Montréal,QC H3S 2H6</span></Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">819-919-8683 (CANADA)</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">+(226)76443636 (BURKINA FASO)</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Du lundi au vendredi de 8h30 à 17h00</Link></li>
                            <li><Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">nwinnogme.hien@gmail.com</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Image src={imagePathFinder.logo} alt="logo" width={150} />
                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6">
                        <Link href="/" className="hover:text-gray-white text-gray-200 text-sm">Find Jobs</Link>
                        <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Hire Talent</Link>
                        <Link href="/about" className="hover:text-gray-600 text-gray-400 text-sm">About Us</Link>
                        <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Explore Consulting Solutions </Link>
                        <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Discover Insights </Link>
                        <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Discover Insights </Link>
                    </div>

                    <div>
                        <Link href="/login" className="hover:text-gray-600 btn text-gray-400 text-sm">Login</Link>
                    </div>

                    {/* Bouton menu mobile */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu mobile */}
            {isOpen && (
                <div className="md:hidden bg-gray-800">
                    <Link href="#" className="block py-2 px-4 hover:bg-gray-700">Find Jobs</Link>
                    <Link href="#" className="block py-2 px-4 hover:bg-gray-700">Hire Talent</Link>
                    <Link href="#" className="block py-2 px-4 hover:bg-gray-700">About Us</Link>
                    <Link href="#" className="block py-2 px-4 hover:bg-gray-700">Explore Consulting Solutions</Link>
                    <Link href="#" className="block py-2 px-4 hover:bg-gray-700">Discover Insights</Link>
                </div>
            )}
        </nav>
    );
}

