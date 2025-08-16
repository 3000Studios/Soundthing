/* eslint-disable react/prop-types */
import React from "react";
import { Volume2, Headphones, Cpu } from "lucide-react";
import { formatNum } from "../utils/formatters";

const FrequencyVisualizer = ({
  audioData,
  peakFrequency,
  audioLevel,
  microphoneGain,
  ultrasonicMode,
  isLivePlayback,
  aiEqualizer,
  sensitivity,
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-white mb-2 flex items-center justify-between">
        <span className="flex items-center">
          <Volume2 className="mr-2" size={16} />
          Audio Spectrum {ultrasonicMode ? "(0-96kHz)" : "(0-24kHz)"}
        </span>
        <div className="flex items-center space-x-2">
          {isLivePlayback && (
            <Headphones
              size={14}
              className="text-green-400"
              title="Live Playback On"
            />
          )}
          {aiEqualizer && (
            <Cpu
              size={14}
              className="text-purple-400"
              title="AI Equalizer On"
            />
          )}
        </div>
      </h3>
      <div className="h-40 flex items-end space-x-px overflow-hidden">
        {Array.from({ length: 200 }, (_, i) => {
          const index = Math.floor(i * (audioData.length / 200));
          const value = audioData[index] || 0;
          return (
            <div
              key={i}
              className="bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 flex-1"
              style={{
                height: `${Math.max(2, (value / 255) * 100)}%`,
                opacity: value > sensitivity ? 1 : 0.3,
              }}
            />
          );
        })}
      </div>
      <div className="text-xs text-gray-400 mt-2 flex justify-between">
        <span>Peak: {formatNum(peakFrequency, 0)} Hz</span>
        <span>Level: {formatNum(audioLevel, 0)}</span>
        <span>Gain: {microphoneGain}%</span>
      </div>
    </div>
  );
};

export default FrequencyVisualizer;
