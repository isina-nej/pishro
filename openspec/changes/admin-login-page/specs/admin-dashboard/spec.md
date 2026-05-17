# Admin Dashboard Specification

## ADDED Requirements

### Dashboard Layout
The admin dashboard at /admin/dashboard SHALL display:
- Header with admin branding
- Sidebar with navigation menu
- Main content area
- User profile/logout menu

#### Acceptance Criteria
- WHEN authenticated user visits /admin/dashboard THEN layout loads successfully
- WHEN user clicks logout button THEN user is logged out and redirected to login
- WHEN sidebar is visible THEN navigation items match user role permissions
- WHEN dark mode is enabled THEN dashboard uses dark theme

### Dashboard Access Control
The admin dashboard route /admin/dashboard SHALL only be accessible to authenticated admin users.

#### Acceptance Criteria
- WHEN unauthenticated user visits /admin/dashboard THEN redirects to /admin/login
- WHEN authenticated admin visits /admin/dashboard THEN dashboard loads
- WHEN JWT token expired THEN user is redirected to login page
- WHEN user session invalid THEN returns to login with "Session expired" message

### Navigation Menu
The sidebar navigation SHALL display menu items based on user role:
- Dashboard (all roles)
- Users (admin, moderator)
- Content (admin, moderator)
- Settings (admin only)
- Reports (admin, moderator)
- Logout (all roles)

#### Acceptance Criteria
- WHEN admin user logged in THEN all menu items visible
- WHEN moderator user logged in THEN Settings menu item hidden
- WHEN viewer user logged in THEN only Dashboard menu item visible

### Dashboard Welcome
The main dashboard area SHALL display welcome message and quick stats:
- Welcome message with user's name
- Last login time
- System status summary
- Quick action buttons (for future features)

#### Acceptance Criteria
- WHEN user logs in THEN welcome message shows user's name
- WHEN page loads THEN last login timestamp displayed
- WHEN page loads THEN basic system status visible

