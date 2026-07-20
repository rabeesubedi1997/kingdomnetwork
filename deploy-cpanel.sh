#!/bin/bash
# Kingdom Network - cPanel Deployment Script
# Usage: chmod +x deploy-cpanel.sh && ./deploy-cpanel.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ============================================
# CONFIGURATION
# ============================================
CPANEL_USER="vertexen"
SUBDOMAIN="kingdomnetwork.kitetool.com"

HOME_DIR="/home/$CPANEL_USER"
REPO_DIR="$HOME_DIR/$SUBDOMAIN"
BACKEND_DIR="$REPO_DIR/backend"
FRONTEND_DIST="$REPO_DIR/frontend/dist"

echo -e "${YELLOW}🚀 Kingdom Network cPanel Deployment${NC}"
echo -e "${YELLOW}📁 Repo dir: $REPO_DIR${NC}"
echo -e "${YELLOW}🌐 Subdomain: $SUBDOMAIN${NC}"

echo -e "${RED}⚠️  IMPORTANT: Set subdomain document root in cPanel to:${NC}"
echo -e "${YELLOW}   /home/$CPANEL_USER/$SUBDOMAIN/frontend/dist${NC}"
echo -e ""

# ============================================
# 1. BACKEND SETUP
# ============================================
echo -e "${YELLOW}🔧 Backend setup...${NC}"
cd "$BACKEND_DIR"

if [ ! -d "vendor" ]; then
    echo -e "${YELLOW}📦 Installing Composer dependencies...${NC}"
    composer install --no-dev --optimize-autoloader
fi

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env from production example...${NC}"
    cp .env.production.example .env
    echo -e "${RED}⚠️  EDIT .env WITH YOUR DATABASE CREDENTIALS!${NC}"
    echo -e "${YELLOW}   nano .env${NC}"
    read -p "Press Enter after editing .env..."
fi

php artisan key:generate --force
php artisan storage:link
php artisan migrate --force
php artisan db:seed --class=RolesPermissionsSeeder --force
php artisan db:seed --class=PagesSeeder --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

chmod -R 775 storage bootstrap/cache

# ============================================
# 2. FRONTEND BUILD
# ============================================
echo -e "${YELLOW}🎨 Building frontend...${NC}"
cd "$REPO_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing npm dependencies...${NC}"
    npm ci
fi

npm run build

# ============================================
# 3. START/RESTART API SERVER
# ============================================
echo -e "${YELLOW}🚀 Starting API server...${NC}"
cd "$BACKEND_DIR"
mkdir -p storage/logs

pkill -f "artisan serve" 2>/dev/null || true
nohup php artisan serve --host=127.0.0.1 --port=8000 > storage/logs/api.log 2>&1 &
sleep 2

# ============================================
# 4. TEST API
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
echo "1. Set document root in cPanel → Subdomains → kingdomnetwork.kitetool.com"
echo "   to: /home/$CPANEL_USER/$SUBDOMAIN/frontend/dist"
echo "2. Install SSL: cPanel → SSL/TLS → Let's Encrypt"
echo "3. Set up cron: * * * * * cd $BACKEND_DIR && php artisan schedule:run"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to edit .env with your DB credentials!${NC}"
