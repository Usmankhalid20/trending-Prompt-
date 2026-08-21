# Authentication & Authorization System Context — AI Prompt Hub

## 1. Purpose

Build a secure, production-ready authentication and authorization system for AI Prompt Hub.

The system must support:

- User registration and login
- Creator registration and approval
- Creator login and Creator Portal access
- Admin authentication
- Super Admin authentication
- Role-Based Access Control (RBAC)
- Permission-based Admin access
- Secure sessions
- Protected routes
- Prompt approval workflow
- Account status management

The authentication and authorization system must be reusable, dynamic, scalable, and secure.

---

# 2. User Roles

The platform has four main roles:

````text
USER
CREATOR
ADMIN
SUPER_ADMIN

3. User

A User is a normal registered platform user.

User Can
Register
Login
Logout
Manage profile
Access User Portal
Browse approved prompts
View prompt details
Use platform features available to users
User Cannot
Access Creator Portal
Access Admin Dashboard
Approve creators
Approve prompts
Manage users
Manage administrators
Change permissions
User Flow
User
 ↓
Register
 ↓
Account Created
 ↓
Login
 ↓
User Portal
4. Creator

A Creator is a user who wants to submit AI prompts to the platform.

Creators can register themselves, but they must be approved by an Admin before they can use Creator Portal functionality.

Creator Can
Register
Login after approval
Logout
Manage profile
Access Creator Portal
Create prompts
Save prompt drafts
Edit their own prompts
Submit prompts for review
View prompt status
Edit rejected prompts
View submission history
Creator Cannot
Approve themselves
Approve prompts
Publish prompts directly
Manage users
Manage administrators
Change permissions
Access Admin Dashboard
5. Creator Registration & Approval

Creator registration must use an approval workflow.

Creator
   ↓
Register
   ↓
Creator Application Created
   ↓
Status: PENDING
   ↓
Admin Review
   ↓
 ┌───────────────┐
 │               │
 ▼               ▼
APPROVED       REJECTED
 │               │
 ▼               ▼
Creator        Cannot use
Portal         Creator Portal
Access

A Creator must not receive Creator Portal access while their account is pending.

6. Creator Account Status

Creator accounts should support:

pending
approved
rejected
suspended
Pending

Creator registration is waiting for Admin approval.

Approved

Creator can login and access Creator Portal.

Rejected

Creator cannot use Creator Portal functionality.

Suspended

Creator access is disabled by an authorized Admin/Super Admin.

7. Creator Prompt Workflow

Creators submit prompts for Admin review.

Creator
   ↓
Create Prompt
   ↓
Draft
   ↓
Submit for Review
   ↓
Pending
   ↓
Admin Review
   ↓
 ┌───────────────┐
 │               │
 ▼               ▼
Approved       Rejected
 │               │
 ▼               ▼
Published      Creator
Prompt         Can Edit
 │
 ▼
User Portal

Creators cannot directly publish prompts.

Only authorized Admins or Super Admin can approve/publish prompts.

8. Prompt Ownership

Creators can only manage their own prompts.

Example:

Creator A
   ↓
Can edit Creator A prompts


Creator B
   ↓
Cannot edit Creator A prompts

Ownership must be checked on the backend/API.

Never rely only on frontend restrictions.

9. Admin

Admins manage platform content and moderation.

Admins cannot publicly register.

Only Super Admin can create Admin accounts.

Admin access is controlled through permissions.

Admin Can Be Allowed To
View users
Manage users
Approve creators
Reject creators
View creators
Suspend creators
View prompts
Approve prompts
Reject prompts
Publish prompts
Edit prompts
Delete prompts
Manage categories

The exact capabilities depend on permissions assigned by Super Admin.

10. Admin Creation

Admins must never be created through public registration.

Only Super Admin can create an Admin.

Super Admin
     ↓
Create Admin
     ↓
Assign Role
     ↓
Assign Permissions
     ↓
Admin Account Created
     ↓
Admin Login
     ↓
Admin Dashboard

Public routes must never allow:

