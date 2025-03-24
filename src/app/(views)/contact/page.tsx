"use client";

import Button from "@/components/button";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from 'next/image';
import Link from "next/link";


export default function Contact() {

    function handleClick() {
        console.log("Clic !");
    }

    return (
        <>
            {/* We accept recruitment mandates across Quebec! */}
            <section className="mx-auto max-w-5xl mb-10 p-10">
                <div className="grid grid-cols-5 items-center gap-4 mt-10">
                    <div className="lg:col-span-3 col-span-12  pr-4">
                        <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                            {"We accept recruitment mandates across Quebec!"}
                        </h2>
                        <p className="text-gray-500 text-sm mb-5">
                            {"Based in the heart of Quebec, Industrielle RH is your trusted partner for specialized recruitment in the manufacturing, industrial, and other key sectors. Whether you're in Montreal, Quebec City, or anywhere else in the province, we're ready to meet your recruitment needs."}
                        </p>
                    </div>
                    <div className="lg:col-span-2 col-span-12">
                        <Image src={imagePathFinder.we_accept_recruitment} alt="Salary Guide" />
                    </div>
                </div>
            </section>
            {/*   Contact Us */}
            <section className="mx-auto w-5xl mb-10 p-10">
                <div className="w-full">

                    <h2 className="lg:text-3xl text-2xl font-semibold mb-4 text-black text-center">
                        Contact Us
                    </h2>

                    <p className="text-gray-500 font-semibold text-sm text-center mb-10">
                        {"Feel free to reach out to learn more about our recruitment services or to entrust us with your mandate."}
                    </p>

                    <div className="grid grid-cols-4 gap-4 w-full mb-10 ">
                        <div className="col-span-1 p-7 text-left">
                            <Image src={imagePathFinder.contact_telephone} alt="Describe your Need" className="w-14 mb-4 mx-auto" />
                            <p className="text-sm font-semibold text mb-3   text-gray-600 text-left">
                                Téléphone: <br /> 514-700-7212
                            </p>
                            <p className="text-sm font-semibold text  text-gray-600 text-left">
                                Sans frais: <br /> 1-800-403-0582
                            </p>
                        </div>
                        <div className="col-span-1 p-7 text-left">
                            <Image src={imagePathFinder.contact_couriel} alt="Describe your Need" className="w-14 mb-4" />
                            <p className="text-sm font-semibold text mb-3  text-gray-600 text-left">
                                Courriel
                            </p>
                            <p className="text-sm font-semibold text  text-gray-600 text-left">
                                <Link href="mailto:info@buildup.ca">info@buildup.ca</Link>
                            </p>
                        </div>
                        <div className="col-span-1 p-7 text-left">
                            <Image src={imagePathFinder.contact_adresse} alt="Describe your Need" className="w-14 mb-4" />
                            <p className="text-sm font-semibold text mb-3   text-gray-600 text-left">
                                Adresse
                            </p>
                            <p className="text-sm font-semibold text  text-gray-600 text-left">
                                3800 Rue Saint-Patrick #312, Montréal, QC, H4E 1A4
                            </p>
                        </div>
                        <div className="col-span-1 p-7 text-left">
                            <Image src={imagePathFinder.contact_langue} alt="Describe your Need" className="w-14 mb-4" />
                            <p className="text-sm font-semibold text  mb-3  text-gray-600 text-left">
                                Langues parlées
                            </p>
                            <p className="text-sm font-semibold text  text-gray-600 text-left">
                                Français et Anglais
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/*  Your contact information   */}
            <section className="mx-auto w-lvw mb-0 px-10 py-24 bg-gray-200">
                <div className="bg-blue-900 p-10 rounded-3xl border max-w-3xl mx-auto">

                    <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
                        Your contact information
                    </h2>


                    <form action="" className="grid grid-cols-12 gap-4 w-full mb-10 ">
                        <div className="col-span-6 text-left">
                            <input
                                type="text"
                                placeholder="First Name"
                                className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-6 text-left">
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-6 text-left">
                            <input
                                type="text"
                                placeholder="Company Name"
                                className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-6 text-left">
                            <input
                                type="text"
                                placeholder="Your Job Title"
                                className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-6 text-left">
                            <input
                                type="text"
                                placeholder="Work Email"
                                className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-6 text-left">
                            <input
                                type="text"
                                placeholder="Work Phone"
                                className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="col-span-12 text-left ">
                            <p className="text-white font-semibold">Tell us about the position</p>
                        </div>

                        <div className="col-span-6 text-left">
                            <input
                                type="text"
                                placeholder="Postal Code"
                                className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-6 text-left mb-10">
                            <select name="position" id="position" className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </select>
                        </div>
                        <div className="col-span-12 text-left ">
                            <p className="text-white font-semibold">Explaine your need</p>
                        </div>



                        <div className="col-span-12 text-left mb-4">
                            <textarea rows={6} name="position" id="position" className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </textarea>
                        </div>

                        <div className="col-span-12 text-center">
                            <Button variant="dark" size="md" onClick={handleClick} className="!rounded-full text-sm px-20 mx-auto">
                                Submit
                            </Button>
                        </div>

                    </form>

                </div>
            </section>

        </>
    );
}