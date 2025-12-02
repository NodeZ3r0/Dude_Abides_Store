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

## VPS Production Environment (dudeabides.wopr.systems)

**Infrastructure**
- VPS hosted at dudeabides.wopr.systems
- Caddy reverse proxy handling SSL/TLS
- Cloudflare CDN in front

**Docker Network: authentik_default (Static IPs)**
All Saleor containers use static IP addresses on the `authentik_default` network (subnet: 172.20.0.0/16) to prevent DNS caching issues:

| Container | Static IP | Port |
|-----------|-----------|------|
| saleor-postgres-dude | 172.20.50.10 | 5432 |
| saleor-redis-dude | 172.20.50.11 | 6379 |
| saleor-api-dude | 172.20.50.12 | 8000 |
| saleor-worker-dude | 172.20.50.13 | - |
| saleor-dashboard-dude | 172.20.50.14 | 9002 |

**Saleor Backend**
- **Saleor API**: Port 8000 (container: saleor-api-dude, IP: 172.20.50.12)
- **Saleor Dashboard**: Port 9002 (container: saleor-dashboard-dude, IP: 172.20.50.14)
- **Saleor Worker**: (container: saleor-worker-dude, IP: 172.20.50.13)
- **PostgreSQL**: (container: saleor-postgres-dude, IP: 172.20.50.10)
- **Redis**: (container: saleor-redis-dude, IP: 172.20.50.11)

**Storefront (VPS)**
- Located at `/opt/thedudeabides-store/storefront/`
- Port 3001 (maps to internal 3000)
- Container: saleor-storefront
- **GitHub Repo**: `https://github.com/NodeZ3r0/Dude_Abides_Store.git`
- **CRITICAL**: VPS must pull from NodeZ3r0/Dude_Abides_Store.git, NOT saleor/storefront.git

**Auto-Deploy Pipeline**
- Timer: `dude-deploy.timer` runs every 5 minutes
- Script: `/opt/thedudeabides-store/deploy.sh`
- Email alerts on failure: stephen.falken@wopr.systems (rate-limited 1x per 24hr)
- Workflow: Replit → GitHub push → VPS auto-pulls within 5 min

**Printful Sync Service**
- Located at `/opt/printful-sync/`
- Port 8055
- Syncs products from Printful to Saleor
- Trigger sync: `curl -X POST http://localhost:8055/sync`
- SALEOR_TOKEN: `lethwrqrb5ur5MPtLwzemb68OgSPGX` (has MANAGE_PRODUCTS permission)

**Caddy Config**: `/etc/caddy/sites-enabled/dudeabides.wopr.systems.caddy`

**Multi-Domain Channel Architecture**
- `the-dude-abides-shop`: The Dude Abides store channel (THIS storefront)
- `default-channel`: Separate domain/store (NOT related to this project)
- Each domain maps to its own Saleor channel for multi-tenant setup

## Replit Staging Environment

This Replit project serves as a **staging/development environment** for testing component and styling changes before deploying to the VPS production storefront.

