import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!post) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const { title, slug, content, excerpt, coverImage, isPublished } = await req.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check slug uniqueness excluding self
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing && existing.id !== params.id) {
      return NextResponse.json(
        { message: 'A post with this slug already exists' },
        { status: 400 },
      );
    }

    const currentPost = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!currentPost) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        publishedAt: isPublished ? currentPost.publishedAt || new Date() : null,
      },
    });

    return NextResponse.json(post);
  } catch (err: any) {
    if (err.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.blogPost.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (err: any) {
    if (err.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
