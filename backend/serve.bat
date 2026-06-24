@echo off
where php >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Using global PHP...
    php -d upload_max_filesize=3M -d post_max_size=4M -S localhost:8000 -t public server.php
) else (
    set "PHP_DIR=C:\Users\ahsan\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe"
    set "PHPRC=%PHP_DIR%"
    echo Using hardcoded PHP path: %PHP_DIR%
    "%PHP_DIR%\php.exe" -d upload_max_filesize=3M -d post_max_size=4M -S localhost:8000 -t public server.php
)

