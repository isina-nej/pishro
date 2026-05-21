# Admin Authentication API Specification

## ADDED Requirements

### Login Endpoint
A POST endpoint at /api/admin/login SHALL authenticate admin users and return JWT tokens.

Request body:
- email (required, string): Admin user email
- password (required, string): Admin user password
- rememberMe (optional, boolean): Extended session duration

Response on success (200):
- accessToken (string): JWT token for subsequent requests
- user (object): User details (id, email, name, role)
- expiresIn (number): Token expiration time in seconds

Response on failure (401):
- error (string): Error message
- code (string): Error code (invalid_credentials, account_inactive, etc.)

#### Acceptance Criteria
- WHEN valid credentials provided THEN endpoint returns 200 with accessToken
- WHEN invalid credentials provided THEN endpoint returns 401 with error message
- WHEN account is inactive THEN endpoint returns 401 with account_inactive error
- WHEN rate limit exceeded THEN endpoint returns 429 with rate_limit_exceeded error

### Logout Endpoint
A POST endpoint at /api/admin/logout SHALL invalidate the current session.

Response on success (200):
- message: "Logged out successfully"

#### Acceptance Criteria
- WHEN authenticated request made THEN logout clears session token
- WHEN user tries to access protected routes after logout THEN returns 401
- WHEN unauthenticated request made to logout THEN returns 200 (idempotent)

### Current User Endpoint
A GET endpoint at /api/admin/me SHALL return current authenticated admin user information.

Response on success (200):
- id (string): User ID
- email (string): User email
- name (string): User full name
- role (string): User role (admin, moderator, viewer)
- permissions (array): List of permitted resources

Response on failure (401):
- error: "Unauthorized"

#### Acceptance Criteria
- WHEN valid JWT token provided THEN endpoint returns current user data
- WHEN invalid or expired token provided THEN returns 401 Unauthorized
- WHEN no token provided THEN returns 401 Unauthorized

### Token Refresh Endpoint
A POST endpoint at /api/admin/refresh SHALL issue a new access token.

Request body: (empty, token in cookie)

Response on success (200):
- accessToken (string): New JWT token
- expiresIn (number): New token expiration time

Response on failure (401):
- error: "Unauthorized"

#### Acceptance Criteria
- WHEN valid refresh token provided THEN returns new access token
- WHEN refresh token expired THEN returns 401 and requires re-login
- WHEN token is valid THEN new token has full 24-hour expiration

### Password Requirements
All admin authentication endpoints SHALL enforce password security:
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character

#### Acceptance Criteria
- WHEN weak password provided THEN login fails with password_requirements error
- WHEN strong password provided THEN login succeeds
- WHEN password contains special chars and uppercase THEN password is accepted

