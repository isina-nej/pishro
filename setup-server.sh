#!/bin/bash

# Script to setup and run pishro project on server

cd /opt/pishro

# Create .env file if not exists
if [ ! -f .env ]; then
    cat > .env << 'ENVEOF'
# DATABASE
DATABASE_URL="mongodb://localhost:27017/pishro"

# OBJECT STORAGE (iranServer S3)
S3_ENDPOINT="https://s3.iran-server.com"
S3_REGION="default"
S3_ACCESS_KEY_ID="test"
S3_SECRET_ACCESS_KEY="test"
S3_BUCKET_NAME="pishro-videos"
S3_PUBLIC_URL="https://pishro.iran-server.com"

# TEMP DIRECTORY
TEMP_DIR="/tmp/video-processing"

# NODE ENVIRONMENT
NODE_ENV="production"

# AUTH
AUTH_SECRET="dGVzdC1zZWNyZXQta2V5LXRlc3Qtc2VjcmV0LWtleS1kZW1v"
NEXTAUTH_URL="http://178.239.147.136:3000"

# SMS PROVIDER
SMS_USERNAME="test"
SMS_PASSWORD="test"
SMS_FROM="1000"

# PAYMENT (ZarinPal)
ZARINPAL_MERCHANT_ID="test"
ZARINPAL_CALLBACK_URL="http://178.239.147.136:3000/api/payment/verify"

# FILE STORAGE
UPLOAD_STORAGE_PATH="/opt/pishro/uploads"
UPLOAD_BASE_URL="http://178.239.147.136/uploads"
ENVEOF
    echo ".env file created"
fi

# Create upload directory
mkdir -p /opt/pishro/uploads
mkdir -p /tmp/video-processing

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

# Start the project
echo "Starting project..."
npm start
