/**
 * API Route: POST /api/news/create
 * Create a new article with rich HTML content or markdown
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { sanitizeContent } from '@/lib/sanitize-content';
import { parseMarkdown, sanitizeMarkdown, validateMarkdown } from '@/lib/markdown-processor';

// Simple slug generator
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin permissions
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      title, 
      content, 
      contentMarkdown,
      contentHtml,
      category = 'General', 
      draft = true, 
      published = false 
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      );
    }

    // Determine which content format to use
    let finalMarkdown = '';
    let finalHtml = '';

    if (contentMarkdown) {
      // If markdown is provided, validate and parse it
      const validation = validateMarkdown(contentMarkdown);
      if (!validation.valid) {
        return NextResponse.json(
          { error: `Invalid markdown: ${validation.error}` },
          { status: 400 }
        );
      }

      // Sanitize markdown
      finalMarkdown = sanitizeMarkdown(contentMarkdown);

      // Parse markdown to HTML
      finalHtml = parseMarkdown(finalMarkdown);
    } else if (contentHtml) {
      // If HTML is provided, sanitize it
      finalHtml = sanitizeContent(contentHtml);
      finalMarkdown = ''; // Will be regenerated or left empty
    } else if (content) {
      // Fallback to legacy content field (assume it's HTML)
      finalHtml = sanitizeContent(content);
      finalMarkdown = '';
    } else {
      return NextResponse.json(
        { error: 'Missing content: provide contentMarkdown, contentHtml, or content' },
        { status: 400 }
      );
    }

    // Validate content length (max 1MB each)
    if (finalHtml.length > 1048576 || finalMarkdown.length > 1048576) {
      return NextResponse.json(
        { error: 'Content exceeds maximum size of 1MB' },
        { status: 400 }
      );
    }

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
        content: finalHtml, // Keep backward compatibility
        contentMarkdown: finalMarkdown,
        contentHtml: finalHtml,
        excerpt: title.substring(0, 160),
        author: session.user.name,
        contentType: contentMarkdown ? 'MARKDOWN' : 'HTML',
        category: category,
        draft: draft,
        published: published,
        publishedAt: published ? new Date() : null,
        lastEditedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        id: article.id,
        slug: article.slug,
        title: article.title,
        status: draft ? 'draft' : 'published',
        message: draft ? 'Draft saved successfully' : 'Article published successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Article creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create article', details: String(error) },
      { status: 500 }
    );
  }
}
