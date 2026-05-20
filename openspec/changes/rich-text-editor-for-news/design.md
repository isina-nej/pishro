# Design: Rich Text Editor for News Articles

## Context

The Pishro platform needs a modern, feature-rich text editor for creating news and blog articles. This editor must support formatting capabilities comparable to M2, including:
- Text formatting (bold, italic, underline, etc.)
- Image insertion between paragraphs
- Heading hierarchy
- Lists and code blocks
- Context menu for quick actions
- Auto-save functionality

**Current State:**
- News articles use plain text or limited HTML input
- No visual editing interface
- Limited formatting options
- No draft auto-save

**Target State:**
- Full WYSIWYG editor with rich formatting
- Drag-and-drop and click-to-insert image support
- Auto-saving drafts
- Context menu for accessibility
- Safe HTML rendering for articles

## Goals

1. **User Experience**: Create an intuitive, modern editor that reduces friction for content creators
2. **Feature Parity**: Support all M2 editor capabilities (bold, italic, images, headings, lists, etc.)
3. **Reliability**: Implement auto-save and draft preservation to prevent content loss
4. **Security**: Ensure safe HTML storage and rendering (sanitization, XSS prevention)
5. **Performance**: Editor loads quickly and handles large articles smoothly
6. **Maintainability**: Use well-supported libraries and architecture for long-term sustainability

## Non-Goals

- Real-time collaborative editing (multi-user simultaneous editing)
- Custom theme support from editor
- Advanced plugins/extensions system (initially)
- Video embedding (can be added later)
- AI-powered suggestions

## Decisions

### 1. **Use TipTap as Editor Foundation**

**Decision**: Use TipTap (built on ProseMirror) as the core editor engine.

**Why**: 
- Most popular modern WYSIWYG editor for React/Next.js (14k+ GitHub stars)
- Excellent TypeScript support
- Headless architecture (full UI control)
- Rich extension ecosystem
- Great for building custom interfaces with context menus
- Actively maintained and production-ready

**Alternatives Considered**:
- Slate.js - More flexible but steeper learning curve
- Draft.js - Good but declining in popularity
- Contentful Editor - Too opinionated, heavyweight
- Plain contenteditable - Would require too much custom implementation

### 2. **Component Architecture**

**Decision**: Create modular editor component structure:
- `NewsEditor.tsx` - Main editor wrapper
- `EditorToolbar.tsx` - Top toolbar with formatting buttons
- `EditorContextMenu.tsx` - Right-click context menu
- `EditorStatusBar.tsx` - Word count, character count, save status
- `ImageUpload.tsx` - Image insertion modal

**Why**: 
- Separation of concerns makes maintenance easier
- Each component can be tested independently
- Easy to customize toolbar appearance
- Reusable components across other parts of app

### 3. **Content Format: HTML with Validation**

**Decision**: Store editor content as HTML (not JSON/markdown), with server-side sanitization.

**Why**:
- HTML is display-ready, no conversion needed on render
- Easy to migrate legacy content
- Standard format widely supported
- Server-side sanitization prevents XSS attacks

**Sanitization Approach**:
- Use `sanitize-html` library on server
- Whitelist safe tags and attributes
- Allow: `<p>`, `<h1>-<h3>`, `<strong>`, `<em>`, `<u>`, `<code>`, `<ul>`, `<ol>`, `<li>`, `<blockquote>`, `<img>`, `<a>`, `<br>`, `<hr>`
- Strip: event handlers, style attributes (unless from specific whitelist)

### 4. **Image Handling**

**Decision**: Upload images to dedicated storage, store references in HTML as `<img>` tags with data URLs or CDN URLs.

**Why**:
- Keeps content portable
- Easy to manage images separately
- Can optimize image delivery later
- Supports batch operations (delete unused images)

**Implementation**:
- Use existing upload infrastructure
- Generate unique filename with timestamp
- Return public URL for CDN/direct access
- Store relative path in editor content

### 5. **Auto-Save Strategy**

**Decision**: Implement client-side auto-save with optimistic updates:
- Save every 30 seconds during editing (debounced)
- Save on blur (leaving editor)
- Save before navigation warning

**Why**:
- Reduces data loss risk
- User doesn't need manual save button (simpler UX)
- Debouncing prevents excessive API calls
- Warning before losing unsaved changes adds safety

**Implementation**:
- `useAutoSave` hook that debounces saves
- Draft stored in `news_drafts` table
- Published articles separate from drafts
- Restore draft on editor re-open

### 6. **Right-Click Context Menu**

**Decision**: Custom context menu with context-aware options:
- Text selected: Bold, Italic, Link, Delete
- Paragraph: Insert image above, Insert heading above
- Code block: Copy, Delete
- Empty: Paste, Insert image, Insert heading

**Why**:
- Faster than toolbar navigation
- M2-style UX users expect
- Can show relevant options per context

### 7. **Database Schema Updates**

**Decision**: Modify article schema:
```
- content: String (from plain text to HTML, max 1MB)
- contentType: enum ['text', 'html', 'markdown'] for versioning
- draft: Boolean (default false)
- draftContent: String (nullable, auto-saved versions)
- lastEditedAt: DateTime (track changes)
```

**Why**: Supports both legacy and new content, easy migration

## Risks & Trade-offs

### Risk: HTML Storage Security
**Impact**: High - XSS vulnerabilities
**Mitigation**: 
- Strict server-side sanitization on save
- Content Security Policy headers
- Regular security audits
- User input validation

### Risk: Large Article Performance
**Impact**: Medium - Editor lag with 100K+ word articles
**Mitigation**:
- Implement chunking for very large articles
- Use virtual scrolling for long content
- Performance monitoring and metrics

### Trade-off: HTML vs JSON Storage
**Chosen**: HTML (simpler, less transformation)
**Cost**: Less semantic information, harder to programmatically modify structure
**Benefit**: Display-ready, faster rendering, easier migration

### Trade-off: Full Sanitization vs Feature Flexibility
**Chosen**: Conservative sanitization (whitelisted tags only)
**Cost**: Can't support custom styles without unsafe-inline
**Benefit**: Maximum security, simpler maintenance

## Migration Plan

### Phase 1: Editor Component (Week 1)
- Implement TipTap integration
- Build basic toolbar
- Test text formatting

### Phase 2: Features (Week 2)
- Image upload integration
- Context menu implementation
- Code blocks and lists

### Phase 3: Persistence & Auto-save (Week 3)
- API endpoints for draft save/load
- Auto-save hook implementation
- Draft restoration on editor open

### Phase 4: Database & API (Week 4)
- Prisma schema updates and migrations
- Content sanitization on server
- API endpoint for publishing

### Phase 5: Integration & Testing (Week 5)
- Integrate into news creation flow
- UI/UX testing and refinement
- Performance optimization
- Security review

### Phase 6: Legacy Content (Week 6)
- Migration script for existing articles
- Backward compatibility layer
- Deploy to production

## Open Questions

1. **How should we handle versioning?** Should we keep article edit history or just current version?
2. **What's the maximum file size for articles?** Affects database constraints.
3. **Should editors be able to customize colors/styling directly?** Or only through predefined CSS classes?
4. **Do we need revision history for drafts?** Track all auto-saved versions?
5. **How to handle mentions/tags in articles?** Should @username or #tag be supported?
