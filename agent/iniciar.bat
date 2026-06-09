@echo off
title SKN Agente - Monitor Dosador
cd /d "%~dp0"

if not exist ".env" (
    echo [AVISO] Arquivo .env nao encontrado.
    echo Copie o arquivo .env.example para .env e configure o IP do PLC.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
    echo.
)

echo Iniciando agente...
echo.
node index.js
pause
