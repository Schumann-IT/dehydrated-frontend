#!/bin/bash

# Load environment variables from .env.local if it exists
if [ -f ".env.local" ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Set default values for missing environment variables
export VITE_APP_BASE_URI=${VITE_APP_BASE_URI:-"http://localhost:8080"}
export VITE_API_BASE_URL=${VITE_API_BASE_URL:-"http://localhost:3000"}
export VITE_ENABLE_MSAL=${VITE_ENABLE_MSAL:-"false"}
export VITE_THEME_NAME=${VITE_THEME_NAME:-"hansemerkur"}
export VITE_THEME_MODE=${VITE_THEME_MODE:-"light"}
export VITE_MSAL_CLIENT_ID=${VITE_MSAL_CLIENT_ID:-""}
export VITE_MSAL_AUTHORITY=${VITE_MSAL_AUTHORITY:-""}
export VITE_DEHYDRATED_API_IDENTIFIER=${VITE_DEHYDRATED_API_IDENTIFIER:-""}

# Build the application first
echo "Building the application..."
npm run build

# Substitute environment variables in nginx configuration
echo "Substituting environment variables in nginx configuration..."
envsubst '$VITE_APP_BASE_URI $VITE_API_BASE_URL $VITE_ENABLE_MSAL $VITE_THEME_NAME $VITE_THEME_MODE $VITE_MSAL_CLIENT_ID $VITE_MSAL_AUTHORITY $VITE_DEHYDRATED_API_IDENTIFIER' < nginx.conf > nginx-local.conf

# Start nginx with the processed configuration
echo "Starting nginx on port 8080..."
nginx -c $(pwd)/nginx-local.conf -g "daemon off;" 