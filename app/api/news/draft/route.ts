'use server';

/**
 * API Route: POST /api/news/draft
 * Save article draft with auto-save support
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sanitizeHtmlContent } from '@/lib/editor-config';
import { auth } from '@/auth';
import { checkRateLimit, getClientIp, addSecurityHeaders } from '@/lib/api-security';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request.headers);

    // Check rate limit
    const rateLimit = checkRateLimit(clientIp, 'draft');
    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { error: 'Too many draft saves. Please try again later.' },
        { status: 429 }
      );
      response.headers.set('Retry-After', '60');
      return addSecurityHeaders(response);
    }

    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return addSecurityHeaders(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );
    }

    const { articleId, title, content, excerpt } = await request.json();

    // Validate input
    if (!title || !content) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Title and content are required' },
          { status: 400 }
        )
      );
    }

    // Check length limits
    if (content.length > 1_000_000) {
      return NextResponse.json(
        { error: 'Content exceeds maximum length (1MB)' },
        { status: 400 }
      );
    }

    // Sanitize content
    const sanitizedContent = sanitizeHtmlContent(content);

    // Check user permissions
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN';
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can create articles' },
        { status: 403 }
      );
    }

    let article;

    if (articleId) {
      // Update existing draft
      article = await prisma.newsArticle.update({
        where: { id: articleId },
        data: {
          title,
          content: sanitizedContent,
          excerpt: excerpt || '',
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new draft
      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      article = await prisma.newsArticle.create({
        data: {
          title,
          slug: `${slug}-${Date.now()}`,
          content: sanitizedContent,
          excerpt: excerpt || '',
          published: false,
          category: 'general',
        },
      });
    }

    return NextResponse.json(
      {
        id: article.id,
        savedAt: new Date(),
        status: 'draft',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Draft save error:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}
