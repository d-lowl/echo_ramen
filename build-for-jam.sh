#!/bin/bash
# Build script for EchoRamen - Gamedev.js Jam 2025 submission

echo "Building EchoRamen for Gamedev.js Jam 2025..."

# Ensure we have a clean build
rm -rf ./dist
rm -rf ./echoramen-jam-submission.zip

# Run the production build
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed! Aborting."
    exit 1
fi

echo "Build successful!"

# Copy additional files to dist
cp itch-io-description.md ./dist/
cp README.md ./dist/

# Create a ZIP file for submission
cd dist
zip -r ../echoramen-jam-submission.zip ./*
cd ..

echo "Submission package created: echoramen-jam-submission.zip"
echo "Upload this file to the Gamedev.js Jam 2025 on itch.io"
echo "Good luck in the jam!" 