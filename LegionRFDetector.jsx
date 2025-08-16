import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Settings, Wifi, Zap, Volume2, Activity, Mic, Square, Circle, Settings2, Cpu, Headphones, Compass, Thermometer, Battery, Gamepad2, Monitor } from 'lucide-react'
import DataExplanation from './DataExplanation'

const LegionRFDetector = () => {
  const [isDetecting, setIsDetecting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isLivePlayback, setIsLivePlayback] = useState(false)
  const [audioData, setAudioData] = useState(new Array(150).fill(0))
  const [recordingTime, setRecordingTime] = useState(0)
  const [activeTab, setActiveTab] = useState('audio')

  // Sensor data
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0, magnitude: 0 })
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0, magnitude: 0 })
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0, magnitude: 0 })
  const [cpuData, setCpuData] = useState({ temp: 0, usage: 0, cores: [] })
  const [gpuData, setGpuData] = useState({ temp: 0, usage: 0, memory: 0 })
  const [batteryData, setBatteryData] = useState({ level: 0, charging: false, temp: 0 })
  const [networkData, setNetworkData] = useState({ wifiStrength: 0, bluetoothDevices: 0 })

  // Audio controls
  const [audioLevel, setAudioLevel] = useState(0)
  const [peakFrequency, setPeakFrequency] = useState(0)
  const [sensitivity, setSensitivity] = useState(50)
  const [microphoneGain, setMicrophoneGain] = useState(100)
  const [outputVolume, setOutputVolume] = useState(50)
  const [ultrasonicMode, setUltrasonicMode] = useState(false)
  const [selectedMic, setSelectedMic] = useState('default')
  const [microphoneDevices, setMicrophoneDevices] = useState([])

  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const microphoneRef = useRef(null)
  const streamRef = useRef(null)
  const radarCanvasRef = useRef(null)
  const gainNodeRef = useRef(null)
  const outputGainRef = useRef(null)
  const speechRecRef = useRef(null)
  const [isSpeechOn, setIsSpeechOn] = useState(false)
  const animationFrameRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const recordingIntervalRef = useRef(null)
  const sensorIntervalRef = useRef(null)

  // Get microphones
  const getMicrophones = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const mics = devices.filter(device => device.kind === 'audioinput')
      setMicrophoneDevices(mics)
    } catch (error) {
      console.error('Failed to get microphones:', error)
    }
  }

  // Initialize sensors (simulation + attempt to use available web sensors)
  const initializeSensors = () => {
    // try real DeviceMotion events if available
    if ('DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', (e) => {
        if (e.accelerationIncludingGravity) {
          const acc = e.accelerationIncludingGravity
          const magnitude = Math.sqrt((acc.x||0)**2 + (acc.y||0)**2 + (acc.z||0)**2)
          setAccelerometerData({ x: acc.x||0, y: acc.y||0, z: acc.z||0, magnitude })
        }
        if (e.rotationRate) {
          const rot = e.rotationRate
          const magnitude = Math.sqrt((rot.alpha||0)**2 + (rot.beta||0)**2 + (rot.gamma||0)**2)
          setGyroscopeData({ x: rot.alpha||0, y: rot.beta||0, z: rot.gamma||0, magnitude })
        }
      })
    }

    // Simulation fallback / system sensors (since browser can't read system temps reliably on Windows)
    sensorIntervalRef.current = setInterval(() => {
      const now = Date.now()
      const accX = Math.sin(now / 1000) * 2
      const accY = Math.cos(now / 1200) * 2
      const accZ = Math.sin(now / 800) + 9.8
      setAccelerometerData({ x: accX, y: accY, z: accZ, magnitude: Math.sqrt(accX*accX + accY*accY + accZ*accZ) })

      const rotX = Math.sin(now / 1500) * 0.5
      const rotY = Math.cos(now / 1300) * 0.5
      const rotZ = Math.sin(now / 1100) * 0.3
      setGyroscopeData({ x: rotX, y: rotY, z: rotZ, magnitude: Math.sqrt(rotX*rotX + rotY*rotY + rotZ*rotZ) })

      const magX = Math.sin(now / 2000) * 50
      const magY = Math.cos(now / 2000) * 50
      const magZ = Math.sin(now / 3000) * 30
      setMagnetometerData({ x: magX, y: magY, z: magZ, magnitude: Math.sqrt(magX*magX + magY*magY + magZ*magZ) })

      setCpuData({ temp: 45 + Math.random() * 30, usage: Math.random() * 100, cores: Array.from({ length: 8 }, () => Math.random() * 100) })
      setGpuData({ temp: 50 + Math.random() * 40, usage: Math.random() * 100, memory: Math.random() * 16 })
      setBatteryData({ level: 50 + Math.sin(now / 10000) * 30, charging: Math.random() > 0.5, temp: 30 + Math.random() * 10 })
      setNetworkData({ wifiStrength: 50 + Math.random() * 50, bluetoothDevices: Math.floor(Math.random() * 5) })
    }, 1000)
  }

  // Initialize audio
  const initializeAudio = async () => {
    try {
      const constraints = {
        audio: {
          deviceId: selectedMic !== 'default' ? { exact: selectedMic } : undefined,
          sampleRate: ultrasonicMode ? 192000 : 48000,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: ultrasonicMode ? 192000 : 48000 })
  microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)
  streamRef.current = stream
      gainNodeRef.current = audioContextRef.current.createGain()
  gainNodeRef.current.gain.value = microphoneGain / 100
      outputGainRef.current = audioContextRef.current.createGain()
      outputGainRef.current.gain.value = outputVolume / 100
      analyserRef.current = audioContextRef.current.createAnalyser()
  analyserRef.current.fftSize = ultrasonicMode ? 32768 : 16384
      analyserRef.current.smoothingTimeConstant = 0.1

      microphoneRef.current.connect(gainNodeRef.current)
      gainNodeRef.current.connect(analyserRef.current)
      gainNodeRef.current.connect(outputGainRef.current)

      if (isLivePlayback) outputGainRef.current.connect(audioContextRef.current.destination)

      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data)
      }
      // If live playback requested, connect destination
      if (isLivePlayback && outputGainRef.current) {
        outputGainRef.current.connect(audioContextRef.current.destination)
      }

      // Kick off a small canvas resize for radar
      setTimeout(() => {
        const c = radarCanvasRef.current
        if (c?.parentElement) {
          c.width = c.parentElement.clientWidth
          c.height = 180
        }
      }, 50)

      return true
    } catch (error) {
      console.error('Audio initialization failed:', error)
      return false
    }
  }

  // Analyze audio
  const analyzeAudio = () => {
    if (!analyserRef.current) return
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((s, v) => s + v, 0) / bufferLength
    setAudioLevel(average)

    let maxIndex = 0
    let maxValue = 0
    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i]
        maxIndex = i
      }
    }

  let sampleRate
  if (audioContextRef.current) {
    sampleRate = audioContextRef.current.sampleRate
  } else {
    sampleRate = ultrasonicMode ? 192000 : 48000
  }
  const peakFreq = (maxIndex * sampleRate) / (2 * bufferLength)
    setPeakFrequency(peakFreq)

    setAudioData(Array.from(dataArray).slice(0, 150))
  }

  // Detection loop
  const detectionLoop = () => {
    if (!isDetecting) return
    analyzeAudio()
    animationFrameRef.current = requestAnimationFrame(detectionLoop)
  }

  // Controls
  const startDetection = async () => {
    const ok = await initializeAudio()
    if (ok) {
      initializeSensors()
      setIsDetecting(true)
  // start both audio analysis and radar visualization
  detectionLoop()
  drawRadar()
    }
  }

  const stopDetection = () => {
    setIsDetecting(false)
    // stop any ongoing recordings and speech recognition
    stopRecording()
    stopSpeechRecognition()

    // cancel visual/audio loops
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (sensorIntervalRef.current) {
      clearInterval(sensorIntervalRef.current)
      sensorIntervalRef.current = null
    }

    // stop media tracks safely
    const stream = streamRef.current
    if (stream?.getTracks) {
      stream.getTracks().forEach(t => {
        try { t.stop() } catch (e) { console.warn('track stop error', e) }
      })
      streamRef.current = null
    }

    // disconnect audio nodes
    microphoneRef.current?.disconnect?.()
    gainNodeRef.current?.disconnect?.()
    outputGainRef.current?.disconnect?.()
    analyserRef.current?.disconnect?.()

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(e => console.warn('AudioContext close failed', e))
      audioContextRef.current = null
    }
    analyserRef.current = null
    gainNodeRef.current = null
    outputGainRef.current = null
    microphoneRef.current = null
  }

  const startRecording = () => {
    if (mediaRecorderRef.current && !isRecording) {
      recordedChunksRef.current = []
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      recordingIntervalRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current)
      setTimeout(() => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `legion_rf_${new Date().toISOString().slice(0,19)}.webm`
        a.click()
      }, 100)
    }
  }

  const toggleLivePlayback = () => {
    setIsLivePlayback(p => !p)
    if (outputGainRef.current && audioContextRef.current) {
      if (!isLivePlayback) outputGainRef.current.connect(audioContextRef.current.destination)
      else outputGainRef.current.disconnect(audioContextRef.current.destination)
    }
  }

  // Draw radar-like visualization from frequency data
  const drawRadar = () => {
    const canvas = radarCanvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const bufferLength = analyser.frequencyBinCount
    const data = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(data)

    ctx.clearRect(0,0,w,h)
    // background
    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    ctx.fillRect(0,0,w,h)

    // center and rings
    const cx = w/2
    const cy = h/2
    const maxR = Math.min(w,h)/2 - 10
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath()
      ctx.arc(cx, cy, (r/4)*maxR, 0, Math.PI*2)
      ctx.stroke()
    }

    // draw sweeper line based on time
    const t = Date.now()/1000
    const angle = (t % 6.28318)
    ctx.strokeStyle = 'rgba(0,255,65,0.9)'
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(angle)*maxR, cy + Math.sin(angle)*maxR)
    ctx.stroke()

    // plot strongest bins as blips
    const step = Math.max(1, Math.floor(bufferLength / 80))
    for (let i = 0; i < bufferLength; i += step) {
      const v = data[i]
      const ratio = v/255
      if (ratio < 0.06) continue
      const fAngle = (i / bufferLength) * Math.PI*2
      const r = ratio * maxR
      ctx.fillStyle = `rgba(${Math.floor(255*(1-ratio))},${Math.floor(255*ratio)},50,0.95)`
      ctx.beginPath()
      ctx.arc(cx + Math.cos(fAngle)*r, cy + Math.sin(fAngle)*r, 4 + ratio*6, 0, Math.PI*2)
      ctx.fill()
    }

    // schedule next
    animationFrameRef.current = requestAnimationFrame(drawRadar)
  }

  // Speech-to-text (basic) using Web Speech API
  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (ev) => {
      const last = ev.results[ev.results.length-1]
      const text = last[0].transcript
      // store as an audioData entry for now
      setAudioData(prev => prev.slice(-149).concat([Math.min(255, text.length*4)]))
    }
    rec.onerror = (e) => console.warn('SpeechRec error', e)
    rec.start()
    speechRecRef.current = rec
  }

  const stopSpeechRecognition = () => {
    if (speechRecRef.current) {
      try {
        speechRecRef.current.stop()
      } catch (e) {
        console.error('Speech stop error', e)
      }
      speechRecRef.current = null
    }
  }

  const toggleSpeech = () => {
    if (isSpeechOn) {
      stopSpeechRecognition()
      setIsSpeechOn(false)
    } else {
      startSpeechRecognition()
      setIsSpeechOn(true)
    }
  }

  useEffect(() => {
    getMicrophones()
    return () => stopDetection()
  }, [])

  useEffect(() => {
  if (gainNodeRef.current) gainNodeRef.current.gain.value = microphoneGain / 100
  }, [microphoneGain])

  useEffect(() => {
    if (outputGainRef.current) outputGainRef.current.gain.value = outputVolume / 100
  }, [outputVolume])

  // Simple formatter
  const fmt = (v, d = 2) => (v === null || v === undefined || Number.isNaN(v)) ? '--' : Number(v).toFixed(d)

  return (
    <div className="panel">
      <h2 style={{marginTop:0,display:'flex',alignItems:'center',gap:8}}><Gamepad2/> Legion RF Detector</h2>

      {/* Controls */}
      <div style={{display:'flex',gap:12,marginTop:12,marginBottom:12}}>
        <button className="btn" onClick={() => (isDetecting ? stopDetection() : startDetection())}>
          {isDetecting ? <><Pause/> Stop</> : <><Play/> Start</>}
        </button>

        <button className="btn" onClick={() => (isRecording ? stopRecording() : startRecording())} disabled={!isDetecting}>
          {isRecording ? <><Square/> Stop</> : <><Circle/> Record</>}
        </button>

        <div style={{minWidth:220}}>
          <div className="small">Sensitivity: {sensitivity}%</div>
          <input type="range" min={0} max={100} value={sensitivity} onChange={e => setSensitivity(Number(e.target.value))} />
        </div>

        <div style={{minWidth:200}}>
          <div className="small">Mic Boost: {microphoneGain}%</div>
          <input type="range" min={0} max={500} value={microphoneGain} onChange={e => setMicrophoneGain(Number(e.target.value))} />
        </div>
      </div>

      {/* Tab nav (simple) */}
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        {['audio','sensors','system','network'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`btn`} style={{background: activeTab===t? '#2563EB': undefined}}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'audio' && (
        <div style={{display:'grid',gap:12}}>
          <div className="panel">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div className="small">Microphone</div>
                <select value={selectedMic} onChange={e => setSelectedMic(e.target.value)} className="select">
                  <option value="default">Default</option>
                  {microphoneDevices.map((d, i) => <option key={d.deviceId || i} value={d.deviceId}>{d.label || `Mic ${i+1}`}</option>)}
                </select>
              </div>

              <div>
                <div className="small">Live Monitor</div>
                <button className="btn" onClick={toggleLivePlayback}>{isLivePlayback ? 'On' : 'Off'}</button>
              </div>
            </div>
          </div>

          <div className="panel">
            <h4 style={{margin:0}}>Spectrum {ultrasonicMode ? '(0-96kHz)' : '(0-24kHz)'}</h4>
            <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
              <div className="visualizer" style={{marginTop:8,flex:1}}>
                {audioData.map((v,i) => {
                  const key = `${Math.round(v)}-${i}`
                  return (<div key={key} className="bar" style={{height: `${Math.max(3,(v/255)*160)}px`, opacity: v > sensitivity ? 1 : 0.3}}/>)
                })}
              </div>
              <div style={{width:220}}>
                <canvas ref={radarCanvasRef} style={{width:'100%',height:180,background:'#000',borderRadius:8}} />
                <div style={{display:'flex',gap:6,marginTop:8}}>
                  <button className="btn" onClick={toggleSpeech}>{isSpeechOn ? 'STT On' : 'STT Off'}</button>
                  <button className="btn" onClick={() => { setAudioData(new Array(150).fill(0)) }}>Clear</button>
                </div>
              </div>
            </div>
            <div className="small" style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
              <div>Peak: {fmt(peakFrequency,0)} Hz</div>
              <div>Level: {fmt(audioLevel,0)}</div>
            </div>
          </div>

          <DataExplanation peakFrequency={peakFrequency} audioLevel={audioLevel} sensitivity={sensitivity} />
        </div>
      )}

      {activeTab === 'sensors' && (
        <div style={{display:'grid',gap:12}}>
          <div className="panel">
            <h4 style={{margin:0}}>Accelerometer</h4>
            <div className="small">X: {fmt(accelerometerData.x)} Y: {fmt(accelerometerData.y)} Z: {fmt(accelerometerData.z)} Mag: {fmt(accelerometerData.magnitude)}</div>
          </div>

          <div className="panel">
            <h4 style={{margin:0}}>Gyroscope</h4>
            <div className="small">X: {fmt(gyroscopeData.x)} Y: {fmt(gyroscopeData.y)} Z: {fmt(gyroscopeData.z)} Mag: {fmt(gyroscopeData.magnitude)}</div>
          </div>

          <div className="panel">
            <h4 style={{margin:0}}>Magnetometer</h4>
            <div className="small">X: {fmt(magnetometerData.x)} Y: {fmt(magnetometerData.y)} Z: {fmt(magnetometerData.z)} Mag: {fmt(magnetometerData.magnitude)}</div>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div style={{display:'grid',gap:12}}>
          <div className="panel">
            <h4 style={{margin:0}}>CPU</h4>
            <div className="small">Temp: {fmt(cpuData.temp)}°C • Usage: {fmt(cpuData.usage)}%</div>
          </div>
          <div className="panel">
            <h4 style={{margin:0}}>GPU</h4>
            <div className="small">Temp: {fmt(gpuData.temp)}°C • Usage: {fmt(gpuData.usage)}% • VRAM: {fmt(gpuData.memory)}GB</div>
          </div>
          <div className="panel">
            <h4 style={{margin:0}}>Battery</h4>
            <div className="small">Level: {fmt(batteryData.level,0)}% • Temp: {fmt(batteryData.temp)}°C • {batteryData.charging? 'Charging' : 'Discharging'}</div>
          </div>
        </div>
      )}

      {activeTab === 'network' && (
        <div style={{display:'grid',gap:12}}>
          <div className="panel">
            <h4 style={{margin:0}}>Network</h4>
            <div className="small">WiFi: {fmt(networkData.wifiStrength,0)}% • Bluetooth: {networkData.bluetoothDevices} devices</div>
          </div>
        </div>
      )}

    </div>
  )
}

export default LegionRFDetector
