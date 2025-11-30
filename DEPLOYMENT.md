# Automated Deployment Setup

This document explains how to set up automated deployment from Replit → GitHub → VPS.

## Overview

When you push code from Replit to GitHub, a GitHub Actions workflow automatically:
1. Builds the application
2. Connects to your VPS via SSH
3. Pulls the latest code
4. Rebuilds and restarts Docker containers
5. Runs health checks

## GitHub Secrets Required

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VPS_HOST` | Your VPS hostname | `dudeabides.wopr.systems` |
| `VPS_USER` | SSH username | `root` |
| `VPS_SSH_KEY` | Private SSH key for VPS access | (entire private key content) |

## VPS Setup (One-time)

Run these commands on your VPS:

```bash
# Create deployment directory
sudo mkdir -p /opt/deploy
sudo chmod 755 /opt/deploy

# Copy the deploy script
cat > /opt/deploy/redeploy.sh << 'EOF'
#!/bin/bash
set -e

LOG_FILE="/var/log/dudeabides-deploy.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

log "Starting deployment..."

cd /opt/Dude_Abides_Store
log "Pulling latest changes from GitHub..."
git pull origin main

if [ -f "package.json" ]; then
    log "Installing dependencies..."
    npm install
    npm run build 2>/dev/null || true
fi

log "Restarting storefront..."
cd /opt/thedudeabides-store/storefront
docker compose up -d --build

log "Deployment complete!"
EOF

chmod +x /opt/deploy/redeploy.sh
```

## Manual Deployment

If you need to deploy manually from the VPS:
```bash
/opt/deploy/redeploy.sh
```

## Triggering Deployment

Deployment happens automatically when you:
1. Push to the `main` branch from Replit
2. Or manually trigger the workflow from GitHub Actions

## Troubleshooting

Check deployment logs:
```bash
tail -f /var/log/dudeabides-deploy.log
```

Check Docker container status:
```bash
docker ps -a
docker logs saleor-storefront
```
