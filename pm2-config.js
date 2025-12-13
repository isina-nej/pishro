export const apps = [
  {
    name: 'pishro',
    script: 'npm',
    args: 'run start',
    cwd: '/opt/pishro',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: 'mongodb://admin:admin123456@127.0.0.1:27017/pishro?authSource=admin'
    }
  },
  {
    name: 'pishro-admin',
    script: 'npm',
    args: 'run start',
    cwd: '/opt/pishro-admin',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production'
    }
  }
];
