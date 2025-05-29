"use client";


import { Sector } from "@/models/sector";
import { SectionUIAddSpecializedTalentAcrossYourOrganization } from "./home";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { ReactNode } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { SectionUIConsultingSolutionsSection1, SectionUIConsultingSolutionsSection2, SectionUIConsultingSolutionsSection3 } from "./consulting-solutions";


type SectionEnteteProps = {
    titre: string;
    section: ReactNode;
}



export function SectorSections({ sector }: { sector: Sector }) {

    const sectionEntetes: SectionEnteteProps[] = [
        {
            titre: "Add specialized talent across your organization",
            section: <SectionUIAddSpecializedTalentAcrossYourOrganization sectorIn={sector} />
        },
        {
            titre: "Your Partner for Solutions",
            section: <SectionUIConsultingSolutionsSection1 sectorIn={sector} />
        },
        {
            titre: "Trending job titles",
            section: <SectionUIConsultingSolutionsSection2 sectorIn={sector} />
        },
        {
            titre: "Leading agency solution",
            section: <SectionUIConsultingSolutionsSection3 sectorIn={sector} />
        },
    ]
    return (
        <div>
            <Accordion type="single" collapsible>
                {sectionEntetes && sectionEntetes.map((entete, index) => 
                <AccordionItem key={index} value={index.toString()}>
                    <AccordionTrigger className="w-full cursor-pointer">
                        <div className="flex items-center justify-between w-full space-x-3">
                            <div className="whitespace-nowrap">
                                <h2 className="text-xl font-semibold text mb-5 mt-4 text-slate-800">
                                    {entete.titre}
                                </h2>
                            </div>
                            <div className="w-full border-b-2 border-slate-300">
                            </div>
                            <IoIosArrowBack className=" text-slate-500 text-2xl" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        {entete.section}
                    </AccordionContent>
                </AccordionItem>)}
            </Accordion>

        </div>
    )
}