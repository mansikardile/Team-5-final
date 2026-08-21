Write-Host "Starting Katalyst Standalone User UI on http://localhost:3005 ..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\user-ui"
npm run dev
