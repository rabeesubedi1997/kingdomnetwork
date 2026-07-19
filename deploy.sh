#!/bin/bash
# Kingdom Network - cPanel Deployment Script
# Run this on the server AFTER: git pull origin feature/admin-panel-replacement
# Usage: chmod +x deploy.sh && ./deploy.sh

set -e

echo "🚀 Kingdom Network cPanel Deployment"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Config - ADJUST THESE FOR YOUR SERVER
REPO_DIR="/home/vertexen/kingdomnetwork.kitetool.com"
SUBDOMAIN_ROOT="/home/vertexen/public_html/kingdomnetwork.kitetool.com"
BACKEND_DIR="$REPO_DIR/backend"
FRONTEND_DIST="$REPO_DIR/frontend/dist"

echo -e "${YELLOW}📁 Repo dir: $REPO_DIR${NC}"
echo -e "${YELLOW}📁 Subdomain root: $SUBDOMAIN_ROOT${NC}"

# 1. Create subdomain document root
echo -e "${YELLOW}📁 Creating subdomain document root...${NC}"
mkdir -p "$SUBDOMAIN_ROOT"

# 2. Backend setup
echo -e "${YELLOW}🔧 Backend setup...${NC}"
cd "$BACKEND_DIR"

# Install deps if needed
if [ ! -d "vendor" ]; then
    composer install --no-dev --optimize-autoloader
fi

# .env setup
if [ ! -f ".env" ]; then
    cp .env.production.example .env
    echo -e "${RED}⚠️  EDIT .env with your DB credentials!${NC}"
    echo -e "${YELLOW}   nano .env${NC}"
    read -p "Press Enter after editing .env..."
fi

php artisan key:generate --force
php artisan storage:link
php artisan migrate --force
php artisan db:seed --class=RolesPermissionsSeeder --force
php artisan db:seed --class=PagesSeeder --force
php artisan config:clear && php artisan config:cache && php artisan route:cache
php artisan view:cache 2>/dev/null || mkdir -p resources/views && php artisan view:cache

# Permissions (use current user)
chmod -R 775 storage bootstrap/cache
chown -R $(whoami):$(whoami) storage bootstrap/cache

# 3. Frontend build
echo -e "${YELLOW}🎨 Building frontend...${NC}"
cd "$REPO_DIR/frontend"
if [ ! -d "node_modules" ]; then
    npm ci
fi
npm run build

# 4. Deploy frontend to subdomain root
echo -e "${YELLOW}📦 Deploying frontend to subdomain...${NC}"
rsync -a --delete "$FRONTEND_DIST/" "$SUBDOMAIN_ROOT/"

# 5. Create modified index.php in subdomain root
echo -e "${YELLOW}📝 Creating index.php in subdomain root...${NC}"
cat > "$SUBDOMAIN_ROOT/index.php" << 'EOF'
<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'/../../kingdomnetwork.kitetool.com/backend/storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../../kingdomnetwork.kitetool.com/backend/vendor/autoload.php';

$app = require_once __DIR__.'/../../kingdomnetwork.kitetool.com/backend/bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
EOF

# 6. Create .htaccess for SPA + API routing
echo -e "${YELLOW}📝 Creating .htaccess...${NC}"
cat > "$SUBDOMAIN_ROOT/.htaccess" << 'EOF'
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    RewriteRule ^api/(.*)$ index.php [L,QSA]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api/
    RewriteCond %{REQUEST_URI} !^/storage/
    RewriteRule ^ index.html [L]
</IfModule>
EOF

# 7. Create storage symlink in subdomain root
echo -e "${YELLOW}🔗 Creating storage symlink...${NC}"
cd "$SUBDOMAIN_ROOT"
ln -sfn ../../kingdomnetwork.kitetool.com/backend/storage/app/public storage

# 8. Start/Restart API server
echo -e "${YELLOW}🚀 Starting API server...${NC}"
cd "$BACKEND_DIR"
mkdir -p storage/logs
pkill -f "artisan serve" 2>/dev/null || true
nohup php artisan serve --host=127.0.0.1 --port=8000 > storage/logs/api.log 2>&1 &
sleep 2

# 9. Test
echo -e "${YELLOW}🧪 Testing...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/api/v1/site | grep -q "200"; then
    echo -e "${GREEN}✅ API responding${NC}"
else
    echo -e "${RED}❌ API not responding - check storage/logs/api.log${NC}"
fi

echo -e "${GREEN}"
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo -e "${NC}"
echo "🌐 Frontend: https://kingdomnetwork.kitetool.com"
echo "🔌 API:      https://kingdomnetwork.kitetool.com/api/v1/site"
echo "👤 Admin:    https://kingdomnetwork.kitetool.com/admin/login"
echo "   Email:    admin@kingdomnetwork.com.np"
echo "   Password: password (CHANGE IMMEDIATELY!)"
echo ""
echo "📋 Next steps:"
echo "1. Install SSL: cPanel → SSL/TLS → Let's Encrypt"
echo "2. Set up cron: * * * * * cd $BACKEND_DIR && php artisan schedule:run"
echo "3. Test all features"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to edit .env with your DB credentials!${NC}"
EOF
chmod +x deploy.sh