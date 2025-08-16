/* eslint-disable react/prop-types */
import React from "react";
import { Monitor, Cpu, Gamepad2 } from "lucide-react";
import { formatNum } from "../utils/formatters";

const SystemTab = ({
  cpuData,
  gpuData,
  memoryData,
  fanSpeed,
  storageTemp,
  powerData,
}) => (
  <div className="space-y-4">
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-white mb-2 flex items-center">
        <Monitor className="mr-2" size={16} /> System Overview
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm text-gray-300 mb-2">
            <Cpu className="inline mr-2" size={14} />
            CPU
          </h4>
          <div className="text-xs text-gray-200 space-y-1">
            <div>Temp: {formatNum(cpuData?.temp, 1)} °C</div>
            <div>Usage: {formatNum(cpuData?.usage, 1)}%</div>
            <div>
              Cores:
              {cpuData?.cores?.length
                ? cpuData.cores.map((c, i) => (
                    <span
                      key={`${i}-${Math.round(c)}`}
                      className="ml-1 text-gray-400 text-xs"
                    >
                      [{i}:{Math.round(c)}%]
                    </span>
                  ))
                : " -"}
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm text-gray-300 mb-2">
            <Gamepad2 className="inline mr-2" size={14} />
            GPU
          </h4>
          <div className="text-xs text-gray-200 space-y-1">
            <div>Temp: {formatNum(gpuData?.temp, 1)} °C</div>
            <div>Usage: {formatNum(gpuData?.usage, 1)}%</div>
            <div>Memory: {formatNum(gpuData?.memory, 1)} GB</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm text-gray-300 mb-2">Memory</h4>
          <div className="text-xs text-gray-200 space-y-1">
            <div>Used: {formatNum(memoryData?.used, 1)} GB</div>
            <div>Total: {memoryData?.total ?? "--"} GB</div>
            <div>Temp: {formatNum(memoryData?.temperature, 1)} °C</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm text-gray-300 mb-2">Fans & Storage</h4>
          <div className="text-xs text-gray-200 space-y-1">
            <div>CPU Fan: {formatNum(fanSpeed?.cpu, 0)} RPM</div>
            <div>GPU Fan: {formatNum(fanSpeed?.gpu, 0)} RPM</div>
            <div>Storage Temp: {formatNum(storageTemp, 1)} °C</div>
          </div>
        </div>
        <div className="col-span-2">
          <h4 className="text-sm text-gray-300 mb-2">Power</h4>
          <div className="text-xs text-gray-200 space-y-1">
            <div>Consumption: {formatNum(powerData?.consumption, 1)} W</div>
            <div>Voltage: {formatNum(powerData?.voltage, 2)} V</div>
            <div>Current: {formatNum(powerData?.current, 2)} A</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SystemTab;
