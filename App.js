/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  Settings,
  Volume2,
  Activity,
  Monitor,
  Wifi,
  Gamepad2,
} from "lucide-react";

import AudioTab from "./components/AudioTab";
import SensorsTab from "./components/SensorsTab";
import SystemTab from "./components/SystemTab";
import NetworkTab from "./components/NetworkTab";
const LenovoLegionRFDetector = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLivePlayback, setIsLivePlayback] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Audio state
  const [audioData, setAudioData] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [peakFrequency, setPeakFrequency] = useState(0);
  const [sensitivity, setSensitivity] = useState(50);
  const [selectedMic, setSelectedMic] = useState("default");
  const [microphoneDevices, setMicrophoneDevices] = useState([]);
  const [microphoneGain, setMicrophoneGain] = useState(100);
  const [outputVolume, setOutputVolume] = useState(50);
  const [ultrasonicMode, setUltrasonicMode] = useState(false);
  const [aiEqualizer, setAiEqualizer] = useState(true);
  const [showEqualizer, setShowEqualizer] = useState(false);

  // Sensor data states
  /* eslint-disable no-unused-vars */
  const accelerometerData = useState({
    x: null,
    y: null,
    z: null,
    magnitude: null,
  })[0];
  const gyroscopeData = useState({
    x: null,
    y: null,
    z: null,
    magnitude: null,
  })[0];
  const magnetometerData = useState({
    x: null,
    y: null,
    z: null,
    magnitude: null,
  })[0];
  const orientationData = useState({ alpha: null, beta: null, gamma: null })[0];
  const ambientLightData = useState(null)[0];
  const proximityData = useState(null)[0];
  const temperatureData = useState(null)[0];
  const pressureData = useState(null)[0];
  const humidityData = useState(null)[0];
  const batteryData = useState({ level: null, charging: false, temp: null })[0];
  const networkData = useState({
    wifiStrength: null,
    bluetoothDevices: null,
    cellularSignal: null,
  })[0];
  const gpuData = useState({ temp: null, usage: null, memory: null })[0];
  const cpuData = useState({ temp: null, usage: null, cores: [] })[0];
  const memoryData = useState({ used: null, total: 32, temperature: null })[0];
  const storageTemp = useState(null)[0];
  const fanSpeed = useState({ cpu: null, gpu: null })[0];
  const powerData = useState({
    consumption: null,
    voltage: null,
    current: null,
  })[0];
  const [sensorHistory, setSensorHistory] = useState([]);
  /* eslint-enable no-unused-vars */

  // Display options
  const [activeTab, setActiveTab] = useState("audio");

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const gainNodeRef = useRef(null);
  const outputGainRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const sensorIntervalRef = useRef(null);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current)
        clearInterval(recordingIntervalRef.current);
      setTimeout(() => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `legion_rf_recording_${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-")}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        recordedChunksRef.current = [];
      }, 100);
    }
  }, [isRecording]);

  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    if (isRecording) stopRecording();

    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (sensorIntervalRef.current) clearInterval(sensorIntervalRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current
        .close()
        .catch((e) => console.error("Error closing AudioContext:", e));
      audioContextRef.current = null;
    }
    // Also stop media stream tracks
    if (microphoneRef.current && microphoneRef.current.mediaStream) {
      microphoneRef.current.mediaStream
        .getTracks()
        .forEach((track) => track.stop());
    }
  }, [isRecording, stopRecording]);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    setAudioLevel(average);

    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }
    const peakFreq =
      (maxIndex * audioContextRef.current.sampleRate) / (2 * bufferLength);
    setPeakFrequency(peakFreq);
    setAudioData([...dataArray]);
  }, []);

  const detectionLoop = useCallback(() => {
    if (!isDetectingRef.current) return;
    analyzeAudio();
    animationFrameRef.current = requestAnimationFrame(detectionLoop);
  }, [analyzeAudio]);

  const isDetectingRef = useRef(isDetecting);
  useEffect(() => {
    isDetectingRef.current = isDetecting;
    if (isDetecting) {
      animationFrameRef.current = requestAnimationFrame(detectionLoop);
    } else {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isDetecting, detectionLoop]);

  const initializeAudio = useCallback(async () => {
    if (audioContextRef.current) await stopDetection();
    try {
      const constraints = {
        audio: {
          deviceId:
            selectedMic !== "default" ? { exact: selectedMic } : undefined,
          sampleRate: ultrasonicMode ? 192000 : 48000,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)({
        sampleRate: ultrasonicMode ? 192000 : 48000,
        latencyHint: "interactive",
      });
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = microphoneGain / 50;
      outputGainRef.current = audioContextRef.current.createGain();
      outputGainRef.current.gain.value = outputVolume / 100;
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = ultrasonicMode ? 32768 : 16384;
      microphoneRef.current
        .connect(gainNodeRef.current)
        .connect(analyserRef.current);
      if (isLivePlayback)
        analyserRef.current
          .connect(outputGainRef.current)
          .connect(audioContextRef.current.destination);
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };
      return true;
    } catch (error) {
      console.error("Audio initialization failed:", error);
      alert(
        `Audio Error: ${error.message}. Try another microphone or check permissions.`
      );
      return false;
    }
  }, [
    selectedMic,
    ultrasonicMode,
    microphoneGain,
    outputVolume,
    isLivePlayback,
    stopDetection,
  ]);

  const initializeSensors = useCallback(() => {
    if (sensorIntervalRef.current) clearInterval(sensorIntervalRef.current);
    sensorIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const accX = Math.sin(now / 1000) * 2;
      const accY = Math.cos(now / 1200) * 2;
      const accZ = Math.sin(now / 800) + 9.8;
      const accMag = Math.sqrt(accX ** 2 + accY ** 2 + accZ ** 2);
      setAccelerometerData({ x: accX, y: accY, z: accZ, magnitude: accMag });
      const cpuTemp = 45 + Math.random() * 30;
      const gpuTemp = 50 + Math.random() * 40;
      setCpuData({
        temp: cpuTemp,
        usage: Math.random() * 100,
        cores: Array.from({ length: 8 }, () => Math.random() * 100),
      });
      setGpuData({
        temp: gpuTemp,
        usage: Math.random() * 100,
        memory: Math.random() * 16,
      });
      setSensorHistory((prev) => [
        ...prev.slice(-99),
        {
          timestamp: Date.now(),
          accelerometer: accMag,
          gpu: gpuTemp,
          cpu: cpuTemp,
        },
      ]);
      // ... more sensor updates
    }, 1000);
  }, []);

  const startDetection = useCallback(async () => {
    const audioInit = await initializeAudio();
    if (audioInit) {
      initializeSensors();
      setIsDetecting(true);
    }
  }, [initializeAudio, initializeSensors]);

  const startRecording = () => {
    if (mediaRecorderRef.current && !isRecording) {
      recordedChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(
        () => setRecordingTime((prev) => prev + 1),
        1000
      );
    }
  };

  const toggleLivePlayback = () => {
    setIsLivePlayback((prev) => {
      const newIsLivePlayback = !prev;
      if (outputGainRef.current && audioContextRef.current) {
        if (newIsLivePlayback) {
          outputGainRef.current.connect(audioContextRef.current.destination);
        } else {
          try {
            outputGainRef.current.disconnect(
              audioContextRef.current.destination
            );
          } catch (e) {
            console.warn(
              "Could not disconnect live playback, already disconnected.",
              e
            );
          }
        }
      }
      return newIsLivePlayback;
    });
  };

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) =>
        setMicrophoneDevices(devices.filter((d) => d.kind === "audioinput"))
      );
    return () => stopDetection();
  }, [stopDetection]);

  useEffect(() => {
    if (gainNodeRef.current)
      gainNodeRef.current.gain.value = microphoneGain / 50;
  }, [microphoneGain]);
  useEffect(() => {
    if (outputGainRef.current)
      outputGainRef.current.gain.value = outputVolume / 100;
  }, [outputVolume]);

  const TABS = [
    { id: "audio", label: "Audio", icon: Volume2 },
    { id: "sensors", label: "Sensors", icon: Activity },
    { id: "system", label: "System", icon: Monitor },
    { id: "network", label: "Network", icon: Wifi },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <Gamepad2 className="mr-3" size={32} />
            Lenovo Legion RF Detector
          </h1>
          <p className="text-gray-400 text-sm">
            Multi-sensor electromagnetic detection and analysis tool
          </p>
        </header>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={isDetecting ? stopDetection : startDetection}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
                isDetecting
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isDetecting ? (
                <Pause className="mr-2" />
              ) : (
                <Play className="mr-2" />
              )}
              {isDetecting ? "Stop" : "Start"} Detection
            </button>
            <div className="flex items-center">
              <Settings className="mr-2" />
              <span className="text-sm">Sensitivity</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center py-2 px-3 rounded text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <tab.icon className="mr-1.5" size={14} /> {tab.label}
            </button>
          ))}
        </div>

        <main>
          {activeTab === "audio" && (
            <AudioTab
              {...{
                microphoneDevices,
                selectedMic,
                setSelectedMic,
                microphoneGain,
                setMicrophoneGain,
                outputVolume,
                setOutputVolume,
                isLivePlayback,
                toggleLivePlayback,
                ultrasonicMode,
                setUltrasonicMode,
                aiEqualizer,
                setAiEqualizer,
                isRecording,
                startRecording,
                stopRecording,
                isDetecting,
                recordingTime,
                showEqualizer,
                setShowEqualizer,
                audioData,
                peakFrequency,
                audioLevel,
                sensitivity,
              }}
            />
          )}
          {activeTab === "sensors" && (
            <SensorsTab
              {...{
                accelerometerData,
                gyroscopeData,
                magnetometerData,
                orientationData,
                ambientLightData,
                proximityData,
                temperatureData,
                pressureData,
                humidityData,
                batteryData,
                sensorHistory,
              }}
            />
          )}
          {activeTab === "system" && (
            <SystemTab
              {...{
                cpuData,
                gpuData,
                memoryData,
                fanSpeed,
                storageTemp,
                powerData,
              }}
            />
          )}
          {activeTab === "network" && <NetworkTab {...{ networkData }} />}
        </main>
      </div>
    </div>
  );
};

export default LenovoLegionRFDetector;
