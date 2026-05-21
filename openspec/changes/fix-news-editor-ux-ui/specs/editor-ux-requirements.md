# News Editor UX/UI - Requirements Specifications

## ADDED Requirements

### Requirement: Fix Text Input Focus Issue

Users must be able to type continuously without the editor losing focus after each keystroke.

#### Scenario: Rapid typing continues without interruption
- **WHEN** a user types rapidly in the editor (10+ characters per second)
- **THEN** the editor maintains focus and all characters are captured without any focus loss or gaps

#### Scenario: Pasting text works smoothly
- **WHEN** a user pastes multi-line text into the editor
- **THEN** the text is inserted without losing focus, and subsequent typing works immediately

#### Scenario: Selecting and replacing text works
- **WHEN** a user selects text and starts typing to replace it
- **THEN** the focus remains on editor and replacement text appears immediately

### Requirement: Back Button Navigation

Users need a way to return to the news list without losing unsaved work.

#### Scenario: Return to news list from create page
- **WHEN** user clicks the "Back" button on the create page
- **THEN** they are returned to `/admin/news` list page

#### Scenario: Warning on unsaved changes
- **WHEN** user clicks "Back" with unsaved content in the editor
- **THEN** a confirmation dialog appears asking "Discard unsaved changes?"

#### Scenario: Resume editing after dismissing warning
- **WHEN** user clicks "Cancel" on the unsaved changes warning
- **THEN** they remain on the editor page with content intact

### Requirement: Save Draft Button

Users need explicit control to save their draft manually in addition to auto-save.

#### Scenario: Manual save of draft
- **WHEN** user clicks the "Save Draft" button
- **THEN** the draft is immediately saved and a "Saved" confirmation appears briefly

#### Scenario: Save button shows during auto-save failure
- **WHEN** auto-save encounters an error
- **THEN** the "Save Draft" button displays prominently with visual indication of error

#### Scenario: Disabled button during save operation
- **WHEN** user clicks "Save Draft" button
- **THEN** the button becomes disabled and shows "Saving..." until operation completes

### Requirement: Publish Button with Confirmation

Users need to publish articles with a confirmation workflow.

#### Scenario: Publish article from editor
- **WHEN** user clicks the "Publish" button
- **THEN** a confirmation modal appears showing article details and asking for confirmation

#### Scenario: Publish confirmation with validation
- **WHEN** user confirms publish action
- **THEN** the system validates title and content are not empty, then publishes the article

#### Scenario: Publish success feedback
- **WHEN** article is successfully published
- **THEN** a success message appears and user is redirected to the article or news list

#### Scenario: Publish failure handling
- **WHEN** publish operation fails (API error, validation failure)
- **THEN** an error message is shown and user remains on editor page to retry

### Requirement: Improved Auto-Save Error Handling

Auto-save should work reliably with proper error recovery without interrupting the user.

#### Scenario: Silent auto-save success
- **WHEN** auto-save completes successfully
- **THEN** a subtle indicator shows "Saved" in the status bar (no intrusive notification)

#### Scenario: Auto-save retry on network error
- **WHEN** auto-save encounters a network error
- **THEN** it automatically retries after 1 second, then 2 seconds, then 4 seconds (max 3 attempts)

#### Scenario: Status feedback during auto-save
- **WHEN** auto-save is in progress
- **THEN** the status bar shows "Saving..." without blocking user interaction

#### Scenario: Final failure graceful handling
- **WHEN** auto-save fails after 3 retries
- **THEN** status bar shows "Save failed - click Save Draft to retry" without being intrusive

### Requirement: UI Design Consistency with Admin Panel

The editor styling must match the rest of the admin panel.

#### Scenario: Color scheme matches
- **WHEN** viewing the editor in light mode
- **THEN** the text, toolbar, and backgrounds use the same colors as other admin pages

#### Scenario: Dark mode consistency
- **WHEN** toggling dark mode in the editor
- **THEN** the editor properly transitions to dark mode with all elements themed consistently

#### Scenario: Typography consistency
- **WHEN** viewing the editor
- **THEN** font families, sizes, and weights match the admin panel components

