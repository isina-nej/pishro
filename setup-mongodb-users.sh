#!/bin/bash

# Setup MongoDB Users and Databases for Pishro

MONGO_CONTAINER="pishro-mongodb"

echo "🔧 تنظیم MongoDB شروع شد..."

# منتظر شروع MongoDB
sleep 5

# ایجاد admin user
echo "👤 ایجاد admin user..."
docker exec $MONGO_CONTAINER mongo <<EOF
use admin
db.createUser({
  user: "admin",
  pwd: "admin123456",
  roles: [{role: "root", db: "admin"}]
})
EOF

# ایجاد pishro database و user
echo "🗄️  ایجاد pishro database..."
docker exec $MONGO_CONTAINER mongo admin -u admin -p admin123456 <<EOF
use pishro
db.createUser({
  user: "pishro",
  pwd: "pishro123456",
  roles: [{role: "readWrite", db: "pishro"}]
})
EOF

echo "✅ تنظیم MongoDB تکمیل شد"

# تست اتصال
echo "🧪 تست اتصال..."
docker exec $MONGO_CONTAINER mongo mongodb://admin:admin123456@localhost:27017/admin --eval 'print("✅ Admin connection OK")' || echo "⚠️  تست ناموفق"

docker exec $MONGO_CONTAINER mongo mongodb://pishro:pishro123456@localhost:27017/pishro --eval 'print("✅ Pishro connection OK")' || echo "⚠️  تست ناموفق"
