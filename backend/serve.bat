@echo off
set "PHP_DIR=C:\Users\R.T INTERNATIONAL\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe"
set "PHPRC=%PHP_DIR%"
"%PHP_DIR%\php.exe" artisan serve --port=8000
