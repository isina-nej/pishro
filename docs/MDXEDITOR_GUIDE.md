# MDXEditor Integration for News & Articles

## 📚 Overview

MDXEditor has been successfully integrated into your Pishro project for managing news articles and blog posts with professional Markdown editing capabilities.

## ✨ Features

### 🎨 Professional Markdown Editor
- **Live Preview**: Real-time markdown rendering
- **Full Markdown Support**: Headings, lists, tables, code blocks, blockquotes
- **RTL Persian Support**: Full support for Persian/Arabic content
- **Dark Mode**: Automatic theme switching based on system preference
- **Syntax Highlighting**: Beautiful code highlighting for 190+ languages

### 📝 Content Management
- **Auto-save**: Optional auto-save with debouncing
- **Draft System**: Save articles as drafts before publishing
- **Rich Formatting**: Bold, italic, strikethrough, code, and more
- **Media Support**: Direct image upload with drag-and-drop
- **Metadata**: Category, description, featured flag, and more

### 🔒 Security Features
- **XSS Protection**: Sanitized HTML output
- **Content Validation**: Server-side validation
- **Rate Limiting**: API protection against abuse
- **Type Safety**: Full TypeScript support

## 📂 File Structure

```
components/news/
├── MDXNewsEditor.tsx          # Main MDXEditor wrapper component
├── MDXEditorComponent.tsx      # Display/preview component
└── ... (other components)

app/admin/news/
├── create/                     # TipTap editor (existing)
│   └── page.tsx
├── create-mdx/                 # MDXEditor (new)
│   └── page.tsx
└── page.tsx                    # News management

lib/
├── editor-config.ts            # Editor configuration
└── services/
    └── news-service.ts         # News API service (optional)

styles/
└── editor.module.css           # Editor styles
```

## 🚀 Usage

### 1. Create News with MDXEditor

Navigate to `/admin/news/create-mdx` to create a new article.

#### Features:
- **Title Input**: Clear text field for article title
- **Category**: Dropdown to categorize articles
- **Description**: Summary for preview/listing
- **Featured Flag**: Mark important articles
- **MDX Editor**: Rich markdown editor with live preview

#### Keyboard Shortcuts:
- `Ctrl+B` / `Cmd+B`: Bold
- `Ctrl+I` / `Cmd+I`: Italic
- `Ctrl+K` / `Cmd+K`: Insert link
- `Ctrl+Shift+C`: Code block
- Tab navigation for toolbar

### 2. Using the Component

```tsx
import { MDXNewsEditor } from '@/components/news/MDXNewsEditor';

export default function MyPage() {
  const editorRef = useRef(null);

  const handleSave = async (data: { title: string; content: string }) => {
    const response = await fetch('/api/news/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // Handle response
  };

  return (
    <MDXNewsEditor
      initialTitle="Article Title"
      initialContent="Article content in markdown..."
      onContentChange={(content) => console.log(content)}
      onSave={handleSave}
      autoSaveEnabled={true}
      autoSaveInterval={30000}
    />
  );
}
```

### 3. Accessing Editor Methods

```tsx
const editorRef = useRef<MDXEditorMethods | null>(null);

// Get markdown content
const content = await editorRef.current?.getMarkdown();

// Set markdown content
editorRef.current?.setMarkdown('# New Content');

// Focus editor
editorRef.current?.focus();
```

## 🔧 Configuration

### Editor Configuration

Located in `lib/editor-config.ts`, customize:

```typescript
export const EDITOR_CONFIG = {
  maxLength: 100000,              // Maximum content length
  toolbarPosition: 'top',         // Toolbar position
  previewPosition: 'right',       // Preview pane position
  autoSaveInterval: 30000,        // Auto-save interval (ms)
  highlightTheme: 'github-dark',  // Code highlight theme
};
```

### Environment Variables

```bash
# API endpoints
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_UPLOAD_URL=/api/upload

# CDN configuration
NEXT_PUBLIC_CDN_URL=https://cdn.example.com
```

## 📤 Image Upload

### Implementation

Images are uploaded through `/api/upload/image` endpoint. The editor handles:

1. **Drag & Drop**: Drag images onto editor
2. **Click Upload**: Click toolbar image button
3. **URL Paste**: Paste image URLs directly

### Configuration

```typescript
imagePlugin({
  imageUploadHandler: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.url;
  },
})
```

## 🎯 API Endpoints

