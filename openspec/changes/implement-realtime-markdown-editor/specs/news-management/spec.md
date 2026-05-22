# News Management Delta Spec

## ADDED Requirements

### Requirement: Real-time Markdown Transformation

The system MUST parse raw Markdown input into standard sanitized HTML tags instantly on the admin interface.

#### Scenario: Typing Markdown syntax transforms into HTML nodes

- **GIVEN** The admin is on the Create News page.
- **WHEN** The admin types `## This is a heading` into the content textarea.
- **THEN** The preview block MUST display an `h2` element containing text `This is a heading`.

#### Scenario: Empty Markdown preview

- **GIVEN** The admin is on the Create News page.
- **WHEN** The content textarea is empty.
- **THEN** The preview block MUST display `چیزی برای نمایش وجود ندارد. تایپ را شروع کنید...`.

### Requirement: Persisted Sanitized HTML

The system MUST store a sanitized rendered HTML version of news content for public display.

#### Scenario: Saving Markdown stores rendered HTML

- **GIVEN** The admin submits a news form with `content_markdown` set to `**متن مهم**`.
- **WHEN** The server creates the news article.
- **THEN** The stored `content_html` MUST contain a safe `strong` element.
- **AND** The stored `content_markdown` MUST retain the original Markdown text for future editing.

#### Scenario: Dangerous HTML is removed before persistence

- **GIVEN** The admin submits Markdown containing `<script>alert('xss')</script>` and `<img src=x onerror=alert(1)>`.
- **WHEN** The server creates the news article.
- **THEN** The stored HTML MUST NOT contain `script`, `onerror`, or executable JavaScript protocols.

### Requirement: Public News Uses Pre-rendered HTML

The public news detail page MUST render stored sanitized HTML without running client-side Markdown compilation for newly created articles.

#### Scenario: News detail displays stored HTML

- **GIVEN** A published news article has `content_html` containing `<h2>تیتر</h2><p>متن</p>`.
- **WHEN** A user opens the news detail page.
- **THEN** The page MUST inject that stored HTML into the news typography container.
- **AND** The page MUST NOT require client-side Markdown compilation for that article.

## MODIFIED Requirements

### Requirement: Admin News Form Content Editing

The admin news form MUST use a Markdown textarea with a live preview instead of relying only on a rich text output field.

#### Scenario: Desktop admin editing uses split view

- **GIVEN** The admin opens the Create News page on a desktop viewport.
- **WHEN** The content editor is visible.
- **THEN** The raw Markdown textarea and rendered preview MUST be visible side by side.

#### Scenario: Mobile admin editing uses tabs

- **GIVEN** The admin opens the Create News page on a mobile viewport.
- **WHEN** The content editor is visible.
- **THEN** The admin MUST be able to switch between editing and preview tabs.
