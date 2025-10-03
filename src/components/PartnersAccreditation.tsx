"use client";

import { imagePathFinder } from "@/utils/imagePathFinder";
import { useTranslation } from "@/contexts/LanguageContext";
import Image from 'next/image';
import { motion, Variants } from "framer-motion";

export default function PartnersAccreditation() {
    const { t, language } = useTranslation();

    // Configuration des partenaires
    const partners = [
        {
            id: 1,
            name: "Desjardins",
            logo: imagePathFinder.partners_desjardins,
            alt: "Desjardins - Partenaire financier"
        },
        {
            id: 2,
            name: "CRIC",
            logo: imagePathFinder.partners_CRIC,
            alt: "CRIC - Conseil en recrutement international"
        },
        {
            id: 3,
            name: "CNESST",
            logo: imagePathFinder.partners_cnesst,
            alt: "CNESST - Commission des normes du travail"
        },
        {
            id: 4,
            name: "PME MTL",
            logo: imagePathFinder.partners_pme_mtl,
            alt: "PME MTL - Réseau de soutien aux entreprises"
        },
        {
            id: 5,
            name: "Stride",
            logo: imagePathFinder.partners_stride,
            alt: "Stride - Partenaire technologique"
        }
    ];

    // Variants d'animation pour les conteneurs
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    // Variants d'animation pour chaque logo
    const itemVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0, 0, 0.2, 1]
            }
        }
    };

    return (
        <>
            {/*   Partners & Accreditation */}
            <section className="mx-auto max-w-7xl mb-10 p-4 sm:p-6 lg:p-10">
                <div className="w-full bg-[url(/images/partners_accreditation.png)] bg-cover bg-center bg-blue-900 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-4xl border">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text mb-8 sm:mb-10 lg:mb-14 mt-3 sm:mt-4 lg:mt-5 text-white text-center">
                            {t('partners.title')}
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 place-items-center items-center w-full mb-6 sm:mb-8 lg:mb-10"
                    >
                        {partners.map((partner, index) => (
                            <motion.div
                                key={partner.id}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.05,
                                    y: -5,
                                    transition: { duration: 0.3 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 text-center flex flex-col items-center justify-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer group min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]"
                            >
                                <motion.div
                                    className="w-full h-auto flex items-center justify-center"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                        loading="lazy"
                                        src={partner.logo}
                                        alt={partner.alt}
                                        className="w-full h-auto max-w-[120px] sm:max-w-[140px] lg:max-w-[160px] object-contain group-hover:brightness-110 transition-all duration-300"
                                        width={160}
                                        height={80}
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Effet de shimmer subtil pour indiquer l'interactivité */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <p className="text-white/80 text-xs sm:text-sm font-light">
                            {language === 'fr' ? 'Reconnus par des organisations de premier plan' : 'Trusted by leading organizations'}
                        </p>
                    </motion.div>

                </div>
            </section>
        </>
    );
}