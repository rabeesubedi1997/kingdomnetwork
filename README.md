# Kingdom Network - Film Production Company Website

A modern, modular Laravel 11 + React 18 application for Kingdom Network, a leading Nepali film production company.

## 🎬 Features

### Core Modules (Always Enabled)
- **Home** - Hero slider, featured films, stats, newsletter signup
- **Films** - Full film catalog with status badges (Released/Post-Production/Pre-Production/Development), timeline view, detailed pages with cast/crew, gallery, awards, JSON-LD Movie schema
- **About** - Mission/Vision/Values, cinematic journey timeline, leadership team
- **News** - Press releases, blog posts, categories, tags, Article schema
- **Careers** - Job board with filters, application forms with file upload
- **Contact** - Contact form, office info, social links
- **Gallery** - Albums by category (BTS, Posters, Stills, Events, Concept Art)
- **Press Kit** - Auto-generated EPKs with downloadable assets
- **Newsletter** - Double opt-in, segmentation, campaign management

### Optional Modules (Enable via config)
- **Shop** - Merchandise, soundtracks, vinyl (Shopify or native)
- **Membership** - AAA24-style tiered membership with Stripe Billing
- **Events** - Premieres, festivals, screenings with RSVP
- **Podcasts** - Audio content with RSS feed
- **TV** - Television division catalog
- **Comics** - IP/comics division
- **Screenings** - Private screening request workflow
- **Investors** - Secure investor portal with reports

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Laravel 11 (PHP 8.2+) |
| **API** | RESTful + Laravel API Resources |
| **Admin** | Filament v3 |
| **Auth** | Laravel Sanctum (SPA) |
| **Media** | Spatie MediaLibrary + Cloudflare R2/S3 |
| **Search** | Meilisearch (Laravel Scout) |
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS v4 + CSS Variables |
| **State** | TanStack Query + Zustand |
| **Forms** | React Hook Form + Zod |
| **Animation** | Framer Motion |
| **UI** | Radix UI / shadcn/ui |

## 🎨 Brand Colors (Extracted from Logo)

| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#09333f` | Headers, CTAs, active states |
| Secondary | `#516f78` | Hover states, borders |
| Accent | `#7fa0a1` | Light highlights, backgrounds |
| Gold | `#ffcd57` | Awards, badges, highlights |
| Dark | `#08313c` | Darker variants |
| Surface | `#f9f6fe` | Card backgrounds, sections |
| Text | `#1e293b` | Primary text |
| Muted | `#67768e` | Secondary text |

## 📁 Project Structure

```
kingdomnetwork/
├── backend/                 # Laravel 11 Application
│   ├── app/
│   │   ├── Http/Controllers/Api/    # API Controllers
│   │   ├── Models/                   # Eloquent Models
│   │   ├── Filament/Resources/      # Admin Panel Resources
│   │   ├── Providers/               # Service Providers
│   │   └── Services/                # Business Logic
│   ├── config/kingdom.php           # Module & Brand Config
│   ├── database/migrations/         # All Module Migrations
│   ├── database/seeders/            # Demo Data Seeders
│   ├── routes/api.php               # API Routes
│   └── routes/web.php               # Web Routes
│
├── frontend/                # React 18 + Vite + TS
│   ├── src/
│   │   ├── components/              # Reusable Components
│   │   │   ├── ui/                  # Base UI (Button, Input, etc.)
│   │   │   ├── film/                # Film-specific
│   │   │   ├── news/                # News-specific
│   │   │   ├── career/              # Career-specific
│   │   │   ├── gallery/             # Gallery-specific
│   │   │   ├── press/               # Press Kit
│   │   │   ├── layout/              # Layout components
│   │   │   └── shared/              # Shared (SEO, Loading, etc.)
│   │   ├── pages/                   # Page Components
│   │   ├── hooks/                   # Custom React Hooks
│   │   ├── lib/                     # Utilities (API, validation, etc.)
│   │   ├── providers/               # Context Providers
│   │   ├── layouts/                 # Page Layouts
│   │   ├── styles/                  # Global Styles
│   │   ├── types/                   # TypeScript Types
│   │   ├── App.tsx                  # Main App + Routes
│   │   └── main.tsx                 # Entry Point
│   ├── tailwind.config.ts           # Brand Theme Config
│   ├── vite.config.ts               # Vite Config
│   └── package.json
│
└── docs/                      # Documentation
```

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- SQLite/PostgreSQL/MySQL
- Redis (for queues/cache)
- Meilisearch (optional, for search)

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate --seed

