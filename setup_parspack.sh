#!/bin/bash

# --- Configuration ---
REMOTE_NAME="parspack_auto"
BUCKET_NAME="c773651"
ENDPOINT="s3.parspack.net"
ACCESS_KEY="z5Valwnm6lr8Veea"
SECRET_KEY="NrGQ2qAlaufOcBeUmJ0ufX9EBj6xK9AF"
TEST_FILE="rclone_test_file.txt"
TEST_CONTENT="Hello ParsPack from rclone!"

# --- Helper Functions ---
print_info() {
    echo "INFO: $1"
}

print_success() {
    echo "✅ SUCCESS: $1"
}

print_error() {
    echo "❌ ERROR: $1"
    exit 1
}

# --- Main Script ---

# 1. Install rclone if not exists
if ! command -v rclone &> /dev/null; then
    print_info "rclone not found. Installing..."
    sudo apt update && sudo apt install rclone -y
    if [ $? -ne 0 ]; then
        print_error "Failed to install rclone. Please install it manually and run the script again."
    fi
    print_success "rclone installed."
else
    print_info "rclone is already installed."
fi

# 2. Create or update rclone config
print_info "Creating/Updating rclone config for remote: $REMOTE_NAME"
rclone config create "$REMOTE_NAME" s3 \
    provider "Other" \
    env_auth "false" \
    access_key_id "$ACCESS_KEY" \
    secret_access_key "$SECRET_KEY" \
    endpoint "$ENDPOINT"

# Check if config was created
if ! rclone config dump | grep -q "\[$REMOTE_NAME\]"; then
    print_error "Failed to create rclone config. Please check permissions."
fi
print_success "rclone config '$REMOTE_NAME' created/updated."

# 3. Create a local test file
print_info "Creating local test file: $TEST_FILE"
echo "$TEST_CONTENT" > "$TEST_FILE"

# 4. Upload the test file
print_info "Uploading $TEST_FILE to $BUCKET_NAME..."
rclone copy "$TEST_FILE" "$REMOTE_NAME:$BUCKET_NAME/"
if [ $? -ne 0 ]; then
    print_error "Failed to upload the test file."
fi
print_success "Test file uploaded."

# 5. Verify the upload by listing files
print_info "Verifying by listing files in $BUCKET_NAME..."
LIST_OUTPUT=$(rclone ls "$REMOTE_NAME:$BUCKET_NAME/")
if ! echo "$LIST_OUTPUT" | grep -q "$TEST_FILE"; then
    print_error "Verification failed! Uploaded file not found in the bucket."
fi
print_success "Verification successful. File found in bucket."

# 6. Clean up: remove the test file from the bucket and locally
print_info "Cleaning up..."
rclone deletefile "$REMOTE_NAME:$BUCKET_NAME/$TEST_FILE"
rm "$TEST_FILE"
print_success "Cleanup complete. Test files removed from bucket and locally."

echo -e "\n\n🚀🚀🚀\nAll tests passed! Your rclone remote '$REMOTE_NAME' is configured correctly and works perfectly with your ParsPack bucket.\n🚀🚀🚀"
