"use client";

import Button from "@/components/ui/button";
import { Sector } from "@/models/sector";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";

import { UpdateDescriptionSectorComponent, UpdateImageSectorComponent } from "./updateComponent";
import { useState } from "react";
import { AsyncBuilder } from "@/components/ui/asyncBuilder";
import { LoadingSpinner } from "@/lib/load.helper";
import { HttpService } from "@/utils/http.services";
import { Section } from "@/models/section";

export function SectionUIAddSpecializedTalentAcrossYourOrganization({ sectorIn, showEnglish }: { sectorIn: Sector, showEnglish?: boolean }) {
    const [sector, setSector] = useState(sectorIn);
    const [section, setSection] = useState(sectorIn.sections.filter((s) => s.page === "home")[0]);
    const [count, setCount] = useState(0);

    return (
        <section className="mb-10 w-5xl text-white mx-auto">
            <div className="w-full bg-cover bg-center bg-blue-900 p-10 rounded-4xl border">
                <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
                    {showEnglish ? "Add specialized talent across your organization" : "Ajoutez des talents spécialisés dans votre organisation"}
                </h2>
                <AsyncBuilder promise={async () => {
                    return HttpService.show<Section>({
                        url: '/sections/' + section.id,
                        fromJson: (json: any) => Section.fromJSON(json)
                    });
                }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>} callDataListen={count}
                    hasData={(data) => {
                        setSection(data.data!);
                        return <div className="grid grid-cols-6 w-full ">
                            <div className="col-span-3 relative">
                                <Popover>
                                    <PopoverTrigger>
                                        <p className="text-sm font-light text text-start mb-4 cursor-pointer">
                                            {showEnglish ? section.description_en : section.description}
                                        </p>
                                    </PopoverTrigger>
                                    <PopoverContent className="z-50">
                                        <UpdateDescriptionSectorComponent section={section} onChange={(s) => setCount(c => c + 1)} libelle="description" value={section.description} libelle_en="description_en" value_en={section.description_en} />
                                    </PopoverContent>
                                </Popover>
                                <p className="text-sm font-bold text text-start mb-4">
                                    Trending job titles
                                </p>
                                <div className="grid grid-cols-4 mb-4">
                                    {sector && sector?.functions.map((f) =>
                                        <div className="col-span-2" key={f.id}>
                                            <p className="text-sm font-light text text-start mb-4 underline">
                                                {showEnglish ? f.libelle_en : f.libelle}
                                            </p>
                                        </div>)}
                                </div>
                                <div className="relative mb-10 pt-10">

                                    <motion.img key={sector?.id} src={imagePathFinder.light.src} initial={{
                                        y: 100,
                                        opacity: 0
                                    }} animate={{
                                        y: 0,
                                        opacity: 1
                                    }} exit={{
                                        x: -100,
                                        opacity: 0
                                    }} width={500} height={500} alt="We Source the Talent" className="-mb-4 mt-30 mx-auto bottom-0 w-5/6 absolute z-20  -right-75" />

                                    <Button variant="light" size="md" className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex px-10 absolute !whitespace-nowrap z-30">
                                        Learn more about our Manufacturing hiring solutions
                                        <div className="bg-blue-700 p-1 rounded-full ml-3">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            <div className="col-span-3 p-5 relative">
                                <Image loading="lazy" src={imagePathFinder.bg}
                                    width={500} height={500} alt="We Source the Talent" className="mb-4 mx-auto w-full absolute top-0 z-0" />
                                <Popover>
                                    <PopoverTrigger>
                                        {sector && <Image loading="lazy" src={sector === undefined ? imagePathFinder.add_specialized_talent_across_your_organization : sector.sections.filter((s) => s.page === "home")[0]?.image}
                                            width={500} height={500} alt="We Source the Talent" className="mb-4 mx-auto w-full relative z-10 cursor-pointer" />}
                                    </PopoverTrigger>
                                    <PopoverContent className="z-50">
                                        <UpdateImageSectorComponent section={section} onChange={(s) => setCount(c => c + 1)} />
                                    </PopoverContent>
                                </Popover>

                            </div>
                        </div>

                    }
                    }
                />


            </div>
        </section>
    )
}