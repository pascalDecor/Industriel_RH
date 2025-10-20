
"use client";

import { DynamicImage } from "@/components/ui/DynamicImage";
import { FiCheck } from "react-icons/fi";
import Button from "./ui/button";
import Image from 'next/image';
import { useTranslation } from "@/contexts/LanguageContext";
import { motion, Variants } from "framer-motion";
import { imagePathFinder } from "@/utils/imagePathFinder";


export default function AppYourWayToNewJob() {
    const { t } = useTranslation();

    function handleClick() {
        console.log("Clic !");
    }

    // Configuration des fonctionnalités avec animations
    const features = [
        { key: 'feature1', text: t('mobile_app.feature1') },
        { key: 'feature2', text: t('mobile_app.feature2') },
        { key: 'feature3', text: t('mobile_app.feature3') }
    ];

    // Variants d'animation pour les fonctionnalités
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const featureVariants: Variants = {
        hidden: {
            opacity: 0,
            x: -50,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0, 0, 0.2, 1]
            }
        }
    };

    const buttonVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0, 0, 0.2, 1]
            }
        }
    };

    return (
        <>
            {/*  App your way to a new job  */}
            <section className="mx-auto max-w-5xl mb-10 p-4 sm:p-6 lg:p-10">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                    <div className="w-full lg:w-3/5 lg:pr-4 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text mb-8 sm:mb-10 lg:mb-14 text-gray-800">
                                {t('mobile_app.title')}
                            </h2>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-4 sm:space-y-6 mb-8 lg:mb-10"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.key}
                                    variants={featureVariants}
                                    className="flex gap-3 sm:gap-4 align-start items-start group"
                                >
                                    <motion.div
                                        className="bg-blue-700 p-1 rounded-full flex-shrink-0 group-hover:bg-blue-800 transition-colors duration-300"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiCheck className="text-white text-sm" />
                                    </motion.div>
                                    <p className="text-gray-500 text-sm sm:text-base group-hover:text-gray-700 transition-colors duration-300">
                                        {feature.text}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.2,
                                        delayChildren: 0.8
                                    }
                                }
                            }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                        >
                            <motion.div variants={buttonVariants}>
                                <Button
                                    variant="dark"
                                    size="md"
                                    onClick={handleClick}
                                    className="w-full sm:w-auto !rounded-[10px] text-left hover:scale-105 transition-transform duration-300 group"
                                >
                                    <div className="flex gap-3 sm:gap-4 items-center">
                                        <DynamicImage
                                            imageKey="apple"
                                            alt="Apple App Store"
                                            className="w-5 sm:w-6 my-auto group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="text-left">
                                            <p className="text-[10px] sm:text-[11px] font-light -mb-1 text-gray-300">
                                                {t('mobile_app.download_on')}
                                            </p>
                                            <p className="text-white text-sm sm:text-base font-medium">
                                                {t('mobile_app.app_store')}
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </motion.div>

                            <motion.div variants={buttonVariants}>
                                <Button
                                    variant="dark"
                                    size="md"
                                    onClick={handleClick}
                                    className="w-full sm:w-auto !rounded-[10px] text-left hover:scale-105 transition-transform duration-300 group"
                                >
                                    <div className="flex gap-3 sm:gap-4 items-center">
                                        <DynamicImage
                                            imageKey="google_play"
                                            alt="Google Play Store"
                                            className="w-5 sm:w-6 my-auto group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="text-left">
                                            <p className="text-[10px] sm:text-[11px] font-light -mb-1 text-gray-300">
                                                {t('mobile_app.download_on')}
                                            </p>
                                            <p className="text-white text-sm sm:text-base font-medium">
                                                {t('mobile_app.google_play')}
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>

                    <motion.div
                        className="w-full lg:w-3/5 order-1 lg:order-2"
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <DynamicImage
                            // loading="lazy"
                            imageKey="app_your_way_to_a_new_job"
                            alt="App your way to a new job"
                            width={600}
                            height={400}
                            className="w-full h-auto"
                        />
                    </motion.div>
                </div>
            </section>
        </>
    );
}  