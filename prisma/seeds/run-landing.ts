import { seedLandingPages } from './landing-seed';

seedLandingPages()
  .catch((e) => {
    console.error('Error running landing seeder:', e);
    process.exit(1);
  })
  .finally(() => {
    // allow process to exit
    process.exit(0);
  });
