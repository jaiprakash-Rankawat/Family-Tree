# FamilyTree - Replit Project Documentation

## Overview

This is a production-ready collaborative family tree builder web application built with Next.js 14 (App Router), TypeScript, React Flow, Prisma, PostgreSQL, and NextAuth. The application allows users to create, visualize, and share family trees with an intuitive visual interface featuring generation-based layouts, person profiles with privacy controls, and real-time collaboration.

**Current State**: MVP implemented with core features working:
- ✅ Landing page with authentication
- ✅ Dashboard with tree management  
- ✅ Interactive React Flow tree viewer
- ✅ Person nodes with photos and dates
- ✅ Relationship edges with labels
- ✅ Generation-based auto-layout
- ✅ Person detail/edit modals
- ✅ Add person functionality
- ✅ Real-time search with highlighting
- ✅ Zoom/pan controls
- ⏳ Export (PDF/PNG) - planned
- ⏳ Advanced sharing features - planned
- ⏳ Add relationship modal - planned

## Recent Changes

**2024-11-18**: Complete MVP implementation
- Initialized Next.js 14 project with TypeScript and Tailwind CSS
- Set up PostgreSQL database with Prisma ORM
- Configured NextAuth with email (magic link) and Google OAuth providers
- Created comprehensive Prisma schema (User, Tree, Person, Relationship, Collaboration)
- Built landing page with marketing copy and signup/login flows
- Implemented dashboard with tree CRUD operations
- Created React Flow tree canvas with custom Person nodes and Relationship edges
- Implemented generation-based layout algorithm for automatic positioning
- Built Person detail modal with full profile fields and medical data consent
- Created Add Person modal with validation
- Integrated all modals with tree canvas (node clicks, toolbar buttons)
- Created API routes for trees and people (GET, POST, PATCH, DELETE)
- Seeded database with sample 8-person family tree
- Fixed authentication issues (removed broken signOut page, added proper SignOutButton)
- Verified application runs successfully on port 5000

## User Preferences

None specified yet. The application follows standard Next.js and React best practices with:
- Server Components for performance
- Client Components only where interactivity is needed
- Tailwind CSS for utility-first styling
- TypeScript strict mode
- Clean, beginner-friendly UI design
- Large buttons and clear labels
- Privacy-first approach for sensitive data

## Project Architecture

### Frontend
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Visualization**: React Flow for family tree canvas
- **Forms**: React Hook Form + Zod validation
- **State**: React hooks (useState, useCallback, useRef)
- **Navigation**: Next.js Link and useRouter

### Backend
- **API**: Next.js Route Handlers (App Router API routes)
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Prisma 5 with schema-first approach
- **Authentication**: NextAuth.js with Prisma adapter
- **Providers**: Email (magic link), Google OAuth, Credentials

### Database Models
- **User**: email, password (hashed), name, OAuth accounts
- **Tree**: name, description, owner, collaborators
- **Person**: fullName, names, gender, dates, photos, medicalFlags, notes, privacy
- **Relationship**: from/to person, type (parent/spouse/sibling), label
- **Collaboration**: tree access with role (owner/editor/viewer/suggestor)

### File Structure
```
/app - Next.js App Router pages
  /api - API routes (auth, trees, people)
  /auth - Authentication pages (signin, signup)
  /dashboard - Dashboard and tree viewer pages
/components - React components (TreeCanvas, modals, buttons)
/lib - Utilities (auth config, Prisma client, layout algorithm)
/prisma - Schema and migrations
```

### Key Design Decisions

1. **React Flow for Visualization**: Chosen for performance, built-in interactions, and customization capabilities
2. **Generation-Based Layout**: Automatic positioning using parent-child relationships
3. **Server Components**: Default to server components for better performance
4. **Privacy-First**: Medical data requires explicit consent, all data private by default
5. **Role-Based Access**: Collaboration with different permission levels
6. **JWT Sessions**: For better scalability vs database sessions

## Dependencies

### Core
- next@^14.2.0
- react@^18.3.0
- reactflow@^11.11.0
- @prisma/client@^5.20.0
- next-auth@^4.24.0

### UI/Forms
- tailwindcss@^3.4.0
- lucide-react@^0.441.0
- react-hook-form@^7.53.0
- zod@^3.23.0

### Utils
- bcryptjs@^2.4.3
- date-fns@^4.1.0
- clsx, tailwind-merge

### Dev
- typescript@^5
- eslint, prettier
- prisma@^5.20.0
- tsx (for seed script)

## Environment Setup

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: Random secret for session encryption
- `EMAIL_SERVER_*`: SMTP configuration for magic links
- `GOOGLE_CLIENT_ID/SECRET`: OAuth credentials (optional)

The `.env.example` file provides templates for all required variables.

## Workflow

**Start application**:
- Command: `pnpm dev`
- Port: 5000
- Output: webview
- Status: Running successfully

## Testing Instructions

1. **Landing Page**: Navigate to `/` - should show marketing page with signup/login
2. **Authentication**: 
   - Use demo account: `demo@familytree.com` / `password123`
   - Or create new account at `/auth/signup`
3. **Dashboard**: After login, view trees, create new tree, delete owned trees
4. **Tree Viewer**: Click into "Smith Family Tree" to see interactive canvas
5. **Person Nodes**: Click any person node to view details
6. **Edit Person**: In person modal, click "Edit Profile" to modify
7. **Add Person**: Click "Add Person" button in toolbar
8. **Search**: Type in search box to find and highlight people
9. **Navigation**: Use mouse wheel to zoom, drag to pan, "Fit to View" button

## Known Issues

### UI/UX Issues
- **Person edit refresh**: After editing a person, page requires manual refresh to see changes in canvas (state not optimistically updated)
- **Medical flags data loss**: If consent toggle is unchecked during edit, existing medical flags may be lost
- **Add person refresh**: New people require page refresh to appear in canvas layout
- **Sibling/spouse relationships**: Reciprocal relationship records not created automatically

### Technical Debt
- Missing input validation on API routes (Zod schema validation needed)
- No error boundaries for React components
- LSP warnings about React UMD global references (non-breaking)
- Cross-origin warnings for Next.js dev server (expected in Replit environment)

## Next Steps

High priority features to implement:
1. **Add Relationship Modal**: UI for connecting people (parent, spouse, sibling)
2. **Export Functionality**: PDF and PNG export using html-to-image and jsPDF
3. **Share Tree Modal**: Send email invitations with role selection
4. **Shareable Links**: Generate token-based public/private links
5. **Suggested Changes**: Workflow for non-editors to propose edits
6. **ARIA Labels**: Accessibility improvements for screen readers
7. **Tests**: Jest + React Testing Library for core components
8. **JSON Export/Import**: Full tree backup and restore

## Deployment Notes

- Designed for Vercel deployment
- Works with any Node.js hosting (Railway, Render, etc.)
- Requires PostgreSQL database (Neon, Supabase, AWS RDS)
- Run `pnpm prisma migrate deploy` after deployment
- Set all environment variables in hosting dashboard
- Use HTTPS in production for OAuth and security

## Architecture Review Notes

**Architect Feedback (2024-11-18)**:
- ✅ Fixed broken logout (removed custom signOut page, added SignOutButton)
- ✅ Added EmailProvider for magic link authentication
- ✅ Wired modals to TreeCanvas (node clicks, toolbar buttons)
- ✅ Implemented update person API route
- ✅ Verified core functionality works end-to-end

**Remaining Concerns**:
- Performance optimization for very large trees (100+ people)
- Edge case handling in layout algorithm (orphaned nodes, circular relationships)
- Error boundaries for better error handling
- Loading states for async operations
