#!/bin/bash

echo "===================================================="
echo "Teacher Management System - Quick Start"
echo "===================================================="
echo

echo "Starting Backend Server on port 4000..."
echo
cd "$(dirname "$0")/backend"
npm start &
BACKEND_PID=$!

sleep 2

echo
echo "Starting Frontend on port 3000..."
echo
cd "$(dirname "$0")/frontend"
npm start &
FRONTEND_PID=$!

echo
echo "===================================================="
echo "Backend: http://localhost:4000"
echo "Frontend: http://localhost:3000"
echo "===================================================="
echo
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo
echo "Press Ctrl+C to stop both servers"
echo

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
