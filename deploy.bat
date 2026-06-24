@echo off
echo ==========================================
echo       ZARKA COUTURE GIT DEPLOYMENT
echo ==========================================
echo.

:: Initialize git if not already done
if not exist .git (
    echo [1/4] Initializing Git...
    git init
) else (
    echo [1/4] Git already initialized.
)

:: Add all files
echo [2/4] Adding files to Git staging...
git add .

:: Commit files
echo [3/4] Creating Commit...
git commit -m "production ready: categories synced with nav, vendor removed"

:: Ask user for repo URL
echo.
set /p repo_url="Enter your GitHub Repository URL: "

:: Remove origin if it already exists to avoid conflict
git remote remove origin >nul 2>&1

:: Add new origin and push
echo [4/4] Connecting to GitHub and pushing code...
git remote add origin %repo_url%
git branch -M main
git push -u origin main -f

echo.
echo ==========================================
echo  DONE! Code has been pushed to GitHub.
echo ==========================================
pause
