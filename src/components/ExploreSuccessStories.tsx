import { imagePathFinder } from "@/utils/imagePathFinder";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Image from 'next/image'
import { AiFillStar } from "react-icons/ai";


interface ExploreSuccessStoriesInputProps {
  className?: string;
}
export default function ExploreSuccessStories({ className }: Readonly<ExploreSuccessStoriesInputProps>) {

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

    </>
  );
}  