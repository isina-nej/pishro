import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    // wait a bit for client components to hydrate
    await page.waitForTimeout(1500);

    const heroText = await page.evaluate(() => {
      const el = document.querySelector('h1, h2, [data-hero-title]');
      return el ? (el.textContent || '').trim() : null;
    });

    const slideImg = await page.evaluate(() => {
      const img = Array.from(document.querySelectorAll('img')).find(i => (i.src || '').includes('/images/home/slide-1') || (i.getAttribute('src')||'').includes('/images/home/slide-1'));
      return img ? (img.src || img.getAttribute('src')) : null;
    });

    const slideTitleExists = await page.evaluate(() => !!Array.from(document.querySelectorAll('*')).find(n => (n.textContent||'').includes('اسلاید اول')));

    console.log('HERO_TEXT:', heroText);
    console.log('SLIDE_IMAGE_SRC:', slideImg);
    console.log('SLIDE_TITLE_FOUND:', slideTitleExists);

  } catch (e) {
    console.error('ERR', e.message || e);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
