#!/bin/bash

echo "🎯 PlayerBet Setup Script"
echo "========================="

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET 8.0 SDK not found. Please install .NET 8.0 SDK first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Setup database
echo "🔧 Starting PostgreSQL database..."
docker-compose up -d postgres
sleep 10

# Setup backend
echo "🔧 Setting up backend..."
cd backend/PlayerBet.Api
dotnet restore
dotnet ef database update
dotnet run &
BACKEND_PID=$!
cd ../../

# Setup frontend
echo "🔧 Setting up frontend..."
cd frontend
npm install
npm start &
FRONTEND_PID=$!
cd ../

echo ""
echo "🚀 PlayerBet is starting up!"
echo "Backend API: http://localhost:5001"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop all services"

# Cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    docker-compose down
    echo "✅ All services stopped"
    exit 0
}

trap cleanup INT
wait
