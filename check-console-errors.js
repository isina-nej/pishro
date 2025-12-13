/**
 * Script to check console errors on the homepage
 * Run with: npx ts-node check-console-errors.js
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkConsoleErrors() {
  try {
    const response = await fetch('http://localhost:3000', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    const html = await response.text();
    
    // Look for console errors in the HTML
    console.log('✓ Server responded with status:', response.status);
    console.log('✓ HTML length:', html.length);
    
    // Check for error patterns
    if (html.includes('error') || html.includes('Error')) {
      console.log('⚠ Found "error" in HTML');
    }
    
    if (html.includes('undefined')) {
      console.log('⚠ Found "undefined" references');
    }
    
    // Check for next.js specific patterns
    if (html.includes('__NEXT_DATA__')) {
      console.log('✓ Next.js data found');
    }
    
  } catch (error) {
    console.error('✗ Error fetching page:', error.message);
  }
}

checkConsoleErrors();
