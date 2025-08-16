/* eslint-disable react/prop-types */
import React from "react";
import { Activity, Thermometer, Battery, Compass, Zap } from "lucide-react";
import { formatNum } from "../utils/formatters";

const SensorsTab = ({
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
}) => (
  <div className="space-y-4">
    {/* Motion Sensors */}
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-white mb-2 flex items-center">
        <Activity className="mr-2" size={16} /> Motion Sensors
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm text-gray-300 mb-2">Accelerometer (m/s²)</h4>
          <div className="text-xs space-y-1 text-gray-200">
            <div>X: {formatNum(accelerometerData.x)}</div>
            <div>Y: {formatNum(accelerometerData.y)}</div>
            <div>Z: {formatNum(accelerometerData.z)}</div>
            <div>Mag: {formatNum(accelerometerData.magnitude)}</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm text-gray-300 mb-2">Gyroscope (°/s)</h4>
          <div className="text-xs space-y-1 text-gray-200">
            <div>X: {formatNum(gyroscopeData.x)}</div>
            <div>Y: {formatNum(gyroscopeData.y)}</div>
            <div>Z: {formatNum(gyroscopeData.z)}</div>
            <div>Mag: {formatNum(gyroscopeData.magnitude)}</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm text-gray-300 mb-2">
            <Zap className="inline mr-1" size={12} />
            Magnetometer (sim)
          </h4>
          <div className="text-xs space-y-1 text-gray-200">
            <div>X: {formatNum(magnetometerData.x)}</div>
            <div>Y: {formatNum(magnetometerData.y)}</div>
            <div>Z: {formatNum(magnetometerData.z)}</div>
            <div>Mag: {formatNum(magnetometerData.magnitude)}</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm text-gray-300 mb-2">Orientation (°)</h4>
          <div className="text-xs space-y-1 text-gray-200">
            <div>Alpha: {formatNum(orientationData.alpha, 1)}</div>
            <div>Beta: {formatNum(orientationData.beta, 1)}</div>
            <div>Gamma: {formatNum(orientationData.gamma, 1)}</div>
          </div>
        </div>
      </div>
    </div>

    {/* Environmental Sensors */}
    <div className="bg-gray-900 rounded-lg p-4 grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm text-gray-300 mb-2">
          <Thermometer className="inline mr-2" size={14} />
          Environment
        </h4>
        <div className="text-xs text-gray-200 space-y-1">
          <div>Amb Light: {formatNum(ambientLightData, 1)} lx</div>
          <div>Proximity: {formatNum(proximityData, 1)}</div>
          <div>Temp: {formatNum(temperatureData, 1)} °C</div>
          <div>Pressure: {formatNum(pressureData, 1)} hPa</div>
          <div>Humidity: {formatNum(humidityData, 1)} %</div>
        </div>
      </div>
      <div>
        <h4 className="text-sm text-gray-300 mb-2">
          <Battery className="inline mr-2" size={14} />
          Battery
        </h4>
        <div className="text-xs text-gray-200 space-y-1">
          <div>
            Level:{" "}
            {batteryData?.level ? `${Math.round(batteryData.level)}%` : "--"}
          </div>
          <div>Charging: {batteryData?.charging ? "Yes" : "No"}</div>
          <div>Temp (sim): {formatNum(batteryData?.temp, 1)} °C</div>
        </div>
      </div>
    </div>

    {/* Sensor History */}
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white mb-2 flex items-center">
        <Compass className="mr-2" size={16} /> Sensor History (last{" "}
        {sensorHistory.length})
      </h3>
      <div className="text-xs text-gray-300 max-h-40 overflow-auto">
        {sensorHistory.length === 0 ? (
          <div className="text-gray-500">No history yet.</div>
        ) : (
          sensorHistory.map((entry) => (
            <div
              key={entry.timestamp}
              className="flex justify-between py-1 border-b border-gray-700"
            >
              <div className="text-gray-200">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-gray-400 text-xs">
                acc:{formatNum(entry.accelerometer, 1)} gpu:
                {formatNum(entry.gpu, 0)} cpu:{formatNum(entry.cpu, 0)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default SensorsTab;
