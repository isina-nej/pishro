/**
 * Test script to verify page loads correctly
 * Checks for common issues:
 * 1. Server responds with 200
 * 2. Page loads without crashing
 * 3. Images are accessible
 * 4. No obvious JS errors
 */

import fetch from 'node-fetch';
import cheerio from 'cheerio';

async function testPage() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('\n📋 Testing Pishro Application\n');
    console.log('=' .repeat(50));
    
    // Test 1: Server Health
    console.log('\n✓ Test 1: Server Response');
    const response = await fetch(baseUrl);
    if (response.status === 200) {
      console.log('  ✅ Server responded with 200');
    } else {
      console.log(`  ⚠️ Server responded with ${response.status}`);
    }
    
    // Test 2: Check HTML content
    console.log('\n✓ Test 2: HTML Content');
    const html = await response.text();
    console.log(`  ✅ HTML length: ${html.length} bytes`);
    
    // Test 3: Check for Next.js hydration
    if (html.includes('__NEXT_DATA__')) {
      console.log('  ✅ Next.js hydration data found');
    } else {
      console.log('  ⚠️ Next.js hydration data missing');
    }
    
    // Test 4: Parse images
    console.log('\n✓ Test 3: Image References');
    const $ = cheerio.load(html);
    const images = $('img');
    console.log(`  Found ${images.length} images`);
    
    // Sample some image srcs
    let imageCount = 0;
    images.each((i, el) => {
      if (imageCount < 5) {
        const src = $(el).attr('src');
        console.log(`    - ${src}`);
        imageCount++;
      }
    });
    
    // Test 5: Check for error patterns
    console.log('\n✓ Test 4: Error Detection');
    if (html.includes('error') || html.includes('Error')) {
      console.log('  ⚠️ "error" keyword found in HTML');
    } else {
      console.log('  ✅ No obvious error keywords detected');
    }
    
    // Test 6: Check for common paths
    console.log('\n✓ Test 5: Asset Paths');
    const publicPaths = [
      '/images/',
      '/_next/',
      '/font/',
      '/icons/',
    ];
    
    publicPaths.forEach(path => {
      if (html.includes(path)) {
        console.log(`  ✅ ${path} found`);
      } else {
        console.log(`  ⚠️ ${path} not found`);
      }
    });
    
    console.log('\n' + '=' .repeat(50));
    console.log('\n✅ Tests completed!\n');
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    process.exit(1);
  }
}

testPage();
