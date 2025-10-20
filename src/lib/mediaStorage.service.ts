import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME!;

/**
 * Nettoie et sécurise un nom de fichier
 */
const sanitizeFileName = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .toLowerCase();

/**
 * Génère un chemin unique pour le stockage
 */
const generateStoragePath = (fileName: string, category?: string): string => {
  const safeName = sanitizeFileName(fileName);
  const timestamp = Date.now();
  const prefix = category ? `media/${category}` : 'media';
  return `${prefix}/${timestamp}-${safeName}`;
};

/**
 * Extrait les métadonnées d'une image
 */
const getImageMetadata = async (file: File): Promise<{
  width?: number;
  height?: number;
  mimeType: string;
  fileSize: number;
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        width: img.width,
        height: img.height,
        mimeType: file.type,
        fileSize: file.size
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        mimeType: file.type,
        fileSize: file.size
      });
    };

    img.src = objectUrl;
  });
};

export interface UploadMediaResult {
  publicUrl: string;
  storagePath: string;
  fileName: string;
  width?: number;
  height?: number;
  mimeType: string;
  fileSize: number;
}

/**
 * Upload une image vers Supabase Storage
 */
export async function uploadMedia(
  file: File,
  category?: string
): Promise<UploadMediaResult> {
  const storagePath = generateStoragePath(file.name, category);

  // Upload vers Supabase
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      contentType: file.type,
      cacheControl: '31536000', // 1 an
      upsert: true,
    });

  if (error) {
    throw new Error(`Erreur d'upload: ${error.message}`);
  }

  // Récupérer l'URL publique
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  // Obtenir les métadonnées de l'image (client-side uniquement)
  // Pour le serveur, on retourne les infos de base
  return {
    publicUrl: publicUrlData.publicUrl,
    storagePath,
    fileName: file.name,
    mimeType: file.type,
    fileSize: file.size
  };
}

/**
 * Supprime une image de Supabase Storage
 */
export async function deleteMedia(storagePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) {
    throw new Error(`Erreur de suppression: ${error.message}`);
  }
}

/**
 * Vérifie si un fichier existe dans le storage
 */
export async function mediaExists(storagePath: string): Promise<boolean> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(storagePath.split('/').slice(0, -1).join('/'));

  if (error) return false;

  const fileName = storagePath.split('/').pop();
  return data?.some(file => file.name === fileName) || false;
}

/**
 * Obtient l'URL publique d'un fichier
 */
export function getPublicUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

export default {
  uploadMedia,
  deleteMedia,
  mediaExists,
  getPublicUrl
};
