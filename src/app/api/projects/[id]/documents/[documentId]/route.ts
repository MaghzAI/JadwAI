import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const { id, documentId } = await params;

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // Check if document exists and belongs to the project
    const document = await prisma.projectDocument.findFirst({
      where: {
        id: documentId,
        projectId: id,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'المستند غير موجود' },
        { status: 404 }
      );
    }

    // In a real implementation, you would also delete the actual file from storage
    await prisma.projectDocument.delete({
      where: { id: documentId },
    });

    return NextResponse.json(
      { message: 'تم حذف المستند بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'خطأ في حذف المستند' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const { id, documentId } = await params;

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    const document = await prisma.projectDocument.findFirst({
      where: {
        id: documentId,
        projectId: id,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'المستند غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب المستند' },
      { status: 500 }
    );
  }
}
