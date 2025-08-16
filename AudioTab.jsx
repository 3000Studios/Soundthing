import React from 'react'
import { Mic, Headphones, Settings2, Cpu, Circle, Square } from 'lucide-react'

const AudioTab = ({ microphoneDevices, selectedMic, setSelectedMic, microphoneGain, setMicrophoneGain, outputVolume, setOutputVolume, isLivePlayback, toggleLivePlayback, ultrasonicMode, setUltrasonicMode, aiEqualizer, setAiEqualizer, showEqualizer, setShowEqualizer, eqBands, setEqBands, audioData, peakFrequency, audioLevel, sensitivity }) => {
  return (
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
            <button className="btn" onClick={toggleLivePlayback}>{isLivePlayback? 'Live On' : 'Live Off'}</button>
            <button className="btn" onClick={()=>setUltrasonicMode(u=>!u)}>{ultrasonicMode? 'Ultrasonic' : 'Normal'}</button>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3 style={{margin:0}}>Frequency Visualizer</h3>
        <div className="visualizer" style={{marginTop:8}}>
          {audioData.slice(0,120).map((v,i)=>(<div key={i} className="bar" style={{height:`${Math.max(3, (v/255)*160)}px`,opacity: v>sensitivity?1:0.3}}/>))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:8}} className="small">
          <div>Peak: {Math.round(peakFrequency)} Hz</div>
          <div>Level: {Math.round(audioLevel)}</div>
          <div>Gain: {microphoneGain}%</div>
        </div>
      </div>
    </div>
  )
}

export default AudioTab
