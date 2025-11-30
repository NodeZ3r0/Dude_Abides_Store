#!/bin/bash
# VPS Deployment Script for The Dude Abides Shop
# Place this at /opt/deploy/redeploy.sh on the VPS

set -e

LOG_FILE="/var/log/dudeabides-deploy.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

log "Starting deployment..."

# Pull latest code
cd /opt/Dude_Abides_Store
log "Pulling latest changes from GitHub..."
git pull origin main

# Build frontend if needed
if [ -f "package.json" ]; then
    log "Installing npm dependencies..."
    npm install
    log "Building application..."
    npm run build 2>/dev/null || log "No build script or build failed (non-critical)"
fi

# Restart storefront
log "Restarting Next.js storefront..."
cd /opt/thedudeabides-store/storefront
docker compose pull 2>/dev/null || true
docker compose up -d --build

# Restart printful-sync if needed
log "Checking printful-sync..."
cd /opt/printful-sync
docker compose up -d

# Health checks
log "Running health checks..."
sleep 5

if curl -sf https://dudeabides.wopr.systems/ > /dev/null; then
    log "Storefront: OK"
else
    log "Storefront: FAILED"
fi

if curl -sf -X POST https://dudeabides.wopr.systems/graphql/ \
    -H 'Content-Type: application/json' \
    -d '{"query": "{ __typename }"}' > /dev/null; then
    log "GraphQL API: OK"
else
    log "GraphQL API: FAILED"
fi

log "Deployment complete!"
