#!/bin/bash

# Test books upload endpoint

API_URL="https://pishrosarmaye.com"
TEST_FILE="/tmp/test.pdf"

# Create a test PDF file
echo "Test PDF content" > "$TEST_FILE"

echo "🧪 Testing books upload endpoint..."
echo "URL: ${API_URL}/api/admin/books/upload"
echo ""

# Test the endpoint
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@${TEST_FILE}" \
  -F "type=pdf" \
  "${API_URL}/api/admin/books/upload" \
  -v 2>&1 | head -50

echo ""
echo "✅ Test complete"

# Cleanup
rm -f "$TEST_FILE"
