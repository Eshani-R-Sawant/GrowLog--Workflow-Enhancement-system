@echo off
echo Starting Load Balancer Setup...

echo Starting Backend Instance 1 on port 7001...
start "Backend-1" cmd /k "set PORT=7001 && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Backend Instance 2 on port 7002...
start "Backend-2" cmd /k "set PORT=7002 && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Nginx Load Balancer on port 80...
echo Make sure Nginx is installed and run: nginx -c nginx/nginx.conf

echo.
echo Load Balancer Setup Complete!
echo - Backend 1: http://localhost:7001
echo - Backend 2: http://localhost:7002  
echo - Load Balancer: http://localhost:80
echo.
pause



