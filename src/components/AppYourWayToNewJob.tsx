
import { imagePathFinder } from "@/utils/imagePathFinder";
import { FiCheck } from "react-icons/fi";
import Button from "./ui/button";
import Image from 'next/image'


export default function AppYourWayToNewJob() {

    function handleClick() {
        console.log("Clic !");
    }


    return (
        <>
         {/*  App your way to a new job  */}
         <section className="mx-auto max-w-5xl mb-10 p-10">
                <div className="flex items-center gap-4">
                    <div className="w-3/5 pr-4">
                        <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                            App your way to a new job
                        </h2>
                        <div className="flex gap-4 align-start items-start">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                Get instantly notified of job matches
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                Filter searches by skills and preferences
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                Apply in a tap and much more
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="dark" size="md" onClick={handleClick} className="mt-10 !rounded-[10px]  text-left">
                                <div className="flex gap-4 items-center">
                                    <Image src={imagePathFinder.apple} alt="Describe your Need" className="w-6 my-auto" />
                                    <div>
                                        <p className="text-[11px] font-light -mb-1">Download on the</p>
                                        <p className="text-white">App Store</p>
                                    </div>
                                </div>
                            </Button>
                            <Button variant="dark" size="md" onClick={handleClick} className="mt-10 !rounded-[10px]  text-left">
                                <div className="flex gap-4 items-center">
                                    <Image src={imagePathFinder.google_play} alt="Describe your Need" className="w-6 my-auto" />
                                    <div>
                                        <p className="text-[11px] font-light -mb-1">Download on the</p>
                                        <p className="text-white">Google Play</p>
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>
                    <div className="w-3/5">
                        <Image src={imagePathFinder.app_your_way_to_a_new_job} alt="App your way to a new job" />
                    </div>
                </div>
            </section>
        </>
    );
}  