/register → ADMIN
/register → SUPER_ADMIN
11. Super Admin

Super Admin is the highest-level platform role.

Super Admin has complete administrative control.

Super Admin Can
Create Admins
Disable Admins
Manage Admin accounts
Assign Admin permissions
Remove Admin permissions
Approve creators
Reject creators
Suspend creators
Manage users
Manage prompts
Approve prompts
Reject prompts
Publish prompts
Manage categories
Manage platform settings
Review security-related activity
Manage access control

Super Admin cannot be created through public registration.

12. Admin Permissions

Do not create unnecessary Admin roles.

Use permissions instead.

Example permissions:

user.view
user.manage
user.suspend


creator.view
creator.approve
creator.reject
creator.suspend


prompt.view
prompt.create
prompt.edit
prompt.delete
prompt.approve
prompt.reject
prompt.publish


category.view
category.create
category.edit
category.delete


admin.create
admin.manage
admin.permissions

Super Admin controls which permissions each Admin receives.

13. Example Admin Permission Structure

Admin A:

ADMIN
├── creator.view
├── creator.approve
├── creator.reject
├── prompt.view
└── prompt.approve

Admin B:

ADMIN
├── prompt.view
├── prompt.edit
├── prompt.delete
├── category.view
└── category.edit

Admin C:

ADMIN
├── user.view
├── user.manage
└── user.suspend

This allows the platform to scale without creating unnecessary roles.

14. Authentication

Use secure authentication architecture.

Preferred technologies:

Scrypt for password hashing
JOSE for JWT/session handling
HTTP-only cookies
Secure cookies in production
SameSite cookie protection
HTTPS in production

Never store plain-text passwords.

Never expose sensitive authentication tokens unnecessarily to client-side JavaScript.

15. User Registration

Route:

/register

API:

POST /api/auth/register

Flow:

User
 ↓
Registration Form
 ↓
Validate Input
 ↓
Check Existing Account
 ↓
Hash Password
 ↓
Create User
 ↓
Create Session
 ↓
User Portal
16. Creator Registration

Creators use the registration system to apply for a Creator account.

Flow:

Creator
 ↓
Registration
 ↓
Select Creator / Apply as Creator
 ↓
Validate Data
 ↓
Create Account
 ↓
Status: PENDING
 ↓
Admin Review

The creator must not automatically receive Creator Portal access.

17. User Login

Route:

/login

Flow:

User
 ↓
Login
 ↓
Validate Credentials
 ↓
Check Account Status
 ↓
Create Session
 ↓
/dashboard
18. Creator Login

Creators may login only after approval.

Flow:

Creator
 ↓
Login
 ↓
Validate Credentials
 ↓
Check Role
 ↓
Check Creator Status
 ↓
Is Approved?
 ├── NO → Access Denied / Pending State
 │
 └── YES
       ↓
   Create Session
       ↓
   /creator
19. Admin Login

Admin login should use:

/admin/login

Flow:

Admin
 ↓
Admin Login
 ↓
Validate Credentials
 ↓
Check Role
 ↓
Check Account Status
 ↓
Load Permissions
 ↓
Create Session
 ↓
/admin
20. Super Admin Login

Super Admin uses the administrator authentication system.

Flow:

Super Admin
 ↓
/admin/login
 ↓
Validate Credentials
 ↓
Verify SUPER_ADMIN role
 ↓
Create Session
 ↓
/admin

Super Admin must have the highest authorization level.

21. Authentication vs Authorization

Authentication answers:

Who are you?

Authorization answers:

What are you allowed to do?

Example:

Creator
 ↓
Authenticated
 ↓
Can access Creator Portal
 ↓
Can create own prompt
 ↓
Cannot approve prompt

Authentication alone is not enough.

Authorization must be checked for protected actions.

22. RBAC

Use Role-Based Access Control for major access levels.

Roles:

USER
CREATOR
ADMIN
SUPER_ADMIN

Roles determine the general area of the application the user can access.

23. Permission-Based Authorization

