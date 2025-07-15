FROM docker.io/library/nginx:alpine

# Install envsubst
RUN apk add --no-cache bash

# Copy built application from builder stage
COPY dist /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/nginx.conf.template

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 8080
EXPOSE 8080

# Start with environment variable substitution
ENTRYPOINT ["/docker-entrypoint.sh"] 