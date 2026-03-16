@echo off
echo Starting AgriChain MERN Project...
echo.

echo Step 1: Checking MongoDB...
netstat -ano | findstr :27017 > nul
if %errorlevel% neq 0 (
    echo ❌ MongoDB is NOT running on port 27017.
    echo Please start the MongoDB service and try again.
    pause
    exit /b
)
echo ✅ MongoDB is running!

echo Step 2: Starting Backend Server...
start "AgriChain Backend" cmd /k "node server/index.js"

echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo Step 3: Starting React Frontend...
start "AgriChain Frontend" cmd /k "cd client && npm start"

echo.
echo ✅ AgriChain MERN Stack is starting up!
echo 🌐 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:5000
echo 📊 Database: mongodb://localhost:27017/agrichain
echo.
echo Press any key to exit this window...
pause > nul
