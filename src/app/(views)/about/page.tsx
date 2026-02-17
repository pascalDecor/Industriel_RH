"use client";

import { DynamicImage } from "@/components/ui/DynamicImage";
import { useTranslation } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaGlobe } from "react-icons/fa";

function normalizeLinkedinUrl(input: string): string {
  let s = input.trim();
  if (!s) return "";

  s = s.replace(/^https:\/\/https\/+/i, "https://");
  s = s.replace(/^https:\/\/http\/+/i, "http://");
  s = s.replace(/^https\/+/i, "https://");
  s = s.replace(/^http\/+/i, "http://");
  s = s.replace(/^https:\/*/i, "https://");
  s = s.replace(/^http:\/*/i, "http://");

  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) {
    s = `https://${s}`;
  }

  try {
    const url = new URL(s);
    const host = url.hostname.toLowerCase();
    if (host === "linkedin" || host === "www.linkedin") {
      const path = url.pathname.replace(/^\/+/, "").replace(/\/+$/, "") || "";
      const normalizedPath =
        path.startsWith("in/") || path.startsWith("company/") || path.startsWith("school/")
          ? `/${path}`
          : path
            ? `/in/${path}`
            : "/in/";
      return `https://www.linkedin.com${normalizedPath}`;
    }
  } catch {
    // noop
  }

  return s;
}

interface TeamMemberData {
  id: string;
  nom: string;
  prenom: string;
  post: string;
  imageKey: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  instagram: string | null;
  website: string | null;
  order: number;
}

const SOCIAL_LINKS_CONFIG: { key: keyof TeamMemberData; label: string; Icon: React.ComponentType<{ className?: string }>; color?: string }[] = [
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin, color: "text-[#0A66C2] hover:text-[#004182]" },
  { key: "twitter", label: "Twitter", Icon: FaTwitter, color: "text-slate-600 hover:text-sky-500" },
  { key: "facebook", label: "Facebook", Icon: FaFacebook, color: "text-slate-600 hover:text-[#1877F2]" },
  { key: "instagram", label: "Instagram", Icon: FaInstagram, color: "text-slate-600 hover:text-[#E4405F]" },
  { key: "website", label: "Site web", Icon: FaGlobe, color: "text-slate-600 hover:text-teal-600" },
];

