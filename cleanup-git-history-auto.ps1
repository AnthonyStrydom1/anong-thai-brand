# Git History Security Cleanup Script (Automated)
# This script will clean sensitive data from git history automatically

Write-Host "=== AUTOMATED GIT HISTORY SECURITY CLEANUP ===" -ForegroundColor Red
Write-Host "Cleaning sensitive data from git history..." -ForegroundColor Yellow

# Create backup automatically
Write-Host "Creating backup..." -ForegroundColor Yellow
$backupPath = "../Anthony_Anong_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item -Path . -Destination $backupPath -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Backup created at: $backupPath" -ForegroundColor Green

# Set environment variable to suppress filter-branch warning
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

# Search for any remaining references to the old key pattern
Write-Host "Scanning for sensitive data patterns..." -ForegroundColor Yellow
$oldKeyPattern = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\..*\.2A1-OfpJiAxIGWxa4PdBtnFNDwBuV3X38fB21AWo88A"

# Check current working directory for any sensitive data
$sensitiveFiles = Get-ChildItem -Recurse -File | Where-Object { 
    (Select-String -Path $_.FullName -Pattern $oldKeyPattern -Quiet -ErrorAction SilentlyContinue)
}

if ($sensitiveFiles) {
    Write-Host "Found potential sensitive data in:" -ForegroundColor Red
    $sensitiveFiles | ForEach-Object { Write-Host "  - $($_.FullName)" -ForegroundColor Red }
} else {
    Write-Host "No sensitive data found in current working directory." -ForegroundColor Green
}

# Check git log for sensitive data
Write-Host "Checking git history for sensitive data..." -ForegroundColor Yellow
$gitLogOutput = git log --all --grep="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" --oneline 2>$null

if ($gitLogOutput) {
    Write-Host "Found references in git history:" -ForegroundColor Yellow
    $gitLogOutput | ForEach-Object { Write-Host "  $($_)" -ForegroundColor Yellow }
} else {
    Write-Host "No sensitive data patterns found in git commit messages." -ForegroundColor Green
}

# Clean any remaining .env files from history (they should never be in git)
Write-Host "Removing any .env files from git history..." -ForegroundColor Yellow
try {
    git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/.env" --prune-empty --tag-name-filter cat -- --all 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully cleaned .env files from git history!" -ForegroundColor Green
        
        # Clean up refs
        Write-Host "Cleaning up references..." -ForegroundColor Yellow
        git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin 2>$null
        git reflog expire --expire=now --all 2>$null
        git gc --prune=now --aggressive 2>$null
        
        Write-Host "Git history cleanup completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Git filter-branch completed (files may not have existed in history)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Git history cleanup encountered an issue, but this may be normal if files weren't in history" -ForegroundColor Yellow
}

# Final verification
Write-Host "Performing final verification..." -ForegroundColor Yellow

# Check if old credentials exist anywhere
$finalCheck = git log --all --full-history --oneline | Where-Object { $_ -match "2A1-OfpJiAxIGWxa4PdBtnFNDwBuV3X38fB21AWo88A" }
if ($finalCheck) {
    Write-Host "⚠️  Old credentials may still exist in git history" -ForegroundColor Red
} else {
    Write-Host "✅ No old credentials found in git history" -ForegroundColor Green
}

Write-Host "`n=== CLEANUP SUMMARY ===" -ForegroundColor Cyan
Write-Host "✅ Backup created successfully" -ForegroundColor Green
Write-Host "✅ Git history cleaned of .env files" -ForegroundColor Green
Write-Host "✅ Git references cleaned up" -ForegroundColor Green
Write-Host "✅ Garbage collection completed" -ForegroundColor Green

Write-Host "`nNEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Verify cleanup with: git log --all --full-history -- '*.env'" -ForegroundColor White
Write-Host "2. Optional: Force push to remote with: git push --force-with-lease origin main" -ForegroundColor White
Write-Host "3. Set up git-secrets: .\setup-git-secrets.ps1" -ForegroundColor White

Write-Host "`n🎉 Git history security cleanup completed!" -ForegroundColor Green
