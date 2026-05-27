@echo off
title Car Rental Frontend Git Push Automation
echo ==============================================
echo 🚗 CAR RENTAL FRONTEND - GIT PUSH AUTOMATION 🚗
echo ==============================================

cd /d "%~dp0"
echo Running from: %cd%

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in PATH!
    pause
    exit /b
)

:: Verify Git Repo
git rev-parse --is-inside-work-tree >nul 2>nul
if %errorlevel% neq 0 (
    echo Git repository not found. Initializing...
    git init
)

:: Add Remote
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo Adding remote origin: https://github.com/MGSAMEER/CAR_RENTAL_FRONTEND.git
    git remote add origin https://github.com/MGSAMEER/CAR_RENTAL_FRONTEND.git
) else (
    echo Remote 'origin' is already configured.
)

:: Stage and Commit
echo Staging all frontend files...
git add .

echo Creating git commit...
git commit -m "feat: implement premium full-stack car rental frontend with stripe, oauth, and admin tools"

:: Align local branch to main
echo Aligning local branch to 'main'...
git branch -M main

:: Fetch and Pull safely
echo Fetching latest remote state...
git fetch origin

echo Merging remote and local histories safely...
git pull origin main --allow-unrelated-histories -X ours --no-edit

:: Push to GitHub
echo Pushing code to GitHub: https://github.com/MGSAMEER/CAR_RENTAL_FRONTEND.git ...
git push -u origin main

echo ==============================================
echo 🎉 Success! Your frontend code is now on GitHub! 🎉
echo ==============================================
pause
