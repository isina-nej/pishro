# Admin Role-Based Permissions Specification

## ADDED Requirements

### Admin Roles
The system SHALL support three role levels with escalating permissions:

#### Admin Role
Full system access, all permissions granted.

#### Moderator Role
Limited content and user management permissions.
- Can view all users
- Can moderate content
- Cannot modify other admins
- Cannot access system settings

#### Viewer Role
Read-only access to dashboard and reports.
- Can view dashboard
- Can view reports
- Cannot modify any data
- Cannot access user management

#### Acceptance Criteria
- WHEN user has admin role THEN all API endpoints are accessible
- WHEN user has moderator role THEN content endpoints are accessible but settings are blocked
- WHEN user has viewer role THEN only GET endpoints for dashboard are accessible

### Permission Assignment
Admin users SHALL have permissions assigned based on their role:
- Role assigned at user creation
- Role can be modified by admin users only
- Each role has predefined permission set

#### Acceptance Criteria
- WHEN admin creates new user THEN role must be selected
- WHEN role is changed THEN permissions immediately take effect
- WHEN non-admin user tries to change role THEN request is denied

### Access Control
Protected admin routes SHALL validate user permissions before allowing access:
- Middleware checks JWT token
- Middleware verifies user role and permissions
- Request denied if permissions insufficient

#### Acceptance Criteria
- WHEN authenticated user accesses /admin/dashboard THEN user is allowed regardless of role
- WHEN user with viewer role accesses /admin/users/edit THEN request is denied
- WHEN user with admin role accesses /admin/users/edit THEN request is allowed

### Default Admin User
An initial admin user SHALL be created during setup with:
- Email: admin@pishrosarmaye.com (or configurable)
- Role: admin
- Password: Must be changed on first login

#### Acceptance Criteria
- WHEN system is first deployed THEN default admin can log in
- WHEN default admin logs in THEN password change is required
- WHEN new password is set THEN default password is invalidated

