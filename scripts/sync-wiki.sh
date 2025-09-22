#!/bin/bash

# Local wiki sync script for testing
# This script simulates what the GitHub Action does

set -e

REPO_URL="https://github.com/waforix/mocha.wiki.git"
WIKI_DIR="temp-wiki"

echo "🔄 Starting local wiki sync simulation..."

# Clean up any existing temp directory
if [ -d "$WIKI_DIR" ]; then
    echo "🧹 Cleaning up existing temp wiki directory..."
    rm -rf "$WIKI_DIR"
fi

# Clone the wiki repository (or create temp directory for simulation)
echo "📥 Setting up wiki directory..."
mkdir -p "$WIKI_DIR"

# Simulate copying docs to wiki
echo "📋 Copying documentation files..."
for file in docs/*.md; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        pagename="${filename%.md}"
        
        cp "$file" "$WIKI_DIR/${pagename}.md"
        echo "  ✅ Synced: $filename -> ${pagename}.md"
    fi
done

# Handle README -> Home conversion
if [ -f "$WIKI_DIR/README.md" ]; then
    mv "$WIKI_DIR/README.md" "$WIKI_DIR/Home.md"
    echo "  ✅ Created Home.md from README.md"
fi

# Create navigation sidebar
echo "🧭 Creating navigation sidebar..."
cd "$WIKI_DIR"

cat > _Sidebar.md << 'EOF'
# @waforix/mocha Documentation

## Quick Links
- [Home](Home)
- [Getting Started](Getting-Started)
- [API Reference](API-Reference)

## Setup
- [Getting Started](Getting-Started)
- [Client Configuration](Client-Configuration)
- [Database Configuration](Database-Configuration)

## Usage
- [Quick Examples](Quick-Examples)
- [Command System](Command-System)
- [Autocomplete System](Autocomplete-System)

## Reference
- [API Reference](API-Reference)
EOF

echo "  ✅ Created _Sidebar.md"

# List all generated files
echo ""
echo "📄 Generated wiki files:"
for file in *.md; do
    if [ -f "$file" ]; then
        echo "  - $file"
    fi
done

cd ..

echo ""
echo "✨ Wiki sync simulation complete!"
echo "📁 Files are in: $WIKI_DIR/"
echo ""
echo "To clean up: rm -rf $WIKI_DIR"
echo ""
echo "Note: This is a simulation. The actual GitHub Action will:"
echo "  1. Clone the real wiki repository"
echo "  2. Update the files"
echo "  3. Commit and push changes"
