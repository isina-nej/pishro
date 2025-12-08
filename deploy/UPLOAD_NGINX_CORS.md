# How to serve /uploads and enable CORS (Nginx + S3)

If images in your frontend are served from `/uploads/` on your VPS (static storage) or directly from S3, ensure the server responds with the proper CORS headers and the correct root path.

1) Verify path and permissions on the server (run on your server via SSH):

```bash
# list files
ls -la /var/www/uploads
# check example file
stat /var/www/uploads/avatars/example.jpg
# test via curl from server
curl -I http://localhost/uploads/avatars/example.jpg
```

2) Example Nginx `location` block to serve `/uploads/` and add CORS headers

Replace the existing `location /uploads/` block or insert it in your Nginx server block for `www.pishrosarmaye.com`:

```nginx
location /uploads/ {
  alias /var/www/uploads/;
  access_log off;
  expires 30d;
  add_header Access-Control-Allow-Origin "*";
  add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";
  add_header Access-Control-Allow-Headers "Authorization,Content-Type";
  # If you want to limit origins, replace '*' with specific domains:
  # add_header Access-Control-Allow-Origin "https://pishrosarmaye.com";
}
```

3) For S3-hosted files -> CORS policy

If you use S3 (S3-compatible service like poshtiban), set the bucket CORS to something like:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "OPTIONS"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Replace `AllowedOrigins` with `https://www.pishrosarmaye.com` and/or `http://localhost:3002` for stricter rules.

4) Reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

5) Check headers from a remote machine (your dev workstation):

```bash
curl -I -H "Origin: http://localhost:3002" https://www.pishrosarmaye.com/uploads/avatars/example.jpg
```

The response should include `Access-Control-Allow-Origin` header.

6) Verify Next.js config & restart there:

 - Ensure `next.config.ts` remotePatterns include the S3 or `www.pishrosarmaye.com` host.
 - Restart server: `npm run dev` (or the production process manager systemd/pm2 etc.)

If you'd like, provide me the `curl -I` responses and I’ll help interpret them.