#### Scenario: Spacing and layout match
- **WHEN** comparing editor layout to other admin forms
- **THEN** padding, margins, and gaps are consistent with admin panel patterns

### Requirement: Action Button Layout

Action buttons must be clearly visible and accessible in the expected location.

#### Scenario: Back button positioned
- **WHEN** viewing the editor page
- **THEN** the "Back" button appears at the top left, near the page title

#### Scenario: Save and Publish buttons positioned
- **WHEN** viewing the editor page
- **THEN** "Save Draft" and "Publish" buttons appear in the top right action bar

#### Scenario: Buttons visible on scroll
- **WHEN** scrolling through the editor content
- **THEN** the action buttons remain visible (sticky header or always visible section)

#### Scenario: Button states responsive
- **WHEN** hovering over buttons
- **THEN** buttons show hover state; when disabled, show disabled state clearly

### Requirement: Status Bar Information

Users need clear feedback about their work status.

#### Scenario: Show save status
- **WHEN** auto-save is active
- **THEN** the status bar shows current state: "Saving...", "Saved", or "Save failed"

#### Scenario: Show character and word count
- **WHEN** viewing the editor content area
- **THEN** the status bar displays "Words: X" and "Characters: Y"

#### Scenario: Status bar non-intrusive
- **WHEN** using the editor normally
- **THEN** the status bar doesn't interrupt editing or show intrusive notifications

## MODIFIED Requirements

### Requirement: NewsEditor Component Stability

The NewsEditor component must maintain focus during rapid state updates.

#### Scenario: Memoized callbacks prevent re-renders
- **WHEN** content is updated in the editor
- **THEN** the component only re-renders when necessary, not on every keystroke

#### Scenario: Editor instance persists
- **WHEN** editor is active
- **THEN** the TipTap editor instance remains stable and doesn't reinitialize

### Requirement: Create Page Layout

The create article page must provide clear workflow with proper spacing and organization.

#### Scenario: Title input at top
- **WHEN** viewing create page
- **THEN** the title input field appears at the top with placeholder "Article Title"

#### Scenario: Editor below title
- **WHEN** on create page
- **THEN** the editor content area appears below the title input with clear visual separation

#### Scenario: Action buttons accessible
- **WHEN** on create page
- **THEN** Back, Save Draft, and Publish buttons are all accessible without scrolling (or in sticky header)

### Requirement: Edit Page Layout

The edit article page follows the same layout as create page.

#### Scenario: Existing article loads
- **WHEN** opening the edit page for an existing article
- **THEN** the title and content are populated from the database

#### Scenario: Draft restoration works
- **WHEN** opening edit page with unsaved draft
- **THEN** a notification appears offering to restore or discard the draft

### Requirement: Auto-Save API Integration

The auto-save API endpoint must handle requests reliably.

#### Scenario: Save draft endpoint responds
- **WHEN** auto-save sends a POST request to `/api/news/draft`
- **THEN** the API returns 200 with saved draft data, not 500 errors

#### Scenario: Proper authentication check
- **WHEN** auto-save request is made
- **THEN** the API verifies user is authenticated before saving

## REMOVED Requirements

### Requirement: Intrusive Auto-Save Notifications
Auto-save should work silently without toast notifications that distract the user.

### Requirement: Undocumented Save Status
The save status must be visible in the status bar, not scattered across the UI.

---

## Implementation Notes

### Testing Requirements
- Manual testing: Type continuously for 1 minute, verify focus never breaks
- Manual testing: Paste 500+ character text, verify paste works smoothly
- Manual testing: Test in Firefox, Chrome, Safari on desktop
- Test dark mode toggle transitions smoothly
- Test all button states (hover, active, disabled, loading)

### Browser Compatibility
- Desktop Chrome 90+
- Desktop Firefox 88+
- Desktop Safari 14+
- Mobile browser testing in separate phase

### Accessibility Requirements
- All buttons must have proper ARIA labels
- Focus indicators must be visible
- Keyboard navigation must work
- Status messages must be announced to screen readers
