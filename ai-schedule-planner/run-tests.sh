#!/bin/bash

# AI Schedule Planner MVP - Test Runner Script
# This script runs all tests for both backend and frontend

set -e  # Exit on any error

echo "🧪 AI Schedule Planner MVP - Running All Tests"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v18+ to run tests."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Function to run backend tests
run_backend_tests() {
    print_status "Running Backend Tests..."
    
    if [ ! -d "backend" ]; then
        print_error "Backend directory not found!"
        return 1
    fi
    
    cd backend
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "Backend package.json not found!"
        cd ..
        return 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    # Run tests
    print_status "Running backend tests with coverage..."
    if npm run test:coverage; then
        print_success "Backend tests passed!"
        cd ..
        return 0
    else
        print_error "Backend tests failed!"
        cd ..
        return 1
    fi
}

# Function to run frontend tests
run_frontend_tests() {
    print_status "Running Frontend Tests..."
    
    if [ ! -d "frontend" ]; then
        print_error "Frontend directory not found!"
        return 1
    fi
    
    cd frontend
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "Frontend package.json not found!"
        cd ..
        return 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Run tests
    print_status "Running frontend tests with coverage..."
    if npm run test:coverage; then
        print_success "Frontend tests passed!"
        cd ..
        return 0
    else
        print_error "Frontend tests failed!"
        cd ..
        return 1
    fi
}

# Function to generate test summary
generate_summary() {
    echo ""
    echo "📊 Test Summary"
    echo "==============="
    
    if [ -f "backend/coverage/lcov-report/index.html" ]; then
        print_success "Backend coverage report: backend/coverage/lcov-report/index.html"
    fi
    
    if [ -f "frontend/coverage/lcov-report/index.html" ]; then
        print_success "Frontend coverage report: frontend/coverage/lcov-report/index.html"
    fi
    
    echo ""
    print_status "To view coverage reports:"
    echo "  Backend:  open backend/coverage/lcov-report/index.html"
    echo "  Frontend: open frontend/coverage/lcov-report/index.html"
}

# Main execution
main() {
    local backend_passed=false
    local frontend_passed=false
    
    # Run backend tests
    if run_backend_tests; then
        backend_passed=true
    fi
    
    echo ""
    
    # Run frontend tests
    if run_frontend_tests; then
        frontend_passed=true
    fi
    
    echo ""
    
    # Generate summary
    generate_summary
    
    echo ""
    echo "🏁 Test Results"
    echo "==============="
    
    if [ "$backend_passed" = true ]; then
        print_success "Backend tests: PASSED"
    else
        print_error "Backend tests: FAILED"
    fi
    
    if [ "$frontend_passed" = true ]; then
        print_success "Frontend tests: PASSED"
    else
        print_error "Frontend tests: FAILED"
    fi
    
    echo ""
    
    if [ "$backend_passed" = true ] && [ "$frontend_passed" = true ]; then
        print_success "All tests passed! 🎉"
        exit 0
    else
        print_error "Some tests failed! ❌"
        exit 1
    fi
}

# Handle command line arguments
case "${1:-}" in
    "backend")
        run_backend_tests
        ;;
    "frontend")
        run_frontend_tests
        ;;
    "help"|"-h"|"--help")
        echo "AI Schedule Planner MVP - Test Runner"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  (no args)  Run all tests (default)"
        echo "  backend    Run only backend tests"
        echo "  frontend   Run only frontend tests"
        echo "  help       Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0              # Run all tests"
        echo "  $0 backend      # Run only backend tests"
        echo "  $0 frontend     # Run only frontend tests"
        ;;
    *)
        main
        ;;
esac
