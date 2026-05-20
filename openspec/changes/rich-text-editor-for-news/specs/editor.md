# Specifications: Rich Text Editor for News Articles

## Editor Component Interface

### Requirement: RTE-001 - Editor Component Initialization

**Requirement**: The NewsEditor component SHALL accept initial content, placeholder text, and configuration options, and MUST be mountable on any page requiring content editing.

**Normative Details**:
- Component accepts props: `initialContent` (string), `placeholder` (string), `readonly` (boolean), `maxLength` (number, optional), `onContentChange` (callback), `onSave` (callback)
- Component SHALL integrate TipTap editor with ProseMirror backend
- Component MUST render in controlled mode (parent manages state)
- Component SHALL initialize with provided content or empty editor if no content provided

**Scenarios**:

#### Scenario 1: Initialize empty editor for new article
```
Given the NewsEditor is mounted with initialContent=""
When editor renders
Then editor shows placeholder text
And cursor is positioned in empty editor
And editor is ready for typing
```

#### Scenario 2: Load existing article for editing
```
Given the NewsEditor is mounted with initialContent="<p>Hello <strong>world</strong></p>"
When editor renders
Then editor displays formatted content
And text shows "Hello world" with "world" bolded
And cursor position can be set to start
```

#### Scenario 3: Read-only preview mode
```
Given the NewsEditor is mounted with readonly=true
When user attempts to modify content
Then editor prevents all modifications
And toolbar is disabled
And cursor changes to pointer
```

---

### Requirement: RTE-002 - Text Formatting Capabilities

**Requirement**: The editor SHALL support text formatting operations (bold, italic, underline, strikethrough) and MUST apply formatting to selected text or current cursor position.

**Normative Details**:
- Bold formatting: applies `<strong>` or `<b>` tag
- Italic formatting: applies `<em>` or `<i>` tag
- Underline: applies `<u>` tag
- Strikethrough: applies `<s>` or `<del>` tag
- All formatting MUST be toggleable (apply if not present, remove if present)
- Formatting shortcuts SHALL work:
  - Ctrl/Cmd+B for bold
  - Ctrl/Cmd+I for italic
  - Ctrl/Cmd+U for underline
  - Ctrl/Cmd+Shift+X for strikethrough

**Scenarios**:

#### Scenario 1: Apply bold to selected text
```
Given user has text "important word" in editor
And "important" is selected
When user clicks bold button or presses Ctrl+B
Then "important" is wrapped in <strong> tag
And button shows as active/pressed
And formatting persists after cursor moves
```

#### Scenario 2: Toggle formatting off
```
Given text "important" is already bold
And "important" is selected
When user clicks bold button
Then bold formatting is removed
And text displays as regular weight
And button no longer shows as active
```

#### Scenario 3: Apply formatting to empty selection at cursor
```
Given cursor is positioned in text "Hello|world"
When user presses Ctrl+B and types "bold"
Then typed text appears as <strong>bold</strong>
And formatting ends when user presses space or arrow key
```

---

### Requirement: RTE-003 - Heading Levels (H1, H2, H3)

**Requirement**: The editor SHALL support creating headings at levels H1, H2, and H3, and MUST convert paragraph blocks to heading blocks.

**Normative Details**:
- Heading levels: H1 (`<h1>`), H2 (`<h2>`), H3 (`<h3>`)
- Pressing Enter in heading creates new paragraph
- Backspace at start of heading converts it back to paragraph
- Heading formatting SHALL NOT be combined with inline formats
- Editor SHALL provide block type selector in toolbar

**Scenarios**:

#### Scenario 1: Convert paragraph to heading
```
Given cursor is in paragraph "This is content"
When user selects heading level 2 from block menu
Then paragraph converts to <h2>This is content</h2>
And text displays with heading styling
And cursor remains in heading
```

#### Scenario 2: Create new paragraph after heading
```
Given cursor is at end of heading "My Title"
When user presses Enter
Then new paragraph block is created
And cursor moves to new empty paragraph
And heading remains unchanged
```

#### Scenario 3: Convert heading back to paragraph
```
Given cursor is at start of heading "My Title"
When user presses Backspace
Then heading converts to paragraph
And text remains "My Title"
And formatting is removed
```

---

