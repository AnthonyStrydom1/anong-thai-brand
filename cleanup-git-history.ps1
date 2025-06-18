# Git History Security Cleanup Script
# WARNING: This script will rewrite git history. Ensure you have backups!

Write-Host "=== GIT HISTORY SECURITY CLEANUP ===" -ForegroundColor Red
Write-Host "This script will clean sensitive data from git history." -ForegroundColor Yellow
Write-Host "BACKUP YOUR REPOSITORY BEFORE PROCEEDING!" -ForegroundColor Red

$response = Read-Host "Do you want to proceed? (yes/no)"
if ($response -ne "yes") {
    Write-Host "Aborted by user." -ForegroundColor Yellow
    exit 1
}

# Step 1: Create backup
Write-Host "Creating backup..." -ForegroundColor Yellow
$backupPath = "../Anthony_Anong_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item -Path . -Destination $backupPath -Recurse -Force
Write-Host "Backup created at: $backupPath" -ForegroundColor Green

# Step 2: Set environment variable to suppress filter-branch warning
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

# Step 3: Clean the file from entire history
Write-Host "Removing backend/.env from git history..." -ForegroundColor Yellow
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/.env" --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully cleaned git history!" -ForegroundColor Green
    
    # Step 4: Clean up refs
    Write-Host "Cleaning up references..." -ForegroundColor Yellow
    git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
    
    Write-Host "Git history cleanup completed!" -ForegroundColor Green
    Write-Host "The sensitive file has been removed from all commits." -ForegroundColor Green
    
    Write-Host "NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "1. Force push to remote: git push --force-with-lease origin main" -ForegroundColor White
    Write-Host "2. Notify team members to reclone the repository" -ForegroundColor White
    Write-Host "3. Rotate your Supabase credentials immediately" -ForegroundColor Red
    Write-Host "4. Set up git-secrets to prevent future issues" -ForegroundColor White
} else {
    Write-Host "Git history cleanup failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Red
}
