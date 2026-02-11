import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const sanitizeFileName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .toLowerCase();

export async function POST(req: Request) {
  const supabase = getSupabaseAdminClient();
  const bucket = process.env.SUPABASE_BUCKET_NAME;
  if (!supabase || !bucket) {
    return NextResponse.json(
      { error: 'Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_BUCKET_NAME).' },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const originalName = file.name;
  const safeName = sanitizeFileName(originalName);
  const path = `public/${Date.now()}-${safeName}`;

  // Upload
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Récupérer l'URL publique
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return NextResponse.json({
    success: 1,
    file: {
      url: publicUrlData.publicUrl,
    },
  });
}
