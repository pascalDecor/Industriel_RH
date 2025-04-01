
import { imagePathFinder } from "@/utils/imagePathFinder";
import { FiArrowRight } from "react-icons/fi";
import Button from "./ui/button";
import Image from 'next/image'


export default function AddSpecializedTalentAcrossYourOrganization() {

    function handleClick() {
        console.log("Clic !");
    }


    return (
        <>
            {/*   Add specialized talent across your organization */}
            <section className="mx-auto w-5xl mb-10 p-10">
                <div className="w-full bg-cover bg-center bg-blue-900 p-10 rounded-4xl border">

                    <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
                        Add specialized talent across your organization
                    </h2>

                    <div className="flex mb-10 gap-4 mx-auto items-center justify-center">
                        <Button variant="dark" size="md" onClick={handleClick} className="!rounded-full text-sm">
                            Manufacturing
                        </Button>
                        <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300 !text-gray-500 fw">
                            Construction
                        </Button>
                        <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300 !text-gray-500">
                            Healthcare
                        </Button>
                        <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300 !text-gray-500">
                            Transport
                        </Button>
                        <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300 !text-gray-500">
                            Agriculture & Agro-Food
                        </Button>
                    </div>

                    <div className="grid grid-cols-6 w-full ">
                        <div className="col-span-3">
                            <p className="text-sm font-light text text-start mb-4">
                                From entry-level roles to leadership positions, we connect
                                you with top candidates who have the in-demand skills
                                and experience to meet your workforce needs in key sectors:
                            </p>
                            <p className="text-sm font-bold text text-start mb-4">
                                Trending job titles
                            </p>
                            <div className="grid grid-cols-4 mb-4">
                                <div className="col-span-2">
                                    <p className="text-sm font-light text text-start mb-4 underline">
                                        Welders
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-light text text-start mb-4 underline">
                                        Machine Operators
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-light text text-start mb-4 underline">
                                        Assemblers
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-light text text-start mb-4 underline">
                                        Industrial Mechanics
                                    </p>
                                </div>
                            </div>
                            <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex px-14 absolute mt-10">
                                Learn more about our Manufacturing hiring solutions
                                <div className="bg-blue-700 p-1 rounded-full ml-3">
                                    <FiArrowRight className="text-white" />
                                </div>
                            </Button>
                        </div>
                        <div className="col-span-3 p-0">
                            <Image src={imagePathFinder.add_specialized_talent_across_your_organization} alt="  We Source the Talent" className=" mb-4 mx-auto" />
                        </div>
                    </div>

                </div>
            </section>

        </>
    );
}  