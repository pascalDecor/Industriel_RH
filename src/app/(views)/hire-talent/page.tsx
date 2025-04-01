
"use client";

import Button from "@/components/ui/button";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from 'next/image';

import { FiCheck, FiSearch } from "react-icons/fi";
import HomeBannerCarroussel from "@/components/HomeBannerCarroussel";
import ExploreSuccessStories from "@/components/ExploreSuccessStories";
import AddSpecializedTalentAcrossYourOrganization from "@/components/AddSpecializedTalentAcrossYourOrganization";
import Link from "next/link";
import FloatingLabelInput from "@/components/ui/input";
import FloatingLabelSelect from "@/components/ui/select";
import FloatingLabelTextarea from "@/components/ui/textarea";
import PartnersAccreditation from "@/components/PartnersAccreditation";

export default function FindJobs() {

    function handleClick() {
        console.log("Clic !");
    }


    return <>
        <HomeBannerCarroussel />
        {/*Find your next hire */}
        <section className="mx-auto mb-10 p-10 text-center max-w-3xl">
            <h2 className="text-3xl font-semibold text mb-5 text-gray-800">
                {"Find your next hire"}
            </h2>
            <p className="text-gray-500 text-sm mb-5 font-semibold">
                {"Preview recruiter-assessed and Al-matched candidates or provide open role details to hire now. The choice is yours."}
            </p>
            <div className="flex gap-4 mt-10 align-center items-center mx-auto w-fit">
                <Button variant="primary" size="md" onClick={handleClick} className="!rounded-full text-sm">
                    Preview candidates
                </Button>
                <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300">
                    Hire now
                </Button>
            </div>
            <p className="text-gray-500 mt-5 font-semibold">
                {"Or contact us at "}
                <Link href="tel:819-919-8683" className="font-bold text-blue-800 ml-2 underline">819-919-8683</Link>
            </p>
        </section>

        {/* Explore our talent solutions  */}
        <section className="mx-auto w-full mb-10 px-10 py-2">
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
                Explore our talent solutions
            </h2>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-2 gap-10 text-left">
                <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
                    <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                        Outsourced Recruitment
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        Entrust us with the management of your short- or long-term workforce needs. Access qualified
                        professionals ready to join your teams quickly while you focus on your strategic priorities.
                    </p>
                    <Button variant="primary" size="md" onClick={handleClick} className="mt-5 !rounded-full text-sm">
                        Learn more
                    </Button>
                </div>
                <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
                    <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                        International Recruitment
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        Find exceptional french talent worldwide to meet your specific needs.
                        Our experts support you at every step, from pre-selecting candidates to their seamless integration.
                    </p>
                    <Button variant="primary" size="md" onClick={handleClick} className="mt-5 !rounded-full text-sm">
                        Learn more
                    </Button>
                </div>
            </div>
        </section>


        {/* How we help you find a job  */}
        <section className="mx-auto w-full mb-0 px-10 py-24 bg-gray-200">

            {/*How it works */}
            <section className="mx-auto max-w-5xl mb-10 p-10">
                <div className="grid grid-cols-4 items-center justify-center gap-25 w-full">
                    <div className="lg:col-span-2 col-span-12">
                        <Image src={imagePathFinder.hire_talent_how_it_work} alt="Salary Guide" />
                    </div>
                    <div className="lg:col-span-2 col-span-12">
                        <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                            {"How it works"}
                        </h2>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {"We understand your needs"}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                We find the right candidates
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                We handle the recruitment process
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                6-month satisfaction guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/*   Add specialized talent across your organization */}
            <AddSpecializedTalentAcrossYourOrganization />


            <h2 className="text-3xl font-semibold text mb-10 mt-10 text-black text-center">
                Grow, learn and prepare
            </h2>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-12 gap-4 text-left">
                <div className="col-span-3">
                    <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
                        <Image src={imagePathFinder.card_image_1} alt="  We Source the Talent" className="mx-auto" />
                        <div className="p-5">
                            <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                                {"6 Tips to Ease Hiring in Canada's Tight Labour Market"}
                            </p>
                            <p className="text-sm font-regular text-gray-500 ">
                                Having trouble navigating the tight labour market for hiring skilled talent in Canada? Here are six tips Canadian ...
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
                        <Image src={imagePathFinder.card_image_2} alt="  We Source the Talent" className="mx-auto" />
                        <div className="p-5">
                            <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                                {"Starting a New Job? Don't Make These 5 Mistakes"}
                            </p>
                            <p className="text-sm font-regular text-gray-500 ">
                                {"Just starting a nen job? Don't relex yet. Read our tips on avoiding five of the most common mistakes that new ..."}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className=" bg-blue-900 text-white rounded-lg p-10 shadow-lg mb-4">
                        <p className="text-sm font-regular font-bold mb-3">
                            FEATURED
                        </p>
                        <p className="text-sm font-regular ">
                            What jobs are in demand?
                        </p>
                    </div>
                    <div className=" bg-black text-white rounded-lg p-10 shadow-lg mb-4">
                        <p className="text-sm font-regular font-bold mb-3">
                            TAG RESULTS
                        </p>
                        <p className="text-sm font-regular mb-10">
                            Landing a job
                        </p>
                        <p className="text-sm font-regular">
                            64 posts
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
                        <Image src={imagePathFinder.card_image_3} alt="  We Source the Talent" className="mx-auto" />
                        <div className="p-5">
                            <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                                Benefits of Using a Recruitment Agency in Canada to Hire Talent in 2025
                            </p>
                            <p className="text-sm font-regular text-gray-500 ">
                                Wondering about the benefits of using employment agencies to recruit employees? This article walks Canadian businesses through the benefits of ...
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
                        <Image src={imagePathFinder.card_image_4} alt="  We Source the Talent" className="mx-auto" />
                        <div className="p-5">
                            <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                                December 2024 Labour Force Survey: Canadian Employment Rises b...
                            </p>
                            <p className="text-sm font-regular text-gray-500 ">
                                {"Canada's unemployment rate fell to 6.7 percent in December eccording to Statistics Canada's newest..."}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
                        <Image src={imagePathFinder.card_image_5} alt="  We Source the Talent" className="mx-auto" />
                        <div className="p-5">
                            <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                                {"Why More Canadians Should Be Setting Career New Year's Resolutions"}
                            </p>
                            <p className="text-sm font-regular text-gray-500 ">
                                {" Considering making career new year's resolutions? This guide features eight factors Canadians should consider ..."}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className=" bg-blue-900 text-white rounded-lg p-10 shadow-lg mb-4">
                        <p className="text-sm font-regular font-bold mb-3">
                            FEATURED
                        </p>
                        <p className="text-sm font-regular ">
                            What jobs are in demand?
                        </p>
                    </div>
                    <div className=" bg-black text-white rounded-lg p-10 shadow-lg mb-4">
                        <p className="text-sm font-regular font-bold mb-3">
                            TAG RESULTS
                        </p>
                        <p className="text-sm font-regular mb-10">
                            Landing a job
                        </p>
                        <p className="text-sm font-regular">
                            72 posts
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
                        <Image src={imagePathFinder.card_image_6} alt="  We Source the Talent" className="mx-auto" />
                        <div className="p-5">
                            <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                                New Year, New Career: 7 Canada-Centric Job Search Tips for 2025
                            </p>
                            <p className="text-sm font-regular text-gray-500 ">
                                New year, new career! Professionals across Canada wondering how to find a job in 2025 should check out our 7 job search tips for 2025 to ensure they start the year off right.                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 flex justify-center items-center">
                    <Button variant="primary" size="md" onClick={handleClick} className="!rounded-full text-sm mx-auto mt-10 w-fit whitespace-nowrap">
                        Subscribe to updates
                    </Button>
                </div>
            </div>
        </section>

        {/*  Search  */}
        <section className="mx-auto w-full py-20 text-center">
            <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
                {"Here's a sample of our highly skilled Candidate"}
            </h2>
            <div className="max-w-5xl grid grid-cols-12 gap-4 mx-auto px-10">
                <div className="relative col-span-4">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Job Title"
                        className="pl-10 pr-4 py-2 border border-gray-300 w-full
            bg-white text-gray-600 text-sm rounded-full 
            focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <Button variant="dark"
                    size="md" onClick={handleClick} className="!rounded-full text-sm whitespace-nowrap col-span-3">
                    Search
                </Button>
                <Button variant="light"
                    size="md" onClick={handleClick} className="!rounded-full border border-gray-300 text-sm whitespace-nowrap col-span-3">
                    Reset Search
                </Button>
            </div>
            <Button variant="primary"
                size="md" onClick={handleClick} className="!rounded-full border border-gray-300 text-sm text-center whitespace-nowrap my-10 mx-auto">
                Connect now
            </Button>

            <p className="text-gray-500 text-center">
                {"Need immediate help? Call "}
                <Link href="tel:819-919-8683" className="font-bold text-blue-800 ml-2 underline">819-919-8683</Link>
            </p>
        </section>


        {/* How we help you find a job  */}
        <section className="mx-auto w-full mb-10 px-10 py-24 bg-gray-200">

            {/*Your search summary */}
            <div className="mx-auto max-w-5xl mb-10 p-10">
                <div className="grid grid-cols-12 items-center justify-center gap-10 w-full">

                    <div className="lg:col-span-5 col-span-12">
                        <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                            {"Your search summary"}
                        </h2>
                        <p className="text-gray-500 text-sm mb-5">
                            {"The details of your search summary will be provided to one of our experienced recruiters."}
                        </p>
                        <p className="text-gray-500  text-sm font-bold mb-5">
                            {"Skills"}
                        </p>
                        <p className="text-gray-500 text-sm font-bold mb-5">
                            {"Details you provided"}
                        </p>
                        <ul className="list-disc text-gray-500 text-sm mb-5">
                            <li className="ml-7">
                                {"Attorney/Lawyer"}
                            </li>
                        </ul>
                    </div>
                    <div className="lg:col-span-7 col-span-12">
                        <div className="bg-blue-900 p-10 rounded-3xl border max-w-3xl mx-auto">

                            <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
                                Your contact information
                            </h2>


                            <form action="" className="grid grid-cols-12 gap-4 w-full ">
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="First Name"
                                        name="firstName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Last Name"
                                        name="lastName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Company Name"
                                        name="companyName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Your Job Title"
                                        name="jobTitle"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Work Email"
                                        name="workEmail"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Work Phone"
                                        name="workPhone"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div className="col-span-12 text-left ">
                                    <p className="text-white font-semibold">Tell us about the position</p>
                                </div>

                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        label="Postal Code"
                                        type="text"
                                        name="postalCode"
                                    />
                                </div>
                                <div className="col-span-6 text-left mb-10">
                                    <FloatingLabelSelect label="Position Type" name="position" options={[
                                        { label: "Option 1", value: "option1" },
                                        { label: "Option 2", value: "option2" },
                                        { label: "Option 3", value: "option3" },
                                    ]} />
                                </div>

                                <div className="col-span-12 text-center">
                                    <Button variant="dark" size="md" onClick={handleClick} className="!rounded-full text-sm px-20 mx-auto">
                                        Submit
                                    </Button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </div>

        </section>


        {/* Recruitment by outsourcing  */}
        <section className="mx-auto max-w-5xl mb-10 px-10 py-10">
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
                Recruitment by outsourcing
            </h2>


            <div className="grid grid-cols-5 items-center gap-4 mb-10">
                <div className="lg:col-span-3 col-span-12  pr-4">
                    <h2 className="text-3xl font-semibold text mb-10 text-gray-800">
                        {"Build a strong team with permanent talent tailored to your needs."}
                    </h2>
                    <p className="text-gray-500 text-sm mb-5">
                        {`Recruitment Process Outsourcing (IPR or RPO) is a very interesting solution for companies that have specific, recurring and well-defined needs. `}
                    </p>
                    <Button variant="primary" size="md" onClick={handleClick} className="!rounded-full text-sm mx-auto">
                        Hire talents
                    </Button>
                </div>
                <div className="lg:col-span-2 col-span-12">
                    <Image src={imagePathFinder.recruitment_by_outsourcing} alt="Salary Guide" />
                </div>
            </div>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-3 gap-4 text-left">
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white">
                    <Image src={imagePathFinder.find_top_talent_faster} className="!w-10 mb-5" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        Find top talent faster
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        Accelerate your hiring process and fill critical roles in just a few days with our efficient virtual recruitment solutions.
                    </p>
                </div>
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white">
                    <Image src={imagePathFinder.hire_with_precision_confidence} className="!w-10 mb-5" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        Hire with precision & confidence
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        Our expert recruiters and Al-driven matching tools identify candidates that meet your unique needs, skills requirements, and budget.
                    </p>
                </div>
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white">
                    <Image src={imagePathFinder.secure_the_right_fit_for_your_team} className="!w-10 mb-5" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        Secure the right fit for your team
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        Leverage our industry expertise to craft competitive offers and attract the top candidates who will drive your success.
                    </p>
                </div>
            </div>


            <div className="mx-auto max-w-5xl mb-10 p-10">
                <div className="grid grid-cols-12 items-start justify-center gap-5 w-full">

                    <div className="lg:col-span-5 col-span-12">
                        <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                            {"Tell us what you need, we'll take care of the rest! "}
                        </h2>
                        <p className="text-gray-500 text-sm mb-5">
                            {"Take seconds to fill out this form and let us handle it. Whether it's for a specific role or broader needs, we've got your back."}
                        </p>
                        <p className="text-gray-500  text-sm font-bold mb-5">
                            {"Or contact us by phone 819-919-8683"}
                        </p>

                    </div>
                    <div className="lg:col-span-7 col-span-12">
                        <div className="bg-blue-900 p-10 rounded-3xl border max-w-3xl mx-auto">

                            <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
                                Your contact information
                            </h2>


                            <form action="" className="grid grid-cols-12 gap-4 w-full">
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="First Name"
                                        name="firstName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Last Name"
                                        name="lastName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Company Name"
                                        name="companyName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Your Job Title"
                                        name="jobTitle"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Work Email"
                                        name="workEmail"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Work Phone"
                                        name="workPhone"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div className="col-span-12 text-left ">
                                    <p className="text-white font-semibold">Tell us about the position</p>
                                </div>

                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        label="Postal Code"
                                        type="text"
                                        name="postalCode"
                                    />
                                </div>
                                <div className="col-span-6 text-left mb-10">
                                    <FloatingLabelSelect label="Position Type" name="position" options={[
                                        { label: "Local recruitment", value: "1" },
                                        { label: "International recruitment", value: "2" }
                                    ]} />
                                </div>

                                <div className="col-span-12 text-left ">
                                    <p className="text-white font-semibold">Tell us about the position</p>
                                </div>



                                <div className="col-span-12 text-left mb-4">
                                    <FloatingLabelTextarea label="Tell us about the position" name="positionDescription" rows={3} />
                                </div>


                                <div className="col-span-12 text-center">
                                    <Button variant="dark" size="md" onClick={handleClick} className="!rounded-full text-sm px-20 mx-auto">
                                        Submit
                                    </Button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/*  Explore success stories   */}
        <ExploreSuccessStories />

        {/* International recruitment  */}
        <section className="mx-auto max-w-5xl mb-10 px-10 py-10">
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
                International recruitment
            </h2>


            <div className="grid grid-cols-5 items-center gap-4 mb-10">
                <div className="lg:col-span-3 col-span-12  pr-4">
                    <h2 className="text-3xl font-semibold text mb-10 text-gray-800">
                        {"Hire the best francophone talent Worldwide"}
                    </h2>
                    <p className="text-gray-500 text-sm mb-5">
                        {`Employers, don't let labor shortage issues slow you down. Our
recruiters and our network of
partners allow us to offer you 360- degree support in order to quickly welcome your new recruits. `}
                    </p>
                    <Button variant="primary" size="md" onClick={handleClick} className="!rounded-full text-sm mx-auto">
                        Hire talents
                    </Button>
                </div>
                <div className="lg:col-span-2 col-span-12">
                    <Image src={imagePathFinder.international_recruitment} alt="Salary Guide" />
                </div>
            </div>

            <h2 className="text-xl font-medium text-center mb-10 text-gray-800">
                {"All-inclusive recruitment solution: from research to integration, we take care of everything!"}
            </h2>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-3 gap-4 text-center">
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white">
                    <Image src={imagePathFinder.international_recruitment_icon} className="!w-10 mb-5 mx-auto" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        International recruitment
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        Specialists in hiring skilled temporary foreign workers for manufacturing jobs in Quebec.
                    </p>
                </div>
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white">
                    <Image src={imagePathFinder.legal_services} className="!w-10 mb-5 mx-auto" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        Legal services
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        We simplify the process with expert legal support at every stage
                    </p>
                </div>
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white">
                    <Image src={imagePathFinder.welcome_and_integration} className="!w-10 mb-5 mx-auto" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        Welcome and integration
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        From arrival to onboarding, we ensure a seamless experience for your new employees.
                    </p>
                </div>
            </div>
        </section>


        {/*Structured approach */}
        <section className="mx-auto w-full px-10 py-10 bg-gray-200 mb-20">
            <div className="mx-auto max-w-5xl  p-10">
                <div className="grid grid-cols-4 items-start justify-center gap-20 w-full">
                    <div className="lg:col-span-2 col-span-12">
                        <Image src={imagePathFinder.structured_approach} className="!w-full" alt="Salary Guide" />
                    </div>
                    <div className="lg:col-span-2 col-span-12">
                        <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                            {"Structured approach"}
                        </h2>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {"Needs assessment"}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                Selection of top francophone talent
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                Administrative process management
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                Integration support
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                Guarantee and ongoing Support
                            </p>
                        </div>
                        <Button variant="primary" size="md" onClick={handleClick} className="!rounded-full text-sm mx-auto mt-10 w-fit whitespace-nowrap">
                            Contact Us
                        </Button>

                    </div>
                </div>
            </div>
        </section>

        {/*   Partners & Accreditation */}
        <PartnersAccreditation />

        {/* Why choose international recruitment? */}
        <section className="mx-auto max-w-5xl mb-10 p-10">
            <h2 className="text-4xl font-semibold text mb-14 text-gray-800 text-center">
                Why choose international recruitment?
            </h2>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 place-items-center">

                <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4">
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                Access to diverse talent
                            </h6>
                            <p className="text-gray-500 text-sm">
                                Broaden your options with skilled professionals from around the world,
                                bringing fresh perspectives and expertise.
                            </p>
                        </div>
                        <Image className="w-1/3 rounded-lg" src={imagePathFinder.access_to_diverse_talent} alt="Navigate tech skills gaps" />
                    </div>
                </div>

                <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4">
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                Fill critical skill gaps
                            </h6>
                            <p className="text-gray-500 text-sm">
                                Meet your workforce needs in high- demand sectors where local talent is scarce.
                            </p>
                        </div>
                        <Image className="w-1/3 rounded-lg" src={imagePathFinder.fill_critical_skill_gaps} alt="Robert Half blog" />
                    </div>
                </div>

                <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4">
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                Boost competitiveness
                            </h6>
                            <p className="text-gray-500 text-sm">
                                Strengthen your business with globally experienced candidates who elevate your operations and innovation.
                            </p>
                        </div>
                        <Image className="w-1/3 rounded-lg" src={imagePathFinder.boost_competitiveness} alt="Salary Guide" />
                    </div>
                </div>
                <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4">
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                Streamlined processes
                            </h6>
                            <p className="text-gray-500 text-sm">
                                Benefit from a fully managed recruitment process, from sourcing to integration, ensuring a seamless experience.
                            </p>
                        </div>
                        <Image className="w-1/3 rounded-lg" src={imagePathFinder.streamlined_processes} alt="What jobs are in demand?" />
                    </div>
                </div>
            </div>
        </section>
    </>
}