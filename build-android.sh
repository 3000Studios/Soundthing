#!/bin/bash

# Soundthing RF Detector - Android Build Script
# This script builds the Android APK for the application

set -e

echo "🎙️  Soundthing RF Detector - Android Build Script"
echo "=================================================="
echo ""

# Check for required tools
echo "✓ Checking for required tools..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install JDK 17 first."
    exit 1
fi

echo "✓ All required tools found!"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed!"
echo ""

# Build web app
echo "🔨 Building web application..."
npm run build
echo "✓ Web app built successfully!"
echo ""

# Sync with Android
echo "🤖 Syncing with Android project..."
npx cap sync android
echo "✓ Android project synced!"
echo ""

# Build Android APK
echo "📱 Building Android APK (Debug)..."
cd android
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ BUILD SUCCESSFUL!"
    echo ""
    echo "📦 APK Location:"
    echo "   android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "📲 Install on device:"
    echo "   adb install android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "Or open the project in Android Studio:"
    echo "   npm run android"
else
    echo ""
    echo "❌ Build failed. Check the errors above."
    exit 1
fi
