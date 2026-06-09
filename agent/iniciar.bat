@echo off
title SKN Agente - Monitor Dosador
cd /d "%~dp0"
color 0A

echo.
echo  ============================================
echo   SKN Agente - Monitor Dosador
echo  ============================================
echo.

:: Verifica se Node.js esta instalado
node -v >nul 2>&1
if errorlevel 1 (
    echo  [ERRO] Node.js nao encontrado.
    echo.
    echo  Instale em: https://nodejs.org
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  Node.js %NODE_VER% encontrado.

:: Cria .env a partir do exemplo se nao existir
if not exist ".env" (
    echo.
    echo  [AVISO] Arquivo .env nao encontrado.
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo  Arquivo .env criado a partir do .env.example.
        echo.
        echo  Abra o arquivo .env e configure:
        echo    - PLC_IP      : IP da CPU1200
        echo    - AGENT_TOKEN : token igual ao do servidor
        echo.
        echo  Pressione qualquer tecla para abrir o .env no Bloco de Notas...
        pause >nul
        notepad ".env"
        echo.
        echo  Pressione qualquer tecla para continuar apos salvar o .env...
        pause >nul
    ) else (
        echo  Arquivo .env.example nao encontrado. Crie um .env manualmente.
        pause
        exit /b 1
    )
)

:: Instala dependencias se necessario
if not exist "node_modules" (
    echo.
    echo  Instalando dependencias (apenas na primeira vez)...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo  [ERRO] Falha no npm install.
        pause
        exit /b 1
    )
)

:: Mostra config atual
echo.
echo  ---- Configuracao ----
for /f "tokens=1,2 delims==" %%a in ('findstr /i "PLC_IP\|DOSADOR_ID\|SERVER_URL" .env') do (
    echo    %%a = %%b
)
echo  ----------------------
echo.
echo  Iniciando agente... (Ctrl+C para parar)
echo.

node index.js

echo.
echo  Agente encerrado.
pause
