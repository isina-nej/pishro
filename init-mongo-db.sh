#!/bin/bash

# Create pishro database and users
MONGO_CONTAINER="pishro-mongodb"

echo "⏳ منتظر شروع MongoDB..."
sleep 5

echo "🗄️  ایجاد pishro database و user..."
docker exec $MONGO_CONTAINER mongo admin -u admin -p admin123456 <<'EOF'
use pishro
db.createUser({
  user: "pishro",
  pwd: "pishro123456",
  roles: [{role: "readWrite", db: "pishro"}]
})
EOF

echo "✅ Database users تنظیم شدند"

# تست
echo "🧪 تست اتصال..."
docker exec $MONGO_CONTAINER mongo admin -u admin -p admin123456 --authenticationDatabase admin --eval 'db.adminCommand("ping")'

echo ""
echo "✔️  MongoDB آماده است"
