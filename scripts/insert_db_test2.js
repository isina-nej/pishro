db.DigitalBook.insertOne({
  title: 'TEST BOOK AUTO 2',
  slug: 'test-book-auto-2-' + Date.now(),
  author: 'automation',
  description: 'Inserted with tagIds',
  year: 2025,
  category: 'debug',
  formats: [],
  status: [],
  tags: [],
  tagIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
});
