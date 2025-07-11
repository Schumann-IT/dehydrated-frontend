# Dehydrated Frontend - Kubernetes Deployment Guide

This guide explains how to deploy the Dehydrated Frontend React application to Kubernetes.

## Prerequisites

Before deploying to Kubernetes, ensure you have:

1. **Kubernetes Cluster**: A running Kubernetes cluster (local or cloud)
2. **kubectl**: Kubernetes command-line tool configured
3. **Docker**: For building the container image
4. **Container Registry**: Access to push/pull images (optional for local development)

## Architecture Overview

The deployment consists of:
- **Docker Container**: Multi-stage build with Node.js for building and nginx for serving
- **Kubernetes Deployment**: Manages the application pods
- **Service**: Internal load balancer for pod communication
- **Ingress**: External access with SSL termination
- **ConfigMap**: Environment configuration
- **Namespace**: Resource isolation

## Step-by-Step Deployment

### 1. Build the Docker Image

```bash
# Build the image locally
docker build -t dehydrated-frontend:latest .

# If using a remote registry, tag and push
docker tag dehydrated-frontend:latest your-registry/dehydrated-frontend:latest
docker push your-registry/dehydrated-frontend:latest
```

### 2. Update Image Reference

Edit `k8s/kustomization.yaml` to point to your image:

```yaml
images:
- name: dehydrated-frontend
  newTag: latest
  # If using remote registry:
  # newName: your-registry/dehydrated-frontend
```

### 3. Configure Environment Variables

Update `k8s/configmap.yaml` with your specific configuration:

```yaml
data:
  # Vite environment variables
  VITE_APP_BASE_URI: "https://your-frontend-domain.com"
  VITE_API_BASE_URL: "https://your-api-domain.com"
  VITE_ENABLE_MSAL: "false"
  VITE_THEME_NAME: "schumann-it"
  VITE_THEME_MODE: "light"
  
  # Environment
  NODE_ENV: "production"
```

If you want to enable MSAL authentication, update `k8s/secret.yaml` with your MSAL configuration:

```bash
# Encode your MSAL values
echo -n "your-msal-client-id" | base64
echo -n "your-msal-authority" | base64
echo -n "your-api-identifier" | base64
```

Then set `VITE_ENABLE_MSAL: "true"` in the configmap.

### 4. Configure Ingress

Update `k8s/ingress.yaml` with your domain:

```yaml
spec:
  tls:
  - hosts:
    - your-frontend-domain.com  # Replace with your domain
    secretName: dehydrated-frontend-tls
  rules:
  - host: your-frontend-domain.com  # Replace with your domain
```

### 5. Deploy to Kubernetes

```bash
# Apply all resources
kubectl apply -k k8s/

# Or apply individually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### 6. Verify Deployment

```bash
# Check namespace
kubectl get namespace dehydrated-frontend

# Check pods
kubectl get pods -n dehydrated-frontend

# Check services
kubectl get services -n dehydrated-frontend

# Check ingress
kubectl get ingress -n dehydrated-frontend

# View logs
kubectl logs -f deployment/dehydrated-frontend -n dehydrated-frontend
```

## Configuration Options

### Scaling

To scale the application:

```bash
# Scale to 5 replicas
kubectl scale deployment dehydrated-frontend --replicas=5 -n dehydrated-frontend

# Or use HPA (Horizontal Pod Autoscaler)
kubectl apply -f k8s/hpa.yaml
```

### Resource Limits

Adjust resource limits in `k8s/deployment.yaml`:

```yaml
resources:
  requests:
    memory: "64Mi"
    cpu: "50m"
  limits:
    memory: "128Mi"
    cpu: "100m"
```

### Environment Variables

The deployment includes all necessary Vite environment variables:

```yaml
env:
- name: VITE_APP_BASE_URI
  valueFrom:
    configMapKeyRef:
      name: dehydrated-frontend-config
      key: VITE_APP_BASE_URI
- name: VITE_API_BASE_URL
  valueFrom:
    configMapKeyRef:
      name: dehydrated-frontend-config
      key: VITE_API_BASE_URL
- name: VITE_ENABLE_MSAL
  valueFrom:
    configMapKeyRef:
      name: dehydrated-frontend-config
      key: VITE_ENABLE_MSAL
- name: VITE_THEME_NAME
  valueFrom:
    configMapKeyRef:
      name: dehydrated-frontend-config
      key: VITE_THEME_NAME
- name: VITE_THEME_MODE
  valueFrom:
    configMapKeyRef:
      name: dehydrated-frontend-config
      key: VITE_THEME_MODE
```

MSAL configuration (when enabled) is stored in a Secret for security:

```yaml
- name: VITE_MSAL_CLIENT_ID
  valueFrom:
    secretKeyRef:
      name: dehydrated-frontend-msal-secret
      key: VITE_MSAL_CLIENT_ID
      optional: true
```

## SSL/TLS Configuration

### Using cert-manager (Recommended)

1. Install cert-manager in your cluster
2. Create a ClusterIssuer for Let's Encrypt
3. The ingress will automatically request certificates

### Manual SSL Certificate

```bash
# Create TLS secret manually
kubectl create secret tls dehydrated-frontend-tls \
  --cert=path/to/cert.pem \
  --key=path/to/key.pem \
  -n dehydrated-frontend
```

## Monitoring and Logging

### Health Checks

The application includes health checks at `/health` endpoint.

### Logging

View application logs:

```bash
kubectl logs -f deployment/dehydrated-frontend -n dehydrated-frontend
```

### Metrics

For Prometheus monitoring, add annotations to the deployment:

```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "80"
  prometheus.io/path: "/metrics"
```

## Troubleshooting

### Common Issues

1. **Image Pull Errors**: Ensure the image exists and is accessible
2. **Pod CrashLoopBackOff**: Check logs for application errors
3. **Ingress Not Working**: Verify ingress controller is installed
4. **SSL Issues**: Check cert-manager status and certificate validity

### Debug Commands

```bash
# Describe resources for detailed information
kubectl describe pod <pod-name> -n dehydrated-frontend
kubectl describe service dehydrated-frontend-service -n dehydrated-frontend
kubectl describe ingress dehydrated-frontend-ingress -n dehydrated-frontend

# Port forward for local testing
kubectl port-forward service/dehydrated-frontend-service 8080:80 -n dehydrated-frontend

# Execute commands in pod
kubectl exec -it <pod-name> -n dehydrated-frontend -- /bin/sh
```

## Cleanup

To remove the deployment:

```bash
# Remove all resources
kubectl delete -k k8s/

# Or remove individually
kubectl delete -f k8s/ingress.yaml
kubectl delete -f k8s/service.yaml
kubectl delete -f k8s/deployment.yaml
kubectl delete -f k8s/configmap.yaml
kubectl delete -f k8s/namespace.yaml
```

## Production Considerations

1. **Security**: Use network policies, RBAC, and security contexts
2. **Backup**: Implement backup strategies for persistent data
3. **Monitoring**: Set up comprehensive monitoring and alerting
4. **CI/CD**: Automate deployment with GitOps workflows
5. **Disaster Recovery**: Plan for cluster failures and data recovery

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager Documentation](https://cert-manager.io/docs/)
- [React Admin Documentation](https://marmelab.com/react-admin/) 