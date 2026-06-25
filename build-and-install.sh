#!/bin/bash

# EasyPay Android - Build and Install Script
# This script builds the release APK and installs it on a connected Android device

set -e  # Exit on any error

echo "=========================================="
echo "EasyPay Android - Build & Install"
echo "=========================================="
echo ""

# Step 1: Clean and build
echo "📦 Building release APK..."
./gradlew clean assembleRelease

# Check if build was successful
if [ ! -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "❌ Build failed! APK not found."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Install on device
echo "📱 Installing on Android device..."

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo "⚠️  ADB not found in PATH"
    echo "Please install Android SDK Platform Tools or add to PATH"
    echo "APK is ready at: app/build/outputs/apk/release/app-release.apk"
    exit 1
fi

# Check if device is connected
DEVICE_COUNT=$(adb devices | grep -c "device$" || true)
if [ "$DEVICE_COUNT" -eq 0 ]; then
    echo "❌ No Android device found!"
    echo "Please connect your Android device via USB and enable USB Debugging"
    echo "APK is ready at: app/build/outputs/apk/release/app-release.apk"
    exit 1
fi

# Uninstall old version (if exists)
echo "🔄 Removing old version..."
adb uninstall com.easypay 2>/dev/null || true

# Install new APK
adb install app/build/outputs/apk/release/app-release.apk

echo ""
echo "=========================================="
echo "✅ Installation Complete!"
echo "=========================================="
echo ""
echo "🚀 Launch the app on your device:"
echo "   adb shell am start -n com.easypay/.MainActivity"
echo ""
echo "Or find 'EasyPay' in your app drawer"
echo ""
