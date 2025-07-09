
"use client";

import Button from "@/components/ui/button";

import { FiCheck, FiSearch } from "react-icons/fi";
import Image from 'next/image'
import { imagePathFinder } from "@/utils/imagePathFinder";
import AppYourWayToNewJob from "@/components/AppYourWayToNewJob";
import PartnersAccreditation from "@/components/PartnersAccreditation";
import ExploreSuccessStories from "@/components/ExploreSuccessStories";
import AddSpecializedTalentAcrossYourOrganization from "@/components/AddSpecializedTalentAcrossYourOrganization";
import HomeBannerCarroussel from "@/components/HomeBannerCarroussel";
import { redirect } from "next/navigation";

export default function Home() {

  function handleClick() {
    console.log("Clic !");
  }

  return (
    < >
      <HomeBannerCarroussel />
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
              <Image loading="lazy" className="w-1/3 rounded-lg" src={imagePathFinder.salary_guide_1} alt="Salary Guide" />
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] 
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                  CV buider
                </h6>
                <p className="text-gray-500 text-sm">
                  Create your resume. Highlight your skills. Get noticed.
                </p>
              </div>
              <Image loading="lazy" className="w-1/3 rounded-lg" src={imagePathFinder.cv_builder} alt="What jobs are in demand?" />
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] 
          bg-white bg-cover bg-center
            border border-gray-300 rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                  IR blog
                </h6>
                <p className="text-gray-500 text-sm">
                  Stay one step ahead with the latest data, insights, tips and tricks from some of the foremost experts in the talent solutions business.
                </p>
              </div>
              <Image loading="lazy" className="w-1/3 rounded-lg" src={imagePathFinder.ir_blog} alt="Robert Half blog" />
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
              <Image loading="lazy" className="w-1/3 rounded-lg" src={imagePathFinder.navigate_tech_skill} alt="Navigate tech skills gaps" />
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
            <Button variant="primary" size="md" onClick={() => redirect("/hire-talent#")} className="mt-10 !rounded-full text-sm">
              Preview candidates
            </Button>
          </div>
          <div className="w-2/5">
            <Image loading="lazy" src={imagePathFinder.preview_candidat} alt="Salary Guide" />
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
              <Image loading="lazy" src={imagePathFinder.describe_your_need} alt="Describe your Need" className="w-10 mb-4 mx-auto" />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                Describe your Need
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <Image loading="lazy" src={imagePathFinder.we_source_the_talent} alt="  We Source the Talent" className="w-10 mb-4 mx-auto" />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                We Source the Talent
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <Image loading="lazy" src={imagePathFinder.select_and_approve} alt="Select and Approve" className="w-10 mb-4 mx-auto" />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                Select and Approve
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <Image loading="lazy" src={imagePathFinder.seamless_integration} alt="Seamless Integration" className="w-10 mb-4 mx-auto" />
              <p className="text-sm font-semibold text  text-gray-800 text-center">
                Seamless Integration
              </p>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-7 text-center">
              <Image loading="lazy" src={imagePathFinder.continuous_support} alt="Continuous Support" className="w-10 mb-4 mx-auto" />
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
              <Button variant="primary" size="md" onClick={() => redirect("/hire-talent#")} className="mt-10 !rounded-full text-sm">
                Find your next hire
              </Button>
              <Button variant="light" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm border border-gray-300">
                Learn more
              </Button>
            </div>
          </div>
          <div className="w-2/5">
            <Image loading="lazy" src={imagePathFinder.find_your_next_hire} alt="Salary Guide" />
          </div>
        </div>
      </section>


      {/*  We are experts in employee recognition   */}
      <section className="mx-auto w-lvw mb-10 p-10 bg-gray-200">
        <div className="flex items-center gap-4 m-auto max-w-5xl p-10">
          <div className="w-3/5 mr-7">
            <Image loading="lazy" src={imagePathFinder.we_are_experts_in_employee_recognition} alt="Salary Guide" />
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
              <Button variant="primary" size="md" onClick={() => redirect("/hire-talent#")} className="mt-10 !rounded-full text-sm">
                Find your consulting solution
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
              <Button variant="primary" size="md" onClick={() => redirect("/find-jobs#")} className="mt-10 !rounded-full text-sm">
              Get job matches
              </Button>
              <Button variant="light" size="md" onClick={handleClick} className="mt-10 !rounded-full text-sm border border-gray-300">
                Learn more
              </Button>
            </div>
          </div>
          <div className="w-3/5">
            <Image loading="lazy" src={imagePathFinder.shape_the_career_you_want} alt="Salary Guide" />
          </div>
        </div>
      </section>

      {/*   Add specialized talent across your organization */}
      <AddSpecializedTalentAcrossYourOrganization />
      {/*  Explore success stories   */}
      <ExploreSuccessStories />
      {/*   Partners & Accreditation */}
      <PartnersAccreditation />
      {/*  App your way to a new job  */}
      <AppYourWayToNewJob />
    </>
  );
}