### Requirement: RTE-004 - Lists Support

**Requirement**: The editor SHALL support ordered lists (numbered), unordered lists (bulleted), and nested lists (up to 3 levels).

**Normative Details**:
- Unordered lists use `<ul>` with `<li>` items
- Ordered lists use `<ol>` with `<li>` items
- Nesting supported up to 3 levels deep
- Tab key indents list item (increases nesting)
- Shift+Tab outdents list item (decreases nesting)
- Double Enter exits list back to paragraph
- Empty list item with Enter creates next item

**Scenarios**:

#### Scenario 1: Create unordered list
```
Given cursor is in paragraph
When user clicks unordered list button
Then paragraph converts to unordered list
And first bullet point appears with cursor ready
And typing creates list item
```

#### Scenario 2: Nest list items
```
Given list: "Item 1" → "Item 2"
And cursor is at start of "Item 2"
When user presses Tab
Then "Item 2" nests under "Item 1"
And indentation shows visually with different styling
And button shows increased nesting level
```

#### Scenario 3: Exit list back to paragraph
```
Given cursor in third item of list
When user presses Enter twice
Then cursor moves to new paragraph below list
And list ends
```

---

### Requirement: RTE-005 - Image Insertion

**Requirement**: The editor SHALL support inserting images between paragraphs and inline within text, with resize capabilities.

**Normative Details**:
- Images inserted as `<img>` tags with `src` attribute pointing to uploaded file
- Upload interface triggered by button in toolbar or context menu
- Images uploaded to configured storage with unique filename
- Images stored as block elements (full width) or inline
- Image dimensions configurable (width/height attributes)
- Alt text required for accessibility
- Maximum image dimensions: 1920x1080px
- Supported formats: JPEG, PNG, WebP, GIF

**Scenarios**:

#### Scenario 1: Insert image between paragraphs
```
Given cursor is positioned between two paragraphs
When user clicks image insert button
Then image upload modal appears
And user selects image from file picker
And image uploads with progress indicator
And on completion, <img> tag inserted at cursor position
And image displays in editor at full editor width
```

#### Scenario 2: Add alt text to image
```
Given image is inserted in editor
When user clicks on image
Then image selection shows handles and editing toolbar
And alt text field appears in toolbar
And user can type alt text description
Then alt text saved in img[alt] attribute
```

#### Scenario 3: Resize image
```
Given image is selected
When user drags resize handle at corner
Then image scales proportionally
And dimensions shown in status bar
And new width/height stored when drag ends
```

---

### Requirement: RTE-006 - Code Blocks

**Requirement**: The editor SHALL support inserting code blocks with syntax highlighting and language selection.

**Normative Details**:
- Code blocks render as `<pre><code>` with language class
- Language can be selected (JavaScript, Python, HTML, CSS, SQL, etc.)
- Syntax highlighting applied via Highlight.js or Prism
- Tab key indents code (not converted to next block)
- Cmd+Enter exits code block
- Line numbers optional (configurable)

**Scenarios**:

#### Scenario 1: Insert code block
```
Given cursor is in paragraph
When user selects "Code Block" from block menu
Then code block created with cursor ready for typing
And language selector appears above code block
And "JavaScript" selected by default
```

#### Scenario 2: Change language
```
Given code block with JavaScript code
When user clicks language selector
Then dropdown shows language options (Python, HTML, CSS, etc.)
And user selects "Python"
Then syntax highlighting updates to Python rules
```

#### Scenario 3: Indent within code block
```
Given cursor in code block
When user presses Tab
Then spaces/tab inserted (not creating new block)
And cursor moves to indented position
```

---

### Requirement: RTE-007 - Links

**Requirement**: The editor SHALL support adding, editing, and removing hyperlinks from selected text.

