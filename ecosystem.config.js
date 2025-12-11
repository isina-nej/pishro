module.exports = {
  apps: [
    {
      name: 'pishro',
      script: 'npm',
      args: 'run start',
      cwd: '/opt/pishro',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'mongodb://localhost:27017/pishro',
        NEXT_PUBLIC_API_URL: 'https://pishrosarmaye.com/api',
        NEXT_PUBLIC_BASE_URL: 'https://pishrosarmaye.com',
      },
    },
  ],
};
