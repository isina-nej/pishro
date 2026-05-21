# News Editor UX/UI Improvements - Design

## Context

The news editor was recently implemented with TipTap WYSIWYG editor, but has critical UX issues:
- Focus breaks during typing (likely due to component re-renders from state updates)
- Missing action buttons (back, publish, save) required for basic workflow
- Auto-save feature throws errors due to API issues or improper error handling
- UI styling does not align with existing admin panel design system
- No consistent feedback mechanism for user actions

Current state:
- TipTap editor with formatting toolbar renders in `components/news/NewsEditor.tsx`
- useAutoSave hook handles draft persistence with 30-second debounce
- Edit page at `app/admin/news/[id]/edit/page.tsx` with draft restoration
- Create page at `app/admin/news/create/page.tsx` without proper action flow
- CSS Modules in `styles/editor.module.css` but inconsistent with admin panel styling

## Goals

1. **Enable seamless text input** - Fix focus/re-render issues causing typing interruptions
2. **Complete action workflow** - Add navigation and publish/save controls
3. **Implement reliable auto-save** - Error handling with silent failure recovery
4. **Consistent design** - Match admin panel styling and user expectations
5. **Proper feedback** - Clear status indicators without intrusive notifications

## Non-Goals

- Rewriting the TipTap editor or its extensions
- Migrating existing articles to new format
- Adding advanced features (AI, SEO optimization, scheduling)
- Creating separate mobile interface

## Decisions

### 1. Fix Typing Focus Issue
**Decision**: Prevent unnecessary re-renders by memoizing editor callbacks and managing focus state at keyboard event level
**Rationale**: The issue likely stems from `onUpdate` callback triggering state changes that cause re-renders, which blur the editor
**Implementation**:
- Keep editor instance stable (already using useRef in useEditor hook)
- Ensure onContentChange callback is memoized with useCallback
- Test that contenteditable element maintains focus during rapid updates
- Consider using `editor.isFocused()` to preserve focus state
**Alternative considered**: Track focus separately and restore it - too complex, better to prevent re-renders

### 2. Action Buttons Architecture
**Decision**: Add Back/Publish/Save buttons in a fixed action bar above the editor
**Rationale**: 
- Consistent with admin panel patterns
- Clear affordance for users
- Separates navigation from editing
**Implementation**:
- Create `EditorActionBar` component with three buttons
- Back button: Show warning if unsaved changes using useBeforeUnload
- Save button: Call `saveNow()` from useAutoSave hook, show confirmation
- Publish button: Open confirmation modal, call publish API, show success/error
- Position in sticky header for visibility
**Alternative**: Add buttons to toolbar - rejected as toolbar is already crowded

### 3. Auto-Save Error Handling
**Decision**: Log errors silently, auto-retry failed saves, show non-intrusive status
**Rationale**: Auto-save should be transparent to user - errors shouldn't interrupt workflow
**Implementation**:
- useAutoSave hook: Implement exponential backoff retry (1s, 2s, 4s)
- Max 3 retry attempts before giving up
- Store last error in state but don't show unless explicitly checking
- Add status bar indicator: "Saving...", "Saved", "Save failed - retrying..."
- Call status bar with low visual weight (small text in corner)
**Alternative**: Show toast notifications - too intrusive for auto-save, reserved for manual actions

### 4. UI/UX Improvements
**Decision**: Use Tailwind utilities + CSS Modules for consistent styling with admin panel
**Rationale**: 
- Admin panel already uses Tailwind + custom components
- Consistent with project architecture
- Maintainable and scalable
**Implementation**:
- Update editor.module.css to match admin panel color scheme
- Use dark mode class variants consistently
- Apply proper spacing (p-4, gap-4) to match admin patterns
- Style buttons to match existing button components
- Add focus states and hover effects
**Specific updates**:
- Toolbar: Better visual separation, icon alignment
- Content area: Proper padding and border treatment
- Status bar: Subtle styling, aligned to right
- Action buttons: Primary/Secondary button styles from admin panel

### 5. Page Layout
**Decision**: Create "create" and "edit" page layouts with proper header, form, and actions
**Rationale**: Current structure doesn't have proper hierarchy or action flow
**Implementation**:
- Header: Page title ("Create News Article" or "Edit: {title}"), Dark mode toggle
- Section 1: Title input + Editor (main content)
- Section 2: Preview/Metadata sidebar (optional for now)
- Fixed footer or sticky action bar: Back/Save/Publish buttons
- Handle unsaved changes: warn on Back, auto-save before Publish

## Risks & Trade-offs

### Risk 1: Focus Loss During Rapid Typing
**Mitigation**: Maintain focus state manually if needed; test with rapid typing and paste
**Trade-off**: May need slight debounce on onUpdate to reduce re-renders

### Risk 2: Auto-Save Retry Overhead
**Mitigation**: Cap retries at 3 attempts, then silently give up; user can manually save
**Trade-off**: Users might lose work if auto-save fails permanently (acceptable for draft system)

### Risk 3: Button Click Conflicts
**Mitigation**: Disable buttons during save/publish operations; clear loading states
**Trade-off**: Users must wait for operations to complete

### Risk 4: Dark Mode Consistency
**Mitigation**: Test thoroughly in both light and dark modes; use CSS variables for colors
**Trade-off**: Requires maintaining dual style sets

## Migration Plan

### Phase 1: Core Fixes (Quick wins)
1. Fix typing focus issue by memoizing callbacks
2. Add Back button with warning
3. Fix auto-save error handling with retries

### Phase 2: UI Polish
1. Add Save Draft button with explicit feedback
2. Improve styling to match admin panel
3. Add proper status indicators

### Phase 3: Publish Workflow
1. Implement Publish button with confirmation
2. Add success/error feedback
3. Handle edge cases (no title, empty content)

## Open Questions

1. Should "Save Draft" button be always visible or only when auto-save fails?
   - **Proposed**: Always visible for user control
   
2. What happens when user publishes a draft?
   - **Proposed**: Mark as published, set publishedAt timestamp, send to published articles
   
3. Should there be a "Schedule publish" feature?
   - **Proposed**: Not for MVP, defer to later phase
   
4. Should we show character/word count like in current preview?
   - **Proposed**: Yes, keep in status bar for reference
