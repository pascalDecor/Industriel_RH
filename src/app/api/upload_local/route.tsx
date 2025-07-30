import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
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

const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not allowed. Please upload images (JPEG, PNG, GIF, WebP) or documents (PDF, DOC, DOCX).'
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    };
  }
  
  return { isValid: true };
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  
  // Validate file type and size
  const validation = validateFile(file);
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = sanitizeFileName(file.name);
  const filename = `${Date.now()}-${safeName}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);

  await writeFile(filePath, buffer);

  const host = req.headers.get('host');
  const protocol = req.headers.get('x-forwarded-proto') ?? 'http';
  const baseUrl = `${protocol}://${host}`;

  const fileUrl = `${baseUrl}/uploads/${filename}`;

  return NextResponse.json({
    success: 1,
    file: { url: fileUrl },
  });
}
