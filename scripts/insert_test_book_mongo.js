const conn = new Mongo("mongodb://admin:admin123456@127.0.0.1:27017/pishro?authSource=admin");
const db = conn.getDB("pishro");
const names = db.getCollectionNames();
printjson(names);
const col = names.find(n => /digital/i.test(n)) || names[0];
print('using collection: ' + col);
const res = db.getCollection(col).insertOne({
  title: "TEST BOOK AUTO MONGO " + new Date().toISOString(),
  slug: "test-book-auto-mongo-" + Date.now(),
  author: "automation",
  description: "Inserted by automation for debugging via mongosh",
  year: 2025,
  category: "debug",
  createdAt: new Date(),
  updatedAt: new Date()
});
printjson(res);
