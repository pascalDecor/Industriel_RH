"use client";

import { addContact } from "@/app/actions/contact";
import Button from "@/components/ui/button";
import InputError from "@/components/ui/inputError";
import { Contact } from "@/models/contact";
import { DynamicImage } from "@/components/ui/DynamicImage";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import SuccessSend from "../consulting-solutions/components/successSend";
import { useTranslation } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function ContactPage() {
    const { t } = useTranslation();
    const { executeRecaptcha } = useGoogleReCaptcha();
    let [state, action, pending] = useActionState(addContact, undefined);
    const [contact, setContact] = useState(Contact.fromJSON({} as any));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContact(contact.update({ [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!executeRecaptcha) {
            console.error('reCAPTCHA not yet available');
            return;
        }

        // Capture form element before async call
        const form = e.currentTarget;
        setIsSubmitting(true);

        try {
            // Generate reCAPTCHA token
            const token = await executeRecaptcha('contact_form');

            // Create FormData and add the token
            const formData = new FormData(form);
            formData.set('recaptchaToken', token);

            // Submit the form
            action(formData);
        } catch (error) {
            console.error('Error executing reCAPTCHA:', error);
            setIsSubmitting(false);
        }
    };

    // Reset isSubmitting when state changes (form submission completed)
    useEffect(() => {
        if (state !== undefined) {
            setIsSubmitting(false);
        }
    }, [state]);


    return (
        <>
            {/* We accept recruitment mandates across Quebec! */}
            <section className="mx-auto max-w-5xl mb-10 px-4 md:px-6 lg:px-10 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 mt-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:col-span-3 lg:pr-4"
                    >
                        <h2 className="text-2xl md:text-3xl font-semibold text mb-6 md:mb-14 text-gray-800">
                            {t('contact.we_accept_mandates')}
                        </h2>
                        <p className="text-gray-500 text-sm mb-5">
                            {t('contact.based_in_quebec')}
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <DynamicImage imageKey="we_accept_recruitment" alt="Salary Guide"  />
                    </motion.div>
                </div>
            </section>
            {/*   Contact Us */}
            <section className="mx-auto max-w-5xl mb-10 px-4 md:px-6 lg:px-10 py-10">
                <div className="w-full">

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-semibold mb-4 text-black text-center"
                    >
                        {t('contact.contact_us')}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-gray-500 font-semibold text-sm text-center mb-10"
                    >
                        {t('contact.feel_free_reach')}
                    </motion.p>

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
                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 w-full mb-10"
                    >
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 30, scale: 0.95 },
                                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                            }}
                            className="w-full p-5 md:p-7 text-left hover:border rounded-2xl hover:shadow-lg transition-shadow"
                        >
                            <DynamicImage imageKey="contact_telephone" alt="Describe your Need" className="w-16 md:w-20 mb-4"  />
                            <p className="font-semibold text text-gray-600 text-left text-sm sm:text-base text-sm sm:text-base">
                                {t('contact.telephone_label')}: <br /> 819-919-8693
                            </p>
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 30, scale: 0.95 },
                                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                            }}
                            className="w-full p-5 md:p-7 text-left hover:border rounded-2xl hover:shadow-lg transition-shadow"
                        >
                            <DynamicImage imageKey="contact_couriel" alt="Describe your Need" className="w-16 md:w-20 mb-4"  />
                            <p className="font-semibold text mb-3 text-gray-600 text-left text-sm sm:text-base" >
                                {t('contact.email')}
                            </p>
                            <p className="font-semibold text text-gray-600 text-left text-sm sm:text-base break-words">
                                <Link href="mailto:info@industriellerh.com">info@industriellerh.com</Link>
                            </p>
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 30, scale: 0.95 },
                                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                            }}
                            className="w-full p-5 md:p-7 text-left hover:border rounded-2xl hover:shadow-lg transition-shadow"
                        >
                            <DynamicImage imageKey="contact_adresse" alt="Describe your Need" className="w-16 md:w-20 mb-4"  />
                            <p className="font-semibold text mb-3 text-gray-600 text-left text-sm sm:text-base" >
                                {t('contact.address')}
                            </p>
                            <p className="font-semibold text text-gray-600 text-left text-sm sm:text-base">
                                5805 Av. de Darlington Montréal, QC H3S 2H6
                            </p>
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 30, scale: 0.95 },
                                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                            }}
                            className="w-full p-5 md:p-7 text-left hover:border rounded-2xl hover:shadow-lg transition-shadow"
                        >
                            <DynamicImage imageKey="contact_langue" alt="Describe your Need" className="w-16 md:w-20 mb-4"  />
                            <p className="font-semibold text mb-3 text-gray-600 text-left text-sm sm:text-base" >
                                {t('contact.languages_spoken')}
                            </p>
                            <p className="font-semibold text text-gray-600 text-left text-sm sm:text-base">
                                {t('contact.french_english')}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            {/*  Your contact information   */}
            <section className="mx-auto w-full mb-0 px-4 md:px-6 lg:px-10 py-16 md:py-24 bg-gray-200">
                <div className="bg-blue-900 p-6 md:p-10 rounded-3xl border max-w-3xl mx-auto">

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-semibold text mb-6 md:mb-10 mt-5 text-white text-center"
                    >
                        {t('contact.your_contact_info')}
                    </motion.h2>

                    {state === true ?
                        <SuccessSend />
                        : <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
                            <div className="w-full text-left">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={contact.firstName}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.first_name_placeholder')}
                                    className={`px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 ${state?.errors?.firstName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                        }`} />
                                <InputError messages={state?.errors?.firstName} simple={true} inputName="firstName" />
                            </div>
                            <div className="w-full text-left">
                                <input
                                    type="text"
                                    name="lastName"
                                    value={contact.lastName}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.last_name_placeholder')}
                                    className={`px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 ${state?.errors?.lastName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                        }`} />
                                <InputError messages={state?.errors?.lastName} simple={true} inputName="lastName" />
                            </div>
                            <div className="w-full text-left">
                                <input
                                    type="text"
                                    name="companyName"
                                    value={contact.companyName}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.company_name_placeholder')}
                                    className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="w-full text-left">
                                <input
                                    type="text"
                                    name="jobTitle"
                                    value={contact.jobTitle}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.job_title_placeholder')}
                                    className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="w-full text-left">
                                <input
                                    type="email"
                                    name="workEmail"
                                    value={contact.workEmail}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.work_email_placeholder')}
                                    className={`px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 ${state?.errors?.workEmail ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                        }`} />
                                <InputError messages={state?.errors?.workEmail} simple={true} inputName="workEmail" />
                            </div>
                            <div className="w-full text-left">
                                <input
                                    type="tel"
                                    name="workPhone"
                                    value={contact.workPhone}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.work_phone_placeholder')}
                                    className={`px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 ${state?.errors?.workPhone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                        }`} />

                                <InputError messages={state?.errors?.workPhone} simple={true} inputName="workPhone" />
                            </div>

                            <div className="md:col-span-2 w-full text-left">
                                <p className="text-white font-semibold">{t('contact.tell_us_position')}</p>
                            </div>

                            <div className="md:col-span-2 w-full text-left">
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={contact.postalCode}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.postal_code_placeholder')}
                                    className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div className="md:col-span-2 w-full text-left">
                                <p className="text-white font-semibold">{t('contact.explain_need')}</p>
                            </div>

                            <div className="md:col-span-2 w-full text-left mb-4">
                                <textarea
                                    rows={6}
                                    name="message"
                                    value={contact.message}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.describe_recruitment_needs')}
                                    className={`px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 ${state?.errors?.message ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                        }`}
                                />
                                <InputError messages={state?.errors?.message} simple={true} inputName="message" />
                            </div>

                            <div className="md:col-span-2 w-full text-center">
                                <Button
                                    type="submit"
                                    variant="dark"
                                    size="md"
                                    isLoading={pending || isSubmitting}
                                    disabled={pending || isSubmitting}
                                    className="!rounded-full text-sm px-20 mx-auto"
                                >
                                    {t('contact.submit')}
                                </Button>
                            </div>
                        </form>}
                </div>
            </section>

        </>
    );
}