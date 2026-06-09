@echo off
title SKN Agente - Monitor Dosador
cd /d "%~dp0"
color 0A

echo.
echo  ============================================
echo   SKN Agente - Monitor Dosador
echo  ============================================
echo.

:: Verifica Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo  [ERRO] Node.js nao encontrado.
    echo  Instale em: https://nodejs.org
    echo.
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  Node.js %NODE_VER% encontrado.

:: Cria .env se nao existir
if not exist ".env" (
    echo.
    echo  [AVISO] .env nao encontrado.
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo  Arquivo .env criado. Abrindo para configurar...
        echo.
        notepad ".env"
        echo  Pressione qualquer tecla para continuar apos salvar...
        pause >nul
    ) else (
        echo  [ERRO] .env.example nao encontrado.
        pause & exit /b 1
    )
)

:: Instala dependencias
if not exist "node_modules" (
    echo.
    echo  Instalando dependencias...
    npm install
    if errorlevel 1 ( echo  [ERRO] Falha no npm install. & pause & exit /b 1 )
)

:: Mostra config
echo.
echo  ---- Configuracao atual ----
for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
    echo    %%a = %%b
)
echo  ----------------------------
echo.
echo  Pressione Ctrl+C para parar o agente.
echo.

:: Loop de reinicio automatico
:loop
echo  [%date% %time%] Iniciando agente...
echo.
node index.js
echo.
echo  [%date% %time%] Agente parou (codigo de saida: %errorlevel%)
echo  Reiniciando em 15 segundos... (Ctrl+C para cancelar)
echo.
timeout /t 15 /nobreak
echo.
goto loop
