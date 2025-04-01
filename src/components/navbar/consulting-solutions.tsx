"use client";

import Link from "next/link";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Button from "../ui/button";


export function ConsultingSolutionsExpandedNavbar() {
  return (
    <div className="lg:flex grid grid-cols-12 gap-10 lg:px-10 mb-5 justify-between items-start w-7xl mx-auto">
      <div className="col-span-3 lg:w-3/12">
        <div className="bg-white shadow-lg rounded-2xl p-5 w-full">
          <Image src={imagePathFinder.consulting_solutions} alt="logo" className="w-1/2" />
          <p className="text-gray-500 text-sm mb-5">
            See how our consulting capabilities can help transform your business.
          </p>
          <Button variant="primary" size="md" onClick={() => null} className="!rounded-full text-sm px-10 mx-auto">
            Contact US
          </Button>
        </div>
      </div>

      <div className="col-span-7 lg:w-7/12">
        <div className="p-5 w-fit bg-blue-50 shadow-lg rounded-2xl float-right">
          <p className="text-blue-900 text-sm font-bold mb-4 uppercase">
            AREAS OF EXPERTISE
          </p>
          <div className=" grid grid-rows-5 gap-5">

            <Link href={"/consulting-solutions"} className="text-gray-500 text-sm">
              <p className="text-gray-500 text-sm font-bold mb-2">
                Manufacturing & Skilled Trades
              </p>
              <p className="text-gray-500 text-sm">
                Welders, Machine Operators, Assemblers, and Industrial Mechanics.
              </p>
            </Link>
            <Link href={"/consulting-solutions"} className="text-gray-500 text-sm">
              <p className="text-gray-500 text-sm font-bold mb-2">
                Construction & Civil Engineering
              </p>
              <p className="text-gray-500 text-sm">
                Electricians, Heavy Equipment Operators, and Project Managers.
              </p>
            </Link>
            <Link href={"/consulting-solutions"} className="text-gray-500 text-sm">
              <p className="text-gray-500 text-sm font-bold mb-2">
                Healthcare & Social Services
              </p>
              <p className="text-gray-500 text-sm">
                Nurses, Caregivers, and Medical Technicians.
              </p>
            </Link>
            <Link href={"/consulting-solutions"} className="text-gray-500 text-sm">
              <p className="text-gray-500 text-sm font-bold mb-2">
                Transport & Logistics
              </p>
              <p className="text-gray-500 text-sm">
                Truck Drivers, Warehouse Supervisors, and Logistics Coordinators.
              </p>
            </Link>
            <Link href={"/consulting-solutions"} className="text-gray-500 text-sm">
              <p className="text-gray-500 text-sm font-bold mb-2">
                Agriculture & Agro-Food
              </p>
              <p className="text-gray-500 text-sm">
                Farm Workers, Machine Operators, and Food Processing Technicians
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}

