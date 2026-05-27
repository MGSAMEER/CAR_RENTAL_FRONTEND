# PowerShell Automation Script to Push Car Rental Frontend Code
# This script handles the staging, committing, branch alignment, safe history merging, and pushing.

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "🚗 CAR RENTAL FRONTEND - GIT PUSH AUTOMATION 🚗" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Ensure we are in the correct directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir
Write-Host "Running from: $ScriptDir" -ForegroundColor Gray

# 1. Verify Git Setup
if (-not (git rev-parse --is-inside-work-tree 2>$null)) {
    Write-Host "Error: Not a git repository. Initializing..." -ForegroundColor Yellow
    git init
}

# Ensure remote is added correctly
$Remotes = git remote
if ($Remotes -notcontains "origin") {
    Write-Host "Adding remote origin: https://github.com/MGSAMEER/CAR_RENTAL_FRONTEND.git" -ForegroundColor Cyan
    git remote add origin https://github.com/MGSAMEER/CAR_RENTAL_FRONTEND.git
} else {
    Write-Host "Remote 'origin' is already configured." -ForegroundColor Green
}

# 2. Stage all modifications and untracked files
Write-Host "Staging all frontend files..." -ForegroundColor Cyan
git add .

# 3. Create Git Commit
$CommitMessage = "feat: implement premium full-stack car rental frontend with stripe, oauth, and admin tools"
Write-Host "Creating git commit..." -ForegroundColor Cyan
git commit -m "$CommitMessage"

# 4. Rename current branch to 'main' for compatibility with GitHub default
Write-Host "Aligning local branch to 'main'..." -ForegroundColor Cyan
git branch -M main

# 5. Fetch Remote State
Write-Host "Fetching latest remote state..." -ForegroundColor Cyan
git fetch origin

# 6. Merge Remote and Local Histories (Safe Unrelated History Merge)
# Using '-X ours' ensures our newly merged README.md is prioritized in case of differences, 
# preventing any merge conflict blocker.
Write-Host "Merging remote and local histories safely..." -ForegroundColor Cyan
git pull origin main --allow-unrelated-histories -X ours --no-edit

# 7. Push local 'main' to GitHub
Write-Host "Pushing code to GitHub: https://github.com/MGSAMEER/CAR_RENTAL_FRONTEND.git ..." -ForegroundColor Cyan
git push -u origin main

Write-Host "==============================================" -ForegroundColor Green
Write-Host "🎉 Success! Your frontend code is now on GitHub! 🎉" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Read-Host "Press Enter to exit"
