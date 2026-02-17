'use client';

import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import { useImage } from '@/hooks/useImage';
import { useTranslation } from '@/contexts/LanguageContext';
import { toast } from 'react-hot-toast';

interface DynamicImageProps {
  imageKey: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  alt?: string; // Override du texte alternatif

  // Mode édition (pour admins)
  isEditMode?: boolean;
  onUpdate?: (key: string, newUrl: string) => void;

  // Autres props Next/Image
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
}

export function DynamicImage({
  imageKey,
  className,
  priority = false,
  fill = false,
  sizes,
  width = 500,
  height = 500,
  alt,
  isEditMode = false,
  onUpdate,
  quality,
  placeholder,
  blurDataURL,
  loading
}: DynamicImageProps) {
  const { language } = useTranslation();
  const imageData = useImage(imageKey, language);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText_fr', alt || imageKey);
      formData.append('altText_en', alt || imageKey);

      const response = await fetch(`/api/media/${imageKey}`, {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Image mise à jour avec succès');
        onUpdate?.(imageKey, data.media.publicUrl);
        // Forcer le reload de la page pour voir la nouvelle image
        window.location.reload();
      } else {
        toast.error('❌ Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('❌ Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
      setShowUploadModal(false);
    }
  };

  if (imageData.isLoading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse`} />
    );
  }

  if (imageData.error && !imageData.src) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center text-gray-400 text-sm`}>
        Image manquante
      </div>
    );
  }

  // Normaliser l'URL pour éviter les problèmes de localhost en prod (Vercel bloque les IP privées)
  let imageSrc = imageData.src as string | StaticImageData;
  if (typeof imageSrc === 'string') {
    // Si l'URL commence par http://localhost:3000 ou http://127.0.0.1:3000, on garde uniquement le chemin
    const localhostMatch = imageSrc.match(/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(\/.*)$/);
    if (localhostMatch?.[1]) {
      imageSrc = localhostMatch[1];
    }
  }
  const imageAlt = alt || imageData.alt;

  // Déterminer width et height
  const imgWidth = width || imageData.width;
  const imgHeight = height || imageData.height;

  // Si ni width ni height ne sont définis et qu'on n'utilise pas fill, utiliser fill par défaut
  const shouldFill = fill || (!imgWidth && !imgHeight);

  return (
    <div className={`relative ${isEditMode ? 'group' : ''} ${shouldFill && !className?.includes('w-') && !className?.includes('h-') ? 'w-full h-full' : ''}`}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={shouldFill ? undefined : imgWidth || undefined}
        height={shouldFill ? undefined : imgHeight || undefined}
        className={className}
        priority={priority}
        fill={shouldFill}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={loading}
      />

      {isEditMode && (
        <>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg flex items-center gap-2">
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Upload...
                </>
              ) : (
                <>
                  ✏️ Modifier
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
              {imageKey}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
