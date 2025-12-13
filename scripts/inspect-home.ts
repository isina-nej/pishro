(async () => {
  try {
    const res = await fetch('http://localhost:3000');
    const html = await res.text();
    console.log('HAS_SLIDE_TITLE_1:', html.includes('اسلاید اول'));
    const matches = [...html.matchAll(/\/images\/home\/[\w\-\.]+/g)].map(m=>m[0]);
    console.log('IMAGES_FOUND_COUNT:', matches.length);
    console.log(matches.slice(0,20));
  } catch (e) {
    console.error('ERR', e.message || e);
    process.exit(1);
  }
})();