# Storage link
php artisan storage:link

# Start server
php artisan serve
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

### Filament Admin

```bash
# Create admin user
php artisan make:filament-user

# Access at /admin
```

## 🔧 Configuration

### Module Toggle (`config/kingdom.php`)

```php
'modules' => [
    'core'          => true,   // Always on
    'films'         => true,
    'news'          => true,
    'careers'       => true,
    'gallery'       => true,
    'press_kit'     => true,
    'newsletter'    => true,
    'shop'          => false,  // Enable when ready
    'membership'    => false,
    'events'        => false,
    'podcasts'      => false,
    'tv'            => false,
    'comics'        => false,
    'screening'     => false,
    'investors'     => false,
    'seo_sitemap'   => true,
],
```

### Brand Colors

```php
'brand' => [
    'colors' => [
        'primary'   => '#09333f',  // From logo
        'secondary' => '#516f78',
        'accent'    => '#7fa0a1',
        'gold'      => '#ffcd57',
        // ...
    ],
],
```

## 📡 API Endpoints

```
GET  /api/v1/site                    # Site config, menus, brand
GET  /api/v1/films                   # List films (filters: status, genre, year)
GET  /api/v1/films/{slug}            # Film detail
GET  /api/v1/films/status/{status}   # Films by status
GET  /api/v1/films/featured          # Featured films
GET  /api/v1/news                    # List news
GET  /api/v1/news/{slug}             # News detail
GET  /api/v1/careers                 # Job listings
POST /api/v1/careers/{slug}/apply    # Job application
GET  /api/v1/events                  # Events
POST /api/v1/events/{slug}/rsvp      # Event RSVP
GET  /api/v1/gallery                 # Gallery albums
GET  /api/v1/gallery/{slug}          # Album detail
GET  /api/v1/press                   # Press kits
GET  /api/v1/press/{filmSlug}        # Film press kit
POST /api/v1/contact                 # Contact form
POST /api/v1/newsletter/subscribe    # Newsletter signup
POST /api/v1/screenings/request      # Screening request
GET  /api/v1/sitemap.xml             # Auto-generated sitemap
GET  /api/v1/robots.txt              # Robots.txt
```

## 🎯 Key Features

### Modular Architecture
Each feature is a self-contained module with:
- Own migrations, models, controllers
- Own React pages, components, hooks
- Config-driven enable/disable
- Auto-hidden from menus when disabled

### Film Management
- Status workflow: Development → Pre-Production → Post-Production → Released
- Cast/crew with roles, departments, lead flags
- Awards with categories, years, results
- Locations with coordinates
- Gallery with types (poster, still, BTS, concept, marketing)
- Trailer embed (YouTube/Vimeo)
- JSON-LD Movie schema for SEO

### Admin Panel (Filament v3)
- Film CRUD with repeaters for cast/crew/awards
- MediaLibrary integration for posters/galleries
- News with categories/tags
- Career applications with resume uploads
- Team member management
- Module toggle UI
- Analytics widgets

### SEO & Performance
- Dynamic meta tags per page
- Open Graph + Twitter Cards
- JSON-LD structured data (Movie, Article, Organization, Breadcrumb)
- Auto sitemap.xml & robots.txt
- Meilisearch for instant film/news search
- Responsive images via MediaLibrary conversions
- Critical CSS inlining

## 📦 Deployment

### Laravel Forge / Vapor
```bash
# Build assets
npm run build

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Docker (Coolify)
```dockerfile
# Multi-stage build included
docker build -t kingdom-network .
```

## 🔐 Security

- Sanctum token authentication
- CSRF protection
- Rate limiting on forms
- File upload validation (type, size)
- XSS protection via React
- SQL injection prevention via Eloquent

## 📄 License

MIT License - see LICENSE file

---

**Kingdom Network** - Redefining Nepali Cinema Since 2024