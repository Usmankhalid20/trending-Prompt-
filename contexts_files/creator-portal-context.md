# Creator Portal Context

## Purpose

The Creator Portal allows registered creators to create, manage, and submit AI prompts for admin review.

Creators can manage their own prompts, but they cannot directly publish prompts.

## Creator Authentication

Creators can:

- Register
- Login
- Logout
- Manage Profile
- Update Account Settings

Creator accounts are separate from Admin accounts.

## Creator Dashboard

The dashboard should show:

- Total Prompts
- Drafts
- Pending Prompts
- Approved Prompts
- Rejected Prompts

All dashboard data should be dynamic.

## Prompt Management

Creators can:

- Create Prompt
- Save Draft
- Edit Draft
- Submit Prompt
- Edit Rejected Prompt
- Delete Draft
- View Prompt Status
- View Submission History

## Prompt Workflow

```text
Creator
   ↓
Create Prompt
   ↓
Save Draft
   ↓
Submit for Review
   ↓
Pending
   ↓
Admin Review
   ↓
Approve / Reject
   ↓
Approved
   ↓
Visible in User Portal
```

## Prompt Status

- Draft
- Pending
- Approved
- Rejected
- Published
- Archived

## Admin Approval

Creators cannot:

- Approve their own prompts
- Publish directly
- Change approval status
- Bypass admin review
- Modify another creator's prompts

Only authorized Admin/Super Admin users can approve or publish prompts.

## Prompt Data

Each prompt should support:

- Title
- Prompt Content
- Description
- Category
- Tags
- Image
- Creator
- Status
- Created Date
- Updated Date

Only fields required by the current product should be implemented.

## Creator Profile

Creator profile should contain:

- Name
- Profile Image
- Bio
- Submitted Prompts
- Approved Prompts

Only appropriate creator information should be publicly exposed.

## User Portal Integration

Approved prompts should automatically become available to users through the User Portal.

Users should only see prompts that meet the publishing/visibility rules defined by the Admin.

Rejected, draft, and pending prompts must never appear to users.

## Requirements

- Dynamic data
- Protected creator routes
- Role-based authorization
- Reusable components
- Reusable prompt forms
- Server-side validation
- Responsive UI
- Loading states
- Error states
- Empty states
- Pagination where required
- Search/filtering where required

## UI/UX

The Creator Portal should feel like a modern content-management workspace.

Focus on:

- Simple navigation
- Clear prompt status
- Easy submission workflow
- Clean forms
- Clear feedback
- Responsive design
- Consistent design system

Use the existing project design system instead of creating a separate visual language.

## Scope

Implement only the creator functionality required for:

- Creator authentication
- Creator dashboard
- Prompt creation
- Draft management
- Prompt submission
- Submission status
- Admin approval workflow
- Approved prompt visibility

Do not add payments, subscriptions, notifications, messaging, social features, or other features outside the current product scope.
