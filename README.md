# 🎙️ Soundthing RF Detector

A modern React web application for real-time audio frequency analysis, ultrasonic detection, and device sensor monitoring. Built with Vite + React and packaged for Android using Capacitor.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Android](https://img.shields.io/badge/Android-Ready-green)

---

## ✨ Features

### 🎵 Audio Analysis
- **Real-time frequency spectrum visualization** with 150+ frequency bands
- **Peak frequency detection** with Hz precision
- **Ultrasonic mode** supporting up to 192kHz sample rates (hardware dependent)
- **Live audio monitoring** with adjustable gain and output volume
- **Audio recording** with WebM export
- **Radar-style visualization** for RF frequency patterns

### 📱 Sensor Monitoring
- **Accelerometer** - X, Y, Z axis and magnitude
- **Gyroscope** - Rotation rates with magnitude
- **Magnetometer** - Magnetic field detection (simulated)
- **Device orientation** tracking
- Real-time sensor data updates

### 💻 System Telemetry
- CPU temperature and usage monitoring (simulated)
- GPU metrics and memory usage (simulated)
- Battery level and charging status
- System performance metrics

### 📡 Network Information
- Wi-Fi signal strength monitoring (simulated)
- Bluetooth device detection (simulated)
- Cellular signal information (simulated)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (18+ recommended)
- **npm** or **yarn**

### Web Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

### Android Build

See [BUILD.md](BUILD.md) for detailed Android build instructions.

**Quick Android setup:**
```bash
# Install dependencies
npm install

# Build the app
npm run build

# Open in Android Studio
npm run android
```

---

## 📋 Requirements

### Browser Support
- **Chrome/Edge** 90+ (recommended for best Web Audio API support)
- **Firefox** 88+
- **Safari** 14+

### Android
- Android 7.0 (API 24) or higher
- Microphone hardware required
- Recommended: High-quality audio hardware for ultrasonic detection

---

## 🎯 Usage

### Audio Tab
1. **Select Microphone** - Choose your input device from the dropdown
2. **Adjust Mic Boost** - Increase gain for quiet signals (0-500%)
3. **Set Output Volume** - Control monitor volume (0-100%)
4. **Toggle Ultrasonic Mode** - Switch between 48kHz and 192kHz sampling
5. **Enable Live Monitor** - Hear the microphone input in real-time
6. **Start Detection** - Begin analyzing audio
7. **Record Audio** - Capture and export audio as WebM

### Sensors Tab
- View real-time accelerometer, gyroscope, and magnetometer data
- Monitor device orientation (alpha, beta, gamma)
- Track sensor magnitude and individual axis values

### System Tab
- Monitor CPU/GPU temperatures and usage
- View memory statistics
- Check battery level and charging status
- Review system performance metrics

### Network Tab
- Monitor Wi-Fi signal strength
- View Bluetooth device count
- Check cellular signal information

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: React 18.2
- **Build Tool**: Vite 4.4
- **Styling**: TailwindCSS + Custom CSS
- **Icons**: Lucide React
- **Mobile**: Capacitor 5.4

### Project Structure
```
Soundthing/
├── src/
│   ├── components/      # React components
│   │   ├── AudioTab.jsx
│   │   ├── SensorsTab.jsx
│   │   ├── SystemTab.jsx
│   │   └── NetworkTab.jsx
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application
│   ├── main.jsx        # Entry point
│   └── styles.css      # Global styles
├── android/            # Android/Capacitor project
├── dist/              # Production build
├── public/            # Static assets
└── capacitor.config.json
```

### Key APIs Used
- **Web Audio API** - AudioContext, AnalyserNode, MediaRecorder
- **Device Motion API** - DeviceMotionEvent, DeviceOrientationEvent
- **Media Devices API** - getUserMedia, enumerateDevices
- **Canvas API** - Radar visualization

---

## 🔒 Permissions

The app requires the following permissions:

### Browser
- **Microphone** - Required for audio capture and analysis

### Android
- **RECORD_AUDIO** - Audio capture
- **MODIFY_AUDIO_SETTINGS** - Audio configuration
- **WRITE_EXTERNAL_STORAGE** - Save recordings
- **READ_EXTERNAL_STORAGE** - Access recordings

All permissions are requested at runtime with user consent.

---

## ⚠️ Limitations

- **Ultrasonic detection** depends on hardware capabilities and drivers
- **System metrics** (CPU/GPU temps) are simulated in browser environment
  - For real hardware monitoring, deploy with Electron + native module
- **High sample rates** (192kHz) require:
  - Professional audio interface
  - Appropriate driver configuration
  - Browser/OS support
- **Sensor data** availability varies by device and browser

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run android   # Open Android Studio
```

### Building for Production

1. Update version in `package.json`
2. Run `npm run build`
3. Test with `npm run preview`
4. For Android: Run `npm run android` and build in Android Studio

---

## 📦 Deployment

### Web Deployment
Deploy the `dist` folder to any static hosting service:
- Netlify
- Vercel  
- GitHub Pages
- Firebase Hosting

### Android Deployment
1. Build a signed APK/AAB in Android Studio
2. Upload to Google Play Console
3. Or distribute the APK directly

See [BUILD.md](BUILD.md) for detailed instructions.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🆘 Support & Issues

- **Documentation**: See BUILD.md for Android setup
- **Issues**: Open an issue on GitHub
- **Questions**: Check existing issues or create a new one

---

## 🎉 Acknowledgments

Built with modern web technologies:
- React for UI components
- Vite for blazing-fast builds
- Capacitor for native mobile packaging
- Lucide for beautiful icons
- TailwindCSS for styling

---

**Made with ❤️ for audio enthusiasts and RF detection**


---

## What this app does (detailed)

- Audio capture and analysis
  - Enumerates available audio input devices and lets you select a microphone.
  - Uses the Web Audio API to create an AudioContext, AnalyserNode, and (optionally) a high sample-rate context for ultrasonic capture when supported by hardware/drivers.
  - Displays a real-time frequency spectrum (200 bands), computes overall audio level, and reports the detected peak frequency in Hz.
  - Provides mic gain (boost), output volume, live-monitoring (listen to the mic), and a simple AI-eq toggle (UI flag — plug in DSP later).

- Recording
  - Uses MediaRecorder to capture the microphone stream and save audio as a .webm download when recording stops.

- Sensors & telemetry
  - Reads DeviceMotion/DeviceOrientation APIs (when available) for accelerometer and gyroscope data; otherwise provides deterministic simulated values for demo/testing.
  - Shows a Sensor History timeline for quick review of recent sensor snapshots.
  - Displays a System panel (CPU/GPU/memory/fan/power) and Network panel (Wi‑Fi/Bluetooth/cellular) with simulated metrics so you can prototype dashboards before adding native telemetry.

- Extensibility hooks
  - The code base has clear places to add STT (Web Speech API), server-side analytics, AI models, or a native bridge (Electron + native module) for privileged sensors.

---

## Quick start (developer)

Requirements

- Node.js 16+ (Node 18+ recommended)
- npm (comes with Node)

Run locally (PowerShell):

```powershell
cd C:\DoNotEnter
npm install
npm start
```

Open your browser at `http://localhost:3000` (Create React App default) or the port printed by the dev server.

Notes
- Use a Chromium-based browser (Chrome, Edge) for best Web Audio and MediaRecorder support.
- Device labels for microphones only appear after the user grants microphone permission in the browser; grant permission and reload to see full device names.

---

## UI overview (what each tab does)

- Audio tab
  - Microphone selector, Mic Boost and Output Volume sliders.
  - Live monitor toggle, Ultrasonic mode toggle (tries high sample rates), AI EQ flag, and Record controls.
  - Frequency visualizer with peak frequency and level readouts.

- Sensors tab
  - Motion sensors (accelerometer, gyroscope), orientation, magnetometer (simulated), and environmental readouts (simulated where hardware is unavailable).
  - Sensor History list with timestamps and condensed values.

- System tab
  - Prototype view of CPU/GPU/memory/fans and power metrics (simulated). Intended for later replacement with native telemetry.

- Network tab
  - Displays simulated Wi‑Fi strength, Bluetooth counts, and cellular signal.

---

## Architecture & implementation notes

- React + functional components: `src/App.js` is the main orchestrator; each tab lives under `src/components`.
- Web Audio API: AudioContext, createMediaStreamSource, GainNode, AnalyserNode, MediaRecorder.
- Device enumeration: `navigator.mediaDevices.enumerateDevices()` and `getUserMedia()`.
- Sensors: DeviceMotion/DeviceOrientation where supported; otherwise deterministic simulation is used so UI behavior is consistent during development.

If you later package this into Electron, add a small native helper for privileged sensor access (WMI on Windows or a native driver) and expose a secure IPC channel to the renderer.

---

## Privacy, security, and data handling

- Microphone access is requested at runtime by the browser. Streams are used locally and not uploaded by default.
- Recorded audio is saved locally through a browser download. If you add cloud features, obtain explicit user consent and follow privacy regulations (GDPR, CCPA, etc.).

Security tips

- Serve the app over HTTPS in production and use secure IPC channels if packaging with Electron.
- Sanitize and minimize any telemetry sent to servers. Allow opt-in only.

---

## Limitations and common pitfalls

- Microphone labels hidden until permission is granted. Grant mic permission and reload the page.
- Ultrasonic/high sample-rate capture depends on microphone hardware, OS, and driver support. If unsupported, the AudioContext may fall back to a lower sample rate or initialization may fail.
- Browser differences: MediaRecorder codecs, Web Speech API availability, and sensor event support vary across browsers. Chrome/Edge are the most compatible targets.

---

## Troubleshooting

- No devices listed in dropdown after granting permission:
  - Reload the page and call `navigator.mediaDevices.enumerateDevices()` again.
  - Check Windows privacy settings: Settings → Privacy & security → Microphone.

- App fails to initialize audio or AudioContext errors:
  - Try disabling Ultrasonic mode.
  - Use a different microphone or update audio drivers.

- Recording fails or downloaded file won't play:
  - Try a different browser (Chrome/Edge) or inspect `mediaRecorder.mimeType` support.

---

## Development tasks & next steps (recommended)

Pick any of the following and I’ll implement:

1. Add PropTypes to all components and remove eslint disables (runtime prop validation).
2. Convert the codebase to TypeScript for stronger typing.
3. Add unit tests (Jest + React Testing Library) for utilities and a smoke test that verifies AudioContext creation.
4. Create an Electron wrapper and a small native helper (C# or C++) to read Windows WMI sensor metrics and expose them over IPC.

---

## Files of interest

- `src/App.js` — main orchestration and hooks for audio/sensors.
- `src/components/AudioTab.js` — microphone controls and recording UI.
- `src/components/FrequencyVisualizer.js` — spectrum renderer.
- `src/components/*` — other tab UIs.
- `src/utils/formatters.js` — small formatting helpers.

---

If you want, I can now:

- Implement follow-up (1) PropTypes or (2) TypeScript conversion.
- Create an Electron packaging plan and a sample native helper for Windows sensors.
- Add automated tests and a CI job that runs them.

Tell me which follow-up to do next and I’ll proceed.
