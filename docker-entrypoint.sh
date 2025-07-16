#!/bin/bash

# Generate env-config.js from environment variables
./generate-env-config.sh

# Start nginx
exec nginx -g "daemon off;" 