(async () => {
  try {
    const res = await fetch('http://localhost:3000');
    const html = await res.text();
    console.log('HTML length:', html.length);
    console.log('HAS_HERO:', html.includes('پیشرو سرمایه'));
    console.log('HAS_SLIDE1_IMAGE:', html.includes('/images/home/slide-1.jpg'));
    console.log('SNIPPET:', html.slice(0, 1200));
  } catch (e) {
    console.error('ERR', e instanceof Error ? e.message : e);
    process.exit(1);
  }
})();
