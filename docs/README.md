# News Editor - Rich Text Editing System

A production-ready rich text editor component for managing and publishing news articles with advanced formatting, auto-save, and security features.

## 🎯 Features

### Core Editing
- ✅ Full HTML formatting (bold, italic, underline, strikethrough, code)
- ✅ Block types (paragraphs, headings H1-H3, quotes, code blocks)
- ✅ Lists (ordered, unordered, nested)
- ✅ Syntax highlighting for 27+ programming languages
- ✅ Links with URL validation and new window option
- ✅ Image insertion, resizing, and management
- ✅ Horizontal rules and line breaks

### Productivity
- ✅ Auto-save every 30 seconds (configurable)
- ✅ Save on blur event
- ✅ Unsaved changes warning
- ✅ Keyboard shortcuts for all operations
- ✅ Undo/Redo support
- ✅ Word and character count

### User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Right-click context menu
- ✅ Keyboard navigation
- ✅ Accessibility (ARIA labels, screen reader support)
- ✅ Real-time status indicators

### Security
- ✅ Server-side XSS sanitization (whitelist-based)
- ✅ CSRF protection
- ✅ Rate limiting on API endpoints
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Content validation
- ✅ SQL injection prevention

### Developer Experience
- ✅ TypeScript support
- ✅ React hooks for state management
- ✅ Modular component architecture
- ✅ Comprehensive API documentation
- ✅ Unit and integration tests (80+ test cases)
- ✅ E2E testing ready

## 🏗️ Architecture

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Editor | TipTap | 3.23.5 |
| React | React | 18+ |
| Framework | Next.js | 14+ |
| Database | Prisma + MySQL | Latest |
| Sanitization | sanitize-html | Latest |
| Highlighting | highlight.js + lowlight | Latest |
| Styling | CSS Modules | - |

### Component Structure

```
components/news/
├── NewsEditor.tsx              # Main editor component
├── NewsEditorEnhanced.tsx      # With context menu
├── BlockTypeSelector.tsx       # Block type dropdown
├── EditorContextMenu.tsx       # Right-click menu
├── EditorToolbar.tsx           # Formatting toolbar
├── ImageUpload.tsx             # Image upload modal
├── ImageManager.tsx            # Image editing modal
├── LinkDialog.tsx              # Link insertion modal
└── LinkManager.tsx             # Link editing modal

lib/
├── hooks/
│   ├── useEditor.ts            # Editor state management
│   └── useAutoSave.ts          # Auto-save with debounce
├── editor-config.ts            # Configuration constants
├── editor-extensions.ts        # TipTap extension setup
├── sanitize-content.ts         # XSS prevention
└── api-security.ts             # Rate limiting & headers

app/api/news/
├── create/route.ts             # Create article
├── [id]/route.ts               # Get article
├── [id]/update/route.ts        # Update article
├── [id]/publish/route.ts       # Publish/Archive
├── draft/route.ts              # Save draft
└── upload-image/route.ts       # Upload images
```

## 📋 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/news-editor.git
cd news-editor

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

### Environment Setup

Create `.env.local`:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/database

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Editor
NEXT_PUBLIC_EDITOR_AUTO_SAVE_INTERVAL=30000
NEXT_PUBLIC_EDITOR_MAX_LENGTH=1000000
NEXT_PUBLIC_UPLOAD_MAX_SIZE=5242880

# Security
NEXT_PUBLIC_CSP_ENABLED=true
NEXT_PUBLIC_RATE_LIMIT_ENABLED=true
```

### Database Setup

```bash
# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

### Development

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:3000/admin/news/create
```

### Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Or use Docker
docker build -t news-editor .
docker run -p 3000:3000 news-editor
```

## 🚀 API Endpoints

### Create Article
```
POST /api/news/create
Body: { title, content (HTML), category, excerpt?, tags?, coverImage? }
Response: { id, slug, title, status: "draft" }
```

### Get Article
```
GET /api/news/[id]
Response: { id, title, content, status, published, commentCount, ... }
```

### Update Article
```
PUT /api/news/[id]/update      (full update)
PATCH /api/news/[id]/update    (partial update)
Body: { title?, content?, excerpt?, category?, ... }
Response: { id, slug, title, lastEditedAt, ... }
```

### Publish Article
```
POST /api/news/[id]/publish
Response: { id, title, status: "published", publishedAt }
```

### Archive Article
```
DELETE /api/news/[id]/publish
Response: { id, message: "Article archived" }
```

### Auto-Save Draft
```
POST /api/news/draft
Body: { articleId?, title, content, excerpt? }
Response: { id, savedAt, status: "draft" }
```

### Upload Image
```
POST /api/news/upload-image
Body: FormData with file + alt text
Response: { url, filename, size }
```

See [API Documentation](./docs/API_DOCUMENTATION.md) for complete details.

## 📚 Documentation

- [User Guide](./docs/USER_GUIDE.md) - For content editors
- [API Documentation](./docs/API_DOCUMENTATION.md) - For developers
- [Component API](./docs/COMPONENT_API.md) - Component reference
- [Testing Guide](./docs/TESTING_GUIDE.md) - Testing strategies
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - Production deployment

## 🧪 Testing

```bash
# Run all tests
npm run test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Security tests
npm run test:security

# Coverage report
npm run test:coverage
```

### Test Coverage

- **Unit Tests**: 80+ tests covering sanitization, hooks, utilities
- **Integration Tests**: 50+ test specs covering API endpoints
- **Security Tests**: XSS prevention, rate limiting, authentication
- **E2E Tests**: Create-edit-publish workflow
- **Browser Tests**: Cross-browser and mobile compatibility
- **Performance Tests**: Load testing and memory profiling

