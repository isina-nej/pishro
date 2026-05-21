# News Editor UX/UI Fixes - Implementation Tasks

## 1. Fix Text Input Focus Issue

- [ ] 1.1 Debug root cause of focus loss during typing by checking render cycles in NewsEditor
- [ ] 1.2 Verify onContentChange callback is already memoized with useCallback (should be from previous fix)
- [ ] 1.3 Add focus state preservation in useEditor hook using contentRef
- [ ] 1.4 Test rapid typing (100+ characters) without focus loss
- [ ] 1.5 Test pasting multi-line text works smoothly
- [ ] 1.6 Test text selection and replacement workflow
- [ ] 1.7 Verify typing works in different browsers (Chrome, Firefox, Safari)

## 2. Create EditorActionBar Component

- [ ] 2.1 Create new file `components/news/EditorActionBar.tsx`
- [ ] 2.2 Design component interface with `onBack`, `onSave`, `onPublish` callbacks
- [ ] 2.3 Style buttons with admin panel color scheme and spacing
- [ ] 2.4 Add loading states for save/publish buttons
- [ ] 2.5 Add disabled states during operations
- [ ] 2.6 Test component in isolation with mock callbacks
- [ ] 2.7 Add proper TypeScript types and documentation

## 3. Add Back Button Functionality

- [ ] 3.1 Add "Back" button to EditorActionBar component
- [ ] 3.2 Implement `onBack` handler in create page
- [ ] 3.3 Detect unsaved changes (compare current vs last saved content)
- [ ] 3.4 Show confirmation dialog when back is clicked with unsaved changes
- [ ] 3.5 Dialog options: "Discard", "Cancel" (don't add "Save" - that's for Save button)
- [ ] 3.6 If confirmed, navigate back to `/admin/news`
- [ ] 3.7 Test back button without changes (no dialog)
- [ ] 3.8 Test back button with changes (shows dialog)
- [ ] 3.9 Test cancel on dialog (stays on page with content intact)

## 4. Add Explicit Save Draft Button

- [ ] 4.1 Add "Save Draft" button to EditorActionBar component
- [ ] 4.2 Implement `onSave` handler that calls `saveNow()` from useAutoSave
- [ ] 4.3 Show button in loading state with "Saving..." text during save
- [ ] 4.4 Show brief "Saved" feedback after successful save (2-3 seconds)
- [ ] 4.5 Show error state if save fails with "Save failed - retrying..."
- [ ] 4.6 Allow user to click Save again to retry after failure
- [ ] 4.7 Disable button during save operation to prevent double-clicks
- [ ] 4.8 Test save button with valid content
- [ ] 4.9 Test save button with empty content (handle gracefully)

## 5. Add Publish Button and Workflow

- [ ] 5.1 Add "Publish" button to EditorActionBar component
- [ ] 5.2 Create ConfirmPublishDialog component with article preview
- [ ] 5.3 Dialog shows: title, excerpt, content preview
- [ ] 5.4 Dialog buttons: "Publish", "Cancel"
- [ ] 5.5 Validate before publish: title required, content required
- [ ] 5.6 Show validation error if title or content empty
- [ ] 5.7 Call POST `/api/news/{id}/publish` endpoint on confirm
- [ ] 5.8 Handle publish success: show message and redirect to article or list
- [ ] 5.9 Handle publish error: show error message, allow retry
- [ ] 5.10 Disable publish button during operation
- [ ] 5.11 Test publish workflow from create page
- [ ] 5.12 Test publish workflow from edit page
- [ ] 5.13 Test validation (reject empty title/content)

## 6. Fix Auto-Save Error Handling

- [ ] 6.1 Review current useAutoSave hook implementation
- [ ] 6.2 Add exponential backoff retry logic (1s, 2s, 4s delays)
- [ ] 6.3 Cap retries at maximum 3 attempts
- [ ] 6.4 Silently fail after 3 retries instead of throwing error
- [ ] 6.5 Add detailed error logging for debugging
- [ ] 6.6 Test auto-save with network error (should retry)
- [ ] 6.7 Test auto-save with API 500 error (should retry)
- [ ] 6.8 Test auto-save with invalid data (should fail gracefully)
- [ ] 6.9 Verify no console errors during auto-save retries

## 7. Improve Status Bar Display

- [ ] 7.1 Update StatusBar component to show save status clearly
- [ ] 7.2 Add states: "Saving...", "Saved", "Save failed - retrying..."
- [ ] 7.3 Show "Saved" for 3 seconds after successful auto-save
- [ ] 7.4 Keep "Save failed" message visible with retry option
- [ ] 7.5 Add word count and character count display
- [ ] 7.6 Style status bar to be non-intrusive (small text, subtle colors)
- [ ] 7.7 Ensure status bar doesn't interfere with user workflow
- [ ] 7.8 Test status updates during typing and auto-save

## 8. Update Create Page Layout

