
"use client";

import Button from "@/components/ui/button";
import { DynamicImage } from "@/components/ui/DynamicImage";

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
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const DynamicArticlesGrid = dynamic(() => import("@/components/articles/DynamicArticlesGrid"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

interface ContactFormData {
    firstName: string;
    lastName: string;
    companyName: string;
    jobTitle: string;
    workEmail: string;
    workPhone: string;
    postalCode: string;
    position: string;
    message: string;
}

export default function FindJobs() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<ContactFormData>({
        firstName: '',
        lastName: '',
        companyName: '',
        jobTitle: '',
        workEmail: '',
        workPhone: '',
        postalCode: '',
        position: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    function handleClick() {
        console.log("Clic !");
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // TODO: Replace with actual API endpoint
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitStatus('success');
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    companyName: '',
                    jobTitle: '',
                    workEmail: '',
                    workPhone: '',
                    postalCode: '',
                    position: '',
                    message: ''
                });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };


    return <>
        {/* <HomeBannerCarroussel /> */}
        {/*Find your next hire */}

        {/* <section className="mx-auto mb-10 p-10 pt-20 text-center max-w-3xl">
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
        </section> */}

        {/* Explore our talent solutions  */}
        <div className="absolute -mt-60" id="recruitment_by_outsourcing"></div>
        <section className="mx-auto w-full mt-12 sm:mt-20 mb-10 px-4 sm:px-6 lg:px-10 py-2">
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl font-semibold text mb-12 sm:mb-20 text-black text-center"
            >
                {t('hire_talent.solutions.title')}
            </motion.h2>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.2
                        }
                    }
                }}
                className="max-w-5xl mb-10 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-left"
            >
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                    }}
                    className="bg-white rounded-lg p-6 sm:p-10 shadow-lg"
                >
                    <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                        {t('hire_talent.solutions.outsourced.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.solutions.outsourced.description')}
                    </p>
                    <Button variant="primary" size="md" onClick={() => redirect("#recruitment_by_outsourcing")} className="mt-5 !rounded-full text-sm w-full sm:w-auto">
                        {t('hire_talent.solutions.learn_more')}
                    </Button>
                </motion.div>
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                    }}
                    className="bg-white rounded-lg p-6 sm:p-10 shadow-lg"
                >
                    <p className="text-sm font-regular text-gray-500 font-bold mb-3">
                        {t('hire_talent.solutions.international.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.solutions.international.description')}
                    </p>
                    <Button variant="primary" size="md" onClick={() => redirect("#international_recruitment")} className="mt-5 !rounded-full text-sm w-full sm:w-auto">
                        {t('hire_talent.solutions.learn_more')}
                    </Button>
                </motion.div>
            </motion.div>
        </section>


        {/* How we help you find a job  */}
        <section className="mx-auto w-full mb-0 sm:px-10 py-24 bg-gray-200">

            {/*How it works */}
            <section className="mx-auto max-w-5xl mb-10 px-4 sm:px-6 lg:px-10 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 items-center justify-center gap-6 lg:gap-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <DynamicImage loading="lazy" imageKey="hire_talent_how_it_work" alt="Salary Guide" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <h2 className="text-2xl sm:text-3xl font-semibold text mb-8 sm:mb-14 text-gray-800">
                            {t('hire_talent.how_it_works.title')}
                        </h2>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.15,
                                        delayChildren: 0.3
                                    }
                                }
                            }}
                        >
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: 20 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                                }}
                                className="flex gap-4 align-start items-start mb-2"
                            >
                                <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                    <FiCheck className="text-white" />
                                </div>
                                <p className="text-gray-500 text-sm mb-5">
                                    {t('hire_talent.how_it_works.step1')}
                                </p>
                            </motion.div>
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: 20 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                                }}
                                className="flex gap-4 align-start items-start mb-2"
                            >
                                <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                    <FiCheck className="text-white" />
                                </div>
                                <p className="text-gray-500 text-sm mb-5">
                                    {t('hire_talent.how_it_works.step2')}
                                </p>
                            </motion.div>
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: 20 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                                }}
                                className="flex gap-4 align-start items-start mb-2"
                            >
                                <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                    <FiCheck className="text-white" />
                                </div>
                                <p className="text-gray-500 text-sm mb-5">
                                    {t('hire_talent.how_it_works.step3')}
                                </p>
                            </motion.div>
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: 20 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                                }}
                                className="flex gap-4 align-start items-start mb-2"
                            >
                                <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                    <FiCheck className="text-white" />
                                </div>
                                <p className="text-gray-500 text-sm mb-5">
                                    {t('hire_talent.how_it_works.step4')}
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>


            {/*   Add specialized talent across your organization */}
            <AddSpecializedTalentAcrossYourOrganization />


            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl font-semibold text mb-10 mt-10 text-black text-center"
            >
                {t('hire_talent.blog.title')}
            </motion.h2>

            <DynamicArticlesGrid
                category="all"
                limit={12}
                showFeaturedBlocks={true}
            />

            {/* <div className="flex justify-center items-center mt-10">
                <Button variant="primary" size="md" onClick={() => redirect("/discover-insights#refine_your_focus")} className="!rounded-full text-sm mx-auto mt-10 w-fit whitespace-nowrap">
                    {t('hire_talent.blog.subscribe_updates')}
                </Button>
            </div> */}
        </section>


        <div className="absolute -mt-800" id="candidates"></div>
        {/*  Search  */}
        {/* <section className="mx-auto w-full py-20 text-center">
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
        </section> */}

        <div className="absolute -mt-20" id="contact_us"></div>
        {/* How we help you find a job  */}
        {/* <section className="mx-auto w-full mb-10 px-10 py-24 bg-gray-200"> */}

        {/*Your search summary */}
        {/* <div className="mx-auto max-w-5xl mb-10 p-10">
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
            </div> */}

        {/* </section> */}


        {/* Recruitment by outsourcing  */}
        <section className="mx-auto max-w-5xl mb-10 px-4 sm:px-6 lg:px-10 py-10">
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl font-semibold text mb-12 sm:mb-20 text-black text-center"
            >
                {t('hire_talent.outsourcing.title')}
            </motion.h2>


            <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 lg:gap-4 mb-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:col-span-3 lg:pr-4"
                >
                    <h2 className="text-2xl sm:text-3xl font-semibold text mb-6 sm:mb-10 text-gray-800">
                        {t('hire_talent.outsourcing.hero.title')}
                    </h2>
                    <p className="text-gray-500 text-sm mb-5">
                        {t('hire_talent.outsourcing.hero.description')}
                    </p>
                    <Button variant="primary" size="md" onClick={() => redirect("#candidates")} className="!rounded-full text-sm w-full sm:w-auto">
                        {t('hire_talent.outsourcing.hire_talents')}
                    </Button>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2"
                >
                    <DynamicImage loading="lazy" imageKey="recruitment_by_outsourcing" alt="Salary Guide" />
                </motion.div>
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.15
                        }
                    }
                }}
                className="max-w-5xl mb-10 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left"
            >
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                    }}
                    className="rounded-2xl p-6 sm:p-7 border border-gray-300 bg-white"
                >
                    <DynamicImage loading="lazy" imageKey="find_top_talent_faster" className="!w-10 mb-5" alt="Salary Guide" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        {t('hire_talent.outsourcing.find_talent.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.outsourcing.find_talent.description')}
                    </p>
                </motion.div>
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                    }}
                    className="rounded-2xl p-6 sm:p-7 border border-gray-300 bg-white"
                >
                    <DynamicImage imageKey="hire_with_precision_confidence" alt="Salary Guide" className="!w-10 mb-5" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        {t('hire_talent.outsourcing.hire_precision.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.outsourcing.hire_precision.description')}
                    </p>
                </motion.div>
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                    }}
                    className="rounded-2xl p-6 sm:p-7 border border-gray-300 bg-white"
                >
                    <DynamicImage imageKey="secure_the_right_fit_for_your_team" alt="Salary Guide" className="!w-10 mb-5" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        {t('hire_talent.outsourcing.secure_fit.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.outsourcing.secure_fit.description')}
                    </p>
                </motion.div>
            </motion.div>

            <div className="absolute -mt-20" id="contact-infos"></div>
            <div className="mx-auto max-w-5xl mb-10 px-4 sm:px-6 lg:px-10 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-start justify-center gap-6 lg:gap-5 w-full">

                    <div className="lg:col-span-5">
                        <h2 className="text-2xl sm:text-3xl font-semibold text mb-8 sm:mb-14 text-gray-800">
                            {t('hire_talent.contact.title')}
                        </h2>
                        <p className="text-gray-500 text-sm mb-5">
                            {t('hire_talent.contact.description')}
                        </p>
                        <p className="text-gray-500  text-sm font-bold mb-5">
                            {t('hire_talent.contact.phone')}
                        </p>

                    </div>
                    <div className="lg:col-span-7">
                        <div className="bg-blue-900 p-6 sm:p-10 rounded-2xl sm:rounded-3xl border max-w-3xl mx-auto w-full">

                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text mb-6 sm:mb-10 mt-3 sm:mt-5 text-white text-center">
                                {t('hire_talent.contact_info.title')}
                            </h2>


                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                    <p className="text-sm font-medium">{t('hire_talent.form.success_message')}</p>
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    <p className="text-sm font-medium">{t('hire_talent.form.error_message')}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 w-full">
                                <div className="col-span-12  sm:col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.first_name')}
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-12 sm:col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.last_name')}
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-12 sm:col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.company_name')}
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        required
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-12 sm:col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="text"
                                        label={t('hire_talent.form.job_title')}
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleInputChange}
                                        required
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-12 sm:col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="email"
                                        label={t('hire_talent.form.work_email')}
                                        name="workEmail"
                                        value={formData.workEmail}
                                        onChange={handleInputChange}
                                        required
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-12 sm:col-span-6 text-left">
                                    <FloatingLabelInput
                                        type="tel"
                                        label={t('hire_talent.form.work_phone')}
                                        name="workPhone"
                                        value={formData.workPhone}
                                        onChange={handleInputChange}
                                        required
                                        className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div className="col-span-12 text-left mt-2">
                                    <p className="text-white font-semibold text-sm sm:text-base">{t('hire_talent.form.tell_us_position')}</p>
                                </div>

                                <div className="col-span-12 sm:col-span-6 text-left">
                                    <FloatingLabelInput
                                        label={t('hire_talent.form.postal_code')}
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 text-left mb-6 sm:mb-10">
                                    <FloatingLabelSelect
                                        label={t('hire_talent.form.position_type')}
                                        name="position"
                                        value={{ label: formData.position === '1' ? t('hire_talent.form.local_recruitment') : formData.position === '2' ? t('hire_talent.form.international_recruitment') : '', value: formData.position }}
                                        onChange={handleSelectChange}
                                        options={[
                                            { label: t('hire_talent.form.local_recruitment'), value: "1" },
                                            { label: t('hire_talent.form.international_recruitment'), value: "2" }
                                        ]}
                                        required
                                    />
                                </div>

                                <div className="col-span-12 text-left mt-2">
                                    <p className="text-white font-semibold text-sm sm:text-base">{t('hire_talent.form.tell_us_position')}</p>
                                </div>

                                <div className="col-span-12 text-left mb-4">
                                    <FloatingLabelTextarea
                                        label={t('hire_talent.form.position_description')}
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="col-span-12 text-center">
                                    <Button
                                        type="submit"
                                        variant="dark"
                                        size="md"
                                        disabled={isSubmitting}
                                        className="!rounded-full text-sm px-12 sm:px-20 mx-auto w-full sm:w-auto"
                                    >
                                        {isSubmitting ? t('hire_talent.form.submitting') : t('hire_talent.form.submit')}
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
        <section className="mx-auto max-w-5xl mb-10 px-4 sm:px-6 lg:px-10 py-10">
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl font-semibold text mb-12 sm:mb-20 text-black text-center"
            >
                {t('hire_talent.international.title')}
            </motion.h2>


            <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 lg:gap-4 mb-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:col-span-3 lg:pr-4"
                >
                    <h2 className="text-2xl sm:text-3xl font-semibold text mb-6 sm:mb-10 text-gray-800">
                        {t('hire_talent.international.hero.title')}
                    </h2>
                    <p className="text-gray-500 text-sm mb-5">
                        {t('hire_talent.international.hero.description')}
                    </p>
                    <Button variant="primary" size="md" onClick={() => redirect("#candidates")} className="!rounded-full text-sm w-full sm:w-auto">
                        {t('hire_talent.outsourcing.hire_talents')}
                    </Button>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2"
                >
                    <DynamicImage imageKey="international_recruitment" alt="Salary Guide" />
                </motion.div>
            </div>

            <h2 className="text-lg sm:text-xl font-medium text-center capitalize mb-10 text-gray-800">
                {t('hire_talent.international.solution.title')} <br /> {t('hire_talent.international.solution.subtitle')}
            </h2>

            <div className="max-w-5xl mb-10 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                <div className="rounded-2xl p-6 sm:p-7 border border-gray-300 bg-white hover:shadow-lg">
                    <DynamicImage imageKey="international_recruitment_icon" alt="Salary Guide" className="!w-10 mb-5 mx-auto" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        {t('hire_talent.international.recruitment.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.international.recruitment.description')}
                    </p>
                </div>
                <div className="rounded-2xl p-6 sm:p-7 border border-gray-300 bg-white hover:shadow-lg">
                    <DynamicImage imageKey="legal_services" alt="Salary Guide" className="!w-10 mb-5 mx-auto" />
                    <p className="text-sm font-regular text-blue-800 font-bold mb-3">
                        {t('hire_talent.international.legal.title')}
                    </p>
                    <p className="text-sm font-regular text-gray-500 ">
                        {t('hire_talent.international.legal.description')}
                    </p>
                </div>
                <div className="rounded-2xl p-6 sm:p-7 border border-gray-300 bg-white hover:shadow-lg">
                    <DynamicImage imageKey="welcome_and_integration" alt="Salary Guide" className="!w-10 mb-5 mx-auto" />
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
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-10 py-10 bg-gray-200 mb-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 items-start justify-center gap-10 lg:gap-20 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <DynamicImage imageKey="structured_approach" alt="Salary Guide" className="!w-full" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <h2 className="text-2xl sm:text-3xl font-semibold text mb-8 sm:mb-14 text-gray-800">
                            {t('hire_talent.structured.title')}
                        </h2>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.structured.step1')}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.structured.step2')}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.structured.step3')}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.structured.step4')}
                            </p>
                        </div>
                        <div className="flex gap-4 align-start items-start mb-2">
                            <div className="bg-blue-700 p-1 rounded-full flex-shrink-0">
                                <FiCheck className="text-white" />
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                {t('hire_talent.structured.step5')}
                            </p>
                        </div>
                        <Button variant="primary" size="md" onClick={() => redirect("#contact-infos")} className="!rounded-full text-sm mt-6 sm:mt-10 w-full sm:w-auto whitespace-nowrap">
                            {t('hire_talent.structured.contact_us')}
                        </Button>
                    </motion.div>
                </div>
            </div>

    </section >

        {/*   Partners & Accreditation */ }
        < PartnersAccreditation />

        {/* Why choose international recruitment? */ }
        <section className = "mx-auto max-w-5xl mb-10 px-4 sm:px-6 lg:px-10 py-10" >
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl lg:text-4xl font-semibold text mb-10 sm:mb-14 text-gray-800 text-center"
            >
                {t('hire_talent.why_international.title')}
            </motion.h2>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.15
                        }
                    }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center"
            >

                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                    }}
                    className="bg-[url(/images/card_fond.png)] w-full
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4"
                >
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                {t('hire_talent.why_international.diverse_talent.title')}
                            </h6>
                            <p className="text-gray-500 text-sm">
                                {t('hire_talent.why_international.diverse_talent.description')}
                            </p>
                        </div>
                        <DynamicImage imageKey="access_to_diverse_talent" alt="Navigate tech skills gaps" className="w-1/3 rounded-lg" />
                    </div>
                </motion.div>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                    }}
                    className="bg-[url(/images/card_fond.png)] w-full
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4"
                >
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                {t('hire_talent.why_international.skill_gaps.title')}
                            </h6>
                            <p className="text-gray-500 text-sm">
                                {t('hire_talent.why_international.skill_gaps.description')}
                            </p>
                        </div>
                        <DynamicImage imageKey="fill_critical_skill_gaps" alt="Robert Half blog" className="w-1/3 rounded-lg" />
                    </div>
                </motion.div>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                    }}
                    className="bg-[url(/images/card_fond.png)] w-full
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4"
                >
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                {t('hire_talent.why_international.competitiveness.title')}
                            </h6>
                            <p className="text-gray-500 text-sm">
                                {t('hire_talent.why_international.competitiveness.description')}
                            </p>
                        </div>
                        <DynamicImage imageKey="boost_competitiveness" alt="Salary Guide" className="w-1/3 rounded-lg" />
                    </div>
                </motion.div>
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                    }}
                    className="bg-[url(/images/card_fond.png)] w-full
                  bg-white bg-cover bg-center
                    border border-gray-300 rounded-lg p-4"
                >
                    <div className="flex">
                        <div>
                            <h6 className="text-blue-800 text-sm mb-3 font-semibold">
                                {t('hire_talent.why_international.streamlined.title')}
                            </h6>
                            <p className="text-gray-500 text-sm">
                                {t('hire_talent.why_international.streamlined.description')}
                            </p>
                        </div>
                        <DynamicImage imageKey="streamlined_processes" alt="What jobs are in demand?" className="w-1/3 rounded-lg" />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    </> 
}