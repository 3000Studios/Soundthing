import React from 'react'
import { Volume2, Activity, Monitor, Wifi } from 'lucide-react'

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div style={{display:'flex',background:'#111827',borderRadius:8,padding:6,marginBottom:12}}>
    {[{id:'audio',label:'Audio',icon:Volume2},{id:'sensors',label:'Sensors',icon:Activity},{id:'system',label:'System',icon:Monitor},{id:'network',label:'Network',icon:Wifi}].map(tab=>{
      const Icon = tab.icon
      return (
        <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:8,borderRadius:6,background: activeTab===tab.id? '#2563EB' : 'transparent',color: activeTab===tab.id? '#fff' : '#d1d5db',border:'none'}}>
          <Icon size={14} style={{marginRight:6}} />
          <span style={{fontSize:13}}>{tab.label}</span>
        </button>
      )
    })}
  </div>
)

export default TabNavigation
