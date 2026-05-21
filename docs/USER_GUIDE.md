# User Guide - News Editor

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Editing](#basic-editing)
3. [Formatting Text](#formatting-text)
4. [Working with Headings](#working-with-headings)
5. [Working with Lists](#working-with-lists)
6. [Working with Code](#working-with-code)
7. [Inserting Images](#inserting-images)
8. [Adding Links](#adding-links)
9. [Using Quotes](#using-quotes)
10. [Auto-Save & Drafts](#auto-save--drafts)
11. [Publishing Articles](#publishing-articles)
12. [Keyboard Shortcuts](#keyboard-shortcuts)
13. [Tips & Tricks](#tips--tricks)
14. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Editor

1. Navigate to your admin panel
2. Click **News** > **Create New Article**
3. The editor will load with a blank article

### Editor Layout

```
┌─────────────────────────────────────┐
│         Title Input Field           │
├─────────────────────────────────────┤
│    Formatting Toolbar with Icons    │
├─────────────────────────────────────┤
│                                     │
│   Main Editor Area - Type Here      │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  Status Bar (Word Count, Save Time) │
└─────────────────────────────────────┘
```

---

## Basic Editing

### Typing Content

1. Click in the editor area
2. Start typing your article content
3. Press **Enter** to create a new paragraph
4. Press **Shift+Enter** for a line break within the same paragraph

### Selecting Text

- Click and drag to select text
- **Triple-click** to select an entire paragraph
- **Ctrl+A** (or **Cmd+A** on Mac) to select all

### Editing Content

- **Delete** or **Backspace** to remove selected text
- **Ctrl+X** to cut selected text
- **Ctrl+C** to copy selected text
- **Ctrl+V** to paste text

---

## Formatting Text

### Bold Text

**Method 1: Keyboard Shortcut**
1. Select text you want to make bold
2. Press **Ctrl+B** (or **Cmd+B** on Mac)

**Method 2: Toolbar**
1. Select text
2. Click the **Bold** button (B) in the toolbar

**Method 3: Right-Click Menu**
1. Select text
2. Right-click and choose **Bold**

**Result**: Selected text appears in **bold**

---

### Italic Text

**Method 1: Keyboard Shortcut**
1. Select text
2. Press **Ctrl+I** (or **Cmd+I** on Mac)

**Method 2: Toolbar**
1. Select text
2. Click the **Italic** button (I) in the toolbar

**Result**: Selected text appears in *italic*

---

### Underline Text

**Method 1: Keyboard Shortcut**
1. Select text
2. Press **Ctrl+U** (or **Cmd+U** on Mac)

**Method 2: Toolbar**
1. Select text
2. Click the **Underline** button (U) in the toolbar

**Result**: Selected text is <u>underlined</u>

---

### Strikethrough Text

1. Select text
2. Click the **Strikethrough** button (S) in the toolbar
3. Or right-click and select **Strikethrough**

**Result**: Selected text appears with ~~strikethrough~~

---

## Working with Headings

Headings help organize your article into sections.

### Insert a Heading

**Method 1: Toolbar**
1. Click the **Paragraph/Heading** dropdown
2. Select **Heading 1**, **Heading 2**, or **Heading 3**

**Method 2: Keyboard Shortcut**
1. Position cursor at the beginning of a line
2. Press **Ctrl+Alt+1** for Heading 1
3. Press **Ctrl+Alt+2** for Heading 2
4. Press **Ctrl+Alt+3** for Heading 3

**Method 3: Right-Click Menu**
1. Right-click in editor
2. Hover over **Insert**
3. Select **Heading 1/2/3**

### Heading Hierarchy

- **Heading 1** (H1): Main article title
- **Heading 2** (H2): Major sections
- **Heading 3** (H3): Subsections

**Note**: Use headings in order for better structure and accessibility.

---

## Working with Lists

### Unordered Lists (Bullets)

**Method 1: Keyboard Shortcut**
- Press **Ctrl+Shift+8** (or **Cmd+Shift+8** on Mac)

**Method 2: Toolbar**
1. Click the **Bullet List** button
2. Type your items
3. Press **Enter** for each new item

**Result**:
- First item
- Second item
- Third item

### Ordered Lists (Numbered)

**Method 1: Keyboard Shortcut**
- Press **Ctrl+Shift+7** (or **Cmd+Shift+7** on Mac)

**Method 2: Toolbar**
1. Click the **Numbered List** button
2. Type your items

**Result**:
1. First item
2. Second item
3. Third item

### Nested Lists

1. Type an item
2. Press **Enter**
3. Press **Tab** to indent (create a nested level)
4. Press **Shift+Tab** to unindent

**Result**:
- Parent item
  - Nested item
  - Another nested item
- Another parent

---

## Working with Code

### Inline Code

1. Select text you want as code
2. Press **Ctrl+`** (backtick)
3. Or click **Code** button in toolbar

**Result**: `inline code appears like this`

### Code Blocks

**Method 1: Toolbar**
1. Click **Code Block** button in toolbar
2. Select programming language (JavaScript, Python, HTML, etc.)
3. Paste or type your code

**Method 2: Keyboard Shortcut**
- Press **Ctrl+Alt+C** to insert code block
- Select language from dropdown

**Method 3: Right-Click Menu**
1. Right-click in editor
2. Select **Insert Code Block**
3. Choose language

**Supported Languages**:
JavaScript, Python, HTML, CSS, SQL, Bash, JSON, YAML, PHP, Ruby, Java, C++, TypeScript, Go, Rust, and more (27+ languages)

**Example Code Block**:
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```

---

## Inserting Images

### Upload an Image

**Method 1: Toolbar**
1. Click **Insert Image** button
2. Click "Choose File" or drag & drop
3. Select image (JPEG, PNG, WebP, GIF)
4. Add alt text (accessibility description)
5. Click **Upload**

**Method 2: Right-Click Menu**
1. Right-click in empty area of editor
2. Select **Insert Image**
3. Follow same steps as above

### Image Formats

- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ PNG (`.png`)
- ✅ WebP (`.webp`)
- ✅ GIF (`.gif`)

### File Size Limit

- Maximum: **5 MB** per image
- Recommended: **1-2 MB** for faster loading

### Alt Text

Always provide descriptive alt text:
- Describe what the image shows
- Help visually impaired users understand content
- Example: "A person typing on a laptop" not just "image"

### Managing Images

**Edit Image Properties**:
1. Click image in editor
2. Click **Image Manager** button
3. Adjust width/height
4. Edit alt text
5. Click **Save**

**Resize Image**:
1. In Image Manager, change width or height
2. Aspect ratio is maintained automatically
3. Min size: 50px, Max size: 1920px

**Delete Image**:
1. Click image
2. Click **Delete** in Image Manager
3. Confirm deletion

---

## Adding Links

### Insert a Link

**Method 1: Toolbar**
1. Select text you want to link
2. Click **Link** button in toolbar
3. Enter URL (https://example.com)
4. Click **Insert**

**Method 2: Keyboard Shortcut**
1. Select text
2. Press **Ctrl+K** (or **Cmd+K** on Mac)
3. Enter URL
4. Press **Enter**

**Method 3: Right-Click Menu**
1. Select text
2. Right-click
3. Choose **Add Link**
4. Enter URL

### Supported Link Types

- **Websites**: `https://example.com`
- **Relative paths**: `/blog/article`
- **Email**: `mailto:user@example.com`
- **Phone**: `tel:+1234567890`

### Link Options

**Open in New Window**:
1. Click link in editor
2. Click **Link Manager**
3. Check "Open in new window"
4. Click **Save**

### Edit Links

1. Click link in editor
2. Click **Link Manager** button
3. Edit URL or link text
4. Click **Save**

### Remove Links

1. Click link
2. Click **Link Manager**
3. Click **Remove Link**
4. Text remains but link is removed

---

## Using Quotes

### Insert a Block Quote

**Method 1: Toolbar**
1. Click **Paragraph/Heading** dropdown
2. Select **Quote**

**Method 2: Keyboard Shortcut**
- Press **Ctrl+Shift+B** (or **Cmd+Shift+B** on Mac)

**Method 3: Right-Click Menu**
1. Right-click
2. Select **Insert Quote**

**Result**:
> This is a blockquote. It's indented and has a left border to distinguish it from regular text.

---

## Auto-Save & Drafts

### Auto-Save Feature

✅ **Automatic Saving**: Your work is automatically saved every **30 seconds**

**Save Triggers**:
- Every 30 seconds of editing
- When you click outside the editor
- Before you leave the page

### Monitoring Save Status

Look at the status bar (bottom of editor):

- **"Saving..."** - Currently saving your work
- **"Saved"** - Successfully saved (appears for 2 seconds)
- **"Error"** - Problem saving (see troubleshooting)

### Manual Save

1. Press **Ctrl+S** (or **Cmd+S** on Mac)
2. Or click **Save Draft** button if available

### Draft Saved Notification

When you see **"Draft saved at 10:30 AM"**, your work is safely stored.

### Preventing Data Loss

⚠️ **Warning**: If you close the browser or navigate away:
- You'll see: "You have unsaved changes"
- Click **"Stay"** to continue editing
- Click **"Leave"** to abandon changes

---

## Publishing Articles

### Save as Draft First

1. Complete your article
2. Verify auto-save shows "Saved"
3. Article is now in draft status

### Preview Article

1. Click **Preview** button (if available)
2. Review how article looks
3. Make edits if needed
4. Click **Back to Editor**

### Publish Article

1. Click **Publish** button
2. Confirm publication
3. Article becomes publicly visible
4. Notification shows: "Article published successfully"

### After Publishing

- Article appears on website
- Public can view without login
- You can still edit published articles
- Changes take effect immediately

### Unpublish Article

1. Go to published article
2. Click **Unpublish** or **Archive**
3. Article becomes draft
4. Removed from public view
5. Data is preserved

---

## Keyboard Shortcuts

### Text Formatting

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Bold | Ctrl+B | Cmd+B |
| Italic | Ctrl+I | Cmd+I |
| Underline | Ctrl+U | Cmd+U |
| Code | Ctrl+` | Cmd+` |

### Block Formatting

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Heading 1 | Ctrl+Alt+1 | Cmd+Alt+1 |
| Heading 2 | Ctrl+Alt+2 | Cmd+Alt+2 |
| Heading 3 | Ctrl+Alt+3 | Cmd+Alt+3 |
| Bullet List | Ctrl+Shift+8 | Cmd+Shift+8 |
| Numbered List | Ctrl+Shift+7 | Cmd+Shift+7 |
| Code Block | Ctrl+Alt+C | Cmd+Alt+C |
| Quote | Ctrl+Shift+B | Cmd+Shift+B |

### Editor Actions

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Save Draft | Ctrl+S | Cmd+S |
| Add Link | Ctrl+K | Cmd+K |
| Undo | Ctrl+Z | Cmd+Z |
| Redo | Ctrl+Y | Cmd+Y |
| Select All | Ctrl+A | Cmd+A |
| Cut | Ctrl+X | Cmd+X |
| Copy | Ctrl+C | Cmd+C |
| Paste | Ctrl+V | Cmd+V |

---

## Tips & Tricks

### 1. Organize with Headings

- Use **Heading 1** for article title (usually done by system)
- Use **Heading 2** for major sections
- Use **Heading 3** for subsections
- This creates a logical structure

### 2. Use Lists for Steps

Instead of: "First, do this. Second, do that."

Use:
1. Do this
2. Do that
3. Do this next

More readable and cleaner.

### 3. Highlight Important Information

Use **bold** for key terms or **quotes** for important statements.

**Example**:
> Remember: This is a critical piece of information

### 4. Proper Alt Text for Images

❌ Bad: "image" or "pic123"
✅ Good: "Team meeting in conference room"

### 5. Use Code Blocks for Technical Content

```javascript
// Your code examples
const example = "More readable than inline code";
```

### 6. Paste from Word/Google Docs

1. Copy from Word or Google Docs
2. Paste into editor
3. Editor automatically strips formatting
4. Re-apply formatting as needed

**Note**: This prevents hidden formatting conflicts.

### 7. Mobile Editing

- Works on iPad and tablets
- Touch-friendly toolbar
- Same formatting options
- Auto-save works everywhere

### 8. Track Editing History

- Auto-save creates recovery points
- Last saved time is shown in status bar
- Can retrieve previous versions if needed

---

## Troubleshooting

### Auto-Save Not Working

**Problem**: "Saving..." appears but never completes

**Solution**:
1. Check internet connection
2. Refresh the page
3. Try saving again
4. Contact support if problem persists

### Image Upload Failed

**Problem**: "Upload failed" or "Invalid file"

**Solution**:
1. Check file format (JPEG, PNG, WebP, GIF only)
2. Check file size (max 5MB)
3. Try a different image
4. Refresh page and try again

### Cannot Add Link

**Problem**: Link button doesn't work

**Solution**:
1. Select text first (text must be selected)
2. Click Link button
3. Enter full URL (https://example.com)
4. If still broken, try right-click menu

### Editor Freezes

**Problem**: Editor becomes unresponsive

**Solution**:
1. Wait 10 seconds (may be saving large content)
2. Refresh the page
3. Check browser console for errors
4. Try different browser

### Lost Content

**Problem**: Content disappeared

**Solution**:
1. Refresh page (auto-save may restore)
2. Check browser history/undo
3. Check local storage in browser tools
4. Contact support for recovery

### Dark Mode Not Working

**Problem**: Dark mode toggle doesn't change appearance

**Solution**:
1. Refresh page
2. Check system dark mode setting
3. Clear browser cache
4. Try different browser

### Keyboard Shortcuts Not Working

**Problem**: Ctrl+B doesn't make text bold

**Solution**:
1. Make sure text is selected
2. Try clicking toolbar button instead
3. Check keyboard layout (some languages override shortcuts)
4. Restart browser

---

## Getting Help

### Documentation

- [API Documentation](./API_DOCUMENTATION.md) - For developers
- [Component API](./COMPONENT_API.md) - For developers
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - For admins

### Support

- **Email**: support@yourdomain.com
- **Chat**: Use support widget in bottom right
- **Documentation**: https://docs.yourdomain.com

### Reporting Issues

Include:
1. What you were trying to do
2. What happened instead
3. Browser and OS version
4. Screenshot if applicable

---

## Keyboard Navigation for Accessibility

Press **Tab** to navigate:
- Through toolbar buttons
- In dropdown menus
- To save button

Press **Shift+Tab** to go back.

Use **Arrow keys** in menus to select options.

Press **Enter** to activate buttons.

Press **Escape** to close menus.

