# Kingdom Network - Complete Setup Guide

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+ or MariaDB 10.5+
- Redis (optional, for queues/cache)
- Meilisearch (optional, for search)

---

## 1. Database Setup (MySQL)

```bash
# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE kingdom_network CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'kingdom_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON kingdom_network.* TO 'kingdom_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 2. Backend Setup (Laravel 11)

```bash
cd D:\laragon\www\kingdomnetwork\backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure .env with your database credentials:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=kingdom_network
# DB_USERNAME=kingdom_user
# DB_PASSWORD=secure_password_here

# Run migrations with seeders
php artisan migrate --seed

# Create storage link
php artisan storage:link

# Create Filament admin user
php artisan make:filament-user
# Follow prompts: name, email, password

# (Optional) Install Meilisearch for search
# docker run -d -p 7700:7700 getmeili/meilisearch:v1.8
# Then set MEILISEARCH_HOST=http://127.0.0.1:7700 in .env
# php artisan scout:import-all

# Start queue worker (in separate terminal)
php artisan queue:work

# Start Laravel server
php artisan serve --port=8000
```

---

## 3. Frontend Setup (React 18 + Vite)

```bash
cd D:\laragon\www\kingdomnetwork\frontend

# Install dependencies
npm install

# Copy environment
cp .env.example .env

# Start development server
npm run dev

# For production build
npm run build
```

---

## 4. Complete .env Configuration

```env
APP_NAME="Kingdom Network"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kingdom_network
DB_USERNAME=kingdom_user
DB_PASSWORD=your_secure_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
SESSION_DRIVER=database
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="info@kingdomnetwork.com.np"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=

SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DOMAIN=localhost

KINGDOM_BRAND_PRIMARY=#09333f
KINGDOM_BRAND_SECONDARY=#516f78
KINGDOM_BRAND_ACCENT=#7fa0a1
KINGDOM_BRAND_GOLD=#ffcd57

VITE_APP_URL=http://localhost:3000
```

---

## 5. Enable/Disable Modules

Edit `config/kingdom.php`:

```php
'modules' => [
    'core'          => true,   // Always on
    'films'         => true,
    'news'          => true,
    'careers'       => true,
    'gallery'       => true,
    'press_kit'     => true,
    'newsletter'    => true,
    'shop'          => false,   // Enable when ready
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

**To enable a module**: Change `false` to `true` → menus, routes, admin resources auto-appear.

---

## 6. Brand Colors (From Your Logo)

Already configured in `config/kingdom.php` and `frontend/tailwind.config.ts`:

| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#09333f` | Headers, CTAs, active nav |
| Secondary | `#516f78` | Hover states, borders |
| Accent | `#7fa0a1` | Light highlights |
| Gold | `#ffcd57` | Awards, badges |
| Dark | `#08313c` | Darker variants |
| Surface | `#f9f6fe` | Card/section backgrounds |
| Text | `#1e293b` | Primary text |
| Muted | `#67768e` | Secondary text |

---

## 7. Key Features Implemented

### Films Module
- ✅ Status workflow: Development → Pre-Production → Post-Production → Released
- ✅ Cast/Crew repeaters with roles
- ✅ Awards with categories/years
- ✅ Locations with coordinates
- ✅ Gallery with types (poster, still, BTS, concept)
- ✅ Trailer embed (YouTube/Vimeo)
- ✅ JSON-LD Movie schema
- ✅ Featured films on homepage

### Admin Panel (Filament v3)
- ✅ Film CRUD with relation managers
- ✅ News with categories/tags
- ✅ Job applications with file uploads
- ✅ Press kits with downloadable assets
- ✅ Team members
- ✅ Site settings (JSON values)
- ✅ Module toggles in navigation

### Frontend (React + Tailwind)
- ✅ Hero slider with trailer modals
- ✅ Film timeline by status
- ✅ Film detail with schema
- ✅ News with filters
- ✅ Career applications
- ✅ Gallery albums with lightbox
- ✅ Contact/Newsletter forms
- ✅ Dark mode support
- ✅ Framer Motion animations

---

## 8. Production Deployment Checklist

```bash
# 1. Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 2. Build frontend
cd ../frontend && npm run build

# 3. Set production env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://kingdomnetwork.com.np

# 4. Queue workers (supervisor)
# [program:laravel-worker]
# process_name=%(program_name)s_%(process_num)02d
# command=php /path/to/artisan queue:work --sleep=3 --tries=3
# autostart=true
# autorestart=true
# numprocs=2

# 5. Schedule cron
# * * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1

# 6. SSL/HTTPS (Nginx)
# server {
#     listen 443 ssl http2;
#     server_name kingdomnetwork.com.np;
#     root /path/to/backend/public;
#     ssl_certificate /path/to/cert.pem;
#     ssl_certificate_key /path/to/key.pem;
#     # ... Laravel Nginx config
# }
```

---

## 9. API Endpoints Summary

```
GET  /api/v1/site                    # Site config, brand, menus
GET  /api/v1/films                   # List films (?status=&genre=&search=)
GET  /api/v1/films/featured          # Featured films
GET  /api/v1/films/{slug}            # Film detail with relations
GET  /api/v1/films/status/{status}   # Films by status
GET  /api/v1/news                    # News list
GET  /api/v1/news/{slug}             # News detail
GET  /api/v1/careers                 # Job listings
POST /api/v1/careers/{slug}/apply    # Job application (multipart)
GET  /api/v1/events                  # Events
POST /api/v1/events/{slug}/rsvp      # Event RSVP
GET  /api/v1/gallery                 # Gallery albums
GET  /api/v1/gallery/{slug}          # Album detail
GET  /api/v1/press                   # Press kits
GET  /api/v1/press/{filmSlug}        # Film press kit
POST /api/v1/contact                 # Contact form
POST /api/v1/newsletter/subscribe    # Newsletter signup
POST /api/v1/screenings/request      # Screening request
GET  /api/v1/sitemap.xml             # Auto sitemap
GET  /api/v1/robots.txt              # Robots.txt
```

---

## 10. Default Admin Access

After running `php artisan make:filament-user`:
- URL: `http://localhost:8000/admin`
- Login with your created credentials

---

## 11. Adding Content

1. **Films**: Admin → Films → Create → Fill details, upload poster/banner, add cast/crew/awards
2. **News**: Admin → News → Create → Write content, set category, upload featured image
3. **Jobs**: Admin → Careers → Jobs → Create → Set deadline, requirements
4. **Team**: Admin → Core → Team Members → Add leadership
5. **Gallery**: Admin → Gallery → Albums → Create → Upload images
5. **Press Kits**: Auto-generated from film data, or create manually
6. **Site Settings**: Admin → Core → Site Settings → Edit key values

---

## Support

- **Laravel Docs**: https://laravel.com/docs/11.x
- **Filament Docs**: https://filamentphp.com/docs/3.x
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Kingdom Network** - Redefining Nepali Cinema 🎬