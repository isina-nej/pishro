#!/bin/bash

# MongoDB Installation Script for Ubuntu 20.04
# Run this script with sudo: sudo ./install-mongodb.sh

set -e

echo "🚀 Starting MongoDB Installation..."

# 1. Import the public key used by the package management system
if ! apt-key list | grep -q "MongoDB"; then
    echo "🔑 Importing MongoDB public key..."
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
fi

# 2. Create a list file for MongoDB
echo "📂 Creating MongoDB list file..."
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 3. Reload local package database
echo "🔄 Updating package database..."
sudo apt-get update

# 4. Install the MongoDB packages
echo "📦 Installing MongoDB packages..."
sudo apt-get install -y mongodb-org

# 5. Start MongoDB
echo "▶️ Starting MongoDB service..."
sudo systemctl start mongod

# 6. Enable MongoDB to start on boot
echo "🔌 Enabling MongoDB on boot..."
sudo systemctl enable mongod

# 7. Check status
echo "🔍 Checking MongoDB status..."
sudo systemctl status mongod --no-pager

echo "✅ MongoDB installation completed successfully!"
echo "⚠️  NOTE: By default, MongoDB listens on localhost (127.0.0.1). If you need remote access, you must edit /etc/mongod.conf and change bindIp."
