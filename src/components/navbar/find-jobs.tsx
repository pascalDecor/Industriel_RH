"use client";

import Link from "next/link";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Button from "../ui/button";
import { Sector } from "@/models/sector";
import { LoadingSpinner } from "@/lib/load.helper";


export function FindJobsExpandedNavbar({ sectors }: { sectors: Sector[] }) {
  return (
    <div className="lg:flex grid grid-cols-12 gap-10 lg:px-10 mb-5 justify-between items-start w-7xl mx-auto">
      <div className="col-span-3 lg:w-3/12">
        <div className="bg-white shadow-lg rounded-2xl p-5 w-full">
          <Image loading="lazy" src={imagePathFinder.find_jobs} alt="logo" className="w-1/2" />
          <p className="text-gray-500 text-sm mb-5">
            Control your career. Find the right role for you and your family.
          </p>
          <Button variant="primary" size="md" onClick={() => null} className="!rounded-full text-sm px-10 mx-auto">
            Find your next job
          </Button>
        </div>
      </div>
      <div className="col-span-2 lg:w-3/12">
        <div className="p-5 w-full">
          <p className="text-gray-500 text-sm font-bold mb-5">
            Submit Your CV
          </p>
          <p className="text-gray-500 text-sm">
            Explore how we help job seekers
          </p>
        </div>
      </div>
      <div className="col-span-2 lg:w-3/12">
        <div className="p-5 w-fit bg-blue-50 shadow-lg rounded-2xl grid grid-rows-5 gap-5 float-right">
          {sectors.length > 0 ? sectors.map((sector) => (
            <Link key={sector.id} href={"/find-jobs"} className="text-gray-500 text-sm">
              {sector.libelle}
            </Link>
          )) : <LoadingSpinner color="#0F766E"></LoadingSpinner>}
        </div>
      </div>
    </div>
  );
}

