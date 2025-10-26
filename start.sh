#!/bin/bash

# FarmView AI - Startup Script
# This script sets up and runs the FarmView AI application

echo "🌾 ======================================"
echo "   FarmView AI - Startup Script"
echo "   ======================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "✅ Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your credentials:"
    echo "   - Sentinel Hub API credentials"
    echo "   - MongoDB connection URI"
    echo "   - JWT secret key"
    echo ""
    read -p "Press Enter after configuring .env to continue..."
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p temp reports static

# Run database migrations/setup (if needed)
echo "🗄️  Setting up database..."
# Add any database setup commands here

echo ""
echo "🚀 ======================================"
echo "   Starting FarmView AI API Server"
echo "   ======================================"
echo ""
echo "   API: http://localhost:8000"
echo "   Dashboard: http://localhost:8000/static/index.html"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the FastAPI server
python main.py
