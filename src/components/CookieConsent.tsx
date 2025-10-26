"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import Button from './ui/button';
import { IoMdClose } from 'react-icons/io';

export default function CookieConsent() {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté les cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Petite delay pour éviter que ça apparaisse trop rapidement
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  const handleClose = () => {
    // Fermer sans accepter ni refuser (affichera à nouveau au prochain chargement)
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-white border-t-2 border-blue-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Contenu du message */}
            <div className="flex-1 pr-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {t('cookies.title')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('cookies.message')}{' '}
                    <a
                      href="/privacy-policy"
                      className="text-blue-800 hover:text-blue-900 underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('cookies.learn_more')}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
              <Button
                variant="light"
                size="sm"
                onClick={handleDecline}
                className="flex-1 sm:flex-none !text-sm"
              >
                {t('cookies.decline')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                className="flex-1 sm:flex-none !text-sm"
              >
                {t('cookies.accept')}
              </Button>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                aria-label="Fermer"
              >
                <IoMdClose className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
