import React from 'react'
import { Cpu, Gamepad2, Monitor } from 'lucide-react'

const SystemTab = ({ cpuData, gpuData, memoryData, fanSpeed, storageTemp, powerData }) => {
  const f = (v,d=1)=> (v===null||v===undefined||Number.isNaN(v))? '--': Number(v).toFixed(d)
  return (
    <div style={{display:'grid',gap:12}}>
      <div className="panel">
        <h3 style={{margin:0,display:'flex',alignItems:'center',gap:8}}><Monitor/> System Overview</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:8}}>
          <div>
            <div className="small">CPU Temp: {f(cpuData?.temp)} °C</div>
            <div className="small">CPU Usage: {f(cpuData?.usage)}%</div>
            <div className="small">Cores: {cpuData?.cores?.length ? cpuData.cores.map((c,i)=><span key={i} className="small">[{i}:{Math.round(c)}%]</span>) : '-'}</div>
          </div>
          <div>
            <div className="small">GPU Temp: {f(gpuData?.temp)} °C</div>
            <div className="small">GPU Usage: {f(gpuData?.usage)}%</div>
            <div className="small">GPU Mem: {f(gpuData?.memory)} GB</div>
          </div>
          <div>
            <div className="small">Memory Used: {f(memoryData?.used)} GB</div>
            <div className="small">Memory Total: {memoryData?.total ?? '--'} GB</div>
            <div className="small">Memory Temp: {f(memoryData?.temperature)} °C</div>
          </div>
          <div>
            <div className="small">CPU Fan: {Math.round(fanSpeed?.cpu||0)} RPM</div>
            <div className="small">GPU Fan: {Math.round(fanSpeed?.gpu||0)} RPM</div>
            <div className="small">Storage Temp: {f(storageTemp)} °C</div>
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            <div className="small">Power: {f(powerData?.consumption)} W • {f(powerData?.voltage)} V • {f(powerData?.current)} A</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemTab
