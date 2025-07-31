@echo off
echo Starting Spinify Application...
echo.
echo This script will start both the backend and frontend servers.
echo.
echo First, installing dependencies...
cd backend
call npm install
cd ../frontend
call npm install
cd ..
echo.
echo Dependencies installed!
echo.
echo Starting backend server...
start cmd /k "cd backend && npm start"
echo.
echo Starting frontend server...
start cmd /k "cd frontend && npm start"
echo.
echo Spinify is starting! The application will open in your browser shortly.
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul
