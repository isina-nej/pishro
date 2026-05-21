# Component API Documentation - News Editor

## Overview

The News Editor is a comprehensive rich text editing component built with TipTap 3.23.5. It provides a powerful, user-friendly interface for creating and editing news articles with full HTML support, auto-save, and extensive formatting options.

## Main Components

### NewsEditor

The main editor component combining all functionality.

#### Props

```typescript
interface NewsEditorProps {
  initialContent?: string;           // Initial HTML content
  initialTitle?: string;             // Initial article title
  placeholder?: string;              // Placeholder text
  readonly?: boolean;                // Read-only mode
  maxLength?: number;                // Max content length (default: 1MB)
  articleId?: string;                // Article ID for saving
  onContentChange?: (content: string) => void;  // Content change callback
  onSave?: (data: any) => void;      // Save callback
  onError?: (error: Error) => void;  // Error callback
  showStatusBar?: boolean;           // Show status bar
  showToolbar?: boolean;             // Show toolbar
  autoSaveEnabled?: boolean;         // Enable auto-save
  darkMode?: boolean;                // Dark mode
  children?: ReactNode;              // Child elements
}
```

#### Usage

```typescript
import { NewsEditor } from '@/components/news/NewsEditor';

export default function CreateArticle() {
  return (
    <NewsEditor
      initialTitle="New Article"
      placeholder="Start writing..."
      articleId="article-123"
      autoSaveEnabled={true}
      onContentChange={(html) => console.log('Content changed:', html)}
      onSave={(data) => console.log('Saved:', data)}
      darkMode={true}
    />
  );
}
```

#### Features

- ✅ Rich text formatting (bold, italic, underline, strikethrough, code)
- ✅ Heading levels (H1, H2, H3)
- ✅ Lists (ordered, unordered, nested)
- ✅ Code blocks with syntax highlighting (27+ languages)
- ✅ Block quotes and horizontal rules
- ✅ Links with URL validation
- ✅ Image insertion and management
- ✅ Auto-save with 30-second debounce
- ✅ Keyboard shortcuts
- ✅ Undo/Redo
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Status bar with word/character count
- ✅ Context menu (right-click)
- ✅ Full TypeScript support

---

### BlockTypeSelector

Dropdown menu for selecting text block types (paragraph, headings, quote, code block).

#### Props

```typescript
interface BlockTypeSelectorProps {
  editor: Editor | null;
  darkMode?: boolean;
}
```

#### Usage

```typescript
import { BlockTypeSelector } from '@/components/news/BlockTypeSelector';
import { useEditor } from '@/lib/hooks/useEditor';

export default function EditorToolbar() {
  const { editor } = useEditor();
  
  return (
    <BlockTypeSelector editor={editor} darkMode={false} />
  );
}
```

#### Features

- Paragraph selection
- Heading level 1-3 selection
- Code block selection
- Block quote selection
- Real-time state tracking
- Keyboard navigation support

---

### EditorContextMenu

Right-click context menu with formatting and insertion options.

#### Props

```typescript
interface EditorContextMenuProps {
  position: { x: number; y: number };
  options: ContextMenuOption[];
  onClose: () => void;
  darkMode?: boolean;
}
```

#### Usage

```typescript
import { EditorContextMenu } from '@/components/news/EditorContextMenu';

export default function Editor() {
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onContextMenu={handleContextMenu}>
      {contextMenu && (
        <EditorContextMenu
          position={contextMenu}
          options={menuOptions}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
```

#### Features

- Context-aware options
- Text selection detection
- Keyboard navigation (Arrow keys, Enter, Escape)
- Click-outside close
- Dark mode support

---

### ImageUpload

Modal dialog for uploading and inserting images.

#### Props

```typescript
interface ImageUploadProps {
  onUpload: (url: string, alt: string) => void;
  onClose: () => void;
  darkMode?: boolean;
}
```

#### Usage

```typescript
import { ImageUpload } from '@/components/news/ImageUpload';

export default function Editor() {
  const [showUpload, setShowUpload] = useState(false);

  const handleImageUpload = (url: string, alt: string) => {
    editor.chain().focus().setImage({ src: url, alt }).run();
    setShowUpload(false);
  };

  return (
    <>
      <button onClick={() => setShowUpload(true)}>Insert Image</button>
      {showUpload && (
        <ImageUpload
          onUpload={handleImageUpload}
          onClose={() => setShowUpload(false)}
        />
      )}
    </>
  );
}
```

#### Validation

- Supported formats: JPEG, PNG, WebP, GIF
- Max file size: 5MB
- Image preview display
- Alt text required for accessibility

---

### ImageManager

Component for editing, resizing, and deleting images.

#### Props

```typescript
interface ImageManagerProps {
  editor: Editor | null;
  darkMode?: boolean;
}
```

#### Usage

```typescript
import { ImageManager } from '@/components/news/ImageManager';
import { useEditor } from '@/lib/hooks/useEditor';

export default function EditorToolbar() {
  const { editor } = useEditor();
  
  return (
    <ImageManager editor={editor} darkMode={false} />
  );
}
```

#### Features

- Image preview
- Resize with aspect ratio preservation
- Width/height input fields
- Alt text editing
- Delete functionality
- Reset to default size

---

### LinkDialog

Modal dialog for inserting and editing links.

#### Props

```typescript
interface LinkDialogProps {
  onInsert: (url: string, text: string) => void;
  onClose: () => void;
  darkMode?: boolean;
}
```

#### Usage

```typescript
import { LinkDialog } from '@/components/news/LinkDialog';

export default function Editor() {
  const [showDialog, setShowDialog] = useState(false);

  const handleLinkInsert = (url: string, text: string) => {
    editor
      .chain()
      .focus()
      .setLink({ href: url })
      .insertContent(text)
      .run();
    setShowDialog(false);
  };

  return (
    <>
      <button onClick={() => setShowDialog(true)}>Insert Link</button>
      {showDialog && (
        <LinkDialog
          onInsert={handleLinkInsert}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  );
}
```

#### Features

- URL validation (http, https, /, mailto, tel)
- Link text input
- Multiple protocol support
- Keyboard shortcuts (Enter to insert, Escape to close)

---

### LinkManager

Component for editing and removing links.

#### Props

```typescript
interface LinkManagerProps {
  editor: Editor | null;
  darkMode?: boolean;
}
```

#### Usage

```typescript
import { LinkManager } from '@/components/news/LinkManager';
import { useEditor } from '@/lib/hooks/useEditor';

export default function EditorToolbar() {
  const { editor } = useEditor();
  
  return (
    <LinkManager editor={editor} darkMode={false} />
  );
}
```

#### Features

- Detect links at cursor
- Edit link URL and text
- Open in new window option
- Delete links
- Real-time state updates

---

## Hooks

### useEditor

Initialize and manage the TipTap editor instance.

#### Type Signature

```typescript
function useEditor(options: {
  initialContent?: string;
  placeholder?: string;
  readonly?: boolean;
  maxLength?: number;
  onContentChange?: (content: string) => void;
}): {
  editor: Editor | null;
  isMounted: boolean;
  editorState: EditorState;
  setContent: (html: string) => void;
  getContent: () => string;
  getText: () => string;
  getWordCount: () => number;
  getCharacterCount: () => number;
  isReady: boolean;
}
```

#### Usage

```typescript
import { useEditor } from '@/lib/hooks/useEditor';

export default function MyEditor() {
  const {
    editor,
    editorState,
    getContent,
    getWordCount,
  } = useEditor({
    initialContent: '<p>Hello</p>',
    onContentChange: (html) => console.log(html),
  });

  return (
    <>
      <div>{editor && <EditorContent editor={editor} />}</div>
      <p>Words: {getWordCount()}</p>
    </>
  );
}
```

#### EditorState

```typescript
interface EditorState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  isBlockquote: boolean;
  isList: boolean;
  isCodeBlock: boolean;
  currentHeading: number | null;
  canUndo: boolean;
  canRedo: boolean;
}
```

---

### useAutoSave

Implement automatic draft saving with debouncing.

#### Type Signature

```typescript
function useAutoSave(options: {
  articleId?: string;
  title: string;
  content: string;
  interval?: number;
  onSave?: (data: any) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}): {
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt: Date | null;
  error: Error | null;
  saveDraft: () => Promise<void>;
  isSaving: boolean;
  hasSaved: boolean;
  hasError: boolean;
}
```

#### Usage

```typescript
import { useAutoSave } from '@/lib/hooks/useAutoSave';

export default function Editor() {
  const {
    saveStatus,
    lastSavedAt,
    error,
  } = useAutoSave({
    articleId: 'article-123',
    title: 'My Article',
    content: editorContent,
    interval: 30000, // 30 seconds
    onSave: (data) => console.log('Saved:', data),
    onError: (error) => console.error('Error:', error),
    enabled: true,
  });

  return (
    <div>
      <p>Status: {saveStatus}</p>
      {lastSavedAt && <p>Last saved: {lastSavedAt.toLocaleTimeString()}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
}
```

#### Save Triggers

- **Auto-trigger**: Every 30 seconds (configurable)
- **On blur**: When editor loses focus
- **Before unload**: Before page navigation
- **Manual**: Call `saveDraft()` directly

