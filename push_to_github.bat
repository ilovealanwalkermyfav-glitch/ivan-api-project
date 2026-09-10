@echo off
setlocal
cd /d "%~dp0"
set "PATH=C:\Users\Ivan\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;C:\Users\Ivan\AppData\Local\Microsoft\WinGet\Packages\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\bin;%PATH%"

echo ====================================================
echo  HalluGuard AI - GitHub Push Utility
echo  Repository: https://github.com/ilovealanwalkermyfav-glitch/ivan-api-project.git
echo ====================================================
echo.

git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo Configuring GitHub credential helper...
    gh auth setup-git
    git push -u origin main
)

if %errorlevel% equ 0 (
    echo.
    echo ====================================================
    echo  SUCCESS: All files successfully pushed to GitHub!
    echo  Repository: https://github.com/ilovealanwalkermyfav-glitch/ivan-api-project
    echo ====================================================
) else (
    echo.
    echo [Notice] If authentication is needed, you can also run:
    echo   gh auth login --web
    echo then run this script again.
)
echo.
pause
