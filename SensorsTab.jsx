import React from 'react'
import { Activity, Compass, Thermometer, Battery } from 'lucide-react'

const SensorsTab = ({ accelerometerData, gyroscopeData, magnetometerData, orientationData, ambientLightData, proximityData, temperatureData, pressureData, humidityData, batteryData, sensorHistory }) => {
  const formatNum = (v,d=2) => (v===null||v===undefined||Number.isNaN(v))? '--' : Number(v).toFixed(d)
  return (
    <div style={{display:'grid',gap:12}}>
      <div className="panel">
        <h3 style={{margin:0,display:'flex',alignItems:'center',gap:8}}><Activity/> Motion Sensors</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:8}}>
          <div>
            <div className="small">Accelerometer (m/s²)</div>
            <div className="small">X: {formatNum(accelerometerData.x)} Y: {formatNum(accelerometerData.y)} Z: {formatNum(accelerometerData.z)}</div>
            <div className="small">Mag: {formatNum(accelerometerData.magnitude)}</div>
          </div>
          <div>
            <div className="small">Gyroscope (°/s)</div>
            <div className="small">X: {formatNum(gyroscopeData.x)} Y: {formatNum(gyroscopeData.y)} Z: {formatNum(gyroscopeData.z)}</div>
            <div className="small">Mag: {formatNum(gyroscopeData.magnitude)}</div>
          </div>

          <div>
            <div className="small">Magnetometer (sim)</div>
            <div className="small">X: {formatNum(magnetometerData.x)} Y: {formatNum(magnetometerData.y)} Z: {formatNum(magnetometerData.z)}</div>
            <div className="small">Mag: {formatNum(magnetometerData.magnitude)}</div>
          </div>

          <div>
            <div className="small">Orientation (°)</div>
            <div className="small">A: {formatNum(orientationData.alpha,1)} B: {formatNum(orientationData.beta,1)} G: {formatNum(orientationData.gamma,1)}</div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h4 style={{margin:0,display:'flex',alignItems:'center',gap:8}}><Thermometer/> Environment</h4>
        <div style={{marginTop:8}} className="small">Ambient Light: {formatNum(ambientLightData,1)} lx • Proximity: {formatNum(proximityData,1)} • Temp: {formatNum(temperatureData,1)}°C • Pressure: {formatNum(pressureData,1)} hPa • Humidity: {formatNum(humidityData,1)}%</div>
      </div>

      <div className="panel">
        <h4 style={{margin:0,display:'flex',alignItems:'center',gap:8}}><Battery/> Battery</h4>
        <div style={{marginTop:8}} className="small">Level: {batteryData?.level? Math.round(batteryData.level) + '%' : '--'} • Charging: {batteryData?.charging? 'Yes':'No'}</div>
      </div>

      <div className="panel">
        <h4 style={{margin:0,display:'flex',alignItems:'center',gap:8}}><Compass/> History</h4>
        <div className="history small" style={{marginTop:8}}>
          {sensorHistory.length === 0 ? <div style={{color:'#9CA3AF'}}>No history yet.</div> : sensorHistory.map(s=> (
            <div key={s.timestamp} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #111827'}}>
              <div>{new Date(s.timestamp).toLocaleTimeString()}</div>
              <div style={{color:'#9CA3AF',fontSize:12}}>acc:{Number(s.accelerometer||0).toFixed(1)} cpu:{Number(s.cpu||0).toFixed(0)} gpu:{Number(s.gpu||0).toFixed(0)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SensorsTab
