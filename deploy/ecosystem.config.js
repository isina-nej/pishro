module.exports = {
  apps: [
    {
      name: "pishro-app",
      script: "npm",
      args: "start",
      cwd: "/opt/pishro",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_BASE_URL: "https://www.pishrosarmaye.com",
        NEXT_PUBLIC_API_URL: "https://www.pishrosarmaye.com/api",
      },
    },
    {
      name: "pishro-admin",
      script: "npm",
      args: "start -- -p 3001",
      cwd: "/opt/pishro-admin",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        NEXT_PUBLIC_BASE_URL: "https://admin.pishrosarmaye.com",
        NEXT_PUBLIC_API_URL: "https://www.pishrosarmaye.com/api",

        # Set FORCE_LOCAL_API=1 to use admin's server as same-origin proxy when
        # backend CORS is unavailable. Comment out or remove if you prefer direct cross-origin.
        NEXT_PUBLIC_FORCE_LOCAL_API: "1",

        # S3 envs - required if you want admin to sign direct upload or upload via server
        S3_ENDPOINT: "https://teh-1.s3.poshtiban.com",
        S3_REGION: "default",
        S3_BUCKET_NAME: "videos",
        S3_ACCESS_KEY_ID: "REPLACE_WITH_KEY",
        S3_SECRET_ACCESS_KEY: "REPLACE_WITH_SECRET",
      },
    },
  ],
};
