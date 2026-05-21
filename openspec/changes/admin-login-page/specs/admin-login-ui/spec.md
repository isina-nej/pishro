# Admin Login UI Specification

## ADDED Requirements

### Login Form Component
The admin login page SHALL display a form with the following fields:
- Email input field with validation
- Password input field with masking
- "Remember me" checkbox
- Login button
- Link to password reset (placeholder for Phase 2)

#### Acceptance Criteria
- WHEN user enters valid email and password THEN form submits to /api/admin/login
- WHEN user enters invalid email THEN email field shows validation error
- WHEN password field is empty THEN login button is disabled
- WHEN user checks "Remember me" THEN session duration extends to 30 days

### Login Page Layout
The login page SHALL be displayed at route /admin/login with:
- Centered login form design
- Pishro Sarmaye branding/logo
- Dark mode support using Tailwind CSS
- Responsive design for mobile devices
- Professional admin panel styling

#### Acceptance Criteria
- WHEN user visits /admin/login THEN page loads with centered form
- WHEN dark mode is enabled in system settings THEN page uses dark theme
- WHEN page is viewed on mobile THEN layout adapts to mobile viewport
- WHEN user is already logged in THEN page redirects to /admin/dashboard

### Error Handling UI
The login form SHALL display user-friendly error messages for:
- Invalid credentials
- Account not found
- Account suspended/inactive
- Network errors
- Rate limiting (too many attempts)

#### Acceptance Criteria
- WHEN credentials are invalid THEN error message displays below form
- WHEN account is suspended THEN specific message indicates suspension status
- WHEN too many login attempts occur THEN user is informed to try again later
- WHEN network error occurs THEN appropriate error message is shown

### Loading State
The login button SHALL show loading state during authentication:
- Button becomes disabled
- Loading spinner or text appears
- Form cannot be re-submitted during loading

#### Acceptance Criteria
- WHEN form is submitted THEN button shows loading state
- WHEN loading is in progress THEN form cannot be submitted again
- WHEN authentication completes THEN loading state disappears

