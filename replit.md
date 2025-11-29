# The Dude Abides Shop

## Overview

This is an e-commerce web application built as a merchandise store for "The Dude Abides" brand. The application is a full-stack solution featuring a React-based frontend with a Node.js/Express backend, designed to sell print-on-demand merchandise from multiple vendors. The system uses a PostgreSQL database (via Neon serverless) for data persistence and is built with modern web technologies including TypeScript, Vite, and shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server with HMR (Hot Module Replacement)
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query (React Query)** for server state management and data fetching

**UI Component System**
- **shadcn/ui** components built on **Radix UI primitives** for accessible, unstyled components
- **Tailwind CSS** (v4) for styling with custom design tokens
- Custom theme featuring a dark brown/maroon background with cream/beige text (matching "The Dude Abides" brand aesthetic)
- Component library includes extensive UI primitives (buttons, forms, dialogs, sheets, carousels, etc.)

**Design Decisions**
- Uses the "new-york" style variant from shadcn/ui
- Custom CSS variables for theming including primary, secondary, destructive, and accent colors
- Google Fonts integration (Inter for body text, Oswald for display/headers)
- Responsive design with mobile-first approach

### Backend Architecture

**Server Framework**
- **Express.js** server with TypeScript
- HTTP server created with Node's `http` module for WebSocket support potential
- Custom logging middleware that tracks request duration and response details
- Separation of concerns with dedicated route handlers and storage layer

**API Design**
- RESTful API endpoints under `/api/*`
- Product CRUD operations
- Shopping cart management (session-based for guest checkout)
- Structured error handling with proper HTTP status codes

**Storage Layer**
- Abstraction pattern with `IStorage` interface
- `DatabaseStorage` implementation using Drizzle ORM
- Separation allows for easy testing and alternative storage implementations

### Data Storage

**Database**
- **PostgreSQL** via **Neon Serverless** (@neondatabase/serverless)
- **Drizzle ORM** for type-safe database queries
- WebSocket connection support configured for Neon's serverless architecture

**Schema Design**
- `products` table: Stores merchandise from multiple print-on-demand vendors
  - Supports multiple vendors (Printful, Printify, custom, other)
  - Includes vendor-specific data stored as JSONB for flexibility
  - Tracks pricing, categories, stock status, and metadata
  - Uses auto-incrementing integer IDs

- `cart_items` table: Session-based shopping cart
  - Links to products via foreign key relationship
  - Uses session IDs for guest checkout (no user authentication required)
  - Tracks quantity per item

**Database Decisions**
- Drizzle with Neon Serverless chosen for:
  - Type safety with TypeScript
  - Serverless compatibility (no connection pooling issues)
  - Lightweight ORM with good performance
- JSONB for vendor data provides flexibility for different POD vendor metadata structures
- Session-based cart allows immediate shopping without account creation

### Build & Deployment

**Build Process**
- Custom build script (`script/build.ts`) using esbuild for server bundling
- Vite for client bundling
- Allowlist of dependencies to bundle for improved cold start performance
- Server bundled as single CommonJS file (`dist/index.cjs`)
- Client assets output to `dist/public`

**Development vs Production**
- Development: Vite dev server with middleware mode
- Production: Static file serving from built assets
- Environment-specific configurations via `NODE_ENV`

**Replit-Specific Features**
- Custom Vite plugins for Replit integration:
  - `@replit/vite-plugin-runtime-error-modal` for error display
  - `@replit/vite-plugin-cartographer` for development tools
  - `@replit/vite-plugin-dev-banner` for development environment indicators
- Custom meta images plugin to update OpenGraph tags with Replit deployment URLs

### External Dependencies

**Third-Party Services**
- **Neon Serverless PostgreSQL**: Primary database hosting
- **Print-on-Demand Vendors**: Architecture supports multiple vendors (Printful, Printify, custom integrations)
- **Saleor GraphQL API**: Integration configured for e-commerce data (GraphQL client setup in `client/src/lib/saleor.ts`)

**Key Libraries**
- **UI/Styling**: Radix UI components, Tailwind CSS, class-variance-authority
- **Forms**: React Hook Form with @hookform/resolvers for validation
- **Validation**: Zod with drizzle-zod for schema validation
- **State Management**: TanStack Query for server state
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Carousel**: Embla Carousel React

**Session Management**
- Session storage configured via `connect-pg-simple` (PostgreSQL session store)
- Allows guest checkout without requiring user authentication