"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Button from "./ui/button";
import { GoArrowUpRight } from "react-icons/go";
import { motion } from "framer-motion";
import clsx from "clsx";
import { FindJobsExpandedNavbar } from "./navbar/find-jobs";
import { ConsultingSolutionsExpandedNavbar } from "./navbar/consulting-solutions";
import { DiscoverInsightsExpandedNavbar } from "./navbar/discover-insights";
import { HireTalentExpandedNavbar } from "./navbar/hire-talent";


interface NavItem {
  label: string;
  href: string;
  expandedComponnent?: React.FC;
}


// Contenu affiché au hover
const dropdownContent = {
  "find-jobs": <FindJobsExpandedNavbar />,
  "hire-talent": "Trouvez les meilleurs talents pour votre entreprise.",
  "about": "En savoir plus sur notre entreprise et notre mission.",
  "consulting-solutions": "Découvrez nos solutions de conseil personnalisées.",
  "discover-insights": "Restez informé des tendances du marché.",
};

const navItems: NavItem[] = [
  {
    label: "Find Jobs",
    href: "/find-jobs",
    expandedComponnent: FindJobsExpandedNavbar,
  },
  {
    label: "Hire Talent",
    href: "/hire-talent",
    expandedComponnent: HireTalentExpandedNavbar,
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Consulting Solutions",
    href: "/consulting-solutions",
    expandedComponnent: ConsultingSolutionsExpandedNavbar,
  },
  {
    label: "Discover Insights",
    href: "/discover-insights",
    expandedComponnent: DiscoverInsightsExpandedNavbar,
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  function handleClick() {
    console.log("clicked");
  }

  return (
    <nav className="bg-white text-white shadow-md fixed z-50 top-0 w-full hover:bg-gray-100">
      <div className={clsx("relative w-full")}>
        <div className={clsx("w-7xl mx-auto px-4 sm:px-6 lg:px-8 ", {
          "h-100": isOpen
        })}>
          <div className="flex justify-between h-18 items-center">
            {
              /* Logo */
            }
            <Link href="/">
              <Image src={imagePathFinder.logo} alt="logo" width={150} />
            </Link>

            {
              /* Desktop Menu */
            }
            <div className="hidden md:flex space-x-6 h-full my-auto align-middle mt-5">
              {navItems.map((navItem, index) =>
                <div
                  key={index}
                  onMouseEnter={() => setHoveredItem(navItem.href)}
                  onMouseLeave={() => setHoveredItem(null)}>
                  <Link href={navItem.href} className={clsx("hover:text-blue-900 text-gray-400 text-sm",{
                    "text-blue-600": hoveredItem === navItem.href
                  })}>
                    {navItem.label}
                  </Link>
                  {/* Dropdown Content */ }
                  {(hoveredItem === navItem.href && navItem.expandedComponnent) && <motion.div
                    initial={{ opacity: 0, }}
                    animate={{ opacity: 1, }}
                    exit={{ opacity: 0, }}
                    className="absolute w-full left-0 top-15 mt-2 bg-gray-100 p-4  text-gray-700 shadow-xl">
                    {navItem.expandedComponnent && <navItem.expandedComponnent />}
                  </motion.div>}
                </div>)}
            </div>

            {
              /* Contact Button */
            }
            <div>
              <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-[11px] mr-3 border border-gray-300">
                <Link href="/contact" className="hover:text-gray-600 btn text-gray-400 text-sm flex align-middle items-center">
                  <span>Contact Us</span>
                  <div className="bg-blue-700 p-1 rounded-full ml-3">
                    <GoArrowUpRight size={20} className="text-white" />
                  </div>
                </Link>
              </Button>
            </div>

            {
              /* Mobile Menu Button */
            }
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          {Object.keys(dropdownContent).map((key) => (
            <Link key={key} href={`/${key}`} className="block py-2 px-4 hover:bg-gray-700">
              {key.replace("-", " ")}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
