import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';

let url = 'mongodb://127.0.0.1:27017/pishro';
try {
  const env = readFileSync('./.env', 'utf8');
  env.split(/\r?\n/).forEach((line) => {
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key = line.slice(0, idx);
    const val = line.slice(idx + 1).replace(/^"(.*)"$/, '$1');
    if (key === 'DATABASE_URL') url = val;
  });
} catch (e) {}

async function main() {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db();

  const now = new Date();

  const images = [
    {
      filename: 'home-slide-1.jpg',
      url: '/images/home/slide-1.jpg',
      uploadedById: null,
      category: 'home',
      published: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      filename: 'home-slide-2.jpg',
      url: '/images/home/slide-2.jpg',
      uploadedById: null,
      category: 'home',
      published: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const imgRes = await db.collection('Image').insertMany(images);
  const imageIds = Object.values(imgRes.insertedIds);

  const slides = [
    {
      title: 'اسلاید اول',
      subtitle: 'معرفی خدمات پیشرو',
      imageUrl: images[0].url,
      imageId: imageIds[0],
      ctaText: 'مشاهده دوره‌ها',
      ctaLink: '/courses',
      published: true,
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: 'اسلاید دوم',
      subtitle: 'مشاوره سرمایه‌گذاری',
      imageUrl: images[1].url,
      imageId: imageIds[1],
      ctaText: 'درخواست مشاوره',
      ctaLink: '/business-consulting',
      published: true,
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const miniSliders = [
    {
      row: 1,
      title: 'مینی اسلایدر ۱',
      imageUrl: '/images/home/mini-1.jpg',
      published: true,
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      row: 1,
      title: 'مینی اسلایدر ۲',
      imageUrl: '/images/home/mini-2.jpg',
      published: true,
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.collection('HomeSlide').insertMany(slides);
  await db.collection('HomeMiniSlider').insertMany(miniSliders);

  console.log('Inserted slides and mini sliders. Image ids:', imageIds.map((id) => id.toString()));

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
