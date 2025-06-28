
"use client";

import { imagePathFinder } from "@/utils/imagePathFinder";
import { FiArrowRight } from "react-icons/fi";
import Button from "./ui/button";
import Image from 'next/image'
import { HttpService } from "@/utils/http.services";
import { Sector } from "@/models/sector";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AddSpecializedTalentAcrossYourOrganization() {

    function handleClickSector(sector: Sector) {
        setSectorActive(sector);
    }

    function handleClickFunction(sectorId: string) {
        console.log("functionId", sectorId);
    }

    const [sectorActive, setSectorActive] = useState<Sector | undefined>(undefined);
    const [sectors, setSectors] = useState<Sector[]>([]);

    useEffect(() => {
        HttpService.index<Sector>({ url: '/sectors', fromJson: (json: any) => Sector.fromJSON(json), })
            .then((data) => {
                setSectors(data.data);
                if (sectorActive === undefined) {
                    setSectorActive(data.data[0]);
                }
            });

    }, []);



    return (
        <>
            {/*   Add specialized talent across your organization */}


            <section className="mx-auto w-5xl mb-10 p-10">
                <div className="w-full bg-cover bg-center bg-blue-900 p-10 rounded-4xl border">

                    <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
                        Add specialized talent across your organization
                    </h2>

                    <div className="flex mb-10 gap-4 mx-auto items-center justify-center">
                        {
                            sectorActive &&
                            sectors.map((s) =>
                                <Button key={s.id} variant={sectorActive.id === s.id ? "dark" : "light"} size="md" onClick={() => handleClickSector(s)} className="!rounded-full text-sm">
                                    {s.libelle}
                                </Button>
                            )}
                    </div>

                    <div className="grid grid-cols-6 w-full ">
                        <div className="col-span-3 relative">
                            <p className="text-sm font-light text text-start mb-4">
                                {sectorActive && sectorActive?.sections.filter((s) => s.page === "home")[0]?.description} :
                            </p>
                            <p className="text-sm font-bold text text-start mb-4">
                                Trending job titles
                            </p>
                            <div className="grid grid-cols-4 mb-4">
                                {sectorActive && sectorActive?.functions.map((f) =>
                                    <div className="col-span-2" key={f.id}>
                                        <p className="text-sm font-light text text-start mb-4 underline">
                                            {f.libelle}
                                        </p>
                                    </div>)}
                            </div>
                            <div className="relative mb-10 pt-10">
                                <motion.img key={sectorActive?.id} src={imagePathFinder.light.src} initial={{
                                    y: 100,
                                    opacity: 0
                                }} animate={{
                                    y: 0,
                                    opacity: 1
                                }} exit={{
                                    x: -100,
                                    opacity: 0
                                }} width={500} height={500} alt="We Source the Talent" className="-mb-4 mt-30 mx-auto bottom-0 w-5/6 absolute z-20  -right-75" />
                                
                                <Button variant="light" size="md" onClick={() => handleClickFunction(sectorActive?.id ?? "")} className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex px-10 absolute !whitespace-nowrap z-30">
                                    Learn more about our Manufacturing hiring solutions
                                    <div className="bg-blue-700 p-1 rounded-full ml-3">
                                        <FiArrowRight className="text-white" />
                                    </div>
                                </Button>
                            </div>
                        </div>
                        <div className="col-span-3 p-5 relative">
                            <Image src={imagePathFinder.bg}
                                width={500} height={500} alt="We Source the Talent" className="mb-4 mx-auto w-full absolute top-0 z-0" />
                            {sectorActive && <Image src={sectorActive === undefined ? imagePathFinder.add_specialized_talent_across_your_organization : sectorActive.sections.filter((s) => s.page === "home")[0]?.image}
                                width={500} height={500} alt="We Source the Talent" className="mb-4 mx-auto w-full relative z-10" />}
                        </div>
                    </div>

                </div>
            </section>

        </>
    );
}  