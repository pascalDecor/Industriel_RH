
"use client";

import Button from "@/components/ui/button";
import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from 'next/image';

import { FiCheck, FiSearch } from "react-icons/fi";
import ExploreSuccessStories from "@/components/ExploreSuccessStories";
import AddSpecializedTalentAcrossYourOrganization from "@/components/AddSpecializedTalentAcrossYourOrganization";
import Link from "next/link";
import FloatingLabelInput from "@/components/ui/input";
import FloatingLabelSelect from "@/components/ui/select";
import FloatingLabelTextarea from "@/components/ui/textarea";
import PartnersAccreditation from "@/components/PartnersAccreditation";
import { redirect } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";

export default function FindJobs() {
    const { t } = useTranslation();

    function handleClick() {
        console.log("Clic !");
    }


    return <>
        {/* <HomeBannerCarroussel /> */}
        {/*Find your next hire */}

        <section className="mx-auto mb-10 p-10 pt-20 text-center max-w-3xl">
            <h2 className="text-3xl font-semibold text mb-5 text-gray-800">
                {t('hire_talent.hero.title')}
            </h2>
            <p className="text-gray-500 text-sm mb-5 font-semibold">
                {t('hire_talent.hero.description')}
            </p>
            <div className="flex gap-4 mt-10 align-center items-center mx-auto w-fit">
                <Button variant="primary" size="md" onClick={() => redirect("#candidates")} className="!rounded-full text-sm">
                    {t('hire_talent.hero.preview_candidates')}
                </Button>
                <Button variant="light" size="md" onClick={() => redirect("#candidates")} className="!rounded-full text-sm border border-gray-300">
                    {t('hire_talent.hero.hire_now')}
                </Button>
            </div>
            <p className="text-gray-500 mt-5 font-semibold">
                {t('hire_talent.hero.contact_us')}
                <Link href="tel:819-919-7699" className="font-bold text-blue-800 ml-2 underline">819-919-7699</Link>
            </p>
        </section>

        {/* Explore our talent solutions  */}
        <div className="absolute -mt-60" id="recruitment_by_outsourcing"></div>
        <section className="mx-auto w-full mb-10 px-10 py-2">
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
                {t('hire_talent.solutions.title')}
            </h2>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-2 gap-10 text-left">
                <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
                    <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                        {t('hire_talent.solutions.outsourced.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.solutions.outsourced.description')}
                    </p>
                    <Button variant="primary" size="md" onClick={() => redirect("#recruitment_by_outsourcing")} className="mt-5 !rounded-full text-sm">
                        {t('hire_talent.solutions.learn_more')}
                    </Button>
                </div>
                <div className="col-span-1 bg-white rounded-lg p-10 shadow-lg">
                    <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                        {t('hire_talent.solutions.international.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.solutions.international.description')}
                    </p>
                    <Button variant="primary" size="md" onClick={() => redirect("#international_recruitment")} className="mt-5 !rounded-full text-sm">
                        {t('hire_talent.solutions.learn_more')}
                    </Button>
                </div>
            </div>
        </section>


        {/* How we help you find a job  */}
        <section className="mx-auto w-full mb-0 px-10 py-24 bg-gray-200">

            {/*How it works */}
            <section className="mx-auto max-w-5xl mb-10 p-10">
                <div className="grid grid-cols-4 items-center justify-center gap-25 w-full">
                    <div className="lg:col-span-2 col-span-12">
                        <Image loading="lazy" src={imagePathFinder.hire_talent_how_it_work} alt="Salary Guide" />
                    </div>
                    <div className="lg:col-span-2 col-span-12">
                        <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                            {t('hire_talent.how_it_works.title')}
                        </h2>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.how_it_works.step1')}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.how_it_works.step2')}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.how_it_works.step3')}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.how_it_works.step4')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/*   Add specialized talent across your organization */}
            <AddSpecializedTalentAcrossYourOrganization />


            <h2 className="text-3xl font-semibold text mb-10 mt-10 text-black text-center">
                {t('hire_talent.blog.title')}
            </h2>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-12 gap-4 text-left">
                <div className="col-span-3">
                    <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
                        <Image loading="lazy" src={imagePathFinder.card_image_1} alt="  We Source the Talent" className="mx-auto" />
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
                        <Image loading="lazy" src={imagePathFinder.card_image_2} alt="  We Source the Talent" className="mx-auto" />
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
                            {t('hire_talent.blog.featured')}
                        </p>
                        <p className="text-sm font-regular ">
                            {t('hire_talent.blog.what_jobs_demand')}
                        </p>
                    </div>
                    <div className=" bg-black text-white rounded-lg p-10 shadow-lg mb-4">
                        <p className="text-sm font-regular font-bold mb-3">
                            {t('hire_talent.blog.tag_results')}
                        </p>
                        <p className="text-sm font-regular mb-10">
                            {t('hire_talent.blog.landing_job')}
                        </p>
                        <p className="text-sm font-regular">
                            {t('hire_talent.blog.posts_count', { count: '64' })}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
                        <Image loading="lazy" src={imagePathFinder.card_image_3} alt="  We Source the Talent" className="mx-auto" />
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
                        <Image loading="lazy" src={imagePathFinder.card_image_4} alt="  We Source the Talent" className="mx-auto" />
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
                        <Image loading="lazy" src={imagePathFinder.card_image_5} alt="  We Source the Talent" className="mx-auto" />
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
                            {t('hire_talent.blog.featured')}
                        </p>
                        <p className="text-sm font-regular ">
                            {t('hire_talent.blog.what_jobs_demand')}
                        </p>
                    </div>
                    <div className=" bg-black text-white rounded-lg p-10 shadow-lg mb-4">
                        <p className="text-sm font-regular font-bold mb-3">
                            {t('hire_talent.blog.tag_results')}
                        </p>
                        <p className="text-sm font-regular mb-10">
                            {t('hire_talent.blog.landing_job')}
                        </p>
                        <p className="text-sm font-regular">
                            {t('hire_talent.blog.posts_count', { count: '72' })}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden mb-4">
                        <Image loading="lazy" src={imagePathFinder.card_image_6} alt="  We Source the Talent" className="mx-auto" />
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
                    <Button variant="primary" size="md" onClick={() => redirect("/discover-insights#refine_your_focus")} className="!rounded-full text-sm mx-auto mt-10 w-fit whitespace-nowrap">
                        {t('hire_talent.blog.subscribe_updates')}
                    </Button>
                </div>
            </div>
        </section>


        <div className="absolute -mt-800" id="candidates"></div>
        {/*  Search  */}
        <section className="mx-auto w-full py-20 text-center">
            <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
                {t('hire_talent.candidates.title')}
            </h2>
            <div className="max-w-5xl grid grid-cols-12 gap-4 mx-auto px-10">
                <div className="relative col-span-4">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('hire_talent.candidates.job_title')}
                        className="pl-10 pr-4 py-2 border border-gray-300 w-full
            bg-white text-gray-600 text-sm rounded-full 
            focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <Button variant="dark"
                    size="md" onClick={handleClick} className="!rounded-full text-sm whitespace-nowrap col-span-3">
                    {t('hire_talent.candidates.search')}
                </Button>
                <Button variant="light"
                    size="md" onClick={handleClick} className="!rounded-full border border-gray-300 text-sm whitespace-nowrap col-span-3">
                    {t('hire_talent.candidates.reset_search')}
                </Button>
            </div>
            <Button variant="primary"
                size="md" onClick={handleClick} className="!rounded-full border border-gray-300 text-sm text-center whitespace-nowrap my-10 mx-auto">
                {t('hire_talent.candidates.connect_now')}
            </Button>

            <p className="text-gray-500 text-center">
                {t('hire_talent.candidates.need_help')}
                <Link href="tel:819-919-7699" className="font-bold text-blue-800 ml-2 underline">819-919-7699</Link>
            </p>
        </section>

        <div className="absolute -mt-20" id="contact_us"></div>
        {/* How we help you find a job  */}
        <section className="mx-auto w-full mb-10 px-10 py-24 bg-gray-200">

            {/*Your search summary */}
            <div className="mx-auto max-w-5xl mb-10 p-10">
                <div className="grid grid-cols-12 items-center justify-center gap-10 w-full">

                    <div className="lg:col-span-5 col-span-12">
                        <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                            {t('hire_talent.search_summary.title')}
                        </h2>
                        <p className="text-gray-500 text-sm mb-5">
                            {t('hire_talent.search_summary.description')}
                        </p>
                        <p className="text-gray-500  text-sm font-bold mb-5">
                            {t('hire_talent.search_summary.skills')}
                        </p>
                        <p className="text-gray-500 text-sm font-bold mb-5">
                            {t('hire_talent.search_summary.details_provided')}
                        </p>
                        <ul className="list-disc text-gray-500 text-sm mb-5">
                            <li className="ml-7">
                                {t('hire_talent.search_summary.attorney_lawyer')}
                            </li>
                        </ul>
                    </div>
                    <div className="lg:col-span-7 col-span-12">
                        <div className="bg-blue-900 p-10 rounded-3xl border max-w-3xl mx-auto">

                            <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
                                {t('hire_talent.contact_info.title')}
                            </h2>


                            <form action="" className="grid grid-cols-12 gap-4 w-full ">
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.first_name')}
                                        name="firstName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.last_name')}
                                        name="lastName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.company_name')}
                                        name="companyName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.job_title')}
                                        name="jobTitle"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.work_email')}
                                        name="workEmail"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.work_phone')}
                                        name="workPhone"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div className="col-span-12 text-left ">
                                    <p className="text-white font-semibold">{t('hire_talent.form.tell_us_position')}</p>
                                </div>

                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        label={t('hire_talent.form.postal_code')}
                                        type="text"
                                        name="postalCode"
                                    />
                                </div>
                                <div className="col-span-6 text-left mb-10">
                                    <FloatingLabelSelect label={t('hire_talent.form.position_type')} name="position" options={[
                                        { label: "Option 1", value: "option1" },
                                        { label: "Option 2", value: "option2" },
                                        { label: "Option 3", value: "option3" },
                                    ]} />
                                </div>

                                <div className="col-span-12 text-center">
                                    <Button variant="dark" size="md" onClick={handleClick} className="!rounded-full text-sm px-20 mx-auto">
                                        {t('hire_talent.form.submit')}
                                    </Button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </div>

        </section>


        {/* Recruitment by outsourcing  */}
        <section className="mx-auto max-w-5xl mb-10 px-10 py-10">
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
                {t('hire_talent.outsourcing.title')}
            </h2>


            <div className="grid grid-cols-5 items-center gap-4 mb-10">
                <div className="lg:col-span-3 col-span-12  pr-4">
                    <h2 className="text-3xl font-semibold text mb-10 text-gray-800">
                        {t('hire_talent.outsourcing.hero.title')}
                    </h2>
                    <p className="text-gray-500 text-sm mb-5">
                        {t('hire_talent.outsourcing.hero.description')}
                    </p>
                    <Button variant="primary" size="md" onClick={() => redirect("#candidates")} className="!rounded-full text-sm">
                        {t('hire_talent.outsourcing.hire_talents')}
                    </Button>
                </div>
                <div className="lg:col-span-2 col-span-12">
                    <Image loading="lazy" src={imagePathFinder.recruitment_by_outsourcing} alt="Salary Guide" />
                </div>
            </div>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-3 gap-4 text-left">
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white">
                    <Image loading="lazy" src={imagePathFinder.find_top_talent_faster} className="!w-10 mb-5" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        {t('hire_talent.outsourcing.find_talent.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.outsourcing.find_talent.description')}
                    </p>
                </div>
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white">
                    <Image loading="lazy" src={imagePathFinder.hire_with_precision_confidence} className="!w-10 mb-5" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        {t('hire_talent.outsourcing.hire_precision.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.outsourcing.hire_precision.description')}
                    </p>
                </div>
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white">
                    <Image loading="lazy" src={imagePathFinder.secure_the_right_fit_for_your_team} className="!w-10 mb-5" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        {t('hire_talent.outsourcing.secure_fit.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.outsourcing.secure_fit.description')}
                    </p>
                </div>
            </div>

            <div className="absolute -mt-20" id="contact-infos"></div>
            <div className="mx-auto max-w-5xl mb-10 p-10">
                <div className="grid grid-cols-12 items-start justify-center gap-5 w-full">

                    <div className="lg:col-span-5 col-span-12">
                        <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                            {t('hire_talent.contact.title')}
                        </h2>
                        <p className="text-gray-500 text-sm mb-5">
                            {t('hire_talent.contact.description')}
                        </p>
                        <p className="text-gray-500  text-sm font-bold mb-5">
                            {t('hire_talent.contact.phone')}
                        </p>

                    </div>
                    <div className="lg:col-span-7 col-span-12">
                        <div className="bg-blue-900 p-10 rounded-3xl border max-w-3xl mx-auto">

                            <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
                                {t('hire_talent.contact_info.title')}
                            </h2>


                            <form action="" className="grid grid-cols-12 gap-4 w-full">
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.first_name')}
                                        name="firstName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.last_name')}
                                        name="lastName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.company_name')}
                                        name="companyName"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.job_title')}
                                        name="jobTitle"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.work_email')}
                                        name="workEmail"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.work_phone')}
                                        name="workPhone"
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div className="col-span-12 text-left ">
                                    <p className="text-white font-semibold">{t('hire_talent.form.tell_us_position')}</p>
                                </div>

                                <div className="col-span-6 text-left">
                                    <FloatingLabelInput
                                        label={t('hire_talent.form.postal_code')}
                                        type="text"
                                        name="postalCode"
                                    />
                                </div>
                                <div className="col-span-6 text-left mb-10">
                                    <FloatingLabelSelect label={t('hire_talent.form.position_type')} name="position" options={[
                                        { label: t('hire_talent.form.local_recruitment'), value: "1" },
                                        { label: t('hire_talent.form.international_recruitment'), value: "2" }
                                    ]} />
                                </div>

                                <div className="col-span-12 text-left ">
                                    <p className="text-white font-semibold">{t('hire_talent.form.tell_us_position')}</p>
                                </div>



                                <div className="col-span-12 text-left mb-4">
                                    <FloatingLabelTextarea label={t('hire_talent.form.position_description')} name="positionDescription" rows={3} />
                                </div>


                                <div className="col-span-12 text-center">
                                    <Button variant="dark" size="md" onClick={handleClick} className="!rounded-full text-sm px-20 mx-auto">
                                        {t('hire_talent.form.submit')}
                                    </Button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/*  Explore success stories   */}
        <ExploreSuccessStories />
        <div className="absolute mt-1000" id="international_recruitment"></div>
        {/* International recruitment  */}
        <section className="mx-auto max-w-5xl mb-10 px-10 py-10">
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
                {t('hire_talent.international.title')}
            </h2>


            <div className="grid grid-cols-5 items-center gap-4 mb-10">
                <div className="lg:col-span-3 col-span-12  pr-4">
                    <h2 className="text-3xl font-semibold text mb-10 text-gray-800">
                        {t('hire_talent.international.hero.title')}
                    </h2>
                    <p className="text-gray-500 text-sm mb-5">
                        {t('hire_talent.international.hero.description')}
                    </p>
                    <Button variant="primary" size="md" onClick={() => redirect("#candidates")} className="!rounded-full text-sm">
                        {t('hire_talent.outsourcing.hire_talents')}
                    </Button>
                </div>
                <div className="lg:col-span-2 col-span-12">
                    <Image loading="lazy" src={imagePathFinder.international_recruitment} alt="Salary Guide" />
                </div>
            </div>

            <h2 className="text-xl font-medium text-center capitalize mb-10 text-gray-800">
                {t('hire_talent.international.solution.title')} <br /> {t('hire_talent.international.solution.subtitle')}
            </h2>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-3 gap-4 text-center">
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white hover:shadow-lg">
                    <Image loading="lazy" src={imagePathFinder.international_recruitment_icon} className="!w-10 mb-5 mx-auto" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        {t('hire_talent.international.recruitment.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.international.recruitment.description')}
                    </p>
                </div>
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white hover:shadow-lg">
                    <Image loading="lazy" src={imagePathFinder.legal_services} className="!w-10 mb-5 mx-auto" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        {t('hire_talent.international.legal.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.international.legal.description')}
                    </p>
                </div>
                <div className="col-span-1 rounded-2xl p-7 border border-gray-300 bg-white hover:shadow-lg">
                    <Image loading="lazy" src={imagePathFinder.welcome_and_integration} className="!w-10 mb-5 mx-auto" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        {t('hire_talent.international.welcome.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.international.welcome.description')}
                    </p>
                </div>
            </div>
        </section>


        {/*Structured approach */}
        <section className="mx-auto w-full px-10 py-10 bg-gray-200 mb-20">
            <div className="mx-auto max-w-5xl  p-10">
                <div className="grid grid-cols-4 items-start justify-center gap-20 w-full">
                    <div className="lg:col-span-2 col-span-12">
                        <Image loading="lazy" src={imagePathFinder.structured_approach} className="!w-full" alt="Salary Guide" />
                    </div>
                    <div className="lg:col-span-2 col-span-12">
                        <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
                            {t('hire_talent.structured.title')}
                        </h2>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.structured.step1')}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.structured.step2')}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.structured.step3')}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.structured.step4')}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.structured.step5')}
                            </p>
                        </div>
                        <Button variant="primary" size="md" onClick={() => redirect("#contact-infos")} className="!rounded-full text-sm  mt-10 w-fit whitespace-nowrap">
                            {t('hire_talent.structured.contact_us')}
                        </Button>

                    </div>
                </div>
            </div>
        </section>

        {/*   Partners & Accreditation */}
        <PartnersAccreditation />

        {/* Why choose international recruitment? */}
        <section className="mx-auto max-w-5xl mb-10 p-10">
            <h2 className="text-4xl font-semibold text mb-14 text-gray-800 text-center">
                {t('hire_talent.why_international.title')}
            </h2>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 place-items-center">

                <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4">
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                {t('hire_talent.why_international.diverse_talent.title')}
                            </h6>
                            <p className="text-gray-500 text-sm">
                                {t('hire_talent.why_international.diverse_talent.description')}
                            </p>
                        </div>
                        <Image loading="lazy" className="w-1/3 rounded-lg" src={imagePathFinder.access_to_diverse_talent} alt="Navigate tech skills gaps" />
                    </div>
                </div>

                <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4">
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                {t('hire_talent.why_international.skill_gaps.title')}
                            </h6>
                            <p className="text-gray-500 text-sm">
                                {t('hire_talent.why_international.skill_gaps.description')}
                            </p>
                        </div>
                        <Image loading="lazy" className="w-1/3 rounded-lg" src={imagePathFinder.fill_critical_skill_gaps} alt="Robert Half blog" />
                    </div>
                </div>

                <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4">
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                {t('hire_talent.why_international.competitiveness.title')}
                            </h6>
                            <p className="text-gray-500 text-sm">
                                {t('hire_talent.why_international.competitiveness.description')}
                            </p>
                        </div>
                        <Image loading="lazy" className="w-1/3 rounded-lg" src={imagePathFinder.boost_competitiveness} alt="Salary Guide" />
                    </div>
                </div>
                <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4">
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                {t('hire_talent.why_international.streamlined.title')}
                            </h6>
                            <p className="text-gray-500 text-sm">
                                {t('hire_talent.why_international.streamlined.description')}
                            </p>
                        </div>
                        <Image loading="lazy" className="w-1/3 rounded-lg" src={imagePathFinder.streamlined_processes} alt="What jobs are in demand?" />
                    </div>
                </div>
            </div>
        </section>
    </>
}