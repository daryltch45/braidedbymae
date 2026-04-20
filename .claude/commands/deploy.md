# /deploy — Production Deployment Checklist

Deploy BraidedByMae to a VPS with Docker Compose.

## Pre-Deploy Checks

### 1. Production Build Test (local)
```bash
make prod-build
# Visit http://localhost:3000 — verify everything works
make prod-down
```

### 2. Prepare Production Env
Copy `.env.production.example` to `.env.production` on the server.
Fill in ALL values — especially:
- [ ] Strong `POSTGRES_PASSWORD`
- [ ] `CLOUDINARY_*` keys
- [ ] `RESEND_API_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` (final domain)
- [ ] `ADMIN_PASSWORD_HASH` (generate with bcryptjs)

### 3. Content Verification
- [ ] All 3 languages render correctly
- [ ] No missing translation keys
- [ ] Images load from Cloudinary
- [ ] Dark mode on all pages
- [ ] Booking form submits + email sent
- [ ] Admin panel works

## VPS Setup (First Time)

### 1. Provision VPS
Hetzner CX22 (~€4/month) or Contabo equivalent.
Ubuntu 24.04 LTS.

### 2. Install Docker
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 3. Clone Repo
```bash
git clone https://github.com/YOUR_USER/braidedbymae.git
cd braidedbymae
```

### 4. Setup SSL (Let's Encrypt)
```bash
sudo apt install certbot
sudo certbot certonly --standalone -d braidedbymae.de -d www.braidedbymae.de
# Copy certs to nginx/ssl/
cp /etc/letsencrypt/live/braidedbymae.de/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/braidedbymae.de/privkey.pem nginx/ssl/
```

### 5. Deploy
```bash
make prod-build
```

### 6. Setup Backup Cron
```bash
chmod +x scripts/backup/backup.sh
crontab -e
# Add: 0 3 * * * /home/user/braidedbymae/scripts/backup/backup.sh
```

### 7. Setup SSL Auto-Renewal
```bash
crontab -e
# Add: 0 0 1 * * certbot renew --quiet && docker restart braidedbymae-nginx
```

## DNS Configuration
Point domain A record to VPS IP address.

## Post-Deploy
- [ ] HTTPS works
- [ ] All 3 locale URLs work
- [ ] Booking flow end-to-end
- [ ] Email delivery confirmed
- [ ] Backup script runs
- [ ] Lighthouse > 90 on mobile
