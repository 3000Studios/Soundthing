import React, { useState, useEffect, useRef } from 'react'
import TabNavigation from './components/TabNavigation'
import SensorsTab from './components/SensorsTab'
import SystemTab from './components/SystemTab'
import NetworkTab from './components/NetworkTab'
import { Play, Pause, Headphones, Cpu, Settings2, Circle, Square, Mic } from 'lucide-react'

const App = () => {
  // Copy core state and refs from your original large component but keep lean here
  const [activeTab, setActiveTab] = useState('audio')
  const [isDetecting, setIsDetecting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isLivePlayback, setIsLivePlayback] = useState(false)
  const [audioData, setAudioData] = useState([])
  const [recordingTime, setRecordingTime] = useState(0)

  // Sensors
  const [accelerometerData, setAccelerometerData] = useState({x:0,y:0,z:0,magnitude:0})
  const [gyroscopeData, setGyroscopeData] = useState({x:0,y:0,z:0,magnitude:0})
  const [magnetometerData, setMagnetometerData] = useState({x:0,y:0,z:0,magnitude:0})
  const [orientationData, setOrientationData] = useState({alpha:0,beta:0,gamma:0})
  const [ambientLightData, setAmbientLightData] = useState(0)
  const [proximityData, setProximityData] = useState(0)
  const [temperatureData, setTemperatureData] = useState(0)
  const [pressureData, setPressureData] = useState(0)
  const [humidityData, setHumidityData] = useState(0)
  const [batteryData, setBatteryData] = useState({level:0,charging:false,temp:0})
  const [networkData, setNetworkData] = useState({wifiStrength:0,bluetoothDevices:0,cellularSignal:0})
  const [gpuData, setGpuData] = useState({temp:0,usage:0,memory:0})
  const [cpuData, setCpuData] = useState({temp:0,usage:0,cores:[]})
  const [memoryData, setMemoryData] = useState({used:0,total:0,temperature:0})
  const [storageTemp, setStorageTemp] = useState(0)
  const [fanSpeed, setFanSpeed] = useState({cpu:0,gpu:0})
  const [powerData, setPowerData] = useState({consumption:0,voltage:0,current:0})
  const [sensorHistory, setSensorHistory] = useState([])

  // Audio controls
  const [audioLevel, setAudioLevel] = useState(0)
  const [peakFrequency, setPeakFrequency] = useState(0)
  const [sensitivity, setSensitivity] = useState(50)
  const [selectedMic, setSelectedMic] = useState('default')
  const [microphoneDevices, setMicrophoneDevices] = useState([])
  const [microphoneGain, setMicrophoneGain] = useState(100)
  const [outputVolume, setOutputVolume] = useState(50)
  const [ultrasonicMode, setUltrasonicMode] = useState(false)
  const [aiEqualizer, setAiEqualizer] = useState(true)
  const [showEqualizer, setShowEqualizer] = useState(false)
  const [eqBands, setEqBands] = useState({60:0,170:0,310:0,600:0,1000:0,3000:0,6000:0,12000:0,20000:0,40000:0})

  // Refs
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const microphoneRef = useRef(null)
  const gainNodeRef = useRef(null)
  const outputGainRef = useRef(null)
  const filtersRef = useRef([])
  const animationFrameRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const recordingIntervalRef = useRef(null)
  const sensorIntervalRef = useRef(null)

  // lightweight helpers - only a subset of your original functions to make the demo work
  const getMicrophones = async () => {
    try{
      const devices = await navigator.mediaDevices.enumerateDevices()
      setMicrophoneDevices(devices.filter(d=>d.kind==='audioinput'))
    }catch(e){console.error(e)}
  }

  useEffect(()=>{getMicrophones()},[])

  // Simulate sensors and audio for demo
  useEffect(()=>{
    sensorIntervalRef.current = setInterval(()=>{
      setCpuData({temp: Math.random()*30+45, usage: Math.random()*100, cores: Array.from({length:8}, ()=>Math.random()*100)})
      setGpuData({temp: Math.random()*40+50, usage: Math.random()*100, memory: Math.random()*16})
      setMemoryData({used: Math.random()*32, total:32, temperature: Math.random()*20+40})
      setStorageTemp(Math.random()*20+35)
      setFanSpeed({cpu: Math.random()*3000+1000, gpu: Math.random()*4000+1500})
      setPowerData({consumption: Math.random()*200+50, voltage:19+Math.random()*2, current:Math.random()*10+3})
      setTemperatureData(Math.random()*10+20)
      setPressureData(Math.random()*50+1000)
      setHumidityData(Math.random()*40+30)
      setAmbientLightData(Math.random()*1000+100)
      setProximityData(Math.random()*100)

      setSensorHistory(prev=>[...prev.slice(-99),{timestamp:Date.now(),magnetometer:Math.random()*100,accelerometer:Math.random()*10,audio:Math.random()*100,cpu:cpuData.temp,gpu:gpuData.temp}])
    },1000)

    return ()=> clearInterval(sensorIntervalRef.current)
  },[])

  const formatTime = (s)=>{const m=Math.floor(s/60);const sec=s%60;return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}` }

  return (
    <div className="container">
      <h1 style={{marginTop:0}}>Lenovo Legion RF Detector</h1>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{marginBottom:12}}>
        {activeTab==='audio' && (
          <div style={{display:'grid',gap:12}}>
            <div className="panel">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <Mic />
                  <div style={{fontSize:14}}>Microphone</div>
                </div>
                <div style={{minWidth:240}}>
                  <select className="select" value={selectedMic} onChange={e=>setSelectedMic(e.target.value)}>
                    <option value="default">Default Microphone</option>
                    {microphoneDevices.map((d,i)=>(<option key={d.deviceId||i} value={d.deviceId}>{d.label||`Mic ${i+1}`}</option>))}
                  </select>
                </div>
              </div>
            </div>

            <div className="panel">
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div>
                  <div className="small">Mic Boost</div>
                  <input type="range" min="0" max="500" value={microphoneGain} onChange={e=>setMicrophoneGain(Number(e.target.value))} />
                </div>
                <div>
                  <div className="small">Output Volume</div>
                  <input type="range" min="0" max="100" value={outputVolume} onChange={e=>setOutputVolume(Number(e.target.value))} />
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <button className="btn" onClick={()=>setIsLivePlayback(p=>!p)}>{isLivePlayback? 'Live On' : 'Live Off'}</button>
                  <button className="btn" onClick={()=>setUltrasonicMode(u=>!u)}>{ultrasonicMode? 'Ultrasonic' : 'Normal'}</button>
                </div>
              </div>
            </div>

            <div className="panel">
              <h3 style={{margin:0}}>Frequency Visualizer</h3>
              <div className="visualizer" style={{marginTop:8}}>
                {Array.from({length:80}).map((_,i)=>(
                  <div key={i} className="bar" style={{height:`${Math.max(3, Math.floor(Math.random()*160))}px`,opacity: Math.random()>0.6?1:0.3}} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab==='sensors' && <SensorsTab accelerometerData={accelerometerData} gyroscopeData={gyroscopeData} magnetometerData={magnetometerData} orientationData={orientationData} ambientLightData={ambientLightData} proximityData={proximityData} temperatureData={temperatureData} pressureData={pressureData} humidityData={humidityData} batteryData={batteryData} sensorHistory={sensorHistory} />}

        {activeTab==='system' && <SystemTab cpuData={cpuData} gpuData={gpuData} memoryData={memoryData} fanSpeed={fanSpeed} storageTemp={storageTemp} powerData={powerData} />}

        {activeTab==='network' && <NetworkTab networkData={networkData} />}
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={()=>setIsDetecting(d=>!d)}>{isDetecting? <><Pause/> Stop</> : <><Play/> Start</>}</button>
          <button className="btn" onClick={()=>{if(isRecording){setIsRecording(false);clearInterval(recordingIntervalRef.current)}else{setIsRecording(true);recordingIntervalRef.current=setInterval(()=>setRecordingTime(t=>t+1),1000)}}}>{isRecording? <><Square/> Stop</> : <><Circle/> Record</>}</button>
          <div className="small">{isDetecting? 'Detecting' : 'Idle'} • {isRecording? `Recording ${formatTime(recordingTime)}` : 'Not recording'}</div>
        </div>
        <div className="small">Sample Rate: {ultrasonicMode?192000:48000} Hz</div>
      </div>
    </div>
  )
}

export default App
