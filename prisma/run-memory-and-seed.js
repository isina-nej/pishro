#!/usr/bin/env node
import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'child_process';

async function main() {
  try {
    console.log('Starting in-memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    let uri = mongod.getUri();
    console.log('MongoDB in-memory URI (raw):', uri);

    // Prisma requires a database name in the connection string. Append a default DB name if missing.
    const hasDb = /mongodb:\/\/[^\/]+\/[^\/\?]+/.test(uri);
    if (!hasDb) {
      const defaultDb = 'pishro_mem';
      uri = uri.replace(/\/+$/, '') + '/' + defaultDb;
    }
    console.log('Using MongoDB URI:', uri);

    const env = Object.assign({}, process.env, { DATABASE_URL: uri });

    console.log('Running: prisma db push');
    const push = spawn('npx', ['prisma', 'db', 'push'], { stdio: 'inherit', env, shell: true });
    push.on('exit', (code) => {
      if (code !== 0) {
        console.error('prisma db push failed with code', code);
        mongod.stop();
        process.exit(code);
      }

      console.log('Running: npm run seed');
      const seed = spawn('npm', ['run', 'seed'], { stdio: 'inherit', env, shell: true });
      seed.on('exit', async (code2) => {
        if (code2 !== 0) {
          console.error('seed failed with code', code2);
          await mongod.stop();
          process.exit(code2);
        }
        console.log('Seeding finished successfully. Stopping in-memory MongoDB.');
        await mongod.stop();
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Error in runner:', err);
    process.exit(1);
  }
}

main();
