# Let me analyze the structure and features of this React component
code_analysis = {
    "component_name": "LenovoLegionRFDetector",
    "main_features": [
        "RF Detection through audio frequency analysis",
        "Device motion sensors (accelerometer, gyroscope, magnetometer)", 
        "Environmental sensors (light, proximity, temperature, pressure)",
        "Gaming laptop hardware monitoring (CPU, GPU, memory, fans)",
        "Audio recording and real-time processing",
        "Ultrasonic frequency detection capability",
        "Equalizer controls and audio visualization"
    ],
    "state_categories": {
        "audio_processing": [
            "isDetecting", "isRecording", "isLivePlayback", "audioData",
            "audioLevel", "peakFrequency", "sensitivity", "microphoneGain",
            "outputVolume", "ultrasonicMode", "eqBands"
        ],
        "device_sensors": [
            "accelerometerData", "gyroscopeData", "magnetometerData", 
            "orientationData", "ambientLightData", "proximityData"
        ],
        "system_monitoring": [
            "cpuData", "gpuData", "memoryData", "fanSpeed", "powerData",
            "batteryData", "networkData", "storageTemp"
        ],
        "ui_controls": [
            "activeTab", "showEqualizer", "microphoneDevices", "sensorHistory"
        ]
    },
    "web_apis_used": [
        "Web Audio API (AudioContext, AnalyserNode, MediaRecorder)",
        "Device Motion API (DeviceMotionEvent, DeviceOrientationEvent)", 
        "Generic Sensor API (attempted - limited browser support)",
        "Battery API (navigator.getBattery)",
        "Media Devices API (getUserMedia, enumerateDevices)"
    ],
    "limitations": [
        "Hardware monitoring data is simulated (browsers can't access CPU temps directly)",
        "Some sensor APIs have limited browser support",
        "Ultrasonic detection may not work in all browsers/environments",
        "Code is incomplete - cuts off during audio initialization"
    ]
}

print("=== REACT COMPONENT ANALYSIS ===")
print(f"Component: {code_analysis['component_name']}")
print(f"\nMain Features ({len(code_analysis['main_features'])}):")
for i, feature in enumerate(code_analysis['main_features'], 1):
    print(f"{i}. {feature}")

print(f"\nState Management Categories:")
for category, states in code_analysis['state_categories'].items():
    print(f"  {category}: {len(states)} state variables")

print(f"\nWeb APIs Utilized ({len(code_analysis['web_apis_used'])}):")
for api in code_analysis['web_apis_used']:
    print(f"  • {api}")
    
print(f"\nKey Limitations:")
for limitation in code_analysis['limitations']:
    print(f"  ⚠ {limitation}")