@echo off
chcp 65001 > nul
echo ========================================================
echo   ODESILAM AKTUALIZOVANY FSA NA GITHUB PAGES...
echo ========================================================
git add .
git commit -m "update: refresh site cache and latest version"
git push origin master
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   USPECH! Vse bylo uspesne nahrano na GitHub!
    echo   Aktualni web bez mezipameti:
    echo   https://mentystv.github.io/FSA/?v=20261023_v5
    echo ========================================================
    start https://mentystv.github.io/FSA/?v=20261023_v5
) else (
    echo.
    echo [UPOZORNENI] Push vyzaduje overeni uctu. Otevre se prihlasovaci okno.
)
pause
