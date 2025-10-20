"use client";

import { Sector } from "@/models/sector";
import Image from "next/image";

import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";

import { useState } from "react";
import { UpdateDescriptionSectorComponent, UpdateImageSectorComponent } from "./updateComponent";
import { AsyncBuilder } from "@/components/ui/asyncBuilder";
import { LoadingSpinner } from "@/lib/load.helper";
import { Section } from "@/models/section";
import { HttpService } from "@/utils/http.services";
import Button from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";
import { imagePathFinder } from "@/utils/imagePathFinder";

export function SectionUIConsultingSolutionsSection1({ sectorIn, showEnglish }: { sectorIn: Sector, showEnglish?: boolean }) {
    const [sector, setSector] = useState(sectorIn);
    const [section, setSection] = useState(sectorIn.sections.filter((s) => s.slug === "consulting_solutions_section_1")[0]);
    const [count, setCount] = useState(0);


    return (
        <section className="mx-auto max-w-5xl">
            <AsyncBuilder promise={async () => {
                return HttpService.show<Section>({
                    url: '/sections/' + section.id,
                    fromJson: (json: any) => Section.fromJSON(json)
                });
            }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>} callDataListen={count}
                hasData={(data) => {
                    setSection(data.data!);
                    return <div className="grid grid-cols-5 items-center gap-4 mt-10">
                        <div className="lg:col-span-3 col-span-12  pr-4">
                            <Popover>
                                <PopoverTrigger>
                                    <h2 className="text-3xl font-semibold text mb-14 text-gray-800 text-start">
                                        { showEnglish ? section.libelle_en : section.libelle }
                                    </h2>
                                </PopoverTrigger>
                                <PopoverContent className="z-50">
                                    <UpdateDescriptionSectorComponent section={section} onChange={(s) => setCount(c => c + 1)} libelle="libelle" value={section.libelle} libelle_en="libelle_en" value_en={section.libelle_en} />
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger>
                                    <p className="text-gray-500 text-sm mb-5 text-start">
                                        { showEnglish ? section.description_en : section.description }
                                    </p>
                                </PopoverTrigger>
                                <PopoverContent className="z-50">
                                    <UpdateDescriptionSectorComponent section={section} onChange={(s) => setCount(c => c + 1)} libelle="description" value={section.description} libelle_en="description_en" value_en={section.description_en} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="lg:col-span-2 col-span-12">
                            <Popover>
                                <PopoverTrigger>
                                    <Image loading="lazy" src={section.image || imagePathFinder.your_partner_for_manufacturing_workforce_solutions} width={500} height={500} alt={section.libelle} />
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

        </section>
    )
}
export function SectionUIConsultingSolutionsSection2({ sectorIn, showEnglish }: { sectorIn: Sector, showEnglish?: boolean }) {
    const [sector, setSector] = useState(sectorIn);
    const [section, setSection] = useState(sectorIn.sections.filter((s) => s.slug === "consulting_solutions_section_2")[0]);
    const [count, setCount] = useState(0);


    return (
        <section className="mx-auto max-w-5xl">
            <AsyncBuilder promise={async () => {
                return HttpService.show<Section>({
                    url: '/sections/' + section.id,
                    fromJson: (json: any) => Section.fromJSON(json)
                });
            }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>} callDataListen={count}
                hasData={(data) => {
                    setSection(data.data!);
                    return <div className="w-full bg-blue-900  bg-[url(/images/bg_blue.png)] bg-cover bg-center py-15 px-20 rounded-4xl border text-white">
                        <div className="grid grid-cols-6 w-full ">
                            <div className="col-span-3">
                                <p className="text-sm font-bold text text-start mb-4">
                                    Trending job titles
                                </p>
                                <div className="grid grid-cols-4 mb-4">
                                    {sector && sector?.functions.map((f) =>
                                        <div className="col-span-2" key={f.id}>
                                            <p className="text-sm font-light text text-start mb-4 underline">
                                                { showEnglish ? f.libelle_en : f.libelle }
                                            </p>
                                        </div>)}
                                </div>
                                <Button variant="light" size="md" onClick={() => console.log("Clic !")} className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex px-5  mt-10">
                                    And many more!
                                    <div className="bg-blue-700 p-1 rounded-full ml-3">
                                        <FiArrowRight className="text-white" />
                                    </div>
                                </Button>
                            </div>
                            <div className="col-span-3 p-0">
                                <Popover>
                                    <PopoverTrigger>
                                        <Image loading="lazy" src={section.image || imagePathFinder.trending_job_titles} alt="image" width={500} height={500} />
                                    </PopoverTrigger>
                                    <PopoverContent className="z-50">
                                        <UpdateImageSectorComponent section={section} onChange={(s) => setCount(c => c + 1)} />
                                    </PopoverContent>
                                </Popover>

                            </div>
                        </div>

                    </div>
                }
                }
            />

        </section>
    )
}
export function SectionUIConsultingSolutionsSection3({ sectorIn, showEnglish }: { sectorIn: Sector, showEnglish?: boolean }) {
    const [sector, setSector] = useState(sectorIn);
    const [section, setSection] = useState(sectorIn.sections.filter((s) => s.slug === "consulting_solutions_section_3")[0]);
    const [count, setCount] = useState(0);


    return (
        <section className="mx-auto max-w-5xl">
            <AsyncBuilder promise={async () => {
                return HttpService.show<Section>({
                    url: '/sections/' + section.id,
                    fromJson: (json: any) => Section.fromJSON(json)
                });
            }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>} callDataListen={count}
                hasData={(data) => {
                    setSection(data.data!);
                    return <div className="grid grid-cols-5 items-center gap-4 mt-10">
                        <div className="lg:col-span-2 col-span-12 pr-4">
                            <Popover>
                                <PopoverTrigger>
                                    <Image loading="lazy" src={section.image || imagePathFinder.your_partner_for_manufacturing_workforce_solutions} width={500} height={500} alt={section.libelle} />
                                </PopoverTrigger>
                                <PopoverContent className="z-50">
                                    <UpdateImageSectorComponent section={section} onChange={(s) => setCount(c => c + 1)} />
                                </PopoverContent>
                            </Popover>

                        </div>
                        <div className="lg:col-span-3 col-span-12 ">
                            <Popover>
                                <PopoverTrigger>
                                    <h2 className="text-3xl font-semibold text mb-14 text-gray-800 text-start">
                                        { showEnglish ? section.libelle_en : section.libelle }
                                    </h2>
                                </PopoverTrigger>
                                <PopoverContent className="z-50">
                                    <UpdateDescriptionSectorComponent section={section} onChange={(s) => setCount(c => c + 1)} libelle="libelle" value={section.libelle} libelle_en="libelle_en" value_en={section.libelle_en} />
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger>
                                    <p className="text-gray-500 text-sm mb-5 text-start">
                                        {  showEnglish ? section.description_en : section.description }
                                    </p>
                                </PopoverTrigger>
                                <PopoverContent className="z-50">
                                    <UpdateDescriptionSectorComponent section={section} onChange={(s) => setCount(c => c + 1)} libelle="description" value={section.description} libelle_en="description_en" value_en={section.description_en} />
                                </PopoverContent>
                            </Popover>
                        </div>

                    </div>
                }
                }
            />

        </section>
    )
}