### News Management

#### Create Article
```
POST /api/news/create
Content-Type: application/json

{
  "title": "Article Title",
  "content": "Markdown content...",
  "category": "Technology",
  "description": "Brief summary",
  "featured": false,
  "draft": true
}
```

#### Update Article
```
PATCH /api/news/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "draft": false,
  "publishedAt": "2026-05-22T10:00:00Z"
}
```

#### Publish Article
```
PATCH /api/news/:id/publish
Content-Type: application/json

{
  "publishedAt": "2026-05-22T10:00:00Z"
}
```

#### Get Articles
```
GET /api/news?limit=10&offset=0&status=published
```

#### Delete Article
```
DELETE /api/news/:id
```

### Image Upload

```
POST /api/upload/image
Content-Type: multipart/form-data

File: [image file]
```

Response:
```json
{
  "url": "https://cdn.example.com/images/xyz.jpg",
  "size": 152000,
  "type": "image/jpeg"
}
```

## 🌍 Persian/RTL Support

### Automatic Features
- ✅ RTL text direction
- ✅ Persian font support
- ✅ Persian date formatting
- ✅ Persian number support
- ✅ Right-aligned typography

### Customization

```tsx
<MDXNewsEditor
  style={{ direction: 'rtl' }}
  placeholder="محتوا را اینجا بنویسید..."
  // Content will be automatically RTL
/>
```

## 🎨 Styling

### Dark Mode
Automatically switches based on system preference or Next.js Theme provider:

```tsx
import { useTheme } from 'next-themes';

const { theme } = useTheme();
// theme will be 'light', 'dark', or 'system'
```

### Custom Styling

Override default styles in CSS:

```css
.mdx-editor-wrapper {
  direction: rtl;
  font-family: 'Your Font';
}

.mdx-editor-wrapper .mdxeditor {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mdx-editor-wrapper .mdxeditor-preview {
  background: #f8fafc;
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create article with title and content
- [ ] Save as draft
- [ ] Publish article
- [ ] Edit draft article
- [ ] Upload images
- [ ] Use markdown formatting
- [ ] Test in dark mode
- [ ] Test Persian content
- [ ] Test keyboard shortcuts
- [ ] Test responsive layout

### Testing with cURL

```bash
# Create article
curl -X POST http://localhost:3000/api/news/create \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Test Article",
    "content": "# Heading\n\nContent here",
    "draft": true
  }'

# Publish article
curl -X PATCH http://localhost:3000/api/news/{id}/publish \
  -H 'Content-Type: application/json' \
  -d '{"publishedAt": "2026-05-22T10:00:00Z"}'
```

## 🔄 Migration from TipTap

If migrating from TipTap to MDXEditor:

1. **Backup existing content** in database
2. **Create migration script** to convert HTML to Markdown:
   ```typescript
   import { convert } from 'html-to-markdown';

   const markdown = convert(htmlContent);
   ```
3. **Update article content** via API
4. **Verify formatting** in MDXEditor
5. **Test publishing** flow

## ⚠️ Known Limitations

- Images are stored by reference URL (configure your CDN)
- Very large documents (>1MB) may have performance impacts
- Some advanced HTML may not convert to Markdown perfectly
- Table editing is basic (create but limited manipulation)

## 🚨 Troubleshooting

### Editor Not Loading
```
✓ Check if @mdxeditor/editor is installed: npm list @mdxeditor/editor
✓ Clear Next.js cache: rm -rf .next
✓ Restart dev server: npm run dev
```

### Images Not Uploading
```
✓ Verify /api/upload/image endpoint exists
✓ Check CORS headers are configured
✓ Ensure proper file permissions
✓ Check network in browser DevTools
```

### RTL Text Issues
```
✓ Verify direction: rtl CSS is applied
✓ Check font-family supports Persian characters
✓ Use unicode-range for font subsetting
```

### Auto-Save Not Working
```
✓ Verify articleId is provided
✓ Check onSave callback is working
✓ Confirm API endpoint is responsive
```

## 📚 Additional Resources

- [MDXEditor Documentation](https://mdxeditor.dev/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Remark Plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)

## 🤝 Support

For issues or questions:

1. Check the troubleshooting section
2. Review browser console for errors
3. Check Network tab for API failures
4. Refer to MDXEditor documentation
5. Check Pishro project documentation

---

**Last Updated**: May 22, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
