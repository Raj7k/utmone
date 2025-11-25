#!/bin/bash
set -e

echo "Building redirect service..."

# Install dependencies
npm ci

# Build TypeScript
npm run build

echo "✓ Build complete"
