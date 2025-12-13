db.DigitalBook.insertOne({
  title: 'TEST BOOK AUTO',
  slug: 'test-book-auto-' + Date.now(),
  author: 'automation',
  description: 'Inserted by automation for debugging',
  year: 2025,
  category: 'debug',
  createdAt: new Date(),
  updatedAt: new Date()
});
