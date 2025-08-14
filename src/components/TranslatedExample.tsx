"use client";

import { useTranslation } from "@/contexts/LanguageContext";
import Button from "./ui/button";

// Exemple de composant entièrement traduit
export default function TranslatedExample() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          {t('home.hero.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('home.hero.subtitle')}
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" size="lg">
            {t('home.hero.cta_hire')}
          </Button>
          <Button variant="secondary" size="lg">
            {t('home.hero.cta_jobs')}
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold mb-3">
            {t('services.recruitment.title')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('services.recruitment.desc')}
          </p>
          <Button variant="primary" size="sm">
            {t('button.learn_more')}
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold mb-3">
            {t('services.consulting.title')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('services.consulting.desc')}
          </p>
          <Button variant="primary" size="sm">
            {t('button.learn_more')}
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold mb-3">
            {t('services.outsourcing.title')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('services.outsourcing.desc')}
          </p>
          <Button variant="primary" size="sm">
            {t('button.learn_more')}
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-4">
          {t('contact.title')}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {t('contact.subtitle')}
        </p>
        
        <form className="max-w-md mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('form.first_name')} <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('form.email')} <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('form.company')}
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('form.message')} <span className="text-red-500">*</span>
            </label>
            <textarea 
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder={t('form.message')}
              required
            />
          </div>
          
          <Button type="submit" variant="primary" size="lg" className="w-full">
            {t('contact.send_message')}
          </Button>
        </form>
      </section>

      {/* Sectors Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          {t('sectors.title')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'manufacturing',
            'construction', 
            'healthcare',
            'transport',
            'agriculture',
            'technology',
            'energy',
            'aerospace'
          ].map((sector) => (
            <div key={sector} className="text-center p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900">
                {t(`sectors.${sector}`)}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}