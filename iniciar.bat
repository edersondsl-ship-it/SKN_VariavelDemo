@echo off
echo Iniciando SKN Demo...
cd /d "%~dp0"
npm install
node backend/server.js
pause
