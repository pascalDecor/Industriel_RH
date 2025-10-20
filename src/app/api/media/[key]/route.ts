import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole } from '@/types/server-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sanitizeFileName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .toLowerCase();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;

    if (!key) {
      return NextResponse.json(
        { error: 'Clé manquante' },
        { status: 400 }
      );
    }

    // Récupérer l'asset média par sa clé (pas besoin d'authentification pour GET - images publiques)
    const mediaAsset = await prisma.mediaAsset.findUnique({
      where: {
        key,
        isActive: true
      },
      select: {
        id: true,
        key: true,
        category: true,
        publicUrl: true,
        fallbackPath: true,
        fileName: true,
        altText_fr: true,
        altText_en: true,
        width: true,
        height: true,
        fileSize: true,
        mimeType: true,
        priority: true,
        description: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!mediaAsset) {
      return NextResponse.json(
        { error: 'Média non trouvé', key },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      media: mediaAsset
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du média:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    // Vérifier l'authentification et les permissions
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = authResult.user as UserWithRole;

    // Vérifier les permissions (admins seulement)
    if (!hasPermission(user, Permission.USERS_UPDATE)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { key } = await params;
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;
    const altText_fr = formData.get('altText_fr') as string | null;
    const altText_en = formData.get('altText_en') as string | null;
    const priority = formData.get('priority') as string | null;
    const description = formData.get('description') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Fichier manquant' },
        { status: 400 }
      );
    }

    // Vérifier si un média avec cette clé existe déjà
    const existingMedia = await prisma.mediaAsset.findUnique({
      where: { key }
    });

    // Upload du fichier vers Supabase Storage
    const safeName = sanitizeFileName(file.name);
    const safeCategory = category ? sanitizeFileName(category) : 'misc';
    const storagePath = `media/${safeCategory}/${Date.now()}-${safeName}`;
    const bucket = process.env.SUPABASE_BUCKET_NAME!;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: true,
      });

    if (uploadError) {
      console.error('Erreur Supabase upload:', uploadError);
      return NextResponse.json(
        { error: `Erreur d'upload: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Récupérer l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    let publicUrl = publicUrlData.publicUrl;

    // Vérifier si l'URL est relative (commence par /) et la convertir en URL absolue
    if (publicUrl.startsWith('/')) {
      publicUrl = `${process.env.SUPABASE_URL}${publicUrl}`;
    }

    console.log('📸 Public URL générée:', publicUrl);

    // Si un média existait, supprimer l'ancien fichier du storage
    if (existingMedia?.storagePath) {
      try {
        await supabase.storage
          .from(bucket)
          .remove([existingMedia.storagePath]);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancien fichier:', error);
        // Continue même si la suppression échoue
      }
    }

    // Créer ou mettre à jour le média dans la BD
    const mediaAsset = await prisma.mediaAsset.upsert({
      where: { key },
      create: {
        key,
        category: category || null,
        publicUrl: publicUrl,
        storagePath: storagePath,
        fileName: file.name,
        altText_fr: altText_fr || null,
        altText_en: altText_en || null,
        fileSize: file.size,
        mimeType: file.type,
        priority: priority || 'normal',
        description: description || null,
        uploadedBy: user.id,
        isActive: true
      },
      update: {
        publicUrl: publicUrl,
        storagePath: storagePath,
        fileName: file.name,
        altText_fr: altText_fr || undefined,
        altText_en: altText_en || undefined,
        fileSize: file.size,
        mimeType: file.type,
        priority: priority || undefined,
        description: description || undefined,
        category: category || undefined,
        uploadedBy: user.id
      }
    });

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        type: 'media',
        action: existingMedia ? 'update' : 'create',
        entityType: 'media',
        entityId: mediaAsset.id,
        description: existingMedia
          ? `Modification de l'image "${key}"`
          : `Ajout de l'image "${key}"`,
        metadata: {
          key,
          category,
          fileName: file.name,
          fileSize: file.size,
          previousUrl: existingMedia?.publicUrl
        },
        userId: user.id,
        userEmail: user.email,
        userName: user.name
      }
    });

    return NextResponse.json({
      success: true,
      media: mediaAsset,
      message: existingMedia ? 'Média mis à jour' : 'Média créé'
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload du média:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    // Vérifier l'authentification et les permissions
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = authResult.user as UserWithRole;

    // Vérifier les permissions (admins seulement)
    if (!hasPermission(user, Permission.USERS_DELETE)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { key } = await params;

    // Récupérer le média
    const mediaAsset = await prisma.mediaAsset.findUnique({
      where: { key }
    });

    if (!mediaAsset) {
      return NextResponse.json(
        { error: 'Média non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer du storage
    if (mediaAsset.storagePath) {
      try {
        const bucket = process.env.SUPABASE_BUCKET_NAME!;
        await supabase.storage
          .from(bucket)
          .remove([mediaAsset.storagePath]);
      } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
      }
    }

    // Supprimer de la BD (ou désactiver)
    await prisma.mediaAsset.update({
      where: { key },
      data: { isActive: false }
    });

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        type: 'media',
        action: 'delete',
        entityType: 'media',
        entityId: mediaAsset.id,
        description: `Suppression de l'image "${key}"`,
        metadata: {
          key,
          fileName: mediaAsset.fileName,
          publicUrl: mediaAsset.publicUrl
        },
        userId: user.id,
        userEmail: user.email,
        userName: user.name
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Média supprimé'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du média:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