- [ ] 8.1 Review current `app/admin/news/create/page.tsx`
- [ ] 8.2 Add header section with page title "Create News Article"
- [ ] 8.3 Add dark mode toggle in header
- [ ] 8.4 Import and add EditorActionBar at top of page
- [ ] 8.5 Import NewsEditor component
- [ ] 8.6 Create proper form layout with title input and editor
- [ ] 8.7 Integrate useAutoSave hook
- [ ] 8.8 Handle onSave callback from action bar (manual save)
- [ ] 8.9 Handle onPublish callback from action bar (publish workflow)
- [ ] 8.10 Handle onBack callback from action bar (navigate back)
- [ ] 8.11 Add proper error boundary around editor
- [ ] 8.12 Test create page loads without errors
- [ ] 8.13 Test all three action buttons on create page

## 9. Update Edit Page Layout

- [ ] 9.1 Review current `app/admin/news/[id]/edit/page.tsx`
- [ ] 9.2 Apply same layout structure as create page
- [ ] 9.3 Load article data and populate form (title, content)
- [ ] 9.4 Integrate EditorActionBar with article ID
- [ ] 9.5 Integrate draft restoration hook
- [ ] 9.6 Update page title to show article title or "Edit Article"
- [ ] 9.7 Handle publish state (disable publish if already published)
- [ ] 9.8 Test edit page loads existing article
- [ ] 9.9 Test edit page shows draft restoration notification
- [ ] 9.10 Test all three action buttons on edit page

## 10. Improve UI Styling and Consistency

- [ ] 10.1 Review `styles/editor.module.css` for color and spacing consistency
- [ ] 10.2 Update toolbar button styling to match admin panel buttons
- [ ] 10.3 Add proper hover and active states to all buttons
- [ ] 10.4 Improve color contrast for accessibility
- [ ] 10.5 Update dark mode colors to match admin panel dark theme
- [ ] 10.6 Add proper focus indicators for keyboard navigation
- [ ] 10.7 Ensure consistent padding and margins throughout
- [ ] 10.8 Test styling in light mode
- [ ] 10.9 Test styling in dark mode (toggle functionality)
- [ ] 10.10 Verify responsive layout on smaller screens
- [ ] 10.11 Test button hover/focus states
- [ ] 10.12 Check accessibility with accessibility inspector

## 11. Ensure API Endpoint Functionality

- [ ] 11.1 Verify POST `/api/news/draft` endpoint returns 200 (not 401 or 500)
- [ ] 11.2 Verify POST `/api/news/{id}/publish` endpoint exists and works
- [ ] 11.3 Check authentication on both endpoints
- [ ] 11.4 Test publish endpoint marks article as published
- [ ] 11.5 Test publish endpoint sets publishedAt timestamp
- [ ] 11.6 Test draft endpoint with authentication error (should return 401)
- [ ] 11.7 Test draft endpoint with missing articleId (should handle gracefully)
- [ ] 11.8 Review error responses have proper messages for debugging

## 12. Comprehensive Testing

- [ ] 12.1 Test create workflow: title → content → save → publish
- [ ] 12.2 Test edit workflow: modify content → save → publish
- [ ] 12.3 Test auto-save triggers every 30 seconds without errors
- [ ] 12.4 Test manual save works independently of auto-save
- [ ] 12.5 Test back button with/without unsaved changes
- [ ] 12.6 Test publish button with validation (title/content required)
- [ ] 12.7 Test all buttons disabled during operations (no double-click)
- [ ] 12.8 Test dark mode toggle switches all components
- [ ] 12.9 Test rapid typing (100+ chars/sec) maintains focus
- [ ] 12.10 Test paste large text maintains focus
- [ ] 12.11 Test on Chrome, Firefox, Safari
- [ ] 12.12 Test UI consistency with other admin pages (colors, spacing, typography)
- [ ] 12.13 Test error states display properly (network errors, validation errors)
- [ ] 12.14 Test recovery from errors (retry after temporary outage)

## 13. Verify Alignment with Admin Panel

- [ ] 13.1 Compare colors with admin panel components (navbar, buttons, inputs)
- [ ] 13.2 Compare typography (font sizes, weights, families)
- [ ] 13.3 Compare spacing and padding (4px grid system)
- [ ] 13.4 Compare button styles and states
- [ ] 13.5 Compare form input styling
- [ ] 13.6 Compare dark mode implementation
- [ ] 13.7 Adjust any mismatches to match admin panel exactly
- [ ] 13.8 Get design review or comparison screenshot

## 14. Documentation

- [ ] 14.1 Update component documentation in NewsEditor.tsx
- [ ] 14.2 Document new EditorActionBar component
- [ ] 14.3 Document auto-save retry logic in useAutoSave.ts
- [ ] 14.4 Add inline comments for focus preservation logic
- [ ] 14.5 Create usage examples in component files
- [ ] 14.6 Document any API changes or new endpoints

## 15. Final Verification

- [ ] 15.1 Run all tests (if any exist)
- [ ] 15.2 Check for console errors in browser dev tools
- [ ] 15.3 Verify no TypeScript errors
- [ ] 15.4 Verify no ESLint warnings
- [ ] 15.5 Test keyboard navigation (Tab, Enter, Escape)
- [ ] 15.6 Test accessibility with screen reader
- [ ] 15.7 Verify all requirements from specs are met
- [ ] 15.8 Get stakeholder approval for UX flow
- [ ] 15.9 Mark change as ready for production
