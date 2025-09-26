# 🚀 Simple Load Balancer Setup

## Quick Start

### 1. Install Nginx
```bash
# Windows (using Chocolatey)
choco install nginx

# Or download from: https://nginx.org/en/download.html
```

### 2. Start Backend Instances
```bash
# Terminal 1 - Instance 1
npm run start:instance1

# Terminal 2 - Instance 2  
npm run start:instance2
```

### 3. Start Nginx Load Balancer
```bash
# From Backend directory
nginx -c nginx/nginx.conf
```

### 4. Test Load Balancer
```bash
# Test health endpoints
curl http://localhost:7001/api/health
curl http://localhost:7002/api/health

# Test load balancer (port 80)
curl http://localhost/api/health
```

## 📁 Files Created
- `nginx/nginx.conf` - Simple Nginx configuration
- `start-load-balancer.bat` - Windows startup script
- `start-load-balancer.sh` - Linux/Mac startup script

## 🔧 How It Works
1. **Nginx** listens on port 80
2. **Backend 1** runs on port 7001
3. **Backend 2** runs on port 7002
4. **Load Balancer** distributes requests between both backends

## 🎯 Benefits
- **High Availability**: If one backend fails, the other continues
- **Load Distribution**: Requests are shared between backends
- **Simple Setup**: Just 3 commands to start everything

## 🛑 Stop Everything
```bash
# Stop Nginx
nginx -s stop

# Stop backend instances (Ctrl+C in each terminal)
```