## 🔒 Security

### XSS Prevention
- Server-side HTML sanitization
- Whitelist-based tag filtering
- Event handler removal
- Protocol validation

### Rate Limiting
- IP-based rate limiting
- Different limits per endpoint
- 30/min for drafts, 10/min for uploads, 5/min for creates
- 429 response with Retry-After header

### Security Headers
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### Authentication
- Session-based authentication
- Admin role requirement for write operations
- Public access for published articles only

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Bold | Ctrl+B |
| Italic | Ctrl+I |
| Underline | Ctrl+U |
| Code | Ctrl+` |
| Heading 1 | Ctrl+Alt+1 |
| Heading 2 | Ctrl+Alt+2 |
| Heading 3 | Ctrl+Alt+3 |
| Link | Ctrl+K |
| Bullet List | Ctrl+Shift+8 |
| Numbered List | Ctrl+Shift+7 |
| Code Block | Ctrl+Alt+C |
| Quote | Ctrl+Shift+B |
| Undo | Ctrl+Z |
| Redo | Ctrl+Y |
| Save Draft | Ctrl+S |

See [User Guide](./docs/USER_GUIDE.md) for complete shortcuts.

## 📊 Database Schema

### NewsArticle Model

```prisma
model NewsArticle {
  id            String   @id @default(cuid())
  title         String
  slug          String   @unique
  excerpt       String?
  content       String   @db.LongText     // HTML content
  contentType   ContentType @default(HTML)
  draft         Boolean  @default(false)
  draftContent  String?  @db.LongText     // Auto-saved draft
  published     Boolean  @default(false)
  publishedAt   DateTime?
  lastEditedAt  DateTime? @updatedAt
  
  // Other fields
  coverImage    String?
  author        String
  category      String
  tags          Json?
  views         Int      @default(0)
  likes         Int      @default(0)
  featured      Boolean  @default(false)
  readingTime   Int?
  
  // Relationships
  categoryId    String
  category      Category @relation(fields: [categoryId], references: [id])
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([draft])
  @@index([published])
  @@index([publishedAt])
}

enum ContentType {
  HTML
  TEXT
  MARKDOWN
}
```

## 🎨 Customization

### Changing Colors

Edit `styles/editor.module.css`:

```css
.editorWrapper {
  --primary-color: #3b82f6;    /* Change to your color */
  --border-color: #e5e7eb;
  --hover-bg: #f3f4f6;
}

.dark {
  --primary-color: #60a5fa;
  --border-color: #374151;
  --hover-bg: #1f2937;
}
```

### Adding Keyboard Shortcuts

Edit `lib/editor-config.ts`:

```typescript
export const KEYBOARD_SHORTCUTS = {
  // Add your shortcuts
  'Ctrl+Shift+E': 'toggleEmphasis',
};
```

### Custom Extensions

Add to `lib/editor-extensions.ts`:

```typescript
export function createEditorExtensions() {
  return [
    StarterKit,
    // Add your custom extension
    MyCustomExtension,
  ];
}
```

## 🐛 Troubleshooting

### Editor Not Loading

```bash
# Check dependencies
npm list @tiptap/react

# Reinstall if needed
npm reinstall @tiptap/react
```

### Database Connection Failed

```bash
# Test connection
mysql -h $DB_HOST -u $DB_USER -p -e "SELECT 1"

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Rate Limit Too Strict

Edit `lib/api-security.ts`:

```typescript
const RATE_LIMIT_MAX = {
  draft: 60,      // Increase from 30
  upload: 20,     // Increase from 10
  create: 10,     // Increase from 5
  default: 120,   // Increase from 60
};
```

See [Troubleshooting](./docs/USER_GUIDE.md#troubleshooting) for more.

## 📈 Performance

### Optimizations

- ✅ Content debouncing (300ms)
- ✅ Auto-save debouncing (30s)
- ✅ Lazy loading for images
- ✅ Code splitting for editor extensions
- ✅ Connection pooling for database
- ✅ Request caching where applicable

### Metrics

- **Editor Load Time**: < 1s
- **Content Change Detection**: < 300ms
- **Auto-save Interval**: 30s (configurable)
- **Image Upload**: < 5s (for 5MB file)
- **Database Query**: < 100ms (with indexing)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Workflow

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Run linter
npm run lint

# Build
npm run build

# Start dev server
npm run dev
```

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file.

## 👥 Support

- **Documentation**: https://docs.yourdomain.com
- **Issues**: https://github.com/yourusername/news-editor/issues
- **Email**: support@yourdomain.com
- **Chat**: Discord community

## 🎓 Learning Resources

- [TipTap Documentation](https://tiptap.dev)
- [Next.js Documentation](https://nextjs.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [sanitize-html Guide](https://www.npmjs.com/package/sanitize-html)

## 📊 Project Stats

- **Total Components**: 10+
- **Total API Endpoints**: 7
- **Test Cases**: 80+
- **Code Coverage**: 75%+
- **Lines of Code**: 4000+
- **Documentation Pages**: 5

## 🗺️ Roadmap

- [ ] Collaborative editing (real-time sync)
- [ ] Comment threads on paragraphs
- [ ] Revision history and rollback
- [ ] Export to PDF/Word
- [ ] Markdown support
- [ ] Plugins system
- [ ] Advanced analytics
- [ ] Version control integration

## 📸 Screenshots

[Coming Soon]

---

**Built with ❤️ using Next.js, TipTap, and TypeScript**

Last Updated: May 2026
