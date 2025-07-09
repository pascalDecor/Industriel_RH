"use client";

import Button from "@/components/ui/button";
import { SectionProps } from "@/models/props";
import { Section } from "@/models/section";
import { Sector } from "@/models/sector";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { LocalStorageHelper } from "@/utils/localStorage.helper";
import Image from 'next/image';
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { TaxCalculator } from "./components/Calculator";

export default function QuebecTaxCalculator() {
  const [sector, setSector] = useState<Sector | undefined>(undefined);
  const [section2, setSection2] = useState<Section | undefined>(undefined);

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 10 }, (_, i) => `${currentYear - i}`);


  useEffect(() => {
    const data = LocalStorageHelper.getValue("activeSector");
    if (data) {
      const temp = JSON.parse(LocalStorageHelper.getValue("activeSector") ?? "{}");
      const tempSector = Sector.fromJSON(temp as SectionProps);
      setSector(tempSector);
    } else {
      redirect("/");
    }
  }, []);

  useEffect(() => {
    if (sector) {
      setSection2(sector.sections.find(s => s.slug === "consulting_solutions_section_2"));
    }
  }, [sector]);

  return <>
    {/* Calculate your taxes with our tool */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-5 items-center gap-4 mt-10">
        <div className="lg:col-span-3 col-span-12  pr-4">
           <Image loading="lazy" src={imagePathFinder.salaire_net} className="h-8 w-auto" alt="Salary Net" />
          <h2 className="text-3xl font-semibold text mb-5 text-gray-800">
            {"Calculate your taxes with our tool"}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {`In Canada each province and territory has its own provincial income tax rates besides federal tax rates. Below there is simple income tax calculator for every Canadian province and territory. Or you can choose income tax calculator for particular province or territory depending on your residence.`}
          </p>
        </div>
        <div className="lg:col-span-2 col-span-12">
          <Image loading="lazy" src={imagePathFinder.quebec_tax_calculator} alt="Salary Guide" />
        </div>
      </div>
    </section>

    {/*  Quebec Tax Calculator   */}
    <section className="mx-auto w-lvw mb-10 px-10 py-24 bg-gray-200">
      <div className="mx-auto" >
        <TaxCalculator />
      </div>
    </section>

    {/*  Calculate your net income   */}
    {/* <section className="mx-auto w-lvw mb-10 px-10 py-24 bg-gray-200">
      <div className="bg-blue-900 p-10 rounded-3xl border max-w-3xl mx-auto">

        <h2 className="text-3xl font-semibold text mb-10 mt-5 capitalize text-white text-center">
          Calculate your net income
        </h2>

        <form action="" className="grid grid-cols-12 gap-4 w-full mb-10 ">
          <div className="col-span-12 text-left mb-3">
            <AsyncBuilder
              promise={async () => { return HttpService.index<City>({ url: '/cities', fromJson: (json: any) => City.fromJSON(json), }) }}
              loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
              hasData={(data) =>
                <FloatingLabelSelect
                  label="Provincve / Territory"
                  // placeholder="Select  province or territory"
                  required
                  name="city"
                  onChange={(e) => { console.log(e.target.value) }}
                  options={data.data.map((s) => ({ value: s.id, label: s.libelle }))} />
              }
            />
          </div>
          <div className="col-span-12 text-left mb-3">
            <AsyncBuilder
              promise={async () => { return HttpService.index<City>({ url: '/cities', fromJson: (json: any) => City.fromJSON(json), }) }}
              loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
              hasData={(data) =>
                <FloatingLabelSelect
                  label="Provincve / Territory"
                  // placeholder="Select  province or territory"
                  required
                  name="city"
                  onChange={(e) => { console.log(e.target.value) }}
                  options={data.data.map((s) => ({ value: s.id, label: s.libelle }))} />
              }
            />
          </div>

          <div className="col-span-12 flex space-x-3 text-center">
            <Button variant="light" size="md" onClick={() => console.log("Clic !")} className="!rounded-xl w-full text-sm px-20 py-4 mx-auto me-3">
              Calculate
            </Button>
            <Button variant="dark" type="reset" size="md" onClick={() => console.log("Clic !")} className="!rounded-xl w-full py-4 text-sm px-20 mx-auto">
              Clear
            </Button>
          </div>

        </form>

      </div>
    </section> */}


    <section>
      <div>
        <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
          {"How we help you find a job"}
        </h2>

        <div className="max-w-5xl mb-10 mx-auto grid grid-cols-2 gap-10 text-left">
          <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
            <p className="text-sm font-regular text-gray-500 font-bold mb-3">
              Upload your resume
            </p>
            <p className="text-sm font-regular text-gray-500 ">
              Add your latest resume to match with open positions.
            </p>
            <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-5 !rounded-full text-sm">
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
            <Button variant="primary" size="md" onClick={() => redirect("/consulting-solutions#move_your_career_forward")} className="mt-5 !rounded-full text-sm">
              Search
            </Button>
          </div>
          <div className="col-span-2 text-center">
            <Button variant="dark" size="md" onClick={() => redirect("/contact")} className="mt-5 mx-auto text-center !rounded-full text-sm">
              Contact US
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto w-5xl mb-10 p-10">
      <div className="w-full bg-blue-900  bg-[url(/images/bg_blue.png)] bg-cover bg-center py-15 px-20 rounded-4xl border">
        <div className="grid grid-cols-6 w-full ">
          <div className="col-span-3">
            <p className="text-sm font-bold text text-start mb-4">
              Trending job titles
            </p>
            <div className="grid grid-cols-4 mb-4">
              {sector && sector?.functions.map((f) =>
                <div key={f.id} className="col-span-2">
                  <p className="text-sm font-light text text-start mb-4 underline">
                    {f.libelle}
                  </p>
                </div>
              )}
            </div>
            <Button variant="light" size="md" onClick={() => redirect("/discover-insights#refine_your_focus")} className="!rounded-full text-sm border border-gray-300 !text-gray-500 flex px-5  mt-10">
              And many more!
              <div className="bg-blue-700 p-1 rounded-full ml-3">
                <FiArrowRight className="text-white" />
              </div>
            </Button>
          </div>
          <div className="col-span-3 p-0">
            <Image loading="lazy" src={section2?.image || imagePathFinder.trending_job_titles} width={500} height={500} alt="  We Source the Talent" className=" mb-4 mx-auto" />
          </div>
        </div>

      </div>
    </section>


    <section className="mx-auto w-lvw mb-10 p-10 ">

      <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
        Hiring trends & insights
      </h2>


      <div className="max-w-5xl mb-10 mx-auto grid grid-cols-12 gap-8 text-left">
        <div className="col-span-3">
          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image loading="lazy" src={imagePathFinder.be_salary_smart} alt="  We Source the Talent" className="mx-auto" />
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
            <Image loading="lazy" src={imagePathFinder.career_development} alt="  We Source the Talent" className="mx-auto" />
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
            <Image loading="lazy" src={imagePathFinder.What_jobs_are_in_demand} alt="  We Source the Talent" className="mx-auto" />
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
            <Image loading="lazy" src={imagePathFinder.landing_a_job} alt="  We Source the Talent" className="mx-auto" />
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