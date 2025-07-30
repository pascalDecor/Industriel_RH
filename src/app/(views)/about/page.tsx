"use client";

import { imagePathFinder } from "@/utils/imagePathFinder";
import { useTranslation } from "@/contexts/LanguageContext";
import Image from 'next/image';

export default function About() {
  const { t } = useTranslation();
  
  return <>
    {/* Catalyst of prosperity for Quebec businesses */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-5 items-center gap-4 mt-10">
        <div className="lg:col-span-3 col-span-12  pr-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {t('about.catalyst.title')}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {t('about.catalyst.description')}
          </p>
        </div>
        <div className="lg:col-span-2 col-span-12">
          <Image loading="lazy" src={imagePathFinder.about_catalyst_of_prosperity} alt="Salary Guide" />
        </div>
      </div>
    </section>
    {/* Catalyst of prosperity for Quebec businesses */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-1 border-2 border-gray-300 p-7 rounded-2xl text-center h-full hover:bg-white hover:shadow-lg">
          <Image loading="lazy" src={imagePathFinder.expertise} alt="Describe your Need" className="w-10 mb-4 mx-auto" />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            {t('about.expertise.title')}
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center">
            {t('about.expertise.description')}
          </p>
        </div>
        <div className="col-span-1 border-2 border-gray-300 p-7 rounded-2xl text-center h-full hover:bg-white hover:shadow-lg">
          <Image loading="lazy" src={imagePathFinder.technology} alt="  We Source the Talent" className="w-10 mb-4 mx-auto" />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            {t('about.technology.title')}
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center ">
            {t('about.technology.description')}
          </p>
        </div>
        <div className="col-span-1 border-2 border-gray-300 p-7 rounded-2xl text-center h-full hover:bg-white hover:shadow-lg">
          <Image loading="lazy" src={imagePathFinder.innovative_approach} alt="Select and Approve" className="w-10 mb-4 mx-auto" />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            {t('about.innovative_approach.title')}
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center ">
            {t('about.innovative_approach.description')}
          </p>
        </div>
        <div className="col-span-1 border-2 border-gray-300 p-7 rounded-2xl text-center h-full hover:bg-white hover:shadow-lg" >
          <Image loading="lazy" src={imagePathFinder.reliability} alt="Seamless Integration" className="w-10 mb-4 mx-auto" />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            {t('about.reliability.title')}
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center">
            {t('about.reliability.description')}
          </p>
        </div>

      </div>
    </section>

    {/*  Mission, Vision and Values */}
    <section className="mx-auto max-w-5xl p-10 flex items-center justify-center">
      <div className="bg-blue-900 p-10 rounded-3xl border max-w-5xl w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
          {t('about.mission_vision_values.title')}
        </h2>
        <div className="grid grid-cols-12  items-center gap-14 mt-10">
          <div className="col-span-6 text-left bg-white rounded-2xl p-7 h-full hover:bg-blue-100 hover:shadow-lg">
            <p className="font-bold text mb-5  text-blue-800 text-start">
              {t('about.mission.title')}
            </p>
            <p className="text-sm font-regular text  text-gray-500 text-start mb-2">
              {t('about.mission.description')}
            </p>
          </div>
          <div className="col-span-6 text-left bg-white rounded-2xl p-7 h-full hover:bg-blue-100 hover:shadow-lg">
            <p className="font-bold text mb-5  text-blue-800 text-start">
              {t('about.vision.title')}
            </p>
            <p className="text-sm font-regular text  text-gray-500 text-start mb-2">
              {t('about.vision.description')}
            </p>
          </div>
        </div>
        <h2 className="text-xl font-semibold text mt-10 text-white text-center">
          {t('about.values.title')}
        </h2>
        <p className="text-sm font-regular text  text-white text-center mb-10">
          {t('about.values.subtitle')}
        </p>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 place-items-center">
          <div className="bg-[url(/images/card_fond.png)] hover:border-5 hover:border-blue-400
                  bg-white bg-cover bg-center rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  {t('about.innovation.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('about.innovation.description')}
                </p>
              </div>
              <div className="p-5 m-auto w-50 ">
                <Image loading="lazy" className="w-full" src={imagePathFinder.valeur_innovation} alt="Salary Guide" />
              </div>
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] hover:border-5 hover:border-blue-400
                  bg-white bg-cover bg-center rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  {t('about.integrity.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('about.integrity.description')}
                </p>
              </div>
              <div className="p-5 m-auto w-50 ">
                <Image loading="lazy" className="w-full" src={imagePathFinder.valeur_integrity} alt="What jobs are in demand?" />
              </div>
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] hover:border-5 hover:border-blue-400
                  bg-white bg-cover bg-center rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  {t('about.diversity.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('about.diversity.description')}
                </p>
              </div>
              <div className="p-5 m-auto w-50 ">
                <Image loading="lazy" className="w-full" src={imagePathFinder.valeur_diversity} alt="Robert Half blog" />
              </div>
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] hover:border-5 hover:border-blue-400
                  bg-white bg-cover bg-center rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  {t('about.sustainability.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('about.sustainability.description')}
                </p>
              </div>
              <div className="p-5 m-auto w-50 ">
                <Image loading="lazy" className="w-full" src={imagePathFinder.valeur_sustanability} alt="Navigate tech skills gaps" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* Hire the best francophone talent Worldwide */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-5 items-center gap-4 lg:gap-10 mt-10">

        <div className="lg:col-span-2 col-span-12">
          <Image loading="lazy" src={imagePathFinder.hire_the_best_francophone_talent_worldwide} alt="Salary Guide" />
        </div>
        <div className="lg:col-span-3 col-span-12  pr-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {t('about.francophone_talent.title')}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {t('about.francophone_talent.description')}
          </p>
        </div>

      </div>
    </section>

    {/*  Leadership team  */}
    <section className="mx-auto w-lvw mb-0 px-10 py-24 bg-gray-200">
      <h2 className="text-3xl font-semibold text mb-10 text-black text-center">
        {t('about.leadership_team.title')}
      </h2>

      <div className="mx-auto max-w-5xl p-10 grid grid-cols-3 items-end gap-4">
        <div className="col-span-1">
          <div className="w-full border border-gray-200 p-7 rounded-2xl text-center bg-gradient-to-t hover:from-blue-300 hover:to-blue-100  hover:shadow-lg from-gray-300 to-gray-200 pb-20">
            <Image loading="lazy" src={imagePathFinder.jamel_hein} alt="Describe your Need" className="w-40 mb-4 mx-auto -mt-20" />
            <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
            JAMEL HEIN
          </p>
          <p className="text-sm font-regular text-gray-500 text-center">
            {t('about.positions.ceo')}
          </p>
          </div>
         
        </div>
        <div className="col-span-2 border bg-blue-900 p-7 rounded-4xl text-center h-full hover:bg-blue-800">
          <p className="text-sm font-light text-white text-start mb-3">
            {t('about.ceo_message.paragraph1')}
          </p>
          <p className="text-sm font-light text-white text-start mb-3">
            {t('about.ceo_message.paragraph2')}
          </p>
          <p className="text-sm font-light text-white text-start mb-3">
            {t('about.ceo_message.paragraph3')}
          </p>
        </div>

      </div>

    </section>

  </>
}