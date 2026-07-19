# Kingdom Network - Production Deployment Checklist

## Server Requirements
- Ubuntu 22.04+ / Debian 12+
- PHP 8.2+ with extensions: bcmath, ctype, fileinfo, gd, mbstring, openssl, pdo, tokenizer, xml, zip, curl, imagick
- Composer 2.x
- Node.js 18+ & npm
- MySQL 8.0+ / MariaDB 10.6+
- Nginx
- SSL certificate (Let's Encrypt)

## Quick Deploy Commands (run on server)

```bash
# 1. Clone repo
cd /var/www
git clone -b feature/admin-panel-replacement https://github.com/rabeesubedi1997/kingdomnetwork.git kingdomnetwork
cd kingdomnetwork

# 2. Backend setup
cd backend
composer install --no-dev --optimize-autoloader
cp .env.production.example .env
# EDIT .env with your credentials!
nano .env

php artisan key:generate --force
php artisan storage:link
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# 3. Frontend build
cd ../frontend
npm ci
npm run build

# 4. Nginx config
sudo cp ../nginx.conf /etc/nginx/sites-available/kingdomnetwork
sudo ln -s /etc/nginx/sites-available/kingdomnetwork /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 5. SSL (after DNS points to server)
sudo certbot --nginx -d kingdomnetwork.kitetool.com

# 6. Cron for scheduler
sudo crontab -e
# Add: * * * * * cd /var/www/kingdomnetwork/backend && php artisan schedule:run >> /dev/null 2>&1

# 7. Queue worker (if using queues)
sudo tee /etc/supervisor/conf.d/kingdomnetwork-worker.conf <<EOF
[program:kingdomnetwork-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/kingdomnetwork/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/kingdomnetwork/backend/storage/logs/worker.log
EOF
sudo supervisorctl reread && sudo supervisorctl update
```

## Environment Variables (.env) - Required

```env
APP_URL=https://kingdomnetwork.kitetool.com
DB_DATABASE=kingdom_network
DB_USERNAME=your_user
DB_PASSWORD=your_password
MAIL_HOST=your_smtp
MAIL_USERNAME=your_user
MAIL_PASSWORD=your_pass
SANCTUM_STATEFUL_DOMAINS=kingdomnetwork.kitetool.com
SESSION_DOMAIN=.kingdomnetwork.kitetool.com
```

## Directory Structure on Server
```
/var/www/kingdomnetwork/
├── backend/
│   ├── app/
│   ├── public/          <-- Nginx root for API (proxied)
│   ├── storage/
│   └── .env
├── frontend/
│   ├── dist/            <-- Nginx root for SPA
│   └── .env
└── nginx.conf
```

## Nginx - Single Domain Setup
- **Frontend (React SPA)**: `https://kingdomnetwork.kitetool.com/`
- **API (Laravel)**: `https://kingdomnetwork.kitetool.com/api/`
- **Storage files**: `https://kingdomnetwork.kitetool.com/storage/`

## Post-Deploy Verification
1. Visit `https://kingdomnetwork.kitetool.com` - should load React app
2. Visit `https://kingdomnetwork.kitetool.com/api/v1/site` - should return JSON
3. Admin login: `https://kingdomnetwork.kitetool.com/admin/login`
   - Email: `admin@kingdomnetwork.com.np`
   - Password: `password` (change immediately!)
4. Test dark/light mode logo switching
5. Test module enable/disable in Admin > Modules
6. Test page sections in Admin > Pages > Sections tab

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| 500 error on API | Check `storage/logs/laravel.log`, run `php artisan config:clear` |
| CORS errors | Ensure `SANCTUM_STATEFUL_DOMAINS` matches domain exactly |
| Assets 404 | Check `root` path in nginx points to `frontend/dist` |
| Login redirect loop | Verify `SESSION_DOMAIN` has leading dot (`.domain.com`) |
| Storage images broken | Run `php artisan storage:link` and check `/storage/` nginx location |

## Backup Commands
```bash
# Database backup
mysqldump -u user -p kingdom_network > backup_$(date +%F).sql

# Files backup
tar -czf files_$(date +%F).tar.gz /var/www/kingdomnetwork/backend/storage/app/public
```