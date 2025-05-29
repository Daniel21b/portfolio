#!/bin/bash

# Daniel Berhane Portfolio - Deployment Script
# This script helps with local testing and deployment preparation

echo "🚀 Daniel Berhane Portfolio Deployment Script"
echo "=============================================="

# Function to check if files exist
check_files() {
    echo "📁 Checking required files..."
    
    required_files=("index.html" "styles.css" "script.js" "README.md")
    missing_files=()
    
    for file in "${required_files[@]}"; do
        if [[ -f "$file" ]]; then
            echo "✅ $file - Found"
        else
            echo "❌ $file - Missing"
            missing_files+=("$file")
        fi
    done
    
    # Check assets directory
    if [[ -d "assets" ]]; then
        echo "✅ assets/ - Directory exists"
        
        # Check for profile photo
        if [[ -f "assets/profile-placeholder.jpg" ]] || [[ -f "assets/profile.jpg" ]] || [[ -f "assets/profile.png" ]]; then
            echo "✅ Profile photo - Found"
        else
            echo "⚠️  Profile photo - Not found (will show initials placeholder)"
        fi
        
        # Check for resume
        if [[ -f "assets/Daniel_Berhane_Resume.pdf" ]]; then
            echo "✅ Resume PDF - Found"
        else
            echo "⚠️  Resume PDF - Not found (download link will not work)"
        fi
    else
        echo "❌ assets/ - Directory missing"
        missing_files+=("assets/")
    fi
    
    if [[ ${#missing_files[@]} -eq 0 ]]; then
        echo "🎉 All core files are present!"
        return 0
    else
        echo "⚠️  Some files are missing but the site will still work"
        return 1
    fi
}

# Function to start local server
start_server() {
    echo ""
    echo "🌐 Starting local development server..."
    echo "📍 URL: http://localhost:8000"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    
    # Try different server options
    if command -v python3 &> /dev/null; then
        echo "Using Python 3 server..."
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        echo "Using Python server..."
        python -m http.server 8000
    elif command -v npx &> /dev/null; then
        echo "Using npx serve..."
        npx serve . -p 8000
    else
        echo "❌ No suitable server found. Please install Python or Node.js"
        echo "💡 Alternatively, open index.html directly in your browser"
        return 1
    fi
}

# Function to validate HTML
validate_html() {
    echo ""
    echo "🔍 Basic HTML validation..."
    
    if [[ -f "index.html" ]]; then
        # Check for basic HTML structure
        if grep -q "<!DOCTYPE html>" index.html && \
           grep -q "<html" index.html && \
           grep -q "<head>" index.html && \
           grep -q "<body>" index.html; then
            echo "✅ HTML structure looks good"
        else
            echo "⚠️  HTML structure may have issues"
        fi
        
        # Check for meta viewport (mobile responsiveness)
        if grep -q "viewport" index.html; then
            echo "✅ Mobile viewport meta tag found"
        else
            echo "⚠️  Mobile viewport meta tag missing"
        fi
        
        # Check for title
        if grep -q "<title>" index.html; then
            echo "✅ Page title found"
        else
            echo "⚠️  Page title missing"
        fi
    fi
}

# Function to show deployment tips
deployment_tips() {
    echo ""
    echo "🚀 Deployment Tips:"
    echo "==================="
    echo ""
    echo "📌 GitHub Pages:"
    echo "   1. Push code to GitHub repository"
    echo "   2. Go to Settings > Pages"
    echo "   3. Select source branch (main/master)"
    echo "   4. Access via: https://username.github.io/repository-name"
    echo ""
    echo "📌 Netlify:"
    echo "   1. Connect GitHub repo to Netlify"
    echo "   2. Deploy automatically on push"
    echo "   3. Custom domain available"
    echo ""
    echo "📌 Before deploying:"
    echo "   • Add your profile photo to assets/"
    echo "   • Add your resume PDF to assets/"
    echo "   • Test locally first"
    echo "   • Optimize images (< 500KB each)"
    echo ""
}

# Main script logic
main() {
    case "${1:-check}" in
        "check")
            check_files
            validate_html
            ;;
        "serve"|"server"|"start")
            check_files
            start_server
            ;;
        "deploy"|"tips")
            deployment_tips
            ;;
        "help"|"-h"|"--help")
            echo ""
            echo "Usage: ./deploy.sh [command]"
            echo ""
            echo "Commands:"
            echo "  check    - Check if all required files exist (default)"
            echo "  serve    - Start local development server"
            echo "  deploy   - Show deployment tips"
            echo "  help     - Show this help message"
            echo ""
            ;;
        *)
            echo "❌ Unknown command: $1"
            echo "💡 Use './deploy.sh help' for available commands"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 