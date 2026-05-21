'use client';

/**
 * News Management Page
 * Location: app/admin/news/page.tsx
 * Features:
 * - List all articles (drafts and published)
 * - Search and filter
 * - Edit articles
 * - Delete articles
 * - Create new article
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Article {
  id: string;
  title: string;
  category: string;
  published: boolean;
  draft: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewsManagementPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load articles
  useEffect(() => {
    const loadArticles = async () => {
      try {
        // Note: In production, implement a list endpoint
        // For now, this is a placeholder
        // const response = await fetch('/api/news?limit=100');
        // const data = await response.json();
        // setArticles(data);
        setArticles([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    // Filter by status
    if (filter === 'published' && !article.published) return false;
    if (filter === 'draft' && !article.draft) return false;

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return article.title.toLowerCase().includes(search) ||
        article.category.toLowerCase().includes(search);
    }

    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      // This would typically delete the article
      // For now, just remove from local state
      setArticles(articles.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: isDarkMode ? '#111827' : '#ffffff',
    color: isDarkMode ? '#f3f4f6' : '#1f2937',
    minHeight: '100vh',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: isDarkMode ? '#059669' : '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const thStyle: React.CSSProperties = {
    padding: '12px',
    backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
    borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '12px',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: '0 0 12px 0', fontSize: '28px' }}>News Articles</h1>
          <p style={{ margin: 0, color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
            Manage your published and draft articles
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              padding: '8px 12px',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
              color: isDarkMode ? '#f3f4f6' : '#1f2937',
            }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <Link href="/admin/news/create">
            <button style={buttonStyle}>+ New Article</button>
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 12px',
            border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
            borderRadius: '4px',
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f3f4f6' : '#1f2937',
            flex: 1,
          }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          style={{
            padding: '10px 12px',
            border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
            borderRadius: '4px',
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f3f4f6' : '#1f2937',
          }}
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: isDarkMode ? '#7f1d1d' : '#fee2e2',
            color: isDarkMode ? '#fca5a5' : '#991b1b',
            borderRadius: '4px',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading articles...</p>
        </div>
      )}

      {/* Articles Table */}
      {!isLoading && filteredArticles.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb' }}>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Created</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr
                key={article.id}
                style={{
                  backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                }}
              >
                <td style={tdStyle}>
                  <strong>{article.title}</strong>
                </td>
                <td style={tdStyle}>{article.category}</td>
                <td style={tdStyle}>
                  {article.published ? (
                    <span
                      style={{
                        backgroundColor: isDarkMode ? '#065f46' : '#d1fae5',
                        color: isDarkMode ? '#6ee7b7' : '#065f46',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '12px',
                      }}
                    >
                      Published
                    </span>
                  ) : (
                    <span
                      style={{
                        backgroundColor: isDarkMode ? '#7c2d12' : '#fed7aa',
                        color: isDarkMode ? '#fdba74' : '#92400e',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '12px',
                      }}
                    >
                      Draft
                    </span>
                  )}
                </td>
                <td style={tdStyle}>{new Date(article.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/admin/news/${article.id}/edit`}>
                      <button
                        style={{
                          padding: '6px 12px',
                          backgroundColor: isDarkMode ? '#3b82f6' : '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: isDarkMode ? '#dc2626' : '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Empty State */}
      {!isLoading && filteredArticles.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
          }}
        >
          <p>No articles found</p>
          <Link href="/admin/news/create">
            <button style={buttonStyle}>Create your first article</button>
          </Link>
        </div>
      )}
    </div>
  );
}
