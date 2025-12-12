#!/bin/bash

# MongoDB Replica Set Initialization Script
# برای راه‌اندازی replica set در MongoDB

echo "🔧 Initializing MongoDB Replica Set..."

# اتصال به MongoDB و ایجاد replica set
docker exec pishro-mongo mongo --eval "
rs.initiate(
  {
    _id: 'rs0',
    members: [
      { _id: 0, host: 'localhost:27017' }
    ]
  },
  { force: true }
)" 2>&1 || true

echo ""
echo "⏳ Waiting 5 seconds for replica set to initialize..."
sleep 5

# بررسی وضعیت
echo ""
echo "📊 Checking replica set status..."
docker exec pishro-mongo mongo --eval "rs.status()" 2>&1 | grep -E '"ok"|"members"|"stateStr"|"name"' || true

echo ""
echo "✅ MongoDB Replica Set initialization complete!"
