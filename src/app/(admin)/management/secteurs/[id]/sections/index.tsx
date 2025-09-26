"use client";


import { Sector } from "@/models/sector";
import { SectionUIAddSpecializedTalentAcrossYourOrganization } from "./home";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { ReactNode, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineLanguage } from "react-icons/hi2";
import Button from "@/components/ui/button";
import { SectionUIConsultingSolutionsSection1, SectionUIConsultingSolutionsSection2, SectionUIConsultingSolutionsSection3 } from "./consulting-solutions";


type SectionEnteteProps = {
    titre: string;
    titre_en: string;
    section: ReactNode;
}



export function SectorSections({ sector }: { sector: Sector }) {

    const getSectionEntetes = (showEnglish: boolean): SectionEnteteProps[] => [
        {
            titre: "Ajoutez des talents spécialisés dans votre organisation",
            titre_en: "Add specialized talent across your organization",
            section: <SectionUIAddSpecializedTalentAcrossYourOrganization sectorIn={sector} showEnglish={showEnglish} />
        },
        {
            titre: "Votre Partenaire pour les Solutions",
            titre_en: "Your Partner for Solutions",
            section: <SectionUIConsultingSolutionsSection1 sectorIn={sector} showEnglish={showEnglish} />
        },
        {
            titre: "Postes tendances",
            titre_en: "Trending job titles",
            section: <SectionUIConsultingSolutionsSection2 sectorIn={sector} showEnglish={showEnglish} />
        },
        {
            titre: "Solution d'agence leader",
            titre_en: "Leading agency solution",
            section: <SectionUIConsultingSolutionsSection3 sectorIn={sector} showEnglish={showEnglish} />
        },
    ]
    return (
        <div>
            <Accordion type="single" collapsible>
                {[0, 1, 2, 3].map((index) => {
                    const SectionComponent = () => {
                        const [showEnglish, setShowEnglish] = useState(false);
                        const sectionEntetes = getSectionEntetes(showEnglish);
                        const entete = sectionEntetes[index];

                        return (
                            <AccordionItem key={index} value={index.toString()}>
                                <AccordionTrigger className="w-full cursor-pointer">
                                    <div className="flex items-center justify-between w-full space-x-3">
                                        <div className="flex items-center gap-3 min-w-fit">
                                            <h2 className="text-xl font-semibold text mb-5 mt-4 text-slate-800">
                                                {showEnglish ? entete.titre_en : entete.titre}
                                            </h2>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowEnglish(!showEnglish);
                                                }}
                                                variant={showEnglish ? "primary" : "secondary"}
                                                size="sm"
                                                className="!h-6 !px-2 !text-[10px] flex items-center gap-1 mb-2"
                                                title={showEnglish ? "Voir en français" : "Voir en anglais"}
                                            >
                                                <HiOutlineLanguage className="h-3 w-3" />
                                                {showEnglish ? 'FR' : 'EN'}
                                            </Button>
                                        </div>
                                        <div className="w-full border-b-2 border-slate-300">
                                        </div>
                                        <IoIosArrowBack className=" text-slate-500 text-2xl" />
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    {entete.section}
                                </AccordionContent>
                            </AccordionItem>
                        );
                    };

                    return <SectionComponent key={index} />;
                })}
            </Accordion>

        </div>
    )
}