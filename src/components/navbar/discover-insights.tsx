"use client";

import Link from "next/link";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Button from "../ui/button";


export function DiscoverInsightsExpandedNavbar() {
  return (
    <div className="lg:flex grid grid-cols-12 gap-10 lg:px-10 mb-5 justify-between items-start w-7xl mx-auto">
      <div className="col-span-3 lg:w-3/12">
        <div className="bg-white shadow-lg rounded-2xl p-5 w-full">
          <Image src={imagePathFinder.discover_insights} alt="logo" className="w-1/2" />
          <p className="text-gray-500 text-sm mb-5">
            Make smarter decisions with the latest hiring trends and career insights.
          </p>
          <Button variant="primary" size="md" onClick={() => null} className="!rounded-full text-sm px-10 mx-auto">
            Discover Insights
          </Button>
        </div>
      </div>
      <div className="col-span-2 lg:w-3/12">
        <div className="p-5 w-full grid grid-rows-5 gap-1">
          <Link href={"/find-jobs"} className="text-gray-500 text-sm mb-4">
            2025 Salary Guide
          </Link>
          <Link href={"/find-jobs"} className="text-gray-500 text-sm mb-4">
            Demand for Skilled Talent Report
          </Link>
          <Link href={"/find-jobs"} className="text-gray-500 text-sm mb-4">
            Building Future-Forward Tech Teams
          </Link>
          <Link href={"/find-jobs"} className="text-gray-500 text-sm mb-4">
            Job Market Outlook
          </Link>
          <Link href={"/find-jobs"} className="text-gray-500 text-sm mb-4">
            Press Room
          </Link>
        </div>
      </div>
      <div className="col-span-2 lg:w-3/12">
        <div className="p-5 w-fit bg-blue-50 shadow-lg rounded-2xl float-right">
          <p className="text-gray-600 text-sm font-bold mb-4 uppercase">
            TRENDING TOPICS
          </p>
          <div className=" grid grid-rows-5 gap-5">

            <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              Salary and hiring trends
            </Link>
            <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              Adaptive working
            </Link>
            <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              Competitive advantage
            </Link>
            <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              Work/life balance
            </Link>
            <Link href={"/find-jobs"} className="text-gray-500 text-sm">
              Diversity and inclusion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

