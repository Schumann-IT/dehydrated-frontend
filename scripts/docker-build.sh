#!/bin/bash

# Create a temporary directory for the build context
BUILD_DIR=$(mktemp -d)
echo "Creating build context in $BUILD_DIR"

# Copy the main project files
cp -r . "$BUILD_DIR/"
cp -r ../dehydrated-frontend-theme "$BUILD_DIR/dehydrated-frontend-theme"

# Update the package.json to use the local theme package
cd "$BUILD_DIR"
npm pkg set dependencies.@schumann-it/theme="file:./dehydrated-frontend-theme"

# Build the Docker image
docker build -t dehydrated-frontend .

# Clean up
cd -
rm -rf "$BUILD_DIR"

echo "Build completed successfully!" 