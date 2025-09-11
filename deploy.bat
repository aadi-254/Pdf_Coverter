@echo off
setlocal enabledelayedexpansion

echo ================================================
echo     🌐 GitHub Pages Deployment Script
echo ================================================

:: Ask for GitHub repo URL
set /p repo_url=Enter GitHub Repository HTTPS URL (e.g., https://github.com/username/repo.git): 

:: Optional: Ask for directory to deploy (leave blank for current folder)
set /p deploy_dir=Enter folder to deploy (leave blank for current folder): 

if "%deploy_dir%"=="" (
    set deploy_dir=.
)

:: Check if .git folder exists
if not exist ".git" (
    echo 🔧 Git not initialized. Initializing...
    git init
)

:: Remove existing origin if exists
git remote get-url origin >nul 2>&1
if %errorlevel%==0 (
    echo 🔄 Removing existing remote origin...
    git remote remove origin
)

:: Add new origin
echo ➕ Adding remote origin...
git remote add origin %repo_url%

:: Switch to gh-pages branch (create if doesn't exist)
echo 🔀 Switching to gh-pages branch...
git checkout -B gh-pages

:: Copy deploy folder content to root if needed (optional)
:: (This is skipped here. You could add file copy commands if needed.)

:: Add and commit
git add %deploy_dir%\* --all

:: Timestamped commit message
for /f %%i in ('powershell -command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"') do set timestamp=%%i
git commit -m "🚀 Deploy to GitHub Pages on %timestamp%"

:: Push to gh-pages branch
echo 🚚 Pushing to gh-pages...
git push -u origin gh-pages --force

echo ✅ GitHub Pages deployed successfully!
echo 🔗 Visit: https://<your-username>.github.io/<repo-name>/

pause