Permissions control specific Admin functionality.

Example:

ADMIN
   ↓
Check Permission
   ↓
prompt.approve
   ↓
Allowed

Without the permission:

ADMIN
   ↓
Check Permission
   ↓
prompt.approve
   ↓
403 Forbidden
24. Route Structure

Recommended route structure:

/
├── /explore
├── /login
├── /register
│
├── /dashboard
│   └── User Portal
│
├── /creator
│   ├── /dashboard
│   ├── /prompts
│   ├── /prompts/create
│   ├── /prompts/[id]
│   └── /profile
│
└── /admin
    ├── /login
    ├── /dashboard
    ├── /users
    ├── /creators
    ├── /prompts
    ├── /categories
    ├── /admins
    └── /settings

Every protected route must verify authentication and authorization.

25. Access Rules
Guest

Can access:

/
 /explore
 /login
 /register
User

Can access:

/dashboard
Approved Creator

Can access:

/creator
Pending Creator

Cannot access Creator Portal functionality.

Admin

Can access:

/admin

according to assigned permissions.

Super Admin

Can access all administrative functionality.

26. Account Status

User/Admin accounts should support appropriate account states.

Example:

active
suspended
disabled

Creator accounts additionally use:

pending
approved
rejected

Suspended or disabled accounts must not be able to access protected functionality.

27. Session Security

Sessions must:

Use HTTP-only cookies
Use Secure cookies in production
Use appropriate SameSite configuration
Have expiration
Validate sessions server-side
Support logout
Reject expired sessions
Reject invalid sessions

Do not rely on localStorage for sensitive authentication tokens.

28. Security Requirements

The authentication system must protect against:

Brute-force login attempts
Password attacks
Session theft
Invalid tokens
Expired sessions
Privilege escalation
Unauthorized API access
Creator approval bypass
Prompt approval bypass
Admin privilege escalation
IDOR/resource ownership issues
CSRF where applicable
Invalid input
Rate-limit abuse

Never trust role or permission information supplied by the client.

Roles and permissions must come from trusted server-side data.

29. Authorization Must Be Server-Side

Frontend restrictions are for UX only.

For example, hiding:

Approve Prompt

from a Creator is NOT a security mechanism.

The backend must also check:

Is authenticated?
        ↓
Is correct role?
        ↓
Has required permission?
        ↓
Is resource accessible?
        ↓
Allow request
30. API Authorization

Every protected API endpoint must verify:

Authentication
User role
Required permission
Resource ownership where applicable
Account status

Example:

POST /api/prompts/:id/approve


Authentication
      ↓
Authenticated?
      ↓
Admin/Super Admin?
      ↓
prompt.approve permission?
      ↓
Approve

Creator requests to this endpoint must be rejected.

31. Authentication Error Codes

Use appropriate HTTP status codes:

400 → Invalid request
401 → Not authenticated
403 → Authenticated but not authorized
404 → Resource not found
409 → Account/data conflict
429 → Too many requests
500 → Unexpected server error

Do not expose sensitive authentication information through error messages.

32. Login Redirect Rules
User
/login
 ↓
/dashboard
Approved Creator
/login
 ↓
/creator
Pending Creator
/login
 ↓
Pending Approval State
Admin
/admin/login
 ↓
/admin
Super Admin
/admin/login
 ↓
/admin
33. Creator → Admin → User Workflow

The complete platform workflow is:

                    CREATOR
                       │
                       ▼
                   Register
                       │
                       ▼
                    Pending
                       │
                       ▼
                  ADMIN REVIEW
                       │
                ┌──────┴──────┐
                │             │
             Approve        Reject
                │
                ▼
         Creator Portal
                │
                ▼
          Create Prompt
                │
                ▼
          Submit Prompt
                │
                ▼
             Pending
                │
                ▼
           ADMIN REVIEW
                │
          ┌─────┴─────┐
          │           │
       Approve      Reject
          │           │
          ▼           ▼
      Published    Creator
          │         Edits
          ▼
      User Portal
