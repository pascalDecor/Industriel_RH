"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Button from "./button";
import { GoArrowUpRight } from "react-icons/go";


export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    alert("Clic !");
  }


  return (
    <nav className="bg-white text-white shadow-md container fixed z-50 top-0 w-full" style={{ width: "100vw" }}>
      <div className="w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          {/* Logo */}
          <Image src={imagePathFinder.logo} alt="logo" width={150} />
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-gray-600 text-gray-400 text-sm">Find Jobs</Link>
            <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Hire Talent</Link>
            <Link href="/about" className="hover:text-gray-600 text-gray-400 text-sm">About Us</Link>
            <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Explore Consulting Solutions </Link>
            <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Discover Insights </Link>
            <Link href="#" className="hover:text-gray-600 text-gray-400 text-sm">Discover Insights </Link>
          </div>

          <div>
            <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-[11px] mr-3 border border-gray-300">
              <Link href="/login" className="hover:text-gray-600 btn text-gray-400 text-sm flex align-middle items-center">

                <span>Contact Us</span>

                <div className="bg-blue-700 p-1 rounded-full ml-3">
                  <GoArrowUpRight size={20} className="text-white" />
                </div>
              </Link>

            </Button>

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

