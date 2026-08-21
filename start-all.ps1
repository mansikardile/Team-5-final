# Start all 4 Katalyst Services
Write-Host "Starting All Katalyst Services..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd admin/backend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd student/backend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd admin/frontend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd student/frontend; npm run dev"

Write-Host "All 4 servers launched!" -ForegroundColor Green
Write-Host "Admin Portal:   http://localhost:3000" -ForegroundColor Yellow
Write-Host "Student Portal: http://localhost:3001" -ForegroundColor Yellow
