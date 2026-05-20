'use server';

/**
 * API Route: POST /api/news/create
 * Create a new article with rich HTML content
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { sanitizeContent } from '@/lib/sanitize-content';
import { generateSlug } from '@/lib/utils';
import { checkRateLimit, getClientIp, addSecurityHeaders } from '@/lib/api-security';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request.headers);

    // Check rate limit
    const rateLimit = checkRateLimit(clientIp, 'create');
    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { error: 'Too many articles created. Please try again later.' },
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

    // Check admin permissions
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN';
    if (!isAdmin) {
      return addSecurityHeaders(
        NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
      );
    }

    const body = await request.json();
    const { title, content, excerpt, category, coverImage, tags } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Missing required fields: title, content, category' },
          { status: 400 }
        )
      );
    }

    // Validate content length (max 1MB)
    if (content.length > 1048576) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Content exceeds maximum size of 1MB' },
          { status: 400 }
        )
      );
    }

    // Sanitize content
    const sanitizedContent = sanitizeContent(content);

    // Generate slug from title
    let slug = generateSlug(title);

    // Check if slug already exists
    let existingArticle = await prisma.newsArticle.findUnique({
      where: { slug },
    });

    // If slug exists, add timestamp to make it unique
    if (existingArticle) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create article
    const article = await prisma.newsArticle.create({
      data: {
        title,
        slug,
        content: sanitizedContent,
        excerpt: excerpt || title.substring(0, 160),
        category,
        author: session.user.email || session.user.name,
        coverImage,
        tags: tags ? JSON.stringify(tags) : '[]',
        contentType: 'HTML',
        draft: true, // Start as draft
        published: false,
      },
    });

    const response = NextResponse.json(
      {
        id: article.id,
        slug: article.slug,
        title: article.title,
        status: 'draft',
        message: 'Article created successfully',
      },
      { status: 201 }
    );
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Article creation error:', error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: 'Failed to create article' },
        { status: 500 }
      )
    );
  }
}
