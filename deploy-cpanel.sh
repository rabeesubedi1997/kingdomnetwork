#!/bin/bash
# Kingdom Network - cPanel Deployment Script
# Run this on cPanel server AFTER: git pull origin feature/admin-panel-replacement
# Usage: chmod +x deploy-cpanel.sh && ./deploy-cpanel.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ============================================
# CONFIGURATION - ADJUST FOR YOUR CPANEL ACCOUNT
# ============================================
# cPanel username (your hosting account username)
CPANEL_USER="vertexen"

# Subdomain name (kingdomnetwork.kitetool.com)
SUBDOMAIN="kingdomnetwork.kitetool.com"

# Base paths on cPanel server
HOME_DIR="/home/$CPANEL_USER"
REPO_DIR="$HOME_DIR/$SUBDOMAIN"
SUBDOMAIN_ROOT="$HOME_DIR/public_html/$SUBDOMAIN"
BACKEND_DIR="$REPO_DIR/backend"
FRONTEND_DIST="$REPO_DIR/frontend/dist"

echo -e "${YELLOW}🚀 Kingdom Network cPanel Deployment${NC}"
echo -e "${YELLOW}📁 Repo dir: $REPO_DIR${NC}"
echo -e "${YELLOW}📁 Subdomain root: $SUBDOMAIN_ROOT${NC}"
echo -e "${YELLOW}🌐 Subdomain: $SUBDOMAIN${NC}"

# ============================================
# 1. CREATE SUBDOMAIN DOCUMENT ROOT
# ============================================
echo -e "${YELLOW}📁 Creating subdomain document root...${NC}"
mkdir -p "$SUBDOMAIN_ROOT"

# ============================================
# 2. BACKEND SETUP
# ============================================
echo -e "${YELLOW}🔧 Backend setup...${NC}"
cd "$BACKEND_DIR"

# Install composer dependencies
if [ ! -d "vendor" ]; then
    echo -e "${YELLOW}📦 Installing Composer dependencies...${NC}"
    composer install --no-dev --optimize-autoloader
fi

# Setup .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env from production example...${NC}"
    cp .env.production.example .env
    echo -e "${RED}⚠️  EDIT .env WITH YOUR DATABASE CREDENTIALS!${NC}"
    echo -e "${YELLOW}   nano .env${NC}"
    read -p "Press Enter after editing .env..."
fi

# Laravel setup
php artisan key:generate --force
php artisan storage:link
php artisan migrate --force
php artisan db:seed --class=RolesPermissionsSeeder --force
php artisan db:seed --class=PagesSeeder --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Permissions (cPanel uses your user, not www-data)
chmod -R 775 storage bootstrap/cache

# ============================================
# 3. FRONTEND BUILD
# ============================================
echo -e "${YELLOW}🎨 Building frontend...${NC}"
cd "$REPO_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing npm dependencies...${NC}"
    npm ci
fi

npm run build

# ============================================
# 4. DEPLOY FRONTEND TO SUBDOMAIN ROOT
# ============================================
echo -e "${YELLOW}📦 Deploying frontend to subdomain root...${NC}"
rsync -a --delete "$FRONTEND_DIST/" "$SUBDOMAIN_ROOT/"

# ============================================
# 5. CREATE LARAVEL INDEX.PHP IN SUBDOMAIN ROOT
# ============================================
echo -e "${YELLOW}📝 Creating index.php in subdomain root...${NC}"
cat > "$SUBDOMAIN_ROOT/index.php" << 'EOF'
<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Check for maintenance mode
if (file_exists($maintenance = __DIR__.'/../../kingdomnetwork.kitetool.com/backend/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Load Composer autoloader
require __DIR__.'/../../kingdomnetwork.kitetool.com/backend/vendor/autoload.php';

// Bootstrap Laravel application
$app = require_once __DIR__.'/../../kingdomnetwork.kitetool.com/backend/bootstrap/app.php';

// Handle the incoming request
$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
EOF

# ============================================
# 6. CREATE .HTACCESS FOR SPA + API ROUTING
# ============================================
echo -e "${YELLOW}📝 Creating .htaccess for SPA + API routing...${NC}"
cat > "$SUBDOMAIN_ROOT/.htaccess" << 'EOF'
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Handle API Routes - Route to Laravel
    RewriteRule ^api/(.*)$ index.php [L,QSA]

    # Handle Storage Files - Route to Laravel
    RewriteRule ^storage/(.*)$ index.php [L,QSA]

    # Handle Sitemap & Robots - Route to Laravel
    RewriteRule ^sitemap\.xml$ index.php [L,QSA]
    RewriteRule ^robots\.txt$ index.php [L,QSA]

    # Frontend Assets - Serve Directly
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # React SPA - Serve index.html for all other routes
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api/
    RewriteCond %{REQUEST_URI} !^/storage/
    RewriteRule ^ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Cache Static Assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Deny Access to Hidden Files
<Files ~ "^\.">
    Order allow,deny
    Deny from all
</Files>

# Deny Access to Backup/Config Files
<FilesMatch "\.(env|log|sql|bak|backup)$">
    Order allow,deny
    Deny from all
</FilesMatch>
EOF

# ============================================
# 7. CREATE STORAGE SYMLINK IN SUBDOMAIN ROOT
# ============================================
echo -e "${YELLOW}🔗 Creating storage symlink in subdomain root...${NC}"
cd "$SUBDOMAIN_ROOT"
ln -sfn ../../kingdomnetwork.kitetool.com/backend/storage/app/public storage

# ============================================
# 8. START/RESTART API SERVER (if using artisan serve)
# ============================================
echo -e "${YELLOW}🚀 Starting API server...${NC}"
cd "$BACKEND_DIR"
mkdir -p storage/logs

# Kill existing artisan serve processes
pkill -f "artisan serve" 2>/dev/null || true

# Start API server in background on port 8000
nohup php artisan serve --host=127.0.0.1 --port=8000 > storage/logs/api.log 2>&1 &
sleep 2

# ============================================
# 9. TEST API
# ============================================
echo -e "${YELLOW}🧪 Testing API...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/api/v1/site | grep -q "200"; then
    echo -e "${GREEN}✅ API responding successfully${NC}"
else
    echo -e "${RED}❌ API not responding - check storage/logs/api.log${NC}"
fi

# ============================================
# COMPLETE
# ============================================
echo -e "${GREEN}"
echo "============================================"
echo "✅ DEPLOYMENT COMPLETE!"
echo "============================================"
echo -e "${NC}"
echo "🌐 Frontend: https://$SUBDOMAIN"
echo "🔌 API:      https://$SUBDOMAIN/api/v1/site"
echo "👤 Admin:    https://$SUBDOMAIN/admin/login"
echo "   Email:    admin@kingdomnetwork.com.np"
echo "   Password: password (CHANGE IMMEDIATELY!)"
echo ""
echo "📋 Next steps:"
echo "1. Install SSL: cPanel → SSL/TLS → Let's Encrypt"
echo "2. Set up cron: * * * * * cd $BACKEND_DIR && php artisan schedule:run >> /dev/null 2>&1"
echo "3. Test all features"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to edit .env with your DB credentials!${NC}"
EOF
chmod +x deploy-cpanel.sh