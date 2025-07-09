import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ou SUPABASE_ANON_KEY si le bucket est public
);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('image') as File;
  

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

  const path = `public/${filename}`;

  // Upload vers Supabase Storage
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME!) // Remplace par le nom de ton bucket
    .upload(path , file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from('my-bucket')
    .getPublicUrl(`uploads/${filename}`);

  return NextResponse.json({
    success: 1,
    file: {
      url: publicUrlData.publicUrl,
    },
  });
}
