"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAngleRight, FaArrowLeft, FaBars, FaTimes, FaTimesCircle } from "react-icons/fa";
import { DynamicImage } from "@/components/ui/DynamicImage";
import Button from "./ui/button";
import { GoArrowUpRight, GoTriangleRight } from "react-icons/go";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useTranslation } from "@/contexts/LanguageContext";
import { EditableText } from "@/app/(admin)/management/translations/components/EditableText";


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
import { Sector } from "@/models/sector";
import dynamic from "next/dynamic";
import { ArrowBigRight } from "lucide-react";
import { TiTimes, TiTimesOutline } from "react-icons/ti";


interface NavItem {
  label: string;
  href: string;
  expandedComponnent?: React.ComponentType<{ sectors: Sector[]; sectorsLoading?: boolean; sectorsError?: boolean }>;
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

interface NavbarProps {
  isTranslateMode?: boolean;
  translations?: { id: string; key: string; fr: string; en: string }[];
  onUpdate?: (id: string, fr: string, en: string) => void;
}

export function Navbar({ isTranslateMode = false, translations = [], onUpdate = () => {} }: NavbarProps = {}) {
  const { t, language } = useTranslation();
  const pathname = usePathname();

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
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [sectorsLoading, setSectorsLoading] = useState(true);
  const [sectorsError, setSectorsError] = useState(false);

  const navItems = getNavItems(t);

  useEffect(() => {
    const fetchData = async () => {
      setSectorsLoading(true);
      setSectorsError(false);
      try {
        const res = await fetch("/api/sectors?limit=50");
        if (!res.ok) {
          setSectorsError(true);
          setSectors([]);
          return;
        }
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        const meta = json?.meta && typeof json.meta === "object" ? json.meta : {};
        const mapped = list.map((item: unknown) => Sector.fromJSON(item as ConstructorParameters<typeof Sector>[0]));
        setSectors(mapped);
        if (mapped.length > 0) {
          LocalStorageHelper.setValue("activeSector", JSON.stringify(mapped[0]));
        }
      } catch {
        setSectorsError(true);
        setSectors([]);
      } finally {
        setSectorsLoading(false);
      }
    };
    fetchData();
  }, []);


  function activeNavItem(href: string, e?: React.MouseEvent) {
    return () => {
      // if(href !== "/about" && screen.width < 768) {
      //   e.preventDefault();
      // }
      console.log("Active nav item:", href);
      setHoveredItem(href);
      LocalStorageHelper.setValue("activeNavItem", href);
      if (href === "/about") {
        setIsOpen(false);
      }
    }
  }

  return (
    <nav className="bg-white text-black shadow-md fixed z-50 top-0 w-[100vw] hover:bg-gray-100 transition">
      <div className={clsx("relative w-full")}>
        <div className={clsx("w-full lg:w-7xl mx-auto px-4 sm:px-6 lg:px-8 ", {
          "h-20": isOpen
        })}>
          <div className="flex justify-between h-18 items-center w-full">
            {
              /* Logo */
            }
            <Link href="/" onClick={handleLinkClick}>
              <DynamicImage imageKey="logo" alt="logo" width={typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 150} priority />
            </Link>

            {
              /* Desktop Menu */
            }
            <div className="hidden md:flex space-x-6 h-full my-auto align-middle mt-5">
              {navItems.map((navItem, index) =>
                <div
                  key={index}
                  onMouseEnter={() => !isTranslateMode && setHoveredItem(navItem.href)}
                  onMouseLeave={() => !isTranslateMode && setHoveredItem(null)}>
                  <Link
                    href={navItem.href}
                    onClick={(e) => {
                      if (isTranslateMode) {
                        e.preventDefault();
                      } else {
                        if (navItem.href === "/consulting-solutions") {
                          LocalStorageHelper.setValue("activeSector", "");
                          if (pathname === "/consulting-solutions") {
                            e.preventDefault();
                            window.location.href = "/consulting-solutions";
                          }
                        }
                        activeNavItem(navItem.href, e)();
                      }
                    }}
                    className={clsx("transition  hover:text-slate-600 hover:underline text-gray-400 text-sm", {
                      "!text-slate-600 underline font-bold": LocalStorageHelper.getValue("activeNavItem") === navItem.href,
                    })}>
                    {navItem.label}
                    {(hoveredItem === navItem.href && navItem.href !== "/about" && !isTranslateMode) && <GoTriangleDown className={clsx("text-gray-400 ml-0.5 inline-block text-sm",
                      {
                        "!text-slate-600 underline font-bold": LocalStorageHelper.getValue("activeNavItem") === navItem.href,
                      }
                    )} />}
                  </Link>
                  {/* Dropdown Content */}
                  {(hoveredItem === navItem.href && navItem.expandedComponnent && !isTranslateMode) && <motion.div
                    initial={{ opacity: 0, }}
                    animate={{ opacity: 1, }}
                    exit={{ opacity: 0, }}
                    className="absolute w-full left-0 top-15 mt-2 bg-gray-100 p-4  text-gray-700 shadow-xl">
                    {navItem.expandedComponnent && <navItem.expandedComponnent sectors={sectors} sectorsLoading={sectorsLoading} sectorsError={sectorsError} />}
                  </motion.div>}
                </div>)}
            </div>

            {
              /* Contact Button */
            }
            <div className="flex items-center  gap-3 sm:gap-4">
              <Button variant="primary" size="md" className="!rounded-full text-[11px] !py-1">
                <Link href="/contact" onClick={handleLinkClick} className="text-white hover:text-white btn text-sm flex align-middle items-center">
                  <span>{renderText('nav.contact')}</span>
                  <div className="bg-white/20 p-1 rounded-full ml-3">
                    <GoArrowUpRight size={20} className="text-white" />
                  </div>
                </Link>
              </Button>

              {
                /* Mobile Menu Button */
              }
              <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
                  {isOpen ? <TiTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>

          <div className="md:hidden bg-white pb-10 texte-center h-full w-full border-t border-gray-200 relative z-10">
            {/* {Object.keys(dropdownContent).map(key => <Link key={key} href={`/`} className="block py-3 px-4 hover:bg-gray-700 text-center">
              {key.replace("-", " ")}
            </Link>)} */}

            {navItems.map((navItem, index) =>
              <div key={index} className="">
                {navItem.href === "/about" ? <Link
                  href={navItem.href}
                  onClick={(e) => {
                    if (isTranslateMode) {
                      e.preventDefault();
                    } else {
                      activeNavItem(navItem.href, e)();
                    }
                  }}
                  className={clsx("transition  hover:text-slate-600 flex justify-between hover:underline text-gray-400 text-sm px-10 !py-4", {
                    "!text-slate-600 underline font-bold": LocalStorageHelper.getValue("activeNavItem") === navItem.href,
                  })}>
                  {navItem.label}
                  {(navItem.href !== "/about") && <FaAngleRight className={clsx("text-gray-400 ml-0.5 inline-block text-sm",
                    {
                      "!text-slate-600 underline font-bold": LocalStorageHelper.getValue("activeNavItem") === navItem.href,
                    }
                  )} />}
                </Link> : <span
                  onClick={(e) => {
                    if (!isTranslateMode) {
                      activeNavItem(navItem.href, e)();
                    } else {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className={clsx("transition cursor-pointer  hover:text-slate-600 flex justify-between hover:underline text-gray-400 text-sm px-10 !py-4", {
                    "!text-slate-600 underline font-bold": LocalStorageHelper.getValue("activeNavItem") === navItem.href,
                  })}>
                  {navItem.label}
                  {(navItem.href !== "/about" && !isTranslateMode) && <FaAngleRight className={clsx("text-gray-400 ml-0.5 inline-block text-sm",
                    {
                      "!text-slate-600 underline font-bold": LocalStorageHelper.getValue("activeNavItem") === navItem.href,
                    }
                  )} />}
                </span>}

                {(hoveredItem === navItem.href && navItem.expandedComponnent && !isTranslateMode) && <motion.div
                  initial={{ opacity: 0, }}
                  animate={{ opacity: 1, }}
                  exit={{ opacity: 0, }}
                  className="fixed w-full left-0 top-0 bg-gray-100 p-4  text-gray-700 shadow-xl h-[100vh] overflow-scroll">
                  <p className="text-sm font-medium text-gray-700 mb-5 mt-3 uppercase tracking-wide flex gap-3">
                    <FaArrowLeft onClick={() => setHoveredItem(null)} className="text-gray-400 ml-0.5 inline-block text-sm" />
                    {navItem.label}
                  </p>
                  <div onClick={() => { setIsOpen(false); setHoveredItem(null); }} >
                    {navItem.expandedComponnent && <navItem.expandedComponnent sectors={sectors} sectorsLoading={sectorsLoading} sectorsError={sectorsError} />}
                  </div>
                </motion.div>}
              </div>
            )}
          </div>
          <div onClick={() => setIsOpen(!isOpen)} className="fixed z-0 bottom-0 top-0  w-full h-[100vh] bg-gray opacity-100 border-t border-gray-200"></div>
        </>
      )}
    </nav>
  );
}
