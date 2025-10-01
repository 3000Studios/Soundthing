# Building Soundthing RF Detector for Android

## Prerequisites

Before building the Android app, ensure you have the following installed:

1. **Node.js** (v16 or later) - [Download here](https://nodejs.org/)
2. **Android Studio** - [Download here](https://developer.android.com/studio)
3. **Java Development Kit (JDK) 17** - Usually included with Android Studio
4. **Android SDK** - Install via Android Studio SDK Manager
   - Required: Android SDK Platform 33 or later
   - Build Tools 33.0.0 or later

## Quick Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Web App
```bash
npm run build
```

### 3. Sync with Android
```bash
npm run android
```

This will:
- Copy the built web assets to the Android project
- Open Android Studio with the project

### 4. Build in Android Studio

Once Android Studio opens:

#### For Debug APK (Testing):
1. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for the build to complete
3. Click **locate** in the notification to find your APK
4. Install the APK on your Android device

#### For Release APK (Production):
1. Click **Build** → **Generate Signed Bundle / APK**
2. Select **APK** and click **Next**
3. Create a new keystore or use an existing one
4. Fill in the keystore details and click **Next**
5. Select **release** build variant
6. Check both signature versions (V1 and V2)
7. Click **Finish**

The APK will be located at:
- **Debug**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release**: `android/app/build/outputs/apk/release/app-release.apk`

## One-Click Install Setup

### Installing on Your Device

#### Method 1: Direct APK Install
1. Enable **Developer Options** on your Android device:
   - Go to Settings → About Phone
   - Tap **Build Number** 7 times
2. Enable **USB Debugging**:
   - Settings → Developer Options → USB Debugging
3. Connect your device via USB
4. Transfer the APK file
5. Open the APK file on your device
6. Allow installation from unknown sources if prompted
7. Tap **Install**

#### Method 2: USB Install via ADB
```bash
# Connect your device via USB
# Then run:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### Method 3: Run from Android Studio
1. Connect your device via USB
2. Click the **Run** button (green play icon) in Android Studio
3. Select your device from the list
4. The app will automatically install and launch

## Build Scripts

We've added convenient scripts to package.json:

```bash
# Development server
npm run dev

# Build web app
npm run build

# Preview built app
npm run preview

# Open in Android Studio
npm run android
```

## Troubleshooting

### Android Studio doesn't open
- Make sure Android Studio is installed and in your PATH
- Manually open the `android` folder as a project in Android Studio

### Build fails in Android Studio
- Go to **File** → **Sync Project with Gradle Files**
- Check that you have the correct SDK versions installed
- Clean and rebuild: **Build** → **Clean Project** then **Build** → **Rebuild Project**

### Microphone not working
- Make sure you granted microphone permissions
- Check Settings → Apps → Soundthing RF Detector → Permissions
- Grant **Microphone** permission

### App crashes on startup
- Check logcat in Android Studio for error messages
- Try clearing app data: Settings → Apps → Soundthing → Storage → Clear Data

## Application Features

This app provides:
- 🎤 Real-time audio frequency analysis
- 📊 Ultrasonic frequency detection (up to 192kHz sample rate on supported devices)
- 📱 Device sensor monitoring (accelerometer, gyroscope, magnetometer)
- 💻 System monitoring (simulated CPU, GPU, battery stats)
- 📡 Network monitoring
- 🎙️ Audio recording with export
- 🎨 Real-time radar visualization

## Permissions Required

The app requests the following permissions:
- **Microphone** - For audio capture and frequency analysis
- **Storage** - For saving audio recordings
- **Sensors** - For accelerometer, gyroscope, and magnetometer data

All permissions are requested at runtime on Android 6.0+.

## Support

For issues or questions, please open an issue on the GitHub repository.
