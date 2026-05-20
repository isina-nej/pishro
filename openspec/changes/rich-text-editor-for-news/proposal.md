# Proposal: Rich Text Editor for News Articles

## Why

Currently, news/blog articles are created with limited formatting options, making it difficult for content creators to produce visually rich and well-structured articles. Users need the ability to add images, headings, bold/italic text, and other formatting options through an intuitive interface similar to modern content management systems (M2). A rich text editor will significantly improve the content creation experience and article quality.

## What Changes

- **Add Rich Text Editor Component**: Create a reusable news editor component with WYSIWYG (What You See Is What You Get) functionality
- **Image Insertion**: Enable users to insert and resize images within article paragraphs
- **Text Formatting**: Support bold, italic, underline, strikethrough, and other text styles
- **Heading Levels**: Allow creation of H1, H2, H3 headings for article structure
- **Context Menu**: Right-click menu for quick access to formatting options
- **Undo/Redo**: Full undo/redo capability for user-friendly editing
- **Code Blocks**: Support for syntax-highlighted code snippets
- **Links**: Insert and manage hyperlinks within text
- **Lists**: Create ordered and unordered lists with nesting support
- **Block Elements**: Support for quotes, dividers, and other block-level formatting
- **Save Drafts**: Auto-save functionality for draft preservation

## Capabilities

**New Capabilities:**
- Rich text editing with full formatting support
- Context menu (right-click) for text formatting
- Image insertion between paragraphs with resize controls
- Heading hierarchy (H1-H3) for article structure
- Lists (ordered/unordered) with nesting
- Code blocks with syntax highlighting
- Link insertion and management
- Block quotes and horizontal dividers
- Auto-save draft functionality
- Export to HTML and Markdown

**Modified Capabilities:**
- News/Blog article creation API - now supports rich HTML content
- Article storage schema - optimized for formatted content
- Article display components - render formatted HTML safely

## Impact

**Affected Systems:**
- `lib/services/news.ts` - News service layer
- `app/api/blog/*` - Blog/News API routes
- `components/news/NewsEditor.tsx` - New editor component (to be created)
- `prisma/schema.prisma` - Article content field type
- Database migrations - for content field updates
- Article display components - must safely render HTML
