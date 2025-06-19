import React from 'react';
import { Globe, Bell, Lock, User, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Settings = () => {
  const { t, language, toggleLanguage } = useLanguage();
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden divide-y divide-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{t('settings')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('settingsDescription')}</p>
        </div>
        
        {/* Language settings */}
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-900 mb-3 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              {t('languageSettings')}
            </h4>
            
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button 
                className={`px-4 py-2 rounded-md flex justify-center items-center ${
                  language === 'fr' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={language === 'en' ? toggleLanguage : undefined}
              >
                Français
              </button>
              
              <button 
                className={`px-4 py-2 rounded-md flex justify-center items-center ${
                  language === 'en' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={language === 'fr' ? toggleLanguage : undefined}
              >
                English
              </button>
            </div>
          </div>
          
          {/* Notification settings */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-900 mb-3 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              {t('notificationSettings')}
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input 
                  id="email-notifications" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="email-notifications" className="ml-3 text-sm text-gray-700">
                  {t('emailNotifications')}
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  id="validation-complete" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="validation-complete" className="ml-3 text-sm text-gray-700">
                  {t('validationCompleteNotification')}
                </label>
              </div>
            </div>
          </div>
          
          {/* Privacy settings */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-900 mb-3 flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              {t('privacySettings')}
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input 
                  id="data-retention" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="data-retention" className="ml-3 text-sm text-gray-700">
                  {t('documentRetention')}
                </label>
              </div>
              
              <div className="text-sm text-gray-500 ml-7">
                {t('retentionExplanation')}
              </div>
            </div>
          </div>
          
          {/* Account settings */}
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              {t('accountSettings')}
            </h4>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  {t('firstName')}
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue="Jean"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  {t('lastName')}
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue="Tremblay"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('email')}
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue="jean.tremblay@exemple.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            {t('saveSettings')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;