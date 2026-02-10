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
  try {
    const supabase = getSupabaseAdminClient();
    const bucket = process.env.SUPABASE_BUCKET_NAME;
    if (!supabase || !bucket) {
      return NextResponse.json(
        { error: 'Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_BUCKET_NAME).' },
        { status: 500 }
      );
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Vérifier que l'URL est valide
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Télécharger l'image depuis l'URL
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 400 });
    }

    // Vérifier le type de contenu
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'URL does not point to an image' }, { status: 400 });
    }

    // Obtenir le nom de fichier depuis l'URL
    const urlPath = new URL(url).pathname;
    const fileName = urlPath.split('/').pop() || 'image';
    const safeFileName = sanitizeFileName(fileName);
    const path = `public/${Date.now()}-${safeFileName}`;

    // Convertir la réponse en blob
    const blob = await response.blob();

    // Upload vers Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, blob, {
        contentType: contentType,
        cacheControl: '3600',
        upsert: false,
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

  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}