@echo off
echo =======================================================
echo   Starting All Katalyst NGO & Student Portal Servers...
echo =======================================================

echo 1. Starting Admin Backend on http://localhost:5000
start "Admin Backend (Port 5000)" cmd /k "cd admin\backend && npm run dev"

echo 2. Starting Student Backend on http://localhost:5001
start "Student Backend (Port 5001)" cmd /k "cd student\backend && npm run dev"

echo 3. Starting Admin Frontend on http://localhost:3000
start "Admin Frontend (Port 3000)" cmd /k "cd admin\frontend && npm run dev"

echo 4. Starting Student Frontend on http://localhost:3001
start "Student Frontend (Port 3001)" cmd /k "cd student\frontend && npm run dev"

echo =======================================================
echo   All 4 servers launched successfully!
echo   - Admin Portal:   http://localhost:3000
echo   - Student Portal: http://localhost:3001
echo =======================================================
