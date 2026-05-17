# Admin Panel Login Page - Proposal

## Why

The Pishro Sarmaye platform needs a secure admin panel accessible at admin.pishrosarmaye.com to allow administrators to manage the platform's content, users, and system settings. Currently, there is no dedicated admin interface with proper authentication and authorization.

## What Changes

- Add a dedicated admin login page at admin.pishrosarmaye.com
- Implement admin authentication system with JWT tokens
- Create admin user role and permission management
- Establish admin panel base structure and routing
- Add admin dashboard landing page after successful login

## Capabilities

### New
- `admin-login-ui` - Admin login page interface with email/password form and dark mode support
- `admin-auth-api` - API endpoints for admin authentication and session management
- `admin-role-permissions` - Role-based access control (RBAC) system for admin users
- `admin-dashboard` - Admin dashboard layout and main entry point after login

### Modified
- `database-schema` - Add admin users table and permissions table to Prisma schema
- `api-routing` - Add /api/admin/* routes for authentication and admin operations

## Impact

- **Database**: New tables for admin_users and admin_permissions in Prisma schema
- **API**: New admin authentication endpoints (/api/admin/login, /api/admin/logout, /api/admin/me)
- **Frontend**: New admin subdomain routing and layout components
- **Dependencies**: May require additional packages for JWT handling if not already present
- **Breaking Changes**: None - completely new functionality

## Implementation Priority

Phase 1 (Current): Admin login page and basic authentication
Phase 2 (Future): Admin dashboard and management features
