# FamilyTree - Build Your Family History

A production-ready collaborative family tree builder built with Next.js 14, React Flow, Prisma, and NextAuth. Create, visualize, and share your family history with an intuitive visual interface.

![FamilyTree App](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![React Flow](https://img.shields.io/badge/React%20Flow-11-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

## Features

### Core Functionality
- **Interactive Family Tree Canvas**: Visual tree builder with React Flow
- **Custom Person Nodes**: Photo thumbnails, names, and birth/death dates
- **Relationship Visualization**: Labeled edges showing parent, spouse, sibling relationships
- **Generation-Based Layout**: Automatic vertical positioning by generation with horizontal sibling arrangement
- **Zoom & Pan Controls**: Mouse-wheel zoom, buttons, fit-to-view, and reset
- **Real-time Search**: Typeahead search with node centering and highlighting

### Person Management
- **Detailed Profiles**: Full name, dates, photos, notes, and medical information
- **Privacy Controls**: Consent-based medical information sharing
- **Easy Editing**: Click-to-edit person details with inline forms
- **Add People**: Step-by-step modal for adding new family members

### Collaboration
- **Tree Sharing**: Share trees with family members
- **Role-Based Permissions**: Owner, Editor, Viewer, Suggestor roles
- **Multi-User Support**: Multiple users can work on the same tree

### Authentication & Security
- **NextAuth Integration**: Email magic links and Google OAuth
- **Secure Sessions**: JWT-based session management
- **Protected Routes**: Middleware-based route protection
- **Password Hashing**: bcrypt for credential security

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript 5
- **Styling**: Tailwind CSS 3
- **Visualization**: React Flow 11
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 5
- **Authentication**: NextAuth.js 4
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 20+ and pnpm
- PostgreSQL database (or use Neon serverless)
- SMTP server for email authentication (optional)
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd familytree
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/familytree"

   # NextAuth
   NEXTAUTH_URL="http://localhost:5000"
   NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"

   # Email Provider (for magic link auth)
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-email"
   EMAIL_SERVER_PASSWORD="your-password"
   EMAIL_FROM="noreply@familytree.com"

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. Generate Prisma client and run migrations:
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

5. Seed the database with sample data:
   ```bash
   pnpm prisma:seed
   ```

   This creates:
   - Demo user: `demo@familytree.com` / `password123`
   - Sample family tree with 8 people and realistic relationships

6. Start the development server:
   ```bash
   pnpm dev
   ```

7. Open [http://localhost:5000](http://localhost:5000) in your browser

## Project Structure

```
familytree/
├── app/                      # Next.js App Router pages
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   └── trees/          # Tree & people CRUD APIs
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard & tree viewer
│   └── page.tsx            # Landing page
├── components/              # React components
│   ├── TreeCanvas.tsx      # Main tree visualization
│   ├── PersonNode.tsx      # Custom person node
│   ├── RelationshipEdge.tsx # Custom edge component
│   ├── PersonModal.tsx     # Person detail/edit modal
│   └── AddPersonModal.tsx  # Add person modal
├── lib/                     # Utility functions
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
│   ├── layout.ts           # Tree layout algorithm
│   └── utils.ts            # Helper functions
├── prisma/                  # Database schema & migrations
│   ├── schema.prisma       # Prisma schema
│   └── seed.ts             # Database seed script
└── middleware.ts            # Route protection middleware
```

## Database Schema

### Main Models

- **User**: Authentication and user accounts
- **Tree**: Family tree container
- **Person**: Individual family members
- **Relationship**: Connections between people (parent, spouse, sibling)
- **Collaboration**: Tree sharing and permissions

See `prisma/schema.prisma` for the complete schema.

## Usage Guide

### Creating Your First Tree

1. Sign up or sign in
2. Click "Create Tree" on the dashboard
3. Enter a name and optional description
4. Click into your new tree

### Adding People

1. Click "Add Person" button in the tree viewer
2. Fill in the person's details (name, dates, etc.)
3. Submit to add to the tree

### Viewing & Editing

- **Click any person node** to view their full profile
- **Edit button** (owners/editors only) to modify details
- **Medical information** requires explicit consent to share

### Searching

- Type in the search box to find people
- Matching nodes will be centered and highlighted
- Clear search to return to normal view

### Navigation

- **Mouse wheel** or **pinch** to zoom
- **Click and drag** to pan
- **Fit to View** button to see entire tree
- **Controls** panel for zoom in/out and reset

## Development

### Available Scripts

```bash
pnpm dev          # Start development server (port 5000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run database migrations
pnpm prisma:seed      # Seed database with sample data
pnpm prisma:studio    # Open Prisma Studio
```

### Code Quality

- **ESLint**: Configured with Next.js recommended rules
- **Prettier**: Auto-formatting with Tailwind class sorting
- **TypeScript**: Strict mode enabled
- **Git Hooks**: Pre-commit linting (optional)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

Vercel automatically detects Next.js and configures:
- Build command: `pnpm build`
- Output directory: `.next`
- Install command: `pnpm install`

### Environment Variables for Production

Make sure to set all required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your production URL
- `NEXTAUTH_SECRET`: Generate a new secret for production
- Email/OAuth credentials if using those features

### Database Setup

For production, use a managed PostgreSQL service:
- **Neon**: Serverless PostgreSQL (recommended for Vercel)
- **Supabase**: PostgreSQL + additional features
- **Railway**: Simple PostgreSQL hosting
- **AWS RDS**: Enterprise-grade PostgreSQL

Run migrations after deployment:
```bash
pnpm prisma migrate deploy
```

## Architecture Decisions

### Why React Flow?
- Performant rendering of large graphs
- Built-in zoom, pan, and interaction handling
- Customizable nodes and edges
- Active community and excellent documentation

### Why Next.js App Router?
- Server Components for better performance
- Built-in API routes
- File-based routing
- Excellent TypeScript support

### Why Prisma?
- Type-safe database access
- Automatic migration generation
- Great developer experience
- Works well with PostgreSQL

## Future Enhancements

Features not yet implemented (see roadmap):
- [ ] **Shareable Links**: Token-based tree sharing
- [ ] **Suggested Changes**: Non-editor workflow for proposing edits
- [ ] **Export PDF/PNG**: Client-side canvas export
- [ ] **CSV Import**: Bulk person import
- [ ] **GEDCOM Support**: Standard genealogy format
- [ ] **Server-side PDF**: Large tree export
- [ ] **Internationalization**: Multi-language support
- [ ] **Unit Tests**: Jest + React Testing Library
- [ ] **Advanced Relationships**: Guardian, adopted types
- [ ] **Analytics**: Usage tracking and insights

## Privacy & Security

- All personal data is private by default
- Medical information requires explicit consent
- Role-based access control for collaborators
- Secure password hashing with bcrypt
- Session management via NextAuth
- HTTPS recommended for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Visualizations by [React Flow](https://reactflow.dev/)
- Database by [Prisma](https://www.prisma.io/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Icons by [Lucide](https://lucide.dev/)

---

Made with ❤️ for preserving family histories
