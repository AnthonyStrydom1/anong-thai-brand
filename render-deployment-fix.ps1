# Render Deployment Fix Script

Write-Host "🚀 RENDER DEPLOYMENT FIX" -ForegroundColor Cyan
Write-Host "Diagnosing and fixing deployment issues..." -ForegroundColor Yellow

# Check if we're in the right directory
if (-not (Test-Path "backend/server.js")) {
    Write-Host "❌ Error: Not in project root directory" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Project structure validated" -ForegroundColor Green

# Check backend package.json
Write-Host "`n📦 Checking backend dependencies..." -ForegroundColor Yellow
$backendPackage = Get-Content "backend/package.json" | ConvertFrom-Json

Write-Host "✅ Backend package.json found" -ForegroundColor Green
Write-Host "Dependencies:" -ForegroundColor White
$backendPackage.dependencies.PSObject.Properties | ForEach-Object {
    Write-Host "  - $($_.Name): $($_.Value)" -ForegroundColor Gray
}

# Check main package.json for build scripts
Write-Host "`n📦 Checking main package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $mainPackage = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "✅ Main package.json found" -ForegroundColor Green
    
    if ($mainPackage.scripts.build) {
        Write-Host "✅ Build script found: $($mainPackage.scripts.build)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No build script found" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Main package.json not found" -ForegroundColor Yellow
}

# Check for environment variables documentation
Write-Host "`n🔧 Environment Variables Required for Deployment:" -ForegroundColor Yellow
Write-Host "==============================================` " -ForegroundColor Cyan

Write-Host "📋 REQUIRED IN RENDER DASHBOARD:" -ForegroundColor White
Write-Host "  SUPABASE_URL=https://nyadgiutmweuyxqetfuh.supabase.co" -ForegroundColor Green
Write-Host "  SUPABASE_SERVICE_ROLE_KEY=<your_new_service_role_key>" -ForegroundColor Green
Write-Host "  NODE_ENV=production" -ForegroundColor Green

Write-Host "`n📋 RECOMMENDED (for enhanced security):" -ForegroundColor White  
Write-Host "  SUPABASE_ANON_KEY=<your_anon_key>" -ForegroundColor Yellow
Write-Host "  FRONTEND_URL=<your_frontend_domain>" -ForegroundColor Yellow
Write-Host "  SECURITY_WEBHOOK_URL=<your_monitoring_webhook>" -ForegroundColor Yellow

# Check current .env for reference
Write-Host "`n🔍 Current .env values (for reference):" -ForegroundColor Yellow
if (Test-Path "backend/.env") {
    $envContent = Get-Content "backend/.env"
    $envContent | Where-Object { $_ -match "^[A-Z]" -and $_ -notmatch "=#" } | ForEach-Object {
        $envLine = $_ -split "=", 2
        if ($envLine[1] -and $envLine[1].Length -gt 20) {
            Write-Host "  $($envLine[0])=<configured>" -ForegroundColor Gray
        } else {
            Write-Host "  $_" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "  No .env file found" -ForegroundColor Red
}

Write-Host "`n🚀 RENDER DEPLOYMENT COMMANDS:" -ForegroundColor Cyan
Write-Host "===============================` " -ForegroundColor Cyan

Write-Host "Build Command: npm run build" -ForegroundColor White
Write-Host "Start Command: cd backend && npm start" -ForegroundColor White
Write-Host "Port: 5000 (or $PORT environment variable)" -ForegroundColor White

Write-Host "`n📝 QUICK FIXES TO TRY:" -ForegroundColor Yellow
Write-Host "1. Add missing environment variables in Render dashboard" -ForegroundColor White
Write-Host "2. Ensure all dependencies are in package.json (not devDependencies)" -ForegroundColor White
Write-Host "3. Check build logs for specific error messages" -ForegroundColor White
Write-Host "4. Verify Start Command points to backend/server.js" -ForegroundColor White

Write-Host "`n✅ Deployment diagnostic complete!" -ForegroundColor Green
Write-Host "Check the Render dashboard for specific error messages." -ForegroundColor Yellow
