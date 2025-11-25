#!/bin/bash

# utm.one Self-Hosted Quick Start Script
# This script helps you quickly deploy utm.one redirect service

set -e

echo "======================================"
echo "utm.one Self-Hosted Quick Start"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✓ Docker and Docker Compose are installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    
    # Generate secure password
    POSTGRES_PASSWORD=$(openssl rand -base64 32)
    sed -i.bak "s/changeme_strong_password_here/$POSTGRES_PASSWORD/" .env
    rm .env.bak 2>/dev/null || true
    
    echo "✓ Created .env file with secure password"
    echo ""
    echo "⚠️  IMPORTANT: Please update the following in .env:"
    echo "   - PRIMARY_DOMAIN (your main domain)"
    echo "   - REDIRECT_DOMAIN (your redirect domain, e.g., go.yourdomain.com)"
    echo ""
    read -p "Press Enter to continue after updating .env..."
fi

echo "🚀 Starting utm.one services..."
echo ""

# Build and start services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ utm.one is running!"
    echo ""
    echo "📊 Service URLs:"
    echo "   Redirect Service: http://localhost:8080"
    echo "   Health Check:     http://localhost:8080/health"
    echo "   Metrics:          http://localhost:8080/metrics"
    echo ""
    echo "🔧 Useful commands:"
    echo "   View logs:        docker-compose logs -f"
    echo "   Stop services:    docker-compose down"
    echo "   Restart:          docker-compose restart"
    echo ""
    echo "📖 Next steps:"
    echo "   1. Configure DNS for your redirect domain"
    echo "   2. Set up SSL with Caddy: docker-compose --profile with-proxy up -d"
    echo "   3. Read the full documentation: ./README.md"
    echo ""
else
    echo ""
    echo "❌ Some services failed to start. Check logs:"
    echo "   docker-compose logs"
    exit 1
fi
