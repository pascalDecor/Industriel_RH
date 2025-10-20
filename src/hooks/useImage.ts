'use client';

import { useEffect, useState } from 'react';
import { imagePathFinder } from '@/utils/imagePathFinder';
import { StaticImageData } from 'next/image';

export interface ImageData {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  isLoading: boolean;
  error?: string;
}

interface MediaAssetResponse {
  success: boolean;
  media: {
    publicUrl: string;
    altText_fr?: string;
    altText_en?: string;
    width?: number;
    height?: number;
    isActive: boolean;
  };
}

/**
 * Hook pour récupérer une image (statique ou dynamique)
 *
 * Priorité :
 * 1. Si une image dynamique existe en BD -> utilise celle-ci
 * 2. Sinon -> utilise l'image statique de imagePathFinder
 *
 * @param key - Clé de l'image (ex: "logo", "banner_1")
 * @param language - Langue pour le texte alternatif ('fr' ou 'en')
 * @returns ImageData avec src, alt, width, height, isLoading
 */
export function useImage(
  key: string,
  language: 'fr' | 'en' = 'fr'
): ImageData {
  // Fallback par défaut : image statique
  const staticImage = imagePathFinder[key as keyof typeof imagePathFinder];

  const [imageData, setImageData] = useState<ImageData>({
    src: staticImage || '',
    alt: key,
    isLoading: true
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchDynamicImage() {
      try {
        const response = await fetch(`/api/media/${key}`);

        

        if (!isMounted) return;

        if (response.status === 200) {
        
          const data: MediaAssetResponse = await response.json();

            console.log(`Fetch image "${key}" response:`, data);

          if (data.success) {
            // Image dynamique trouvée
            setImageData({
              src: data.media.publicUrl,
              alt: (language === 'fr' ? data.media.altText_fr : data.media.altText_en) || key,
              width: data.media.width,
              height: data.media.height,
              isLoading: false
            });
            return;
          }
        }

        // Pas d'image dynamique, utiliser le fallback statique
        if (staticImage) {
          // Extraire width et height si c'est une StaticImageData
          const isStaticImageData = typeof staticImage === 'object' && 'src' in staticImage;
          setImageData({
            src: staticImage,
            alt: key,
            width: isStaticImageData ? (staticImage as StaticImageData).width : undefined,
            height: isStaticImageData ? (staticImage as StaticImageData).height : undefined,
            isLoading: false
          });
        } else {
          setImageData(prev => ({
            ...prev,
            isLoading: false,
            error: `Image "${key}" non trouvée`
          }));
        }

      } catch (error) {
        if (!isMounted) return;

        console.warn(`Erreur lors du chargement de l'image "${key}", utilisation du fallback statique`, error);

        // En cas d'erreur, utiliser le fallback statique
        const isStaticImageData = staticImage && typeof staticImage === 'object' && 'src' in staticImage;
        setImageData({
          src: staticImage || '',
          alt: key,
          width: isStaticImageData ? (staticImage as StaticImageData).width : undefined,
          height: isStaticImageData ? (staticImage as StaticImageData).height : undefined,
          isLoading: false,
          error: staticImage ? undefined : 'Image non disponible'
        });
      }
    }

    fetchDynamicImage();

    return () => {
      isMounted = false;
    };
  }, [key, language, staticImage]);

  return imageData;
}
