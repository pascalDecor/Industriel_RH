"use client";

import Button from "@/components/button";
import Carousel from "@/components/carroussel";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCheck, FiSearch } from "react-icons/fi";
import { TiLocationOutline } from "react-icons/ti";
import Image from 'next/image'
import { imagePathFinder } from "@/utils/imagePathFinder";
import { AiFillStar } from "react-icons/ai";

export default function Home() {

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

  return (
    <main className="flex flex-col items-center justify-center bg-gray-100 w-full overflow-x-hidden max-w-full">
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

      {/* Hiring trends & insights */}
      <section className="mx-auto max-w-5xl mb-10 p-10">
        <h2 className="text-4xl font-semibold text mb-14 text-gray-800 text-center">
          Hiring trends & insights
        </h2>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 place-items-center">
          <div className="bg-[url(/images/card_fond.png)] 
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                  Salary Guide
                </h6>
                <p className="text-gray-500 text-sm">
                  Explore the latest data for hundreds of positions and
                  know what you should earn or pay in local and national markets.
                </p>
              </div>
              <Image className="w-1/3 rounded-lg" src={imagePathFinder.salary_guide} alt="Salary Guide" />
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] 
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                  What jobs are in demand?
                </h6>
                <p className="text-gray-500 text-sm">
                  Explore our Demand for Skilled Talent report to
                  see what specializations employers need most.
                </p>
              </div>
              <Image className="w-1/3 rounded-lg" src={imagePathFinder.what_jobs_are_in_demand} alt="What jobs are in demand?" />
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] 
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                  Robert Half blog
                </h6>
                <p className="text-gray-500 text-sm">
                  Stay one step ahead with the latest data, insights, tips and tricks
                  from some of the foremost experts in the talent solutions business.
                </p>
              </div>
              <Image className="w-1/3 rounded-lg" src={imagePathFinder.robert_half_blog} alt="Robert Half blog" />
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] 
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                  Navigate tech skills gaps
                </h6>
                <p className="text-gray-500 text-sm">
                  Discover strategies for building a comprehensive
                  tech team to support business priorities.
                </p>
              </div>
              <Image className="w-1/3 rounded-lg" src={imagePathFinder.navigate_tech_skill} alt="Navigate tech skills gaps" />
            </div>
          </div>

        </div>
      </section>

      {/*  Worry-free recruitment for today's and tomorrow's Quebec!  */}
      <section className="mx-auto max-w-5xl mb-10 p-10">
        <div className="flex items-center gap-4">
          <div className="w-3/5 pr-4">
            <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
              {"Worry-free recruitment for today's and tomorrow's Quebec!"}
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              {"We help you build a strong team to tackle the challenges of Quebec's competitive market."}
            </p>
            <div className="flex gap-4 align-middle items-center">
              <p className="text-gray-500 text-sm whitespace-nowrap">
                {"I'm looking for a"}
              </p>
              <div className="relative w-60">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job Title"
                  className=" pl-10 pr-4 py-2 border border-gray-400  w-full
                bg-gray-200 text-gray-900 text-sm rounded-full 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>
            <Button variant="primary" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm">
              Preview candidates
            </Button>
          </div>
          <div className="w-2/5">
            <Image src={imagePathFinder.preview_candidat} alt="Salary Guide" />
          </div>
        </div>
      </section>

      {/*   How it works */}
      <section className="mx-auto w-5xl mb-10 p-10">
        <div className="w-full bg-[url(/images/how_it_work.png)] bg-cover bg-center bg-blue-900 p-10 rounded-4xl border">

          <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
            How it works
          </h2>

          <div className="grid grid-cols-5 gap-4 w-full mb-10 ">
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <Image src={imagePathFinder.describe_your_need} alt="Describe your Need" className="w-10 mb-4 mx-auto" />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                Describe your Need
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <Image src={imagePathFinder.we_source_the_talent} alt="  We Source the Talent" className="w-10 mb-4 mx-auto" />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                We Source the Talent
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <Image src={imagePathFinder.select_and_approve} alt="Select and Approve" className="w-10 mb-4 mx-auto" />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                Select and Approve
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <Image src={imagePathFinder.seamless_integration} alt="Seamless Integration" className="w-10 mb-4 mx-auto" />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                Seamless Integration
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <Image src={imagePathFinder.continuous_support} alt="Continuous Support" className="w-10 mb-4 mx-auto" />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                Continuous Support
              </p>
            </div>

          </div>

        </div>
      </section>

      {/*  Partner with qualified talent aligned with your company values   */}
      <section className="mx-auto max-w-5xl mb-10 p-10">
        <div className="flex items-center gap-4">
          <div className="w-3/5 pr-4">
            <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
              Partner with qualified talent aligned with your company values
            </h2>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {"Access Industrielle RH's extensive network of qualified candidates in manufacturing, construction, healthcare, logistics, and agriculture."}
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                Quickly match with local and international professionals who have the right skills and industry expertise.
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                Let us recruit candidates at every level, from entry-level to managerial roles.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="primary" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm">
                Find your next hire
              </Button>
              <Button variant="light" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm border border-gray-300">
                Learn more
              </Button>
            </div>
          </div>
          <div className="w-2/5">
            <Image src={imagePathFinder.find_your_next_hire} alt="Salary Guide" />
          </div>
        </div>
      </section>


      {/*  We are experts in employee recognition   */}
      <section className="mx-auto w-lvw mb-10 p-10 bg-gray-200">
        <div className="flex items-center gap-4 m-auto max-w-5xl p-10">
          <div className="w-3/5 mr-7">
            <Image src={imagePathFinder.we_are_experts_in_employee_recognition} alt="Salary Guide" />
          </div>
          <div className="w-3/5 pr-4">
            <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
              We are experts in employee recognition
            </h2>

            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                Our offering includes tailored employee recognition programs.
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                Continuing training adapted to your needs.
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                Ongoing support to ensure integration and retention.
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                {"Personalized solutions to celebrate your team's achievements."}
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="primary" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm">
                Find your next hire
              </Button>
              <Button variant="light" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm border border-gray-300">
                Learn more
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/*  Shape the career you want   */}
      <section className="mx-auto max-w-5xl mb-10 p-10">
        <div className="flex items-center gap-4">
          <div className="w-3/5 pr-4">
            <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
              Shape the career you want
            </h2>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                Free legal assistance.
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                Get personalized job recommendations tailored to your skills and goals, whether locally or international ly.
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                Explore opportunities across industries for contract or permanent roles.
              </p>
            </div>
            <div className="flex gap-4 align-start items-start">
              <div className="bg-blue-700 p-1 rounded-full">
                <FiCheck className="text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-5">
                Enjoy competitive pay and benefits, along with free online training and development programs to help you grow.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="primary" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm">
                Find your next hire
              </Button>
              <Button variant="light" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm border border-gray-300">
                Learn more
              </Button>
            </div>
          </div>
          <div className="w-3/5">
            <Image src={imagePathFinder.shape_the_career_you_want} alt="Salary Guide" />
          </div>
        </div>
      </section>

      {/*   How it works */}
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

      {/*   Partners & Accreditation */}
      <section className="mx-auto w-5xl mb-10 p-10">
        <div className="w-full bg-[url(/images/partners_accreditation.png)] bg-cover bg-center bg-blue-900 p-10 rounded-4xl border">

          <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
            Partners & Accreditation
          </h2>

          <div className="grid grid-cols-5 gap-4 w-full mb-10 ">
            <div className="col-span-1 bg-white rounded-2xl p-3 text-center flex flex-col items-center justify-center">
              <Image src={imagePathFinder.partners_desjardins} alt="Describe your Need" className="w-full my-auto" />
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-3 text-center flex flex-col items-center justify-center">
              <Image src={imagePathFinder.partners_CRIC} alt="  We Source the Talent" className="w-full my-auto" />

            </div>
            <div className="col-span-1 bg-white rounded-2xl p-3 text-center flex flex-col items-center justify-center">
              <Image src={imagePathFinder.partners_cnesst} alt="Select and Approve" className="w-full my-auto" />

            </div>
            <div className="col-span-1 bg-white rounded-2xl p-3 text-center flex flex-col items-center justify-center">
              <Image src={imagePathFinder.partners_dusco} alt="Seamless Integration" className="w-full my-auto" />

            </div>
            <div className="col-span-1 bg-white rounded-2xl p-3 text-center flex flex-col items-center justify-center">
              <Image src={imagePathFinder.partners_stride} alt="Continuous Support" className="w-full my-auto" />
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


    </main>
  );
}


