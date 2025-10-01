# 🚀 Soundthing RF Detector - Quick Start Guide

## Get Your Android APK in 3 Steps!

### Step 1: Install Prerequisites ⚙️

**Required Software:**
- [Node.js 16+](https://nodejs.org/) - JavaScript runtime
- [Android Studio](https://developer.android.com/studio) - Android development IDE
- [Java JDK 17](https://adoptium.net/) - Usually comes with Android Studio

**Verify Installation:**
```bash
node --version   # Should show v16 or higher
java -version    # Should show version 17
```

---

### Step 2: Build the Web App 🔨

Open terminal/command prompt and run:

```bash
# Navigate to project directory
cd /path/to/Soundthing

# Install dependencies (first time only)
npm install

# Build the web application
npm run build
```

You should see:
```
✓ built in 2.39s
dist/index.html                   0.73 kB
dist/assets/index-*.css           0.66 kB
dist/assets/index-*.js          169.93 kB
```

---

### Step 3: Build Android APK 📱

#### Option A: Automated Script (Linux/Mac)
```bash
./build-android.sh
```

#### Option B: Manual (All Platforms)

1. **Sync Android project:**
```bash
npm run android
```

2. **In Android Studio** (will open automatically):
   - Wait for Gradle sync to complete
   - Click **Build** menu
   - Select **Build Bundle(s) / APK(s)**
   - Select **Build APK(s)**
   - Wait for build to complete (1-3 minutes)
   - Click **locate** in the notification

3. **Find your APK:**
   - Location: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Size: ~7-10 MB

---

## 🎉 You're Done!

### Install on Your Android Device

1. **Transfer the APK** to your phone:
   - Via USB cable
   - Via email/cloud storage
   - Via ADB: `adb install app-debug.apk`

2. **On your phone:**
   - Tap the APK file
   - Allow installation from unknown sources (if prompted)
   - Tap **Install**
   - Tap **Open**

3. **First Launch:**
   - Grant **Microphone** permission when asked
   - Select your microphone from the dropdown
   - Tap **Start** to begin detection!

---

## 🎵 Using the App

### Audio Tab
- **Start Button** - Begin audio detection
- **Mic Boost** - Adjust input gain (0-500%)
- **Ultrasonic** - Enable 192kHz mode for high frequencies
- **Record** - Capture audio (only when detection is active)
- **Live** - Hear the microphone input in real-time

### Sensors Tab
- View real-time motion sensors
- Monitor device orientation
- Check environmental conditions
- Review sensor history

### System Tab
- CPU and GPU metrics
- Memory usage
- Fan speeds
- Power consumption

### Network Tab
- Wi-Fi signal strength
- Bluetooth devices
- Cellular signal

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Android Studio Issues
- **Gradle sync failed**: Click "Sync Now" again
- **SDK not found**: File → Settings → Android SDK → Install missing components
- **Build failed**: Build → Clean Project, then Build → Rebuild Project

### App Crashes
- Make sure you granted microphone permission
- Try restarting the app
- Check Android version is 7.0 or higher

### No Audio Detection
- Tap the microphone dropdown and select a device
- Increase the Mic Boost slider
- Check microphone works in other apps
- Ensure microphone permission is granted

---

## 📚 Need More Help?

- **Detailed Build Guide**: See [BUILD.md](BUILD.md)
- **Installation Options**: See [INSTALL.md](INSTALL.md)
- **Full Documentation**: See [README.md](README.md)
- **Project Overview**: See [SUMMARY.md](SUMMARY.md)

---

## 🎊 Ready for Production!

Your APK is ready to:
- Share with friends and colleagues
- Install on multiple devices
- Distribute online
- Submit to Google Play Store (after signing)

---

**Enjoy using Soundthing RF Detector!** 🎙️📊

Need help? Open an issue on GitHub!
