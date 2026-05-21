const fs = require('fs');
const path = require('path');

async function testMkdir() {
  const uploadBase = './uploads';
  const testDir = path.join(uploadBase, 'tmp', 'test123');
  console.log('Testing mkdir for:', testDir);
  console.log('Absolute path:', path.resolve(testDir));
  
  try {
    await fs.promises.mkdir(testDir, { recursive: true });
    console.log('✓ Directory created successfully');
  } catch (err) {
    console.error('✗ Error:', err.message);
  }
}

testMkdir();
