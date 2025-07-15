# Runtime Environment Variables Setup

## Problem

The original setup had environment variables embedded at build time, which meant they couldn't be changed without rebuilding the application. This is problematic for Kubernetes deployments where you want to use different configurations for different environments.

## Solution

This project now uses **runtime environment variables only**, which can be set in Kubernetes and will be respected by the application without requiring a rebuild.

## How It Works

### 1. Nginx Configuration
The nginx configuration includes a special endpoint `/env-config.js` that serves a JavaScript file with runtime environment variables:

```nginx
location /env-config.js {
    add_header Content-Type application/javascript;
    return 200 'window.ENV_CONFIG = {
        VITE_APP_BASE_URI: "$VITE_APP_BASE_URI",
        VITE_API_BASE_URL: "$VITE_API_BASE_URL",
        VITE_ENABLE_MSAL: "$VITE_ENABLE_MSAL",
        VITE_THEME_NAME: "$VITE_THEME_NAME",
        VITE_THEME_MODE: "$VITE_THEME_MODE",
        VITE_MSAL_CLIENT_ID: "$VITE_MSAL_CLIENT_ID",
        VITE_MSAL_AUTHORITY: "$VITE_MSAL_AUTHORITY",
        VITE_DEHYDRATED_API_IDENTIFIER: "$VITE_DEHYDRATED_API_IDENTIFIER"
    };';
}
```

### 2. Docker Entrypoint
The `docker-entrypoint.sh` script uses `envsubst` to substitute environment variables in the nginx configuration template:

```bash
#!/bin/bash
envsubst '$VITE_APP_BASE_URI $VITE_API_BASE_URL $VITE_ENABLE_MSAL $VITE_THEME_NAME $VITE_THEME_MODE $VITE_MSAL_CLIENT_ID $VITE_MSAL_AUTHORITY $VITE_DEHYDRATED_API_IDENTIFIER' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
exec nginx -g "daemon off;"
```

### 3. Application Environment Utility
The `src/utils/env.ts` utility provides a way to access runtime environment variables:

```typescript
export const getEnvVar = (key: keyof EnvConfig): string | undefined => {
  // Only use runtime environment variable from window.ENV_CONFIG
  if (typeof window !== 'undefined' && window.ENV_CONFIG) {
    return window.ENV_CONFIG[key];
  }

  return undefined;
};
```

### 4. Application Initialization
The application loads runtime environment variables before rendering:

```typescript
const initializeApp = async () => {
  // Load runtime environment variables
  await loadRuntimeEnv();
  
  // Now render the app with the loaded variables
  // ...
};
```

## Usage

### In Kubernetes
Environment variables are set in the deployment:

```yaml
env:
- name: VITE_APP_BASE_URI
  valueFrom:
    configMapKeyRef:
      name: dehydrated-frontend-config
      key: VITE_APP_BASE_URI
```

### In Application Code
Use the `getEnvVar` utility to access environment variables:

```typescript
import { getEnvVar } from '@/utils/env';

const apiUrl = getEnvVar('VITE_API_BASE_URL') || '';
const isMsalEnabled = getEnvVar('VITE_ENABLE_MSAL') === 'true';
```

## Benefits

1. **No rebuild required**: Environment variables can be changed by updating the Kubernetes deployment
2. **Runtime only**: No build-time environment variables to manage
3. **Flexible**: Easy to deploy the same image to different environments
4. **Type safe**: Full TypeScript support with proper typing
5. **Graceful fallbacks**: Handles missing environment variables properly

## Migration Guide

1. Replace all `import.meta.env.VITE_*` usage with `getEnvVar('VITE_*')`
2. Add fallback values where appropriate: `getEnvVar('VITE_API_BASE_URL') || ''`
3. Import the utility: `import { getEnvVar } from '@/utils/env'`

## Testing

The environment variable utility is fully tested. Run tests with:

```bash
npm test
```

## Development vs Production

- **Development**: Environment variables are loaded from `/env-config.js` endpoint
- **Production**: Environment variables are injected by nginx at container startup
- **Testing**: Environment variables are mocked in test setup 