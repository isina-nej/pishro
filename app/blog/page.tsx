/**
 * Public Blog List Page
 * 
 * Page: /blog
 * Display all published blog posts
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowLeft, Calendar, User, Eye, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getReadingTime } from '@/lib/utils/markdown';

export const dynamic = 'force-dynamic';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string | null;
  category: string;
  publishedAt: string | null;
  createdAt: string;
  views: number;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/public/blog');
        
        if (!response.ok) {
          throw new Error('خطا در بارگیری بلاگ‌ها');
        }
        
        const data = await response.json();
        setPosts(data.data || []);
        setFilteredPosts(data.data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.author?.toLowerCase().includes(lowerQuery)
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl md:text-5xl">📚</span>
              <h1 className="text-4xl md:text-5xl font-bold">بلاگ</h1>
            </div>
            <p className="text-lg text-blue-100 max-w-2xl">مقالات، نوشتارها و راهنماهایی که برای شما آماده شده است</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Search Section */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="جستجو در بلاگ‌ها..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-12 pl-12 pr-4 text-base border-2 bg-white dark:bg-gray-900 w-full max-w-md rounded-xl"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">درحال بارگیری...</p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery ? '😅 مقاله‌ای پیدا نشد' : '📭 بلاگی وجود ندارد'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'سعی کنید جستجو را تغییر دهید' : 'به زودی بلاگ‌های جدید اضافه خواهند شد'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => {
                const readingTime = getReadingTime(post.content);
                const publishDate = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt);
                const formattedDate = publishDate.toLocaleDateString('fa-IR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1 cursor-pointer">
                      {/* Cover Image */}
                      {post.coverImage && (
                        <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                          {/* eslint-disable-next-line @next/next/no-img-element -- cover image URL is arbitrary, host is not in next.config remotePatterns */}
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4 md:p-6 flex-1 flex flex-col">
                        {/* Category Badge */}
                        <div className="mb-3">
                          <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                            {post.category}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800 pt-4">
                          {/* Date */}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formattedDate}
                          </div>

                          {/* Reading Time */}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {readingTime} دقیقه
                          </div>

                          {/* Views */}
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views} بازدید
                          </div>
                        </div>

                        {/* Author */}
                        {post.author && (
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <User className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{post.author}</span>
                          </div>
                        )}
                      </div>

                      {/* Read More */}
                      <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-200 dark:border-gray-800">
                        <Button variant="outline" size="sm" className="w-full text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <ArrowLeft className="w-3 h-3 ml-2" />
                          مطالعه مقاله
                        </Button>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Results Count */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-6 border-t border-gray-200 dark:border-gray-800">
              {searchQuery
                ? `${filteredPosts.length} مقاله برای "${searchQuery}"`
                : `${filteredPosts.length} مقاله در کل`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
