"use client";

import { imagePathFinder } from "@/utils/imagePathFinder";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Image from 'next/image'
import { Notice } from "@/models/notice";
import { HttpService } from "@/utils/http.services";
import { useState, useEffect } from "react";
import ShowStars from "@/app/(admin)/management/notices/showStars";


interface ExploreSuccessStoriesInputProps {
  className?: string;
}
export default function ExploreSuccessStories({ className }: Readonly<ExploreSuccessStoriesInputProps>) {

  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    HttpService.index<Notice>({ url: '/notices', fromJson: (json: any) => Notice.fromJSON(json), })
      .then((data) => {
        setNotices(data.data);
      });

  }, []);

  return (
    <>
      {/*  Explore success stories   */}
      <section className={`mx-auto w-lvw mb-10 p-10 bg-gray-200 ${className}`}>
        <div className="text-center  m-auto max-w-5xl p-10">

          <Image src={imagePathFinder.logo_only} alt="Salary Guide" className="w-20 mx-auto mb-5" />
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            Explore success stories
          </h2>

          <div className="grid grid-cols-6 gap-3">
            {notices.map((n) =>
              <div key={n.id} className="col-span-2 bg-white rounded-2xl p-7 text-center hover:shadow shadow-2xl relative">
                <div className="mb-3">
                  <ShowStars star={n.stars} />
                </div>
                <p className="text-sm font-regular text  text-gray-500 text-start mb-5">
                  "{n.content}"
                </p>
                <p className="text-sm font-bold text  text-gray-800 text-end absolute bottom-5 right-4">
                  - {n.author}
                </p>
              </div>
            )}
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

    </>
  );
}  