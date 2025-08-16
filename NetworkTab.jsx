import React from 'react'
import { Wifi } from 'lucide-react'

const NetworkTab = ({ networkData }) => {
  const f=(v,d=1)=> (v===null||v===undefined||Number.isNaN(v))? '--':Number(v).toFixed(d)
  return (
    <div>
      <div className="panel">
        <h3 style={{margin:0,display:'flex',alignItems:'center',gap:8}}><Wifi/> Network</h3>
        <div style={{marginTop:8}} className="small">WiFi strength: {f(networkData?.wifiStrength)} • Bluetooth devices: {networkData?.bluetoothDevices ?? 0} • Cellular: {networkData?.cellularSignal ?? '--'}</div>
      </div>
    </div>
  )
}

export default NetworkTab
