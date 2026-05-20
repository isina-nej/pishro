/**
 * Public Blog Post View
 * 
 * Page: /blog/[slug]
 * Display published blog post to public users
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Calendar, User, Eye, Clock, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MarkdownPreview from '@/components/BlockNews/MarkdownPreview';
import { getReadingTime } from '@/lib/utils/markdown';

export const dynamic = 'force-dynamic';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string | null;
  category: string;
  createdAt: string;
  publishedAt: string | null;
  views: number;
  likes: number;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/public/blog/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('این مقاله پیدا نشد');
          } else {
            setError('خطا در بارگیری مقاله');
          }
          return;
        }
        
        const data = await response.json();
        setPost(data.data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('خطا در بارگیری مقاله');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">درحال بارگیری...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ⚠️ {error || 'مقاله پیدا نشد'}
          </h1>
          <Link href="/blog">
            <Button className="mt-6">بازگشت به بلاگ</Button>
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(post.content);
  const publishDate = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt);
  const formattedDate = publishDate.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
            <ArrowRight className="w-5 h-5" />
            <span className="text-sm">بازگشت</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          {/* Category Badge */}
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
              {post.category}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 py-4 border-t border-b border-gray-200 dark:border-gray-800">
            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} دقیقه مطالعه</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.views} بازدید</span>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 italic border-r-4 border-blue-600 pr-4">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Article Content */}
        <div className="prose dark:prose-invert max-w-none mb-12">
          <MarkdownPreview content={post.content} />
        </div>

        {/* Author Card */}
        {post.author && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{post.author}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  نویسنده و متخصص محتوا
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <Link href="/blog">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              مشاهده تمام مقالات
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