**Normative Details**:
- Links stored as `<a href="...">` tags
- Ctrl+K opens link dialog
- Link validation ensures valid URL format
- Links can be relative (/path) or absolute (http://...)
- Link preview shows target URL
- Link removal via dialog or keyboard shortcut

**Scenarios**:

#### Scenario 1: Add link to selected text
```
Given text "Click here" is selected
When user presses Ctrl+K
Then link dialog appears
And user enters URL "https://example.com"
And presses Enter or clicks OK
Then text becomes <a href="https://example.com">Click here</a>
And link displays with underline and color
```

#### Scenario 2: Edit existing link
```
Given link "https://old-url.com" exists in text
When user clicks on link
Then link toolbar shows with URL field
And user changes URL to "https://new-url.com"
Then href attribute updates
And link still points to new URL
```

#### Scenario 3: Remove link
```
Given link exists in text
When user presses Ctrl+K with cursor in link
And clicks "Remove link" button
Then link formatting removed
And text remains but no longer clickable
```

---

### Requirement: RTE-008 - Block Quotes

**Requirement**: The editor SHALL support inserting block quotes with `<blockquote>` elements.

**Normative Details**:
- Block quotes render as `<blockquote>` with visual indentation and border
- Enter within quote creates new paragraph in quote
- Backspace at start converts back to paragraph
- Keyboard shortcut: Ctrl+Shift+B

**Scenarios**:

#### Scenario 1: Create block quote
```
Given paragraph "This is important"
When user presses Ctrl+Shift+B
Then paragraph converts to blockquote
And displays with left border and gray background
And visual hierarchy changes
```

---

### Requirement: RTE-009 - Horizontal Rule

**Requirement**: The editor SHALL support inserting horizontal dividers (`<hr>` tags) to separate content sections.

**Normative Details**:
- Horizontal rule inserted as block element
- Takes full editor width
- Button in toolbar or slash command (e.g., type "/hr")
- Cannot have inline content

**Scenarios**:

#### Scenario 1: Insert horizontal rule
```
Given cursor in editor
When user clicks horizontal rule button
Then <hr> element inserted
And thin line appears spanning editor width
And cursor moves to new paragraph below
```

---

## Context Menu Functionality

### Requirement: RTE-010 - Right-Click Context Menu

**Requirement**: The editor SHALL display a context menu on right-click with formatting options relevant to the current selection and position.

**Normative Details**:
- Context menu appears at mouse position
- Menu options change based on context (text selected, block type, etc.)
- Menu closes on selection or escape key
- Options include:
  - **On selected text**: Bold, Italic, Link, Delete selection
  - **On empty line**: Insert Image, Insert Heading, Insert Code Block, Insert Quote
  - **On heading**: Promote/Demote heading level
  - **On list**: Indent/Outdent, Change list type
  - **Global**: Undo, Redo, Select All

**Scenarios**:

#### Scenario 1: Format selected text via context menu
```
Given text "important" selected
When user right-clicks on selection
Then context menu appears with formatting options
And user clicks "Bold"
Then text becomes <strong>important</strong>
And menu closes
```

#### Scenario 2: Insert image via context menu
```
Given cursor between paragraphs
When user right-clicks
Then context menu appears
And "Insert Image" option shown
And user clicks it
Then image upload modal appears
```

---

## Auto-Save & Draft Management

### Requirement: RTE-011 - Auto-Save Draft

**Requirement**: The editor SHALL automatically save draft content every 30 seconds during editing and on blur events.

**Normative Details**:
- Debounce saves to prevent excessive API calls
- Save triggered on: content change (30s interval), blur, before navigation
- Auto-saved version stored separately from published articles
- Visual indicator shows save status (saving/saved/error)
- Notification shown on successful save or error

**Scenarios**:

#### Scenario 1: Auto-save during typing
```
Given user is typing in editor
When 30 seconds pass since last keystroke
Then draft automatically saved via API
And save status indicator shows "Saving..."
And on completion shows "Saved"
And server stores draft with timestamp
```

#### Scenario 2: Save on blur
```
Given editor has unsaved changes
When user clicks outside editor or switches tab
Then draft immediately saved
And status shows "Saved"
```

#### Scenario 3: Restore draft on re-open
```
Given user previously edited article and closed editor
When user reopens article edit page
Then auto-saved draft restored in editor
And timestamp shown of last save
And user can continue editing
```

---

### Requirement: RTE-012 - Unsaved Changes Warning

**Requirement**: The editor SHALL warn user before losing unsaved changes.

**Normative Details**:
- Warning shown when navigating away with unsaved changes
- Warning includes option to save or discard
- Warning NOT shown if all changes auto-saved within last 5 seconds
- Keyboard shortcut (Ctrl+S) manually saves

**Scenarios**:

#### Scenario 1: Warn before losing changes
```
Given editor has unsaved changes
When user attempts to navigate away (browser back, link click)
Then confirmation dialog appears
And message: "You have unsaved changes. Save before leaving?"
And options: "Save", "Discard", "Cancel"
And user can choose action
```

---

## Sanitization & Security

### Requirement: RTE-013 - HTML Content Sanitization

**Requirement**: The server SHALL sanitize all HTML content before storage to prevent XSS attacks.

**Normative Details**:
- Server-side sanitization using `sanitize-html` library
- Whitelist safe tags only:
  - Block: `<p>`, `<h1>`, `<h2>`, `<h3>`, `<blockquote>`, `<ul>`, `<ol>`, `<li>`, `<pre>`, `<hr>`
  - Inline: `<strong>`, `<em>`, `<u>`, `<s>`, `<a>`, `<code>`, `<br>`
  - Media: `<img>` (src, alt, width, height attributes only)
- Strip all event handlers, style attributes, scripts
- Malformed tags automatically corrected

**Scenarios**:

#### Scenario 1: Remove malicious script
```
Given HTML content: "<p>Hello<script>alert('xss')</script></p>"
When content saved to server
Then sanitization strips <script> tag
And stored content: "<p>Hello</p>"
```

#### Scenario 2: Allow safe formatting
```
Given HTML content: "<p><strong>Bold</strong> and <em>italic</em></p>"
When content sanitized
Then content preserved unchanged
And tags allowed in whitelist
```

---

## API Endpoints

### Requirement: RTE-014 - Save Draft Endpoint

**Requirement**: The system SHALL provide POST endpoint `/api/news/draft` to save article drafts with auto-save capability.

**Normative Details**:
- Endpoint: `POST /api/news/draft`
- Authentication required (user must be admin or author)
- Request body: `{ articleId?, title, content, excerpt? }`
- Response: `{ id, savedAt, status: 'draft' }`
- Creates new draft if articleId not provided
- Updates existing draft if articleId provided
- Content sanitized before storage

**Scenarios**:

#### Scenario 1: Create new draft
```
Given user clicks "New Article"
When editor saves first draft with POST /api/news/draft
Body: { title: "New Article", content: "<p>Start</p>", excerpt: "..." }
Then server creates new article with draft status
And returns { id: "123", savedAt: "2026-05-20T10:30:00Z", status: "draft" }
```

---

### Requirement: RTE-015 - Load Draft Endpoint

**Requirement**: The system SHALL provide GET endpoint `/api/news/draft/:id` to retrieve draft content for editing.

**Normative Details**:
- Endpoint: `GET /api/news/draft/:id`
- Returns: `{ id, title, content, excerpt, lastEditedAt, status }`
- Authentication required

**Scenarios**:

#### Scenario 1: Restore draft for editing
```
Given user navigates to edit article "123"
When app loads GET /api/news/draft/123
Then server returns draft content with HTML
And editor restores content state
And timestamps show last edited time
```

---

## Performance & Constraints

### Requirement: RTE-016 - Performance Requirements

**Requirement**: The editor SHALL meet performance targets for responsiveness and load time.

**Normative Details**:
- Editor initialization: < 1 second
- Content save latency: < 500ms
- Keystroke response: < 100ms
- Maximum article size: 1MB HTML content (≈ 300K words)
- Support for articles up to 50K words without lag

**Scenarios**:

#### Scenario 1: Large article editing
```
Given article with 30,000 words
When user types at paragraph 100
Then keystroke response < 100ms
And editor remains responsive
```

---

## Accessibility

### Requirement: RTE-017 - Accessibility Support

**Requirement**: The editor SHALL be keyboard accessible and support screen readers.

**Normative Details**:
- All toolbar buttons have keyboard shortcuts
- Tab key navigation through all controls
- ARIA labels on all interactive elements
- Focus visible indicators
- Screen reader announces formatting changes

**Scenarios**:

#### Scenario 1: Keyboard-only navigation
```
Given user only has keyboard
When pressing Tab
Then focus moves through: toolbar buttons → text area → context menu
And shortcuts shown in tooltips
And Enter/Space activates buttons
```
