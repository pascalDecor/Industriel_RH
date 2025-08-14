"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Button from "./ui/button";
import { GoArrowUpRight } from "react-icons/go";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useTranslation } from "@/contexts/LanguageContext";


const FindJobsExpandedNavbar = dynamic(() =>
  import("./navbar/find-jobs").then(mod => mod.FindJobsExpandedNavbar),
  { ssr: false }
);

const ConsultingSolutionsExpandedNavbar = dynamic(() =>
  import("./navbar/consulting-solutions").then(mod => mod.ConsultingSolutionsExpandedNavbar),
  { ssr: false }
);

const DiscoverInsightsExpandedNavbar = dynamic(() =>
  import("./navbar/discover-insights").then(mod => mod.DiscoverInsightsExpandedNavbar),
  { ssr: false }
);

const HireTalentExpandedNavbar = dynamic(() =>
  import("./navbar/hire-talent").then(mod => mod.HireTalentExpandedNavbar),
  { ssr: false }
);

// import { FindJobsExpandedNavbar } from "./navbar/find-jobs";
// import { ConsultingSolutionsExpandedNavbar } from "./navbar/consulting-solutions";
// import { DiscoverInsightsExpandedNavbar } from "./navbar/discover-insights";
// import { HireTalentExpandedNavbar } from "./navbar/hire-talent";


import { LocalStorageHelper } from "@/utils/localStorage.helper";
import { GoTriangleDown } from "react-icons/go";
import { HttpService } from "@/utils/http.services";
import { Sector } from "@/models/sector";
import dynamic from "next/dynamic";


interface NavItem {
  label: string;
  href: string;
   expandedComponnent?: React.ComponentType<{ sectors: Sector[] }>; 
}


// Contenu affiché au hover
const dropdownContent = {
  "find-jobs": <FindJobsExpandedNavbar sectors={[]} />,
  "hire-talent": "Trouvez les meilleurs talents pour votre entreprise.",
  "about": "En savoir plus sur notre entreprise et notre mission.",
  "consulting-solutions": "Découvrez nos solutions de conseil personnalisées.",
  "discover-insights": "Restez informé des tendances du marché.",
};

// Fonction pour obtenir les éléments de navigation traduits
const getNavItems = (t: (key: string) => string): NavItem[] => [
  {
    label: t('nav.find_jobs'),
    href: "/find-jobs",
    expandedComponnent: FindJobsExpandedNavbar,
  },
  {
    label: t('nav.hire_talent'),
    href: "/hire-talent",
    expandedComponnent: HireTalentExpandedNavbar,
  },
  {
    label: t('nav.about'),
    href: "/about",
  },
  {
    label: t('nav.consulting'),
    href: "/consulting-solutions",
    expandedComponnent: ConsultingSolutionsExpandedNavbar,
  },
  {
    label: t('nav.discover_insights'),
    href: "/discover-insights",
    expandedComponnent: DiscoverInsightsExpandedNavbar,
  },
];

export function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  
  const navItems = getNavItems(t);
  
    useEffect(() => {
      const fetchData = async () => {
        const temp = await HttpService.index<Sector>({
          url: '/sectors',
          fromJson: (json: any) => Sector.fromJSON(json)
        });
        setSectors(temp.data);

        if(temp.data.length > 0) {
          LocalStorageHelper.setValue("activeSector", JSON.stringify(temp.data[0]));
        }
      };
      fetchData();
    }, []);
  

  function activeNavItem(href: string) {
    return () => {
      setHoveredItem(href);
      LocalStorageHelper.setValue("activeNavItem", href);
    }
  }

  return (
    <nav className="bg-white text-black shadow-md fixed z-50 top-0 w-full hover:bg-gray-100">
      <div className={clsx("relative w-full")}>
        <div className={clsx("w-7xl mx-auto px-4 sm:px-6 lg:px-8 ", {
          "h-100": isOpen
        })}>
          <div className="flex justify-between h-18 items-center">
            {
              /* Logo */
            }
            <Link href="/">
              <Image loading="lazy" src={imagePathFinder.logo} alt="logo" width={150} />
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
                  <Link href={navItem.href} onClick={activeNavItem(navItem.href)} className={clsx("transition  hover:text-slate-600 hover:underline text-gray-400 text-sm", {
                    "!text-slate-600 underline font-bold": LocalStorageHelper.getValue("activeNavItem") === navItem.href,
                  })}>
                    {navItem.label}
                    {(hoveredItem === navItem.href && navItem.href !== "/about") && <GoTriangleDown className={clsx("text-gray-400 ml-0.5 inline-block text-sm",
                      {
                        "!text-slate-600 underline font-bold": LocalStorageHelper.getValue("activeNavItem") === navItem.href,
                      }
                    )} />}
                  </Link>
                  {/* Dropdown Content */}
                  {(hoveredItem === navItem.href && navItem.expandedComponnent) && <motion.div
                    initial={{ opacity: 0, }}
                    animate={{ opacity: 1, }}
                    exit={{ opacity: 0, }}
                    className="absolute w-full left-0 top-15 mt-2 bg-gray-100 p-4  text-gray-700 shadow-xl">
                    {navItem.expandedComponnent && <navItem.expandedComponnent sectors={sectors} />}
                  </motion.div>}
                </div>)}
            </div>

            {
              /* Contact Button */
            }
            <div>
              <Button variant="light" size="md" className="!rounded-full text-[11px] mr-3 border border-gray-300">
                <Link href="/contact" className="hover:text-gray-600 btn text-gray-400 text-sm flex align-middle items-center">
                  <span>{t('nav.contact')}</span>
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
