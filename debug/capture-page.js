import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-extensions', '--disable-setuid-sandbox'], ignoreHTTPSErrors: true });
    console.log('Browser launched');
    const page = await browser.newPage();

    page.on('console', (msg) => {
      console.log('PAGE LOG:', msg.type(), msg.text());
    });

    page.on('pageerror', (err) => {
      console.error('PAGE ERROR:', err.message);
    });

    page.on('response', (res) => {
      if (res.status() >= 400) {
        console.error(`HTTP ERROR ${res.status()} ${res.url()}`);
      }
    });

    try {
      console.log('Navigating...');
      await page.goto('http://pishrosarmaye.com/business-consulting', { waitUntil: 'networkidle0', timeout: 60000 });
      console.log('Page loaded, taking screenshot...');
      await page.screenshot({ path: 'business-consulting.png', fullPage: true });
      console.log('Screenshot saved');
    } catch (err) {
      console.error('NAV ERROR:', err.message);
    } finally {
      await browser.close();
      console.log('Browser closed');
    }
  } catch (err) {
    console.error('ERROR:', err);
  }
})();
