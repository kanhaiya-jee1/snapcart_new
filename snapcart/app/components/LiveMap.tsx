'use client'
import React, { useEffect } from 'react'
interface ILocation{
  latitude:number,
  longitude:number
}

interface Iprops{
  userLocation:ILocation
  deliveryBoyLocation:ILocation
}
import L, { LatLngExpression } from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

function Recenter({positions}:{positions:[number,number]}){
  const map=useMap()
  useEffect(()=>{
    if(positions[0]!==0 && positions[1]!==0){
      map.setView(positions,map.getZoom(),{
         animate:true
      })
    }
  },[positions,map]) 
  return null
}

const LiveMap = ({userLocation, deliveryBoyLocation}:Iprops) => {

 const deliveryBoyIcon=L.icon({
  iconUrl:"https://cdn-icons-png.flaticon.com/128/9561/9561839.png",
  iconSize:[45,45]
 })
  const userIcon=L.icon({
  iconUrl:"https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
  iconSize:[45,45]
 })

 const linePositions=
  deliveryBoyLocation  &&  userLocation
  ?[   [userLocation.latitude,userLocation.longitude],
       [deliveryBoyLocation.latitude,deliveryBoyLocation.longitude]
     
  ]:[]
 

 const getValidLatLng = (loc: ILocation | null): [number, number] | null => {
   if (!loc) return null
   const lat = Number(loc.latitude)
   const lng = Number(loc.longitude)
   if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return null
   return [lat, lng]
 }

 const center = getValidLatLng(deliveryBoyLocation  ) || getValidLatLng(userLocation) || [28.6139, 77.2090]

  return (
    <div className='w-full h-[500px] rounded-xl overflow-hidden shadow relative z-2'>
          <MapContainer 
                           center={center as LatLngExpression} 
                           zoom={13} 
                           scrollWheelZoom={false}
                           style={{ height: '100%', width: '100%' }}
                         > 
                          <Recenter positions={center as any}/>
                           <TileLayer
                             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                           />
                           {getValidLatLng(userLocation) && (
                             <Marker position={getValidLatLng(userLocation)!} icon={userIcon}>
                              <Popup>delivery Address</Popup>
                             </Marker>
                           )}
                           {getValidLatLng(deliveryBoyLocation) && (
                             <Marker position={getValidLatLng(deliveryBoyLocation)!} icon={deliveryBoyIcon}>
                                <Popup>delivery Boy</Popup>
                             </Marker>

                           )}
                           <Polyline positions={linePositions as any} color='green'/>
                         </MapContainer>
    </div>
  )
}

export default LiveMap
