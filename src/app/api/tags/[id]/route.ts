import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { libelle, libelle_en } = body;

    const updateData: any = {};
    if (libelle !== undefined) updateData.libelle = libelle.trim();
    if (libelle_en !== undefined) updateData.libelle_en = libelle_en?.trim() || null;

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.tag.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}