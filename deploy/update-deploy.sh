#!/usr/bin/env bash
set -euo pipefail

# update-deploy.sh
# Safe, idempotent script for pulling latest changes from git, building, and restarting PM2
# Usage:
#  sudo ./deploy/update-deploy.sh --app pishro  --branch main
#  sudo ./deploy/update-deploy.sh --app pishro-admin --branch main
#  sudo ./deploy/update-deploy.sh --app all --branch main
#  sudo ./deploy/update-deploy.sh --branch main --skip-build   # update code but skip build
# Notes:
#  - The script assumes you have two apps: /opt/pishro (main) and /opt/pishro-admin (admin)
#  - It will run 'npm ci' and 'npm run build' by default unless --skip-build is set
#  - After updates, it restarts the PM2 processes (via pm2 restart <name>) and does pm2 save
#  - Use --force to proceed even with uncommitted local changes (dangerous)

# Config
PISHRO_DIR="/opt/pishro"
PISHRO_ADMIN_DIR="/opt/pishro-admin"
DEFAULT_BRANCH="main"

APP_TO_UPDATE=${APP_TO_UPDATE:-all}
BRANCH=${BRANCH:-$DEFAULT_BRANCH}
SKIP_BUILD=false
FORCE=false
PM2_CMD=${PM2_CMD:-pm2}

usage() {
  cat <<EOF
Usage: $0 [--app pishro|pishro-admin|all] [--branch BRANCH] [--skip-build] [--force]

Examples:
  sudo $0 --app all --branch main
  sudo $0 --app pishro --branch main --skip-build

EOF
  exit 1
}

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --app)
      APP_TO_UPDATE="$2"
      shift 2
      ;;
    --branch)
      BRANCH="$2"
      shift 2
      ;;
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown arg: $1"
      usage
      ;;
  esac
done

log() {
  echo "[update-deploy] $(date '+%F %T') - $*"
}

abort_if_dirty() {
  local repo_dir="$1"
  pushd "$repo_dir" > /dev/null
  local status
  status=$(git status --porcelain)
  if [[ -n "$status" ]]; then
    if [[ "$FORCE" == "true" ]]; then
      log "WARNING: Uncommitted changes in $repo_dir but proceeding due to --force"
    else
      log "ERROR: Uncommitted changes in $repo_dir. Commit or stash them or run with --force to override."
      popd > /dev/null
      exit 1
    fi
  fi
  popd > /dev/null
}

fetch_and_update() {
  local repo_dir="$1"
  local branch="$2"
  pushd "$repo_dir" > /dev/null
  log "Updating repository in $repo_dir"

  if ! command -v git >/dev/null 2>&1; then
    log "ERROR: git not installed"
    exit 1
  fi

  # fetch origin
  git remote update origin --prune
  # abort if branch exists only locally
  if ! git show-ref --verify --quiet "refs/heads/$branch"; then
    log "Branch $branch does not exist locally. Attempting to fetch from origin"
  fi

  log "Fetching origin/$branch and resetting"
  git fetch origin "$branch"
  git checkout "$branch"
  git reset --hard "origin/$branch"

  # submodules if any
  if [ -f .gitmodules ]; then
    log "Has submodules: updating"
    git submodule sync --recursive
    git submodule update --init --recursive
  fi
  popd > /dev/null
}

install_deps_and_build() {
  local repo_dir="$1"
  pushd "$repo_dir" > /dev/null
  log "Installing dependencies (npm ci) in $repo_dir"
  if [ -f package-lock.json ]; then
    npm ci --silent
  else
    npm install --silent
  fi

  if [[ "$SKIP_BUILD" == "false" ]]; then
    if npm run | grep -q "build"; then
      log "Building app in $repo_dir"
      npm run build --if-present
    else
      log "No build script found for $repo_dir; skipping build"
    fi
  else
    log "Skip build requested; not running build step"
  fi

  popd > /dev/null
}

restart_pm2() {
  local name="$1"
  log "Restarting PM2 process: $name"
  $PM2_CMD restart "$name" --update-env || {
    log "PM2 restart failed for $name; attempting to start via ecosystem if exist"
    if [ -f deploy/ecosystem.config.js ]; then
      $PM2_CMD start deploy/ecosystem.config.js --only "$name" || {
        log "Failed to start $name from ecosystem file"
        exit 1
      }
    else
      log "No ecosystem.config.js - please start the app manually"
    fi
  }
}

reload_nginx() {
  if command -v nginx >/dev/null 2>&1; then
    log "Reloading Nginx config"
    sudo nginx -t && sudo systemctl reload nginx || log "nginx reload failed; check config"
  else
    log "Nginx not installed or not in PATH; skipping reload"
  fi
}

# Run update steps for a single app
update_app() {
  local app='$1'
  if [[ "$app" == "pishro" ]]; then
    repo_dir="$PISHRO_DIR"
    pm2_name="pishro-app"
  elif [[ "$app" == "pishro-admin" ]]; then
    repo_dir="$PISHRO_ADMIN_DIR"
    pm2_name="pishro-admin"
  else
    log "Unknown app: $app"
    return 1
  fi

  abort_if_dirty "$repo_dir"
  fetch_and_update "$repo_dir" "$BRANCH"
  install_deps_and_build "$repo_dir"
  restart_pm2 "$pm2_name"
}

# Start flow
log "Starting update-deploy: app=$APP_TO_UPDATE, branch=$BRANCH, skip_build=$SKIP_BUILD, force=$FORCE"

if [[ "$APP_TO_UPDATE" == "all" || "$APP_TO_UPDATE" == "pishro" ]]; then
  update_app pishro
fi

if [[ "$APP_TO_UPDATE" == "all" || "$APP_TO_UPDATE" == "pishro-admin" ]]; then
  update_app pishro-admin
fi

log "Saving PM2 state"
$PM2_CMD save

reload_nginx

log "Update deploy complete"
exit 0
