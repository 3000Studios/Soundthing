import React from 'react'

const DataExplanation = ({ peakFrequency, audioLevel, sensitivity }) => {
  // Provide human-friendly interpretation for low-frequency data (-250 to 300 Hz range)
  const interpretFrequency = (f) => {
    if (!isFinite(f) || f === 0) return 'No dominant frequency detected.'

    // Negative frequencies are a mathematical representation; map them to absolute for interpretation
    const absF = Math.abs(Math.round(f))

    if (absF <= 20) return `Very low frequency (${absF} Hz): likely environmental or DC offset (fans, power hum).`;
    if (absF <= 60) return `Low frequency (${absF} Hz): could be mechanical vibrations or electrical mains harmonics.`;
    if (absF <= 300) return `Mid-low frequency (${absF} Hz): speech-range energy, rotor/fan blade signatures, or nearby machinery.`;
    return `Higher frequency (${absF} Hz): audio-band or ultrasonic aliasing (if in ultrasonic mode check sample rate).`;
  }

  const quality = audioLevel > sensitivity ? 'Signal above sensitivity threshold' : 'Signal below sensitivity threshold'

  return (
    <div className="panel">
      <h4 style={{margin:0}}>Interpreted Data</h4>
      <div style={{marginTop:8}} className="small">
        <div><strong>Peak Frequency:</strong> {isFinite(peakFrequency) ? `${Math.round(peakFrequency)} Hz` : '--'}</div>
        <div style={{marginTop:6}}>{interpretFrequency(peakFrequency)}</div>
        <div style={{marginTop:8}}><strong>Audio Level:</strong> {Math.round(audioLevel)} ({quality})</div>
        <div style={{marginTop:8}} className="text-gray-400">Notes: Negative frequency values are treated as absolute for physical interpretation. For precise low-frequency work consider using a contact microphone and an audio interface with the appropriate sample rate and DC-coupling.</div>
      </div>
    </div>
  )
}

export default DataExplanation