---

## Utilities

### sanitizeContent

Server-side HTML sanitization for XSS protection.

#### Type Signature

```typescript
function sanitizeContent(
  html: string,
  options?: SanitizationOptions
): string
```

#### Usage

```typescript
import { sanitizeContent } from '@/lib/sanitize-content';

const unsafeHtml = '<p onclick="alert(1)">Click</p>';
const safeHtml = sanitizeContent(unsafeHtml);
// Result: '<p>Click</p>'
```

#### Allowed Tags

`p`, `h1-h3`, `strong`, `em`, `u`, `s`, `ul`, `ol`, `li`, `blockquote`, `pre`, `code`, `img`, `a`, `br`, `hr`

#### Blocked Elements

- Script tags
- Event handlers
- iframes
- Dangerous protocols

---

### getWordCount

Extract and count words from HTML content.

```typescript
import { getWordCount } from '@/lib/sanitize-content';

const wordCount = getWordCount('<p>Hello world test</p>');
// Result: 3
```

---

### getCharacterCount

Count characters in HTML content (excluding tags).

```typescript
import { getCharacterCount } from '@/lib/sanitize-content';

const charCount = getCharacterCount('<p>Hello</p>');
// Result: 5
```

---

## Styling

### CSS Modules

Editor styling is provided via `styles/editor.module.css`:

```typescript
import styles from '@/styles/editor.module.css';

// Available classes:
// - .editorWrapper
// - .toolbar
// - .toolbarButton
// - .editorContent
// - .statusBar
// - .blockTypeSelector
// - (+ dark mode variants)
```

### Dark Mode

Enable dark mode by adding the `dark` class:

```typescript
<div className={`${styles.editorWrapper} ${darkMode ? styles.dark : ''}`}>
  {/* Editor content */}
</div>
```

---

## Examples

### Basic Editor

```typescript
import { NewsEditor } from '@/components/news/NewsEditor';

export default function CreateNews() {
  return (
    <NewsEditor
      initialTitle="New Article"
      placeholder="Start writing your news..."
      autoSaveEnabled={true}
    />
  );
}
```

### Editor with Callbacks

```typescript
import { NewsEditor } from '@/components/news/NewsEditor';
import { useState } from 'react';

export default function EditNews({ articleId }) {
  const [saveStatus, setSaveStatus] = useState('idle');

  return (
    <NewsEditor
      articleId={articleId}
      onContentChange={(html) => {
        console.log('Content changed');
      }}
      onSave={(data) => {
        setSaveStatus('saved');
        console.log('Saved:', data);
      }}
      onError={(error) => {
        setSaveStatus('error');
        console.error('Error:', error);
      }}
    />
  );
}
```

### Read-Only Display

```typescript
import { NewsEditor } from '@/components/news/NewsEditor';

export default function ViewArticle({ articleId, content }) {
  return (
    <NewsEditor
      initialContent={content}
      readonly={true}
      showToolbar={false}
      showStatusBar={false}
    />
  );
}
```

### With Dark Mode

```typescript
import { NewsEditor } from '@/components/news/NewsEditor';
import { useState } from 'react';

export default function DarkModeEditor() {
  const [isDark, setIsDark] = useState(false);

  return (
    <>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle Dark Mode
      </button>
      <NewsEditor darkMode={isDark} />
    </>
  );
}
```

---

## Best Practices

### 1. Handle Content Changes

```typescript
const [content, setContent] = useState('');

<NewsEditor
  onContentChange={(html) => setContent(html)}
  onSave={async (data) => {
    // Save to backend
    await saveToDatabase(data);
  }}
/>
```

### 2. Error Handling

```typescript
<NewsEditor
  onError={(error) => {
    // Log error
    console.error('Editor error:', error);
    // Show user-friendly message
    showNotification('Error saving article', 'error');
  }}
/>
```

### 3. Performance

- Enable auto-save for long-form content
- Use readonly mode for display-only views
- Implement content debouncing for real-time updates

### 4. Accessibility

- Always provide alt text for images
- Use semantic HTML in content
- Test with screen readers

---

## Troubleshooting

### Editor not loading

Check that all dependencies are installed:
```bash
npm install @tiptap/react @tiptap/starter-kit highlight.js lowlight
```

### Content not saving

Ensure `articleId` is provided and API endpoints are accessible:
```typescript
<NewsEditor articleId="article-123" />
```

### Rate limiting

If receiving 429 errors, increase auto-save interval:
```typescript
<useAutoSave interval={60000} /> {/* 1 minute */}
```

### Content sanitization issues

Check the allowed tags list in `lib/sanitize-content.ts`. Custom tags can be added if needed.

