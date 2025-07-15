import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ou SUPABASE_ANON_KEY si le bucket est public
);

const sanitizeFileName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .toLowerCase();

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('image') as File;


  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const originalName = file.name;
  const safeName = sanitizeFileName(originalName);
  const path = `public/${Date.now()}-${safeName}`;

  // Upload vers Supabase Storage
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME!) // Remplace par le nom de ton bucket
    .upload(path, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from('vercel')
    .getPublicUrl(`uploads/${safeName}`);

  return NextResponse.json({
    success: 1,
    file: {
      url: publicUrlData.publicUrl,
    },
  });
}
