import { NextResponse } from 'next/server';
import { uploadToLocalPublicUploads, validateLocalFile } from '@/lib/uploadLocal.service';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  // Validate file type and size
  const validation = validateLocalFile(file);
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const host = req.headers.get('host');
  const protocol = req.headers.get('x-forwarded-proto') ?? 'http';
  const baseUrl = `${protocol}://${host}`;

  const result = await uploadToLocalPublicUploads(file, baseUrl);

  return NextResponse.json({
    success: 1,
    file: { url: result.url },
  });
}
