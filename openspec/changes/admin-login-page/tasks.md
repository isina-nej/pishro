# Admin Panel Login Page - Implementation Tasks

## 1. Database Schema Setup

- [ ] 1.1 Add admin_users table to Prisma schema with fields: id, email, password_hash, name, role, status, created_at, updated_at, last_login_at
- [ ] 1.2 Add admin_permissions table to Prisma schema with fields: id, role, permission, resource
- [ ] 1.3 Create Prisma migration for new admin tables
- [ ] 1.4 Run Prisma migration to update database
- [ ] 1.5 Create seed script to insert default admin user (admin@pishrosarmaye.com)

## 2. Backend Authentication API

- [ ] 2.1 Create /api/admin/login route with POST handler for credential validation
- [ ] 2.2 Implement password hashing using bcrypt for admin users
- [ ] 2.3 Generate JWT tokens with 24-hour expiration on successful login
- [ ] 2.4 Set JWT tokens in httpOnly cookies for session management
- [ ] 2.5 Create /api/admin/logout route that clears session cookies
- [ ] 2.6 Create /api/admin/me route to return current authenticated admin user
- [ ] 2.7 Create /api/admin/refresh route for token refresh functionality
- [ ] 2.8 Implement rate limiting for login attempts (max 5 per 15 minutes)

## 3. Authentication Utilities

- [ ] 3.1 Create utility function to verify JWT tokens
- [ ] 3.2 Create utility function to check admin user permissions
- [ ] 3.3 Create authentication context/hook for client-side admin user state
- [ ] 3.4 Add helper functions for password strength validation
- [ ] 3.5 Create error handling middleware for auth-related errors

## 4. Admin Layout & Routes

- [ ] 4.1 Create app/admin directory structure
- [ ] 4.2 Create app/admin/layout.tsx for admin panel wrapper
- [ ] 4.3 Set up admin route group with proper middleware protection
- [ ] 4.4 Create app/admin/login/page.tsx component
- [ ] 4.5 Create app/admin/dashboard/page.tsx component (stub)

## 5. Login Page UI

- [ ] 5.1 Create AdminLoginForm component with email and password inputs
- [ ] 5.2 Add form validation for email format and password requirements
- [ ] 5.3 Implement error message display for login failures
- [ ] 5.4 Add loading state indicator on login button
- [ ] 5.5 Create Remember me checkbox functionality
- [ ] 5.6 Style login page with Tailwind CSS
- [ ] 5.7 Implement dark mode support for login page
- [ ] 5.8 Make login form responsive for mobile devices
- [ ] 5.9 Add Pishro Sarmaye branding/logo to login page

## 6. Route Protection Middleware

- [ ] 6.1 Create middleware to check JWT token on protected admin routes
- [ ] 6.2 Implement role-based access control (RBAC) in middleware
- [ ] 6.3 Redirect unauthenticated users from admin routes to /admin/login
- [ ] 6.4 Redirect authenticated users away from /admin/login to /admin/dashboard
- [ ] 6.5 Handle expired token scenarios with appropriate redirects

## 7. Admin User Management (Backend)

- [ ] 7.1 Create database query function to find admin user by email
- [ ] 7.2 Create function to verify password against stored hash
- [ ] 7.3 Create function to update last_login_at timestamp
- [ ] 7.4 Create function to check if admin account is active/suspended
- [ ] 7.5 Add validation for account status before allowing login

## 8. Server Actions & Client-Side Auth

- [ ] 8.1 Create server action for login form submission
- [ ] 8.2 Create server action for logout functionality
- [ ] 8.3 Implement client-side state management for logged-in admin user
- [ ] 8.4 Create hook to check if user is authenticated admin
- [ ] 8.5 Create hook to get current admin user data

## 9. Admin Dashboard

- [ ] 9.1 Create dashboard header component with admin branding
- [ ] 9.2 Create sidebar navigation component
- [ ] 9.3 Implement navigation items based on user role permissions
- [ ] 9.4 Create user profile dropdown menu in header
- [ ] 9.5 Add logout button to profile menu
- [ ] 9.6 Create welcome message section with user name
- [ ] 9.7 Add last login time display
- [ ] 9.8 Create placeholder sections for future dashboard features

## 10. Security & Hardening

- [ ] 10.1 Add CSRF protection to login endpoint
- [ ] 10.2 Implement secure cookie settings (secure, sameSite flags)
- [ ] 10.3 Add input sanitization for email and password fields
- [ ] 10.4 Validate all API inputs with schema validation
- [ ] 10.5 Add logging for admin login attempts
- [ ] 10.6 Implement account lockout after failed login attempts

## 11. Environment Configuration

- [ ] 11.1 Add JWT_SECRET to environment variables
- [ ] 11.2 Configure JWT expiration time (JWT_EXPIRES_IN)
- [ ] 11.3 Add database connection string for admin operations
- [ ] 11.4 Configure admin subdomain routing (admin.pishrosarmaye.com)
- [ ] 11.5 Set up environment variables for rate limiting

## 12. Testing & Validation

- [ ] 12.1 Test login with valid credentials
- [ ] 12.2 Test login with invalid email
- [ ] 12.3 Test login with incorrect password
- [ ] 12.4 Test login with inactive/suspended account
- [ ] 12.5 Test rate limiting on repeated failed attempts
- [ ] 12.6 Test JWT token expiration and refresh
- [ ] 12.7 Test protected route access without token
- [ ] 12.8 Test logout functionality clears session
- [ ] 12.9 Test dark mode styling on login page
- [ ] 12.10 Test mobile responsiveness of login form
- [ ] 12.11 Test admin dashboard access control by role
- [ ] 12.12 Test navigation menu items visibility by role

## 13. Documentation & Handover

- [ ] 13.1 Document admin login flow in README
- [ ] 13.2 Document API endpoints in dev documentation
- [ ] 13.3 Document environment variable requirements
- [ ] 13.4 Create admin setup guide for initial deployment
- [ ] 13.5 Document default admin credentials handling
