@echo off
chcp 65001 > nul
title Nahrani FSD na GitHub
cls
echo ========================================================
echo    AUTOMATICKE NAHRANI FSD NA GITHUB
echo ========================================================
echo.
echo 1. Otevri v prohlizeci: https://github.com/new
echo 2. Pojmenuj repozitar (napr. fsd) a klikni na Create repository.
echo 3. Zkopiruj odkaz na tvuj repozitar:
echo    (bude vypadat napr. takhle: https://github.com/tve-jmeno/fsd.git)
echo.
set /p REPO_URL="Vloz sem odkaz na repozitar a stiskni Enter: "

if "%REPO_URL%"=="" (
    echo.
    echo [CHYBA] Nebyl zadan zadny odkaz.
    pause
    exit /b
)

echo.
echo [1/3] Nastavuji GitHub adresu...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Pripravuji vetev master...
git branch -M master

echo [3/3] Odesilam projekt na GitHub...
git push -u origin master

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   USPECH! Projekt je uspesne nahran na GitHubu!
    echo ========================================================
    echo.
    echo Ted uz jen v nastaveni repozitare zapni GitHub Pages:
    echo 1. V repozitari klikni na Settings - Pages
    echo 2. U "Source" vyber "GitHub Actions" (nebo master /docs)
    echo 3. Do minuty mas funkcni webovou stranku!
    echo ========================================================
) else (
    echo.
    echo [CHYBA] Odeslani se nezdarilo. Zkontroluj odkaz a prihlaseni ke GitHubu.
)

pause
