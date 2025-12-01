# Nginx & PM2 quick deployment notes (pishrosarmaye)

This file contains recommended Nginx settings and PM2 workflows for deploying `pishro` and the `admin` (CMS) service.

## Nginx
Add the provided config files under `/etc/nginx/sites-available/` and create symbolic links under `/etc/nginx/sites-enabled/`:

```
# As root
sudo cp deploy/nginx/pishro.conf /etc/nginx/sites-available/pishro
sudo ln -sf /etc/nginx/sites-available/pishro /etc/nginx/sites-enabled/pishro

sudo cp deploy/nginx/pishro-cms.conf /etc/nginx/sites-available/pishro-cms
sudo ln -sf /etc/nginx/sites-available/pishro-cms /etc/nginx/sites-enabled/pishro-cms

sudo nginx -t
sudo systemctl reload nginx
```

Notes:
- The Nginx config adds `Access-Control-Allow-*` headers on `location /api/` and sets `Access-Control-Allow-Credentials: true` to let the frontend use cookie-based sessions or Authorization headers.
- If you need to support multiple origins, replace the `add_header 'Access-Control-Allow-Origin' 'https://admin.pishrosarmaye.com'` line with the correct origin(s). If you must allow all origins, set `*` but avoid that for security.

## PM2
We recommend using an ecosystem file to start and maintain the processes. A sample `deploy/ecosystem.config.js` was added.

Example start & update commands:
```
# Start using ecosystem
cd /opt/pishro
pm2 start deploy/ecosystem.config.js

# If you change environment variables (in ecosystem or .env), apply them with update-env
pm2 restart pishro-admin --update-env
pm2 restart pishro-app --update-env

# Save pm2 process list (persist across reboots)
pm2 save

# If pm2 startup not configured, run the startup command printed by `pm2 startup`.
```

### Quick update/deploy script
We added `deploy/update-deploy.sh` — a helper script to pull latest changes, run `npm ci`, build, and restart PM2. Use it like this:

```bash
# update both the main app and admin
sudo /opt/pishro/deploy/update-deploy.sh --app all --branch main

# update only the admin app
sudo /opt/pishro/deploy/update-deploy.sh --app pishro-admin --branch main

# skip build (useful if you just want to pull code and restart)
sudo /opt/pishro/deploy/update-deploy.sh --app pishro-admin --branch main --skip-build

# Force update even with local changes (dangerous)
sudo /opt/pishro/deploy/update-deploy.sh --app all --branch main --force
```


## Avoiding duplicate processes
- If you have duplicate processes (e.g., `pishro-admin` repeated), check `pm2 ls` and `pm2 show <id>` to find which PID and `cwd` the process is running with.
- Remove unwanted duplicate by `pm2 delete <id>` and then `pm2 save`.

## Notes on S3 and CORS
- To enable direct browser PUT to S3 you MUST configure S3 bucket's CORS policy to allow origin `https://admin.pishrosarmaye.com` and `PUT` and `Content-Type` headers.
- You can avoid CORS issues by setting `NEXT_PUBLIC_FORCE_LOCAL_API=1` on admin app to use the admin server as a same-origin proxy for backend calls.

## Troubleshooting
- Check pm2 logs for errors `pm2 logs pishro-admin` and `pm2 logs pishro-app`.
- Check Nginx error logs `/var/log/nginx/error.log`.
- Use `curl` to test the OPTIONS preflight and direct API calls as documented in code.

*** End ***
