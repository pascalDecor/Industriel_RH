import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const sanitizeFileName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .toLowerCase();

export interface LocalUploadResult {
  url: string; // URL relative depuis la racine du site, ex: /uploads/xxx.png
}

export function validateLocalFile(file: File): { isValid: boolean; error?: string } {
  const isImage = typeof file.type === 'string' && file.type.toLowerCase().startsWith('image/');
  const isAllowedDoc = ALLOWED_FILE_TYPES.includes(file.type);

  if (!isImage && !isAllowedDoc) {
    return {
      isValid: false,
      error:
        'File type not allowed. Please upload an image (any image/* MIME type) or an allowed document (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX).'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    };
  }

  return { isValid: true };
}

export async function uploadToLocalPublicUploads(
  file: File
): Promise<LocalUploadResult> {
  const validation = validateLocalFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid file');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = sanitizeFileName(file.name);
  const filename = `${Date.now()}-${safeName}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);

  await writeFile(filePath, buffer); 
 
  // Next/Node sert automatiquement les fichiers dans public à partir de /
  // Donc un fichier dans public/uploads/xxx est accessible via /uploads/xxx
  const fileUrl = `/uploads/${filename}`;

  return { url: fileUrl };
}

