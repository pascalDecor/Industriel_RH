"use client";

import { useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showFallbackText?: boolean;
  priority?: boolean;
}

export default function Logo({ 
  className = "h-16 w-auto object-contain", 
  width = 200, 
  height = 64,
  showFallbackText = true,
  priority = false
}: LogoProps) {
  const [logoError, setLogoError] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/images/logo.png');

  const handleLogoError = () => {
    if (logoSrc === '/images/logo.png') {
      // Essayer le logo alternatif
      setLogoSrc('/images/logo_light.png');
    } else if (logoSrc === '/images/logo_light.png') {
      // Essayer le logo seul
      setLogoSrc('/images/logo_only.png');
    } else {
      // Tous les logos ont échoué, utiliser le fallback
      setLogoError(true);
    }
  };

  if (logoError) {
    return (
      <div className="text-center">
        <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-full bg-blue-100 mb-2">
          <svg 
            className="h-6 w-6 text-blue-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
            />
          </svg>
        </div>
        {showFallbackText && (
          <h3 className="text-lg font-bold text-blue-900">Industrielle RH</h3>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Image 
        src={logoSrc}
        alt="Industrielle RH" 
        width={width}
        height={height}
        className={className}
        priority={priority}
        onError={handleLogoError}
      />
    </div>
  );
}