**Configuration**
- Saleor API URL: `https://dudeabides.wopr.systems/graphql/`
- Saleor Channel: `the-dude-abides-shop` (this store's dedicated channel)

**Purpose**
- Visual testing of component/styling changes
- Frontend development without affecting production
- Real-time product data sync from production Saleor

## Brand Design

**Color Scheme**
- `#4a2c2a` (dude-brown) - Primary background
- `#f5e6d3` (dude-cream) - Primary text/accent
- `#ff6b35` (dude-orange) - Call-to-action/highlights

**Typography**
- Display font: Oswald
- Body font: Inter

## Recent Changes (Dec 2, 2025)

### Variant Image Switching Fixed (Dec 2, 2025)
**Status**: Working - Product images now change when selecting different color variants

**Fix Applied**:
- Updated `/opt/printful-sync/app.py` to sync variant-specific mockup images from Printful
- Each variant's `files` array contains a `type: "preview"` entry with `preview_url`
- Images are uploaded to Saleor and assigned to variants via `variantMediaAssign` mutation
- Frontend now shows variant-specific images when color is selected

### Successful Printful Product Sync with Variants
**Status**: Working - Snapback Hat with 17 color variants now displaying at $33 each

**Key Fixes Applied**:

1. **Static IP Infrastructure Fix (CRITICAL)**
   - Docker containers now use static IPs on `authentik_default` network (172.20.50.x range)
   - Prevents DNS caching issues after container restarts
   - Database URLs use static IPs instead of container names

2. **Channel Recreation**
   - Recreated `the-dude-abides-shop` channel after loss during container rebuild
   - Channel ID: `Q2hhbm5lbDoy` (Channel:2)
   - Currency: USD

3. **ProductType Variant Configuration (CRITICAL)**
   - ProductType must have `has_variants=True` 
   - Size and Color attributes must be assigned as **variant attributes** via `AttributeVariant` model
   - In Saleor 3.20: `Attribute` and `AttributeVariant` are in `saleor.attribute.models`, NOT `saleor.product.models`

4. **Warehouse Assignment**
   - Created warehouse with ID: `V2FyZWhvdXNlOjk1MzY4Mjk0LTM0ZjktNDQxOC1iZjlhLWEzZWQwZTg4MTNjNw==`
   - Updated Printful sync service with correct warehouse ID

5. **Tax Configuration (CRITICAL)**
   - GraphQL pricing queries fail with `KeyError: 2` without tax config
   - Must create TaxConfiguration for each channel:
   ```python
   from saleor.tax.models import TaxConfiguration
   from saleor.channel.models import Channel
   channel = Channel.objects.get(slug='the-dude-abides-shop')
   TaxConfiguration.objects.get_or_create(
       channel=channel,
       defaults={
           'charge_taxes': False,
           'tax_calculation_strategy': 'FLAT_RATES',
           'display_gross_prices': True,
           'prices_entered_with_tax': True
       }
   )
   ```

6. **Printful Sync Token**
   - Token: `uVEM2HyJkerckvn0u5FALpnVAG50zW`
   - Permissions: MANAGE_PRODUCTS, MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES

### Django Site Entry Required
After running migrations, you must create the Django Site entry for Saleor to work:
```python
# docker exec -it saleor-api-dude python manage.py shell
from django.contrib.sites.models import Site
Site.objects.update_or_create(
    id=1,
    defaults={
        "domain": "dudeabides.wopr.systems",
        "name": "The Dude Abides Store"
    }
)
```

### Static IP Reference Table
| Container | Static IP | Port |
|-----------|-----------|------|
| saleor-postgres-dude | 172.20.50.10 | 5432 |
| saleor-redis-dude | 172.20.50.11 | 6379 |
| saleor-api-dude | 172.20.50.12 | 8000 |
| saleor-worker-dude | 172.20.50.13 | - |
| saleor-dashboard-dude | 172.20.50.14 | 9002 |

## Previous Changes (Dec 1, 2025)

### Dashboard Login Fix (CRITICAL)
**Problem**: Saleor Dashboard login always failed with "password invalid" even though API curl tests worked.

**Root Cause**: The dashboard container had the API URL baked into the HTML at build time as `http://localhost:8000/graphql/` instead of the correct external URL. This meant browsers were trying to authenticate against localhost on the user's device, not the server.

**Fix**: Recreate the dashboard container with the correct `API_URL` environment variable:
```bash
docker stop saleor-dashboard-dude && docker rm saleor-dashboard-dude
docker run -d \
  --name saleor-dashboard-dude \
  --network authentik_default \
  -p 9002:80 \
  -e API_URL=https://dudeabides.wopr.systems/graphql/ \
  -e APP_MOUNT_URI=/dashboard/ \
  ghcr.io/saleor/saleor-dashboard:3.20
```

**Verification**: `curl https://dudeabides.wopr.systems/dashboard/ | grep API_URL` should show the correct URL.

### Previous Changes (Nov 30, 2025)

1. Fixed VPS storefront 502 error by starting the Next.js storefront container
2. Configured Printful sync service with proper SALEOR_API_URL
3. Generated new Saleor API token with MANAGE_PRODUCTS permission
4. Successfully synced first product (Snapback Hat) from Printful to Saleor with 17 color variants
5. **CORS Fix**: Created server-side proxy routes to bypass browser CORS restrictions when calling Saleor API:
   - `/api/saleor/products` - Fetches products for specified channel
   - `/api/saleor/categories` - Fetches all categories
   - `/api/saleor/collections` - Fetches collections for specified channel
6. Updated frontend hooks to use server proxy instead of direct Saleor calls
7. Added dynamic Categories section to homepage (displays Saleor categories with fallback UI)
8. Fixed multi-channel support: Using `the-dude-abides-shop` channel (correct for this store, supports future multi-domain setup)

**Note**: The Printful sync service on the VPS needs to be configured to sync products to `the-dude-abides-shop` channel (not default-channel). Products must be published to the correct channel for this storefront to display them.