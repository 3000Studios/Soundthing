# 📱 Soundthing RF Detector - Installation Guide

## Option 1: One-Click Install (Recommended for End Users)

### For Windows Users:
1. Download the latest `app-release.apk` from the [Releases](https://github.com/3000Studios/Soundthing/releases) page
2. Transfer the APK to your Android device via:
   - USB cable
   - Email
   - Cloud storage (Google Drive, Dropbox)
   - Direct download on your phone
3. On your Android device:
   - Tap the APK file
   - If prompted, allow installation from unknown sources
   - Tap "Install"
   - Tap "Open" to launch the app

### For Mac/Linux Users:
Same as Windows, just transfer the APK to your Android device.

---

## Option 2: Install via USB (Developer Method)

### Prerequisites:
- Android device with USB Debugging enabled
- USB cable
- ADB (Android Debug Bridge) installed

### Enable USB Debugging on Your Device:
1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times to enable Developer Options
3. Go back to **Settings** → **Developer Options**
4. Enable **USB Debugging**

### Install via ADB:
```bash
# Connect your device via USB
# Then run:
adb install app-debug.apk

# Or if you have the project:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Option 3: Build from Source

### Prerequisites:
- Node.js 16+ installed
- Android Studio installed (for Android build)
- Git (to clone the repository)

### Steps:

#### 1. Clone the Repository
```bash
git clone https://github.com/3000Studios/Soundthing.git
cd Soundthing
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Build Web App
```bash
npm run build
```

#### 4. Build Android APK

**Using the Build Script (Linux/Mac):**
```bash
./build-android.sh
```

**Using Android Studio:**
```bash
# Open Android Studio
npm run android

# In Android Studio:
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

**Using Gradle (Command Line):**
```bash
cd android
./gradlew assembleDebug
# APK will be at: app/build/outputs/apk/debug/app-debug.apk
```

---

## First Launch Setup

### 1. Grant Permissions
When you first launch the app, it will request:
- **Microphone** - Required for audio analysis
- **Storage** (Android 10 and below) - Required for saving recordings

Tap **Allow** for each permission.

### 2. Select Your Microphone
1. Tap the microphone dropdown in the Audio tab
2. Select your preferred microphone
3. Note: Device labels appear only after granting microphone permission

### 3. Start Using the App
1. Tap the **Start** button to begin detection
2. Adjust the **Mic Boost** slider if needed
3. Enable **Ultrasonic Mode** for high-frequency detection (if supported)
4. Tap **Record** to capture audio

---

## Troubleshooting

### "App not installed" error
- Make sure you have enough storage space
- Try uninstalling any previous version
- Clear the download cache

### "Installation blocked" message
- Go to Settings → Security
- Enable "Unknown sources" or "Install unknown apps"
- Allow installation from the source you're using

### Microphone not working
- Go to Settings → Apps → Soundthing RF Detector → Permissions
- Make sure Microphone permission is granted
- Try restarting the app

### App crashes on startup
- Clear app data: Settings → Apps → Soundthing → Storage → Clear Data
- Reinstall the app
- Make sure your Android version is 7.0 or higher

### No audio visualizer
- Grant microphone permission
- Select a microphone from the dropdown
- Tap the Start button
- Check that your microphone is working in other apps

### Recording not saving
- Grant storage permission (if requested)
- Check available storage space
- Try recording a shorter clip

---

## Updating the App

### From APK:
1. Download the new APK
2. Install it (it will update the existing installation)
3. Your settings and data will be preserved

### From Source:
```bash
git pull
npm install
npm run build
npm run android
# Build in Android Studio
```

---

## Uninstalling

### From Device:
1. Go to Settings → Apps
2. Find "Soundthing RF Detector"
3. Tap "Uninstall"

### Via ADB:
```bash
adb uninstall com.soundthing.rfdetector
```

---

## System Requirements

### Minimum:
- Android 7.0 (Nougat) or higher
- 50 MB free storage
- Microphone hardware

### Recommended:
- Android 10.0 or higher
- 100 MB free storage
- High-quality microphone for ultrasonic detection
- Device with accelerometer, gyroscope, and magnetometer sensors

---

## Support

- **Documentation**: See [README.md](README.md) and [BUILD.md](BUILD.md)
- **Issues**: [GitHub Issues](https://github.com/3000Studios/Soundthing/issues)
- **Source Code**: [GitHub Repository](https://github.com/3000Studios/Soundthing)

---

**Enjoy using Soundthing RF Detector! 🎙️📊**
