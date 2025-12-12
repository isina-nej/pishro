#!/bin/bash
# Reinitialize MongoDB Replica Set with correct hostname

docker exec -i pishro-mongo mongo << 'MONGOSCRIPT'
rs.initiate(
  {
    _id: 'rs0',
    members: [
      { _id: 0, host: 'pishro-mongo:27017' }
    ]
  },
  { force: true }
)
MONGOSCRIPT

sleep 2
echo "Checking replica set status..."
docker exec pishro-mongo mongo --eval "rs.status().ok ? 'OK' : 'FAILED'"
