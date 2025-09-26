@echo off
echo Starting Nginx Load Balancer...

REM Navigate to nginx directory
cd /d "C:\Users\Admin\Desktop\react\GrowLog--Workflow-Enhancement-system\nginx\nginx-1.29.1"

REM Start nginx with the configuration
nginx.exe -c "C:\Users\Admin\Desktop\react\GrowLog--Workflow-Enhancement-system\Backend\nginx\nginx.conf"

echo Nginx started on port 8080
echo Load Balancer: http://localhost:8080
pause

