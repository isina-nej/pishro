# Admin Panel Login Page - Design

## Context

Pishro Sarmaye is a Next.js-based platform with existing user authentication. We're extending this with a dedicated admin panel at admin.pishrosarmaye.com that requires its own authentication system with proper role-based access control.

## Goals

- Build a secure, role-based admin login page at admin.pishrosarmaye.com
- Establish admin authentication flow with JWT tokens
- Create a foundation for future admin features
- Ensure admin users are separate from regular users with elevated permissions
- Provide session management and logout functionality

### Non-Goals

- Multi-factor authentication (Phase 2)
- SSO/OAuth integration (Phase 2)
- Complex permission hierarchies (Phase 2)
- Admin action audit logging (Phase 2)

## Architecture & Decisions

### Authentication Flow
1. Admin user navigates to admin.pishrosarmaye.com
2. Enters email and password on login form
3. Server validates credentials against admin_users table
4. On success: JWT token issued and stored in httpOnly cookie
5. User redirected to admin dashboard
6. Protected admin routes verify JWT before access

### Technology Stack
- **Frontend**: React/Next.js with TypeScript
- **Backend**: Next.js API routes
- **Database**: MySQL (existing) with new admin_users and admin_permissions tables
- **Auth**: JWT with httpOnly cookies
- **Styling**: Tailwind CSS with dark mode support

### Key Components

#### Frontend Structure
```
app/admin/
  ├── layout.tsx              # Admin layout wrapper
  ├── login/
  │   ├── page.tsx           # Login page component
  │   └── actions.ts         # Server actions for auth
  ├── dashboard/
  │   └── page.tsx           # Admin dashboard (protected)
  └── middleware.ts          # Route protection middleware
```

#### API Routes
```
app/api/admin/
  ├── login               # POST: Authenticate admin user
  ├── logout              # POST: Clear session
  ├── me                  # GET: Current admin user info
  └── refresh             # POST: Refresh JWT token
```

#### Database Schema
```
admin_users:
  - id (PK)
  - email (UNIQUE)
  - password_hash
  - name
  - role (admin, moderator, viewer)
  - status (active, inactive, suspended)
  - created_at
  - updated_at
  - last_login_at

admin_permissions:
  - id (PK)
  - role
  - permission (create, read, update, delete)
  - resource (users, content, settings, etc.)
```

### Session Management
- JWT tokens expire after 24 hours
- Refresh tokens for extending sessions
- httpOnly cookies prevent XSS attacks
- Server-side session validation on protected routes

## Risks & Trade-offs

### Risk: Separate User System
**Issue**: Maintaining separate admin_users table
**Mitigation**: Clear separation of concerns, prevents accidental admin privilege elevation

### Risk: JWT Token Security
**Issue**: Token theft or misuse
**Mitigation**: httpOnly cookies, HTTPS only, short expiration times

### Risk: Admin Account Compromise
**Issue**: Admin credentials leaked or account compromised
**Mitigation**: Strong password requirements, login attempt limits, audit logging (Phase 2)

## Migration Plan

### Phase 1: Initial Setup (Current)
1. Create Prisma schema for admin_users and admin_permissions
2. Build login page UI
3. Implement authentication API endpoints
4. Set up middleware for route protection
5. Create admin layout and dashboard stub

### Phase 2: Future Enhancements
1. MFA (multi-factor authentication)
2. Advanced permission management
3. Admin action audit logging
4. User/content management features
5. Settings and analytics dashboard

## Open Questions

- Should we implement rate limiting on login attempts?
- What should the default admin user creation process be?
- Do we need separate audit logs for admin actions?
- Should admin sessions be device-specific?
