
"use client";

import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from 'next/image';

import HomeBannerCarroussel from "@/components/HomeBannerCarroussel";
import Button from "@/components/ui/button";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { useState } from "react";
import FloatingLabelInput from "@/components/ui/input";
import FloatingLabelSelect from "@/components/ui/select";


interface FilterElementsProps {
  id: number,
  label: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filters: string[];
}


export default function DiscoverInsights() {
  function handleClick() {
    console.log("Clic !");
  }

  const [filterTypes, setfilterTypes] = useState<FilterElementsProps[]>([
    {
      id: 0,
      label: "Areas of Interest",
      checked: true,
      filters: ["Career development", "Hiring help", "Landing a job", "Management tips", "Research and insights"]
    },
    {
      id: 1,
      label: "Content Type",
      checked: false,
      filters: ["Career development", "Hiring help", "Landing a job", "Management tips", "Research and insights"]
    },
    {
      id: 2,
      label: "Specialization",
      checked: false,
      filters: ["Career development", "Hiring help", "Landing a job", "Management tips", "Research and insights"]
    },
    {
      id: 3,
      label: "Trending Topics",
      checked: false,
      filters: ["Career development", "Hiring help", "Landing a job", "Management tips", "Research and insights"]
    },
    {
      id: 4,
      label: "Tags",
      checked: false,
      filters: ["Career development", "Hiring help", "Landing a job", "Management tips", "Research and insights"]
    },
  ]);


  const updateItemCheck = (id: number) => {
    setfilterTypes((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };


  return <>
    {/* <HomeBannerCarroussel /> */}
    {/*Own the future of your work */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-5 items-center gap-4 mt-10">
        <div className="lg:col-span-3 col-span-12  pr-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {"Own the future of your work"}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {"Explore our exclusive research and actionable insights from industry-leading specialists to help transform your business or guide your career."}
          </p>
        </div>
        <div className="lg:col-span-2 col-span-12">
          <Image src={imagePathFinder.own_the_future_of_your_work} alt="Own the future of your work" />
        </div>
      </div>
    </section>
    {/* Explore exclusive insights */}
    <section className="mx-auto w-lvw mb-10 p-10 ">

      <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
        Explore exclusive insights
      </h2>


      <div className="max-w-5xl mb-10 mx-auto grid grid-cols-12 gap-8 text-left">

        <div className="col-span-4">

          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image src={imagePathFinder.salary_guide_five} alt="  We Source the Talent" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                2025 Salary Guide
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                Explore the latest data for hundreds of positions and know what you should earn or pay in local and national markets.
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image src={imagePathFinder.what_jobs_are_in_demand_3} alt="  We Source the Talent" className="mx-auto" />
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

        <div className="col-span-4">
          <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
            <Image src={imagePathFinder.build_employee_engagement} alt="Build employee engagement" className="mx-auto" />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                Build employee engagement
              </p>
              <p className="text-sm font-regular text-gray-500 ">
                Attract and retain top talent and boost your bottom line-with our tips for creative employee recognition and rewards.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>


    {/* Refine your focus */}
    <div className="absolute -mt-400" id="refine_your_focus"></div>
    <section className="mx-auto w-lvw mb-10 p-10 bg-gray-200 text-center">
      <h2 className="text-3xl font-semibold text my-10 text-black text-center">
        Refine your focus
      </h2>

      <div className="grid grid-cols-12 gap-4 max-w-5xl mx-auto">
        <div className="col-span-3 text-left">
          <div className="bg-white p-8 rounded-xl  overflow-hidden mb-4">
            <p className="font-regular text-blue-900 font-bold mb-5 uppercase">
              Filter content by
            </p>

            {filterTypes.map((filterType, index) => (
              <>
                <div className="flex gap-4 items-center justify-between mb-5 cursor-pointer" key={index} onClick={() => updateItemCheck(filterType.id)}>
                  <p className={`text-sm font-bold  ${filterType.checked ? "text-gray-900" : "text-gray-600"} `}>
                    {filterType.label}
                  </p>
                  {filterType.checked ?
                    <FaArrowUp className="text-gray-900 text-lg" /> :
                    <FaArrowDown className="text-gray-600 text-lg" />
                  }
                </div>
                {
                  filterType.checked && filterType.filters.map((filter, index) => (
                    <div className="flex gap-2 items-center mb-4" key={index}>
                      <input type="checkbox" className="w-4 h-4 text-blue-900 bg-gray-100 rounded-md focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <p className="text-sm font-regular text-gray-500">
                        {filter}
                      </p>
                    </div>
                  ))}
                <hr className="my-5" />
              </>
            ))}

            <div className="col-span-12 flex justify-center items-center">
              <Button variant="dark" size="md" onClick={handleClick} className="!rounded-full text-sm mx-auto w-fit whitespace-nowrap px-10 py-3">
                Apply Filter
              </Button>
            </div>

          </div>
        </div>
        <div className="max-w-5xl mb-10 mx-auto grid grid-cols-12 gap-4 text-left col-span-9">
          <div className="col-span-4">
            <div className="bg-white rounded-lg p-0 overflow-hidden mb-4">
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
            <div className="bg-white rounded-lg p-0 overflow-hidden mb-4">
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

          <div className="col-span-4">
            <div className="bg-white rounded-lg p-0  overflow-hidden mb-4">
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
            <div className="bg-white rounded-lg p-0 overflow-hidden mb-4">
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
          <div className="col-span-4">

            <div className="bg-white rounded-lg p-0  overflow-hidden mb-4">
              <Image src={imagePathFinder.card_image_6} alt="  We Source the Talent" className="mx-auto" />
              <div className="p-5">
                <p className="text-sm font-regular text-blue-900 font-bold mb-5">
                  New Year, New Career: 7 Canada-Centric Job Search Tips for 2025
                </p>
                <p className="text-sm font-regular text-gray-500 ">
                  New year, new career! Professionals across Canada wondering how to find a job in 2025 should check out our 7 job search tips for 2025 to ensure they start the year off right.                            </p>
              </div>
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
          <div className="col-span-12 flex justify-center items-center">
            <Button variant="primary" size="md" onClick={handleClick} className="!rounded-full text-sm mx-auto mt-10 w-fit whitespace-nowrap">
              Read more
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/*   Add specialized talent across your organization */}
    <section className="mx-auto w-5xl mb-10 p-10">
      <div className="w-full bg-blue-900  bg-[url(/images/bg_blue.png)] bg-cover bg-center py-15 px-20 rounded-4xl border">
        <p className="font-medium text-3xl text-center mb-4">
          Get insights in your inbox
        </p>

        <div className="flex mt-5 align-center items-center mx-auto w-fit">
          <Button variant="dark" size="md"  onClick={() => redirect("#refine_your_focus")}  className="!rounded-full px-10 py-3 text-sm mx-auto mt-10 w-fit whitespace-nowrap">
            Subscribe to updates
          </Button>
        </div>
      </div>
    </section>

    {/*Subscribe to the Industrielle RH Newsletter */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-6 items-center gap-4 mt-10">

        <div className="lg:col-span-3 col-span-6  pl-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {"Subscribe to the Industrielle RH Newsletter"}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {`By subscribing to the Industrielle RH newsletter, you'll gain access to valuable articles,
            resources, and updates to help you recruit top talent, enhance workforce integration, 
            and stay informed about the latest in the recruitment 
industry. Get insights directly in your inbox to support your company's growth and success.
To receive updates from Industrielle RH, simply enter your name and email below. You can withdraw your
 consent at any time by contacting Industrielle RH Recrutement International Inc.`}
          </p>
        </div>

        <div className="lg:col-span-3 col-span-6 px-5">
          <div className="bg-blue-900 px-10 py-5 rounded-3xl border max-w-3xl mx-auto">

            <h2 className="text-2xl font-semibold text mb-10 mt-5 text-white text-center">
              Why wait? Sign up now
            </h2>
            <form action="" className="grid grid-cols-12 gap-4 w-full mb-10 ">
              <div className="col-span-12">
                <FloatingLabelInput
                  type="text"
                  label="First Name"
                  placeholder="First Name"/>
              </div>
              <div className="col-span-12">
                <FloatingLabelInput
                  type="text"
                  label="Last Name"
                  placeholder="Last Name"
                />
              </div>

              <div className="col-span-12 text-left">
                <FloatingLabelInput
                  type="email"
                  label="Email"
                  placeholder="Email"
                />
              </div>

              <div className="col-span-12 text-left ">
                <p className="text-white font-medium text-sm">Which topic are you interested in?</p>
              </div>

              <div className="col-span-12 text-left mb-5">
                <FloatingLabelSelect label="Areas of Interest" name="areas_of_nterest" options={[{
                  label: "Option 1",
                  value: "option1"
                }, {
                  label: "Option 2",
                  value: "option2"
                }, {
                  label: "Option 3",
                  value: "option3"
                }]} />
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
    </section>

  </>
}