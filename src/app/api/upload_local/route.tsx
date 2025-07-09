import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
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
