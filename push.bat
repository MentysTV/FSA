@echo off
chcp 65001 > nul
echo ========================================================
echo   ODESILAM AKTUALIZOVANY FSA NA GITHUB PAGES...
echo ========================================================
git push origin master
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   USPECH! Vse bylo uspesne nahrano na GitHub!
    echo   Stranka: https://mentystv.github.io/FSA/
    echo ========================================================
) else (
    echo.
    echo [UPOZORNENI] Push vyzaduje overeni uctu. Otevre se prihlasovaci okno.
)
pause
