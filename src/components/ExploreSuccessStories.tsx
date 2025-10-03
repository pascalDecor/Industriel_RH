"use client";

import { imagePathFinder } from "@/utils/imagePathFinder";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Image from 'next/image'
import { Notice } from "@/models/notice";
import { HttpService } from "@/utils/http.services";
import { useState, useEffect } from "react";
import ShowStars from "@/app/(admin)/management/notices/showStars";
import { useTranslation } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";


interface ExploreSuccessStoriesInputProps {
  className?: string;
}
export default function ExploreSuccessStories({ className }: Readonly<ExploreSuccessStoriesInputProps>) {
  const { t, language } = useTranslation();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showEnglish, setShowEnglish] = useState(language === 'en');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Responsive: nombre de cartes par page selon la taille d'écran
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // mobile
      if (window.innerWidth < 1024) return 2; // tablet
      return 3; // desktop
    }
    return 3;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    HttpService.index<Notice>({ url: '/notices', fromJson: (json: any) => Notice.fromJSON(json), })
      .then((data) => {
        setNotices(data.data);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setShowEnglish(language === 'en');
  }, [language]);

  const totalPages = Math.ceil(notices.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentNotices = () => {
    const start = currentIndex * itemsPerPage;
    return notices.slice(start, start + itemsPerPage);
  };

  return (
    <>
      {/*  Explore success stories   */}
      <section className={`mx-auto w-full mb-10 p-4 sm:p-6 lg:p-10 bg-gray-200 ${className}`}>
        <div className="text-center m-auto max-w-6xl p-4 sm:p-6 lg:p-10">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              loading="lazy"
              src={imagePathFinder.logo_only}
              alt="Logo"
              className="w-16 sm:w-20 mx-auto mb-4 sm:mb-5"
            />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-8 sm:mb-10 lg:mb-14 text-gray-800">
              {t('success_stories.title')}
            </h2>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 sm:p-7 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  >
                    {getCurrentNotices().map((notice, index) => (
                      <motion.div
                        key={notice.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white shadow rounded-2xl p-6 sm:p-7 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 relative min-h-[200px] group"
                      >
                        <div className="mb-4 sm:mb-5">
                          <ShowStars star={notice.stars} />
                        </div>
                        <p className="text-xs sm:text-sm font-regular text-gray-600 text-start mb-4 sm:mb-6 leading-relaxed">
                          "{showEnglish ? notice.content_en : notice.content}"
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-gray-800 text-end absolute bottom-4 sm:bottom-5 right-4 group-hover:text-blue-600 transition-colors duration-300">
                          - {showEnglish ? notice.author_en : notice.author}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {notices.length > itemsPerPage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex mx-auto mt-8 sm:mt-10 gap-3 sm:gap-4 align-middle items-center justify-center"
                >
                  <button
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    <FiArrowLeft className="text-white text-sm sm:text-base" />
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'bg-blue-700 scale-125'
                            : 'bg-gray-400 hover:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    disabled={currentIndex === totalPages - 1}
                    className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    <FiArrowRight className="text-white text-sm sm:text-base" />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}  