34. Super Admin Workflow
                    SUPER ADMIN
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
         Admins       Creators      Users
            │            │
            ▼            ▼
       Permissions    Approval
            │            │
            ▼            ▼
       Admin Access   Prompt Review
                         │
                         ▼
                    Published
                         │
                         ▼
                    User Portal
35. Reusable Authentication Architecture

Authentication logic must be reusable.

Create reusable systems for:

Login
Registration
Logout
Session validation
Password hashing
Password verification
Role checking
Permission checking
Route protection
API authorization
Account status checking
Authentication error handling

Do not duplicate authentication logic between User, Creator, Admin, and Super Admin.

36. Dynamic Data

Authentication and authorization data must be dynamic.

Do not hardcode:

Users
Creators
Admins
Roles
Permissions
Account statuses
Creator approvals
Prompt ownership

These values must come from the database/server.

Static values may be used for predefined system roles and permission definitions where appropriate.

37. UI/UX Requirements

Authentication interfaces should be:

Modern
Minimal
Professional
Responsive
Accessible
Consistent with the main platform design

Create reusable:

Login Form
Registration Form
Password Input
Validation Messages
Loading State
Error State
Success State
Account Status State

Creator approval should have a clear UI showing:

Pending Approval
Approved
Rejected
Suspended

Admin interfaces should clearly communicate:

Creator status
Prompt status
Admin permissions
Account status
38. Production Requirements

Before considering authentication production-ready, verify:

TypeScript passes
ESLint passes
Production build passes
Authentication works
Registration works
Creator approval works
Creator login restriction works
Admin login works
Super Admin access works
Permissions work
Protected routes work
Protected APIs work
Ownership checks work
Session expiration works
Logout works
Unauthorized requests return correct status codes
No sensitive credentials are exposed
39. Important Security Rules

Never allow:

Public Admin Registration
Public Super Admin Registration
Creator Self Approval
Creator Prompt Self Approval
Creator Direct Publishing
Client-Side-Only Authorization
Client-Controlled Permissions
Client-Controlled Roles

All critical authorization decisions must happen server-side.

40. Final Authentication Architecture
                         AI PROMPT HUB
                              │
                              ▼
                    AUTHENTICATION SYSTEM
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
        USER              CREATOR              ADMIN
          │                   │                   │
      Register            Register          Created by
          │                   │             Super Admin
          ▼                   ▼                   │
        Login              Pending               ▼
          │                   │              Admin Login
          ▼                   ▼                   │
    User Portal         Admin Review              ▼
                              │              Admin Portal
                         ┌────┴────┐
                         │         │
                      Approve    Reject
                         │
                         ▼
                  Creator Portal
                         │
                         ▼
                  Create Prompt
                         │
                         ▼
                   Submit Prompt
                         │
                         ▼
                    Admin Review
                         │
                    ┌────┴────┐
                    │         │
                 Approve    Reject
                    │         │
                    ▼         ▼
                Published   Creator
                    │        Edits
                    ▼
                User Portal




                         SUPER ADMIN
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
           Admins          Creators         Users
              │               │
              ▼               ▼
        Permissions        Approval
              │               │
              └───────┬───────┘
                      ▼
                Platform Control
41. Scope

This authentication system currently includes:

User authentication
Creator authentication
Creator approval
Creator Portal access control
Prompt submission authorization
Admin authentication
Admin creation by Super Admin
Admin permissions
Super Admin authorization
RBAC
Server-side authorization
Protected routes
Protected APIs
Session security
Account status management

Do NOT add unrelated features such as:

Payments
Subscriptions
Notifications
Chat
Messaging
Social networking
Followers
Advanced analytics
Unrequested integrations

Only implement features required by the current AI Prompt Hub product.



### One important architectural decision


I would keep **one authentication system**, not create completely separate authentication implementations for User, Creator, Admin, and Super Admin.


The roles should live within the same authentication/authorization architecture:


```text
Authentication
      │
      ├── USER
      ├── CREATOR
      ├── ADMIN
      └── SUPER_ADMIN
````
