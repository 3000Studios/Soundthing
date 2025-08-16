# Lenovo Legion RF & Sensor Detector

A desktop-focused, browser-based React app that inspects audio inputs and device sensors to provide real-time frequency analysis, radar-style visuals, system telemetry, and recording. This repository contains a developer-ready scaffold to experiment with multi-microphone capture, ultrasonic analysis, and sensor fusion on a Lenovo Legion or similar Windows laptop.

This README finishes the project documentation: what the app does, how to run it, architecture notes, limitations, privacy, and next steps.

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
