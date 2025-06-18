# Git Secrets Installation and Setup Script
# This script helps install git-secrets to prevent credential commits

Write-Host "Setting up git-secrets to prevent credential exposure..." -ForegroundColor Yellow

# Check if git-secrets is installed
$gitSecretsPath = Get-Command git-secrets -ErrorAction SilentlyContinue

if (-not $gitSecretsPath) {
    Write-Host "git-secrets not found. Installing via Chocolatey or manual setup required." -ForegroundColor Red
    Write-Host "Please visit: https://github.com/awslabs/git-secrets" -ForegroundColor Red
    Write-Host "Or install via: choco install git-secrets" -ForegroundColor Yellow
} else {
    Write-Host "git-secrets found. Setting up for this repository..." -ForegroundColor Green
    
    # Install git-secrets hooks
    git secrets --install
    
    # Add common patterns to scan for
    git secrets --register-aws
    git secrets --add 'SUPABASE_SERVICE_ROLE_KEY.*'
    git secrets --add 'SUPABASE_.*_KEY.*'
    git secrets --add 'eyJ[A-Za-z0-9_/+]*\.[A-Za-z0-9_/+]*\.[A-Za-z0-9_/+]*'  # JWT tokens
    git secrets --add 'sk-[a-zA-Z0-9]{32,}'  # API keys
    git secrets --add '[A-Za-z0-9]{32,}'  # Generic long tokens
    
    Write-Host "git-secrets configured successfully!" -ForegroundColor Green
}

Write-Host "Manual verification: Please scan the repository for any remaining sensitive data." -ForegroundColor Yellow
