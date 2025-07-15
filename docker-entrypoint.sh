#!/bin/bash

# Substitute environment variables in nginx configuration
envsubst '$VITE_APP_BASE_URI $VITE_API_BASE_URL $VITE_ENABLE_MSAL $VITE_THEME_NAME $VITE_THEME_MODE $VITE_MSAL_CLIENT_ID $VITE_MSAL_AUTHORITY $VITE_DEHYDRATED_API_IDENTIFIER' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start nginx
exec nginx -g "daemon off;" 