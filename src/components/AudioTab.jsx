/* eslint-disable react/prop-types */
import React from "react";
import { Mic, Headphones, Cpu, Settings2, Square, Circle } from "lucide-react";
import FrequencyVisualizer from "./FrequencyVisualizer";
import { formatTime } from "../utils/formatters";

const AudioTab = ({
  // State
  microphoneDevices,
  selectedMic,
  microphoneGain,
  outputVolume,
  isLivePlayback,
  ultrasonicMode,
  aiEqualizer,
  isRecording,
  isDetecting,
  recordingTime,
  showEqualizer,
  // Setters
  setSelectedMic,
  setMicrophoneGain,
  setOutputVolume,
  toggleLivePlayback,
  setUltrasonicMode,
  setAiEqualizer,
  startRecording,
  stopRecording,
  setShowEqualizer,
  // Visualizer Props
  audioData,
  peakFrequency,
  audioLevel,
  sensitivity,
}) => {
  return (
    <div className="space-y-4">
      {/* Microphone Selector */}
      <div className="bg-gray-800 rounded-lg p-4">
        <label
          htmlFor="microphone-select"
          className="block text-sm text-gray-300 mb-2"
        >
          Microphone:
        </label>
        <select
          value={selectedMic}
          id="microphone-select"
          onChange={(e) => setSelectedMic(e.target.value)}
          disabled={isDetecting}
          className="w-full bg-gray-700 text-white p-2 rounded text-sm disabled:opacity-50"
        >
          <option value="default">Default Microphone</option>
          {microphoneDevices.map((device, index) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Audio Controls */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white mb-3 flex items-center">
          <Mic className="mr-2" size={16} /> Audio Controls
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Mic Boost</span>
              <span>{microphoneGain}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              value={microphoneGain}
              onChange={(e) => setMicrophoneGain(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Output Volume</span>
              <span>{outputVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={outputVolume}
              onChange={(e) => setOutputVolume(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={toggleLivePlayback}
              className={`flex items-center justify-center py-2 px-3 rounded text-sm ${
                isLivePlayback ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              <Headphones className="mr-1" size={14} /> Live
            </button>
            <button
              disabled={isDetecting}
              onClick={() => setUltrasonicMode(!ultrasonicMode)}
              className={`flex items-center justify-center py-2 px-3 rounded text-sm ${
                ultrasonicMode ? "bg-blue-600" : "bg-gray-600"
              } disabled:opacity-50`}
            >
              Ultrasonic
            </button>
            <button
              onClick={() => setAiEqualizer(!aiEqualizer)}
              className={`flex items-center justify-center py-2 px-3 rounded text-sm ${
                aiEqualizer ? "bg-purple-600" : "bg-gray-600"
              }`}
            >
              <Cpu className="mr-1" size={14} /> AI EQ
            </button>
          </div>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!isDetecting}
            className={`flex items-center px-3 py-2 rounded font-semibold transition-colors ${
              isRecording
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            }`}
          >
            {isRecording ? (
              <Square className="mr-1" size={14} />
            ) : (
              <Circle className="mr-1" size={14} />
            )}
            {isRecording ? "Stop" : "Record"}
          </button>
          {isRecording && (
            <div className="flex items-center text-red-400">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
              {formatTime(recordingTime)}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowEqualizer(!showEqualizer)}
          className="flex items-center px-3 py-2 rounded bg-gray-600 hover:bg-gray-700"
        >
          <Settings2 className="mr-1" size={14} /> EQ
        </button>
      </div>

      {/* Frequency Visualizer */}
      <FrequencyVisualizer
        audioData={audioData}
        peakFrequency={peakFrequency}
        audioLevel={audioLevel}
        microphoneGain={microphoneGain}
        ultrasonicMode={ultrasonicMode}
        isLivePlayback={isLivePlayback}
        aiEqualizer={aiEqualizer}
        sensitivity={sensitivity}
      />
    </div>
  );
};

export default AudioTab;
