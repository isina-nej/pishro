// Node script to initiate a single-node replica set on local mongod (port 27019)
const { MongoClient } = require('mongodb');

async function run() {
  const url = 'mongodb://127.0.0.1:27019';
  const client = new MongoClient(url);
  try {
    await client.connect();
    const adminDb = client.db('admin');
    const config = { _id: 'rs0', members: [{ _id: 0, host: '127.0.0.1:27019' }] };
    const res = await adminDb.command({ replSetInitiate: config });
    console.log('replSetInitiate result:', res);
    const status = await adminDb.command({ replSetGetStatus: 1 });
    console.log('replSet status:', status);
  } catch (err) {
    console.error('Error initiating replset:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
