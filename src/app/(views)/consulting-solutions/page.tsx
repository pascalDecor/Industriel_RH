
"use client";

import Button from "@/components/ui/button";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from 'next/image';

import { FiArrowRight } from "react-icons/fi";
import ExploreSuccessStories from "@/components/ExploreSuccessStories";
import { useState } from "react";
import MoveYourCareerForward from "./components/move-your-career-forward";
import HiringRequest from "./components/hiring-request";


export default function ConsultingSolutions() {
  function handleClick() {
    console.log("Clic !");
  }

  const tabs = [
    { id: "0", label: "I'm looking to hire" },
    { id: "1", label: "I'm looking for a job" },
  ];

  const tabsForm = [
    { id: "0", label: "I'm looking to hire" },
    { id: "1", label: "I'm looking for a job" },
  ];

  const tabsType = [
    { id: "0", label: "Construction" },
    { id: "1", label: "manufacturing" },
    { id: "2", label: "Healthcare" },
  ];

  const [activeTab, setActiveTab] = useState("0");
  const [activeTabType, setActiveTabType] = useState("1");
  const [activeTabForm, setActiveTabForm] = useState("0");

  return <>
    {/*Your Partner for Manufacturing Workforce Solutions */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-5 items-center gap-4 mt-10">
        <div className="lg:col-span-3 col-span-12  pr-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {"Your Partner for Manufacturing Workforce Solutions"}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {"We specialize in connecting skilled workers with leading manufacturers. From welders and machine operators to industrial mechanics and quality control specialists, we provide tailored recruitment solutions for permanent and temporary roles."}
          </p>
        </div>
        <div className="lg:col-span-2 col-span-12">
          <Image src={imagePathFinder.your_partner_for_manufacturing_workforce_solutions} alt="Your Partner for Manufacturing Workforce Solutions" />
        </div>
      </div>
    </section>

    <div className="flex">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 py-3 px-8 cursor-pointer rounded-t-xl transition-all ${activeTab === tab.id ? "bg-blue-800 font-bold text-white" : "text-gray-700 bg-gray-100"
            }`}
        >
          <span className="text-sm">{tab.label}</span>
        </button>
      ))}
    </div>
    {/* Ready to hire? We're ready to help  */}
    <section className="mx-auto w-full mb-0 px-10 py-24 bg-gray-200">
      <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
        {"Ready to hire? We're ready to help"}
      </h2>

      <div className="max-w-5xl mb-10 mx-auto grid grid-cols-2 gap-10 text-left">
        <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
          <p className="text-sm font-regular text-gray-500 font-bold mb-3">
            Outsourced Recruitment
          </p>
          <p className="text-sm font-regular text-gray-500 ">
            Entract us with the management of your short or long term workforse needs.
            Access qualified professionals ready to Join your teams quickly while you
            focus on your strategic priorities.
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
            Our experts support you at every step, from pre selecting candidates to their seamless integration in Canada.
          </p>
          <Button variant="primary" size="md" onClick={handleClick} className="mt-5 !rounded-full text-sm">
            Learn more
          </Button>
        </div>
        <div className="col-span-2 text-center">
          <Button variant="dark" size="md" onClick={handleClick} className="mt-5 mx-auto text-center !rounded-full text-sm">
            Contact US
          </Button>
        </div>
      </div>

      {/*   Add specialized talent across your organization */}
      <section className="mx-auto w-5xl mb-10 p-10">
        <div className="w-full bg-blue-900  bg-[url(/images/bg_blue.png)] bg-cover bg-center py-15 px-20 rounded-4xl border">
          <div className="grid grid-cols-6 w-full ">
            <div className="col-span-3">
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
              <Button variant="light" size="md" onClick={handleClick} className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex px-5  mt-10">
                And many more!
                <div className="bg-blue-700 p-1 rounded-full ml-3">
                  <FiArrowRight className="text-white" />
                </div>
              </Button>
            </div>
            <div className="col-span-3 p-0">
              <Image src={imagePathFinder.trending_job_titles} alt="  We Source the Talent" className=" mb-4 mx-auto" />
            </div>
          </div>

        </div>
      </section>


    </section>

    {/* Tabs */}

    <section>

      <div className="flex mb-10 mt-20 mx-auto items-center justify-center">
        {tabsType.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabType(tab.id)}
            className={`flex flex-col items-center gap-1 py-3 px-3 cursor-pointer  transition-all ${activeTabType === tab.id ? "text-xl font-bold text-black uppercase" : "text-gray-500 bg-gray-100 text-sm"
              }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

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



    {/*Leading agency for manufacturing workforce solutions */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-6 items-center gap-4 mt-10">
        <div className="lg:col-span-3 col-span-6">
          <Image src={imagePathFinder.leading_agency_for_manufacturing_workforce_solutions} alt="Leading agency for manufacturing workforce solutions" />
        </div>
        <div className="lg:col-span-3 col-span-6  pl-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {"Leading agency for manufacturing workforce solutions "}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {"Looking for your next opportunity in manufacturing? We connect skilled professionals like you with leading employers. From welding and machine operation to quality control and industrial maintenance, we'll help you find the perfect role to match your skills and career goals. "}
          </p>
        </div>
      </div>
    </section>


    <div className="flex">
      {tabsForm.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTabForm(tab.id)}
          className={`flex flex-col items-center gap-1 py-3 px-8 cursor-pointer rounded-t-xl transition-all ${activeTabForm === tab.id ? "bg-blue-800 font-bold text-white" : "text-gray-700 bg-gray-100"
            }`}
        >
          <span className="text-sm">{tab.label}</span>
        </button>
      ))}
    </div>

    {activeTabForm === "1" ? <MoveYourCareerForward /> :
      <HiringRequest />}

    {/*  Explore success stories   */}
    <ExploreSuccessStories className="bg-white" />


    <section className="mx-auto w-lvw mb-10 p-10 ">

      <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
        Hiring trends & insights
      </h2>


      <div className="max-w-5xl mb-10 mx-auto grid grid-cols-12 gap-8 text-left">
        <div className="col-span-3">
          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image src={imagePathFinder.be_salary_smart} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                Be salary smart
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                Get the data top companies use to attract and retain skilled talent. Start with our salary calculator.
              </p>
            </div>
          </div>

        </div>
        <div className="col-span-3">

          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image src={imagePathFinder.career_development} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                Career development
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                Get up-to-date information on employment trends in your industry, including salaries, skills and changes to the labor market.
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image src={imagePathFinder.What_jobs_are_in_demand} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                What jobs are in demand?
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                Explore our Demand for Skilled Talent report to see what specializations employers need most.
              </p>
            </div>
          </div>

        </div>
        <div className="col-span-3">
          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image src={imagePathFinder.landing_a_job} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                Landing a job
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                Learn how to write a professional resume, prep for a job interview and make a lasting impression on hiring managers.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  </>
}