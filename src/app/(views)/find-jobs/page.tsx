
"use client";

import Button from "@/components/button";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from 'next/image';

import Carousel from "@/components/carroussel";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck, FiSearch } from "react-icons/fi";
import { TiLocationOutline } from "react-icons/ti";

export default function FindJobs() {

    function handleClick() {
        console.log("Clic !");
    }

    const slides = [

        <div key={2} className="w-full h-[730] bg-[url(/images/banner.png)] bg-cover bg-center py-10 ">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <div className="max-w-4xl mx-auto my-auto 
                flex flex-col items-start justify-start">
                    <div className="max-w-xl mt-20">
                        <h2 className="text-6xl font-semibold text mb-14">Unlock new
                            possibilities with the right Talent</h2>
                        <p className="text-gray-300 mb-14">
                            Discover skilled professionals, high-demand jobs, and tailored solutions to achieve your goals.</p>
                        <div className="flex gap-4">
                            <div>
                                <p className="text-gray-400 text-sm ">FOR JOB SEEKERS</p>
                                <Button variant="primary" size="md" onClick={handleClick} className="mt-10 !rounded-full border text-sm">
                                    Find your next job
                                </Button>
                            </div>
                            <div className="border-l border-gray-500 pl-4">
                                <p className="text-gray-400 text-sm ">FOR BUSINESSES</p>
                                <div className="flex mt-10 gap-3 ">
                                    <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm">
                                        Preview candidates
                                    </Button>
                                    <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm">
                                        Hire now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
        ,
        <div key={2} className="w-full h-[730] bg-[url(/images/banner.png)] bg-cover bg-center py-10 ">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <div className="max-w-4xl mx-auto my-auto flex flex-col items-start justify-start">
                    <div className="max-w-xl mt-20">
                        <h2 className="text-6xl font-semibold text mb-14">Unlock new
                            possibilities with the right Talent</h2>
                        <p className="text-gray-300 mb-14">
                            Discover skilled professionals, high-demand jobs, and tailored solutions to achieve your goals.</p>
                        <div className="flex gap-4">
                            <div>
                                <p className="text-gray-400 text-sm ">FOR JOB SEEKERS</p>
                                <Button variant="primary" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm">
                                    Find your next job
                                </Button>
                            </div>
                            <div className="border-l border-gray-500 pl-4">
                                <p className="text-gray-400 text-sm ">FOR BUSINESSES</p>
                                <div className="flex mt-10 gap-3 ">
                                    <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm">
                                        Preview candidates
                                    </Button>
                                    <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm">
                                        Hire now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    ];


    return <>
        <section className="w-full">
            <Carousel slides={slides} classname="w-dvw z-0" />
            {/* Search bar */}
            <div className="bg-blue-800 rounded-full 
          p-5 flex gap-4 w-1/2 -mt-24
          absolute mx-auto z-50"
                style={{
                    marginLeft: "50%",
                    transform: "translateX(-50%)"
                }}>

                <div className="relative w-full">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Job Title, Skills, or Keywords"
                        className=" pl-10 pr-4 py-2 border w-full
            bg-white text-gray-600 text-sm rounded-full 
            focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <div className="relative w-full">
                    <TiLocationOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="City, Province, or Postal Code"
                        className=" pl-10 pr-4 py-2 border  w-full
            bg-white text-gray-600 text-sm rounded-full 
            focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <Button variant="dark"
                    size="md" onClick={handleClick} className="!rounded-full text-sm whitespace-nowrap">
                    Search Jobs
                </Button>
            </div>
            {/* Carousel */}
        </section>

        {/*Find a job that works for you */}
        <section className="mx-auto max-w-5xl mb-10 p-10">
            <div className="grid grid-cols-5 items-center gap-4 mt-10">
                <div className="lg:col-span-3 col-span-12  pr-4">
                    <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                        {"Find a job that works for you"}
                    </h2>
                    <div className="flex gap-4 align-start items-start">
                        <div className="bg-blue-700 p-1 rounded-full">
                            <FiCheck className="text-white" />
                        </div>
                        <p className="text-gray-500 text-sm mb-5">
                            {"Choose from hundreds of jobs"}
                        </p>
                    </div>
                    <div className="flex gap-4 align-start items-start">
                        <div className="bg-blue-700 p-1 rounded-full">
                            <FiCheck className="text-white" />
                        </div>
                        <p className="text-gray-500 text-sm mb-5">
                            Discover new and exclusive opportunities posted every day
                        </p>
                    </div>
                    <div className="flex gap-4 align-start items-start">
                        <div className="bg-blue-700 p-1 rounded-full">
                            <FiCheck className="text-white" />
                        </div>
                        <p className="text-gray-500 text-sm mb-5">
                            Let our recruiters help you find a job that is right for you
                        </p>
                    </div>
                    <Button variant="primary" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm">
                        Submit your CV
                    </Button>
                </div>
                <div className="lg:col-span-2 col-span-12">
                    <Image src={imagePathFinder.find_a_job_that_works_for_you} alt="Salary Guide" />
                </div>
            </div>
        </section>


        {/* How we help you find a job  */}
        <section className="mx-auto w-full mb-0 px-10 py-24 bg-gray-200">
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
                How we help you find a job
            </h2>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-2 gap-10 text-left">
                <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
                    <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                        Upload your resume
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        Add your latest resume to match with open positions.
                    </p>
                    <Button variant="primary" size="md" onClick={handleClick} className="mt-5 !rounded-full text-sm">
                        Upload resume
                    </Button>
                </div>
                <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
                    <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                        Search available jobs
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        Choose from hundreds of jobs (with new ones posted daily)
                    </p>
                    <Button variant="primary" size="md" onClick={handleClick} className="mt-5 !rounded-full text-sm">
                        Upload resume
                    </Button>
                </div>
            </div>


            {/*   Add specialized talent across your organization */}
            <section className="mx-auto w-5xl mb-10">
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


            <h2 className="text-3xl font-semibold text mb-10 mt-10 text-black text-center">
                Grow, learn and prepare
            </h2>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-12 gap-4 text-left">
                <div className="col-span-3">
                    <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
                        <Image src={imagePathFinder.card_image_1} alt="  We Source the Talent" className="mx-auto" />
                        <div className="p-5">
                            <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                                6 Tips to Ease Hiring in Canada's Tight Labour Market
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
                                Starting a New Job? Don't Make These 5 Mistakes
                            </p>
                            <p className="text-sm font-regular text-gray-500 ">
                                Just starting a nen job? Don't relex yet. Read our tips on avoiding five of the most common mistakes that new ...
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
                                Canada's unemployment rate fell to 6.7 percent in December eccording to Statistics Canada's newest...
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
                        <Image src={imagePathFinder.card_image_5} alt="  We Source the Talent" className="mx-auto" />
                        <div className="p-5">
                            <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                                Why More Canadians Should Be Setting Career New Year's Resolutions
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
        <section className="mx-auto w-full py-20">
            <div className="max-w-5xl grid grid-cols-12 gap-4 mx-auto px-10">
                <div className="relative col-span-4">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Job Title, Skills, or Keywords"
                        className="pl-10 pr-4 py-2 border border-gray-300 w-full
            bg-white text-gray-600 text-sm rounded-full 
            focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <div className="relative col-span-4">
                    <TiLocationOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="City, Province, or Postal Code"
                        className="pl-10 pr-4 py-2 border border-gray-300  w-full
            bg-white text-gray-600 text-sm rounded-full 
            focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <Button variant="dark"
                    size="md" onClick={handleClick} className="!rounded-full text-sm whitespace-nowrap col-span-4">
                    Search Jobs
                </Button>
            </div>
        </section>

        {/*   Explore how we help job seekers */}
        <section className="mx-auto w-5xl  mb-20">
            <div className="w-full bg-cover bg-center bg-blue-900 p-10 rounded-4xl border">

                <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
                    Explore how we help job seekers
                </h2>


                <div className="grid grid-cols-6 w-full gap-10">
                    <div className="col-span-3">
                        <div className="flex gap-4 mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        1
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    Starting your job search at no cost
                                </p>
                                <p className="text-sm font-light text text-start">
                                    Simply apply or upload your resume to gain access to in-demand jobs with competitive pay and benefits.
                                </p>
                                <div className="flex gap-4 mt-5">
                                    <Button variant="dark" size="md" onClick={handleClick} className="!rounded-full text-sm !font-light !text-white flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        Apply to jobs
                                        <div className="bg-white p-2 rounded-full">
                                            <FiArrowRight className="text-black" />
                                        </div>
                                    </Button>
                                    <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        Upload your resume
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        2
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    Making the match
                                </p>
                                <p className="text-sm font-light text text-start">
                                    Job matches will be sent to your inbox and your phone.
                                </p>
                                <div className="flex gap-4 mt-5">
                                    <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        Upload your resume
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Image src={imagePathFinder.explore_how_we_help_job_seekers} alt="  We Source the Talent" className="w-full mb-4 mx-auto" />
                    </div>
                    <div className="col-span-3">
                        <div className="flex gap-4 mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        3
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    Helping you land the job
                                </p>
                                <p className="text-sm font-light text text-start">
                                    We'll guide you through interviews, advocate for you with interested employers, and even negotiate salary on your behalf.
                                </p>
                                <div className="flex gap-4 mt-5">
                                    <Button variant="dark" size="md" onClick={handleClick} className="!rounded-full text-[12px] !font-light !text-white flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        Get interview tips
                                        <div className="bg-white p-2 rounded-full">
                                            <FiArrowRight className="text-black" />
                                        </div>
                                    </Button>
                                    <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-[12px] !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        Explore our salary guide
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        4
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    Staying focused on your future
                                </p>
                                <p className="text-sm font-light text text-start">
                                    As your career develops, our free online training and expertise will help you stay on top of your skills, keep your profile current, and offer insights along the way.
                                </p>
                                <div className="flex gap-4 mt-5">
                                    <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        Get career advice
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-10">
                            <div>
                                <div className="bg-white rounded-full w-10 h-10 text-center flex justify-center items-center whitespace-nowrap">
                                    <p className="text-sm p-0 m-0 text-blue-900 font-bold">
                                        5
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <p className="text-sm text-start uppercase mb-2 font-bold">
                                    Supporting you throughout your career
                                </p>
                                <p className="text-sm font-light text text-start mb-4">
                                    We go beyond just landing the job.
                                    Industrielle RH is here to support you throughout your employment journey:
                                </p>
                                <p className="text-sm font-light text text-start mb-4">
                                    <strong className="font-semibold">Upskill with free training: </strong>   <br />
                                    Access professional development
                                    opportunities to grow and adapt in your role.
                                </p>
                                <p className="text-sm font-light text text-start mb-4">
                                    <strong className="font-semibold">Legal assistance at your side: </strong>   <br />
                                    Get support to understand your rights and navigate any challenges with confidence.
                                </p>
                                <p className="text-sm font-light text text-start mb-4">
                                    <strong className="font-semibold">Continuous career advice: </strong>   <br />
                                    your profile to achieve long-term success.
                                </p>
                                    
                                        <div className="mt-10">
                                    <Button variant="dark" size="md" onClick={handleClick} className="!rounded-full text-sm !font-light !text-white flex items-center gap-3 !pl-4 !pr-1.5 !py-1 mb-4">
                                        Explore our training programs
                                                    <div className="bg-white p-2 rounded-full">
                                            <FiArrowRight className="text-black" />
                                        </div>
                                    </Button>
                                    <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm !font-light !text-gray-600 flex items-center gap-3 !pl-4 !pr-1.5 !py-1 ">
                                        Learn about our legal support
                                        <div className="bg-black p-2 rounded-full">
                                            <FiArrowRight className="text-white" />
                                        </div>
                                </Button>
                            </div>
                        </div>
                                </div>
                                </div>
                </div>
                            
                        </div>
                        </section>
                    

                    
                        {/*  Explore success stories   */}
        <section className="mx-auto w-lvw mb-10 p-10 bg-gray-200">
            <div className="text-center  m-auto max-w-5xl p-10">

                <Image src={imagePathFinder.logo_only} alt="Salary Guide" className="w-20 mx-auto mb-5" />
                <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                    Explore success stories
                </h2>

                <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-2 bg-white rounded-2xl p-7 text-center shadow-2xl relative">
                        <div className="flex mb-3 gap-2">
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                        </div>
                        <p className="text-sm font-regular text  text-gray-500 text-start mb-2">
                            {'"Anyone searching for an entry-level position knows how hard it is to find a position that aligns with your future goals. They connected me with the perfect job."'}
                        </p>
                        <p className="text-sm font-bold text  text-gray-800 text-end absolute bottom-5 right-4">
                            - Sales Assistant
                        </p>
                    </div>
                    <div className="col-span-2 bg-white rounded-2xl p-7 text-center shadow-2xl relative">
                        <div className="flex mb-3 gap-2">
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                        </div>
                        <p className="text-sm font-regular text  text-gray-500 text-start mb-2">
                            {'"Robert Half was able to get the person we needed to do the project in less than a week."'}
                        </p>
                        <p className="text-sm font-bold text  text-gray-800 text-end absolute bottom-5 right-4">
                            - Billing Analyst
                        </p>
                    </div>
                    <div className="col-span-2 bg-white rounded-2xl p-7 text-center shadow-2xl relative">
                        <div className="flex mb-3 gap-2">
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                            <AiFillStar className="text-yellow-500 text-xl" />
                        </div>
                        <p className="text-sm font-regular text  text-gray-500 text-start mb-2">
                            {'"I am in a position that fits me. Robert Half is making working from home so much easier. The support is amazing."'}
                        </p>
                        <p className="text-sm font-bold text  text-gray-800 text-end absolute bottom-5 right-4">
                            - Customer Service Representative
                        </p>
                    </div>
                </div>

                <div className="flex mx-auto mt-10 gap-2 align-middle items-center justify-center">
                    <div className="bg-blue-700 p-2 rounded-full ">
                                      <FiArrowLeft className="text-white" />
                                    </div>
                                    <div className="bg-blue-700 p-2 rounded-full">
                                        <FiArrowRight className="text-white" />
                                    </div>
                </div>
                            </div>
                        </section>

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
}