export default function About() {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);

  useEffect(() => {
    fetch("/api/team-members?limit=50")
      .then((res) => res.ok ? res.json() : { data: [] })
      .then((json) => setTeamMembers(Array.isArray(json?.data) ? json.data : []))
      .catch(() => setTeamMembers([]));
  }, []);
  
  return <>
    {/* Catalyst of prosperity for Quebec businesses */}
    <section className="mx-auto max-w-5xl mb-10 px-4 sm:px-6 lg:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 lg:gap-4 mt-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-3 lg:pr-4"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text mb-8 sm:mb-14 text-gray-800">
            {t('about.catalyst.title')}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {t('about.catalyst.description')}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-2 h-full"
        >
          <DynamicImage imageKey="about_catalyst_of_prosperity" alt="Salary Guide"  />
        </motion.div>
      </div>
    </section>
    {/* Features grid */}
    <section className="mx-auto max-w-5xl mb-10 px-4 sm:px-6 lg:px-10 py-10">
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-4"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
          }}
          className="border-2 border-gray-300 p-6 sm:p-7 rounded-2xl text-center h-full hover:bg-white hover:shadow-lg"
        >
          <DynamicImage imageKey="expertise" alt="Describe your Need" className="w-10 mb-4 mx-auto"  />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            {t('about.expertise.title')}
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center">
            {t('about.expertise.description')}
          </p>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
          }}
          className="border-2 border-gray-300 p-6 sm:p-7 rounded-2xl text-center h-full hover:bg-white hover:shadow-lg"
        >
          <DynamicImage imageKey="technology" alt="  We Source the Talent" className="w-10 mb-4 mx-auto"  />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            {t('about.technology.title')}
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center ">
            {t('about.technology.description')}
          </p>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
          }}
          className="border-2 border-gray-300 p-6 sm:p-7 rounded-2xl text-center h-full hover:bg-white hover:shadow-lg"
        >
          <DynamicImage imageKey="innovative_approach" alt="Select and Approve" className="w-10 mb-4 mx-auto"  />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            {t('about.innovative_approach.title')}
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center ">
            {t('about.innovative_approach.description')}
          </p>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
          }}
          className="border-2 border-gray-300 p-6 sm:p-7 rounded-2xl text-center h-full hover:bg-white hover:shadow-lg"
        >
          <DynamicImage imageKey="reliability" alt="Seamless Integration" className="w-10 mb-4 mx-auto"  />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            {t('about.reliability.title')}
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center">
            {t('about.reliability.description')}
          </p>
        </motion.div>

      </motion.div>
    </section>

    {/*  Mission, Vision and Values */}
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10 py-10 flex items-center justify-center">
      <div className="bg-blue-900 p-6 sm:p-10 rounded-2xl sm:rounded-3xl border max-w-5xl w-full mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-semibold text mb-6 sm:mb-10 mt-3 sm:mt-5 text-white text-center"
        >
          {t('about.mission_vision_values.title')}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10 lg:gap-14 mt-10">
          <div className="text-left bg-white rounded-2xl p-6 sm:p-7 h-full hover:bg-blue-100 hover:shadow-lg">
            <p className="font-bold text mb-5  text-blue-800 text-start">
              {t('about.mission.title')}
            </p>
            <p className="text-sm font-regular text  text-gray-500 text-start mb-2">
              {t('about.mission.description')}
            </p>
          </div>
          <div className="text-left bg-white rounded-2xl p-6 sm:p-7 h-full hover:bg-blue-100 hover:shadow-lg">
            <p className="font-bold text mb-5  text-blue-800 text-start">
              {t('about.vision.title')}
            </p>
            <p className="text-sm font-regular text  text-gray-500 text-start mb-2">
              {t('about.vision.description')}
            </p>
          </div>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text mt-8 sm:mt-10 text-white text-center">
          {t('about.values.title')}
        </h2>
        <p className="text-sm font-regular text  text-white text-center mb-8 sm:mb-10">
          {t('about.values.subtitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="bg-[url(/images/card_fond.png)] hover:border-5 hover:border-blue-400
                  bg-white bg-cover bg-center rounded-lg p-4 w-full">
            <div className="flex gap-2">
              <div className="flex-1 min-w-0">
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  {t('about.innovation.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('about.innovation.description')}
                </p>
              </div>
              <div className="p-3 sm:p-5 flex-shrink-0 w-20 sm:w-24">
                <DynamicImage imageKey="valeur_innovation" alt="Salary Guide" className="w-full"  />
              </div>
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] hover:border-5 hover:border-blue-400
                  bg-white bg-cover bg-center rounded-lg p-4 w-full">
            <div className="flex gap-2">
              <div className="flex-1 min-w-0">
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  {t('about.integrity.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('about.integrity.description')}
                </p>
              </div>
              <div className="p-3 sm:p-5 flex-shrink-0 w-20 sm:w-24">
                <DynamicImage imageKey="valeur_integrity" alt="What jobs are in demand?" className="w-full" />
              </div>
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] hover:border-5 hover:border-blue-400
                  bg-white bg-cover bg-center rounded-lg p-4 w-full">
            <div className="flex gap-2">
              <div className="flex-1 min-w-0">
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  {t('about.diversity.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('about.diversity.description')}
                </p>
              </div>
              <div className="p-3 sm:p-5 flex-shrink-0 w-20 sm:w-24">
                <DynamicImage imageKey="valeur_diversity" alt="Robert Half blog" className="w-full" />
              </div>
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] hover:border-5 hover:border-blue-400
                  bg-white bg-cover bg-center rounded-lg p-4 w-full">
            <div className="flex gap-2">
              <div className="flex-1 min-w-0">
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  {t('about.sustainability.title')}
                </h6>
                <p className="text-gray-500 text-sm">
                  {t('about.sustainability.description')}
                </p>
              </div>
              <div className="p-3 sm:p-5 flex-shrink-0 w-20 sm:w-24">
                <DynamicImage imageKey="valeur_sustanability" alt="Navigate tech skills gaps" className="w-full" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* Hire the best francophone talent Worldwide */}
    <section className="mx-auto max-w-5xl mb-10 px-4 sm:px-6 lg:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 lg:gap-10 mt-10">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-2 order-2 lg:order-1"
        >
          <DynamicImage imageKey="hire_the_best_francophone_talent_worldwide" alt="Salary Guide" width={500} height={400} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-3 lg:pr-4 order-1 lg:order-2"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text mb-8 sm:mb-14 text-gray-800">
            {t('about.francophone_talent.title')}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {t('about.francophone_talent.description')}
          </p>
        </motion.div>

      </div>
    </section>

    {/*  Leadership team  */}
    <section className="mx-auto w-full mb-0 px-4 sm:px-6 lg:px-10 py-16 sm:py-24 bg-gray-200">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl font-semibold text mb-10 sm:mb-20 text-black text-center"
      >
        {t('about.leadership_team.title')}
      </motion.h2>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10 py-10 flex flex-wrap justify-center gap-6 lg:gap-4">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="flex w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-0.666rem)] max-w-sm"
          >
            <div className="w-full border border-gray-200 p-6 sm:p-7 rounded-2xl text-center bg-gradient-to-t hover:from-blue-300 hover:to-blue-100 hover:shadow-lg from-gray-300 to-gray-200 pb-6 sm:pb-10 flex flex-col">
              {member.imageKey ? (
                <DynamicImage
                  imageKey={member.imageKey}
                  alt={`${member.prenom} ${member.nom}`}
                  width={160}
                  height={160}
                  className="w-32 sm:w-40 mb-4 mx-auto -mt-16 sm:-mt-20"
                />
              ) : (
                <div className="w-32 sm:w-40 h-32 sm:h-40 mb-4 mx-auto -mt-16 sm:-mt-20 rounded-full bg-slate-300 flex items-center justify-center text-slate-500 text-2xl font-semibold">
                  {member.prenom.charAt(0)}{member.nom.charAt(0)}
                </div>
              )}
              <p className="text uppercase font-semibold mb-2 text-blue-900 text-center flex-1">
                {member.prenom} {member.nom}
              </p>
              <p className="text-sm font-regular text-gray-500 text-center mb-2">
                {member.post}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {SOCIAL_LINKS_CONFIG.map(({ key, label, Icon, color }) => {
                  const url = member[key];
                  if (!url || typeof url !== "string" || !url.trim()) return null;
                  const href = key === "linkedin" ? normalizeLinkedinUrl(url) : normalizeLinkedinUrl(url);
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-1.5 text-sm font-medium ${color ?? "text-slate-600 hover:text-teal-600"}`}
                      aria-label={`${label} de ${member.prenom} ${member.nom}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </section>

  </>
}