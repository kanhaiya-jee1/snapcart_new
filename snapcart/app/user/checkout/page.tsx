'use client'
import React, { useEffect, useState, useMemo } from 'react'
import {motion} from "motion/react"
import { ArrowLeft, Building, Home, MapPin, Navigation, Phone, User, Search, Loader2, LocateFixed, CreditCard, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from  '@/redux/store'
import 'leaflet/dist/leaflet.css'
import type L from 'leaflet'
import axios from 'axios'

const Checkout = () => {
    const router = useRouter()
    const { userData } = useSelector((state: RootState) => state.user)
    const { subTotal, deliveryFee, finalTotal ,cartData } = useSelector((state: RootState) => state.cart)
    const [address, setAddress] = useState({
        fullName: "",
        mobile: "",
        city: "",
        state: "",
        pincode: "",
        fullAddress: ""
    })

    const [position, setPosition] = useState<[number, number]>([28.6139, 77.2090])
    const [MapComponents, setMapComponents] = useState<{
        MapContainer: React.ElementType;
        TileLayer: React.ElementType;
        Marker: React.ElementType;
    } | null>(null)
    const [map, setMap] = useState<L.Map | null>(null)

    const [searchQuery, setSearchQuery] = useState("")
    interface GeocodingSuggestion {
        place_id: number;
        display_name: string;
        lat: string;
        lon: string;
    }
    const [suggestions, setSuggestions] = useState<GeocodingSuggestion[]>([])
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)
    const [paymentMethod,setPaymentMethod] = useState<"cod" | "online">("cod")

    useEffect(() => {
        if (userData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAddress((prev) => ({
                ...prev,
                fullName: prev.fullName || userData.name || "",
                mobile: prev.mobile || userData.mobile || ""
            }))
        }
    }, [userData])

    const eventHandlers = useMemo(
        () => ({
            dragend(e: L.LeafletEvent) {
                const marker = e.target as L.Marker
                if (marker != null) {
                    const newLatLng = marker.getLatLng()
                    setPosition([newLatLng.lat, newLatLng.lng])
                }
            },
        }),
        [],
    )

    useEffect(() => {
        if (map && position) {
            map.setView(position, map.getZoom())
        }
    }, [position, map])


    useEffect(() => {
        if (position) {
            const fetchAddress = async () => {
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position[0]}&lon=${position[1]}`
                    )
                    const data = await res.json()
                    if (data && data.address) {
                        const addr = data.address
                        const city = addr.city || addr.town || addr.village || addr.county || ""
                        const state = addr.state || ""
                        const pincode = addr.postcode || ""
                        const display_name = data.display_name || ""
                        
                        setAddress((prev) => ({
                            ...prev,
                            city: city,
                            state: state,
                            pincode: pincode,
                            fullAddress: display_name
                        }))
                    }
                } catch (error) {
                    console.error("Reverse geocoding error:", error)
                }
            }
            fetchAddress()
        }
    }, [position])

    useEffect(() => {
        if (searchQuery.length < 3) return

        const delayDebounce = setTimeout(async () => {
            setLoadingSuggestions(true)
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchQuery)}`
                )
                const data = await res.json()
                setSuggestions(data || [])
            } catch (error) {
                console.error("Geocoding search error:", error)
            } finally {
                setLoadingSuggestions(false)
            }
        }, 600)

        return () => clearTimeout(delayDebounce)
    }, [searchQuery])

    const handleSelectSuggestion = (suggestion: GeocodingSuggestion) => {
        const lat = parseFloat(suggestion.lat)
        const lon = parseFloat(suggestion.lon)
        setPosition([lat, lon])
        
        setAddress((prev) => ({
            ...prev,
            fullAddress: suggestion.display_name
        }))
        
        setSuggestions([])
        setSearchQuery("")
    }

    const handleSearch = async () => {
        if (!searchQuery || searchQuery.length < 3) return
        setLoadingSuggestions(true)
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchQuery)}`
            )
            const data = await res.json()
            if (data && data.length > 0) {
                const bestMatch = data[0]
                const lat = parseFloat(bestMatch.lat)
                const lon = parseFloat(bestMatch.lon)
                setPosition([lat, lon])
                
                setAddress((prev) => ({
                    ...prev,
                    fullAddress: bestMatch.display_name
                }))
                setSuggestions([])
            }
        } catch (error) {
            console.error("Geocoding search error:", error)
        } finally {
            setLoadingSuggestions(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch()
        }
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords
                    setPosition([latitude, longitude])
                },
                (err) => {
                    console.error("Geolocation error:", err)
                }
            ) 
        }
    }, []) 

    useEffect(() => {
        Promise.all([
            import('react-leaflet'),
            import('leaflet')
        ]).then(([reactLeaflet, L]) => {
            const defaultIconProto = L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string };
            delete defaultIconProto._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            setMapComponents({
                MapContainer: reactLeaflet.MapContainer,
                TileLayer: reactLeaflet.TileLayer,
                Marker: reactLeaflet.Marker
            });
        }).catch(err => {
            console.error("Error loading Leaflet libraries:", err);
        });
    }, [])
   
    const handleCod=async ()=>{
        if(!position){
            return null
        }
        try{
         const result= await axios.post("/api/user/order",{
            userId:userData?._id,
            items:cartData.map(item=>({
                 grocery:item._id,
                 name:item.name,
                 price:item.price,
                 unit:item.unit,
                 quantity:item.quantity,
                 image:item.image
            })),
            totalAmount:finalTotal,
            address:{
                fullName:address.fullName,
                mobile:address.mobile,
                city:address.city,
                state:address.state,
                fullAddress:address.fullAddress,
                pincode:address.pincode,
                latitude:position[0],
                longitude:position[1]
            },
            paymentMethod
         })
            router.push("/user/order-success")
        }catch(error){
           console.log(error)
        }
    }

    const handleOnlinePayment=async ()=>{
                   if(!position){
                   return null
               }

        try{
                 const result = await axios.post("/api/user/payment" ,{
                userId:userData?._id,
                items:cartData.map(item=>({
                 grocery:item._id,
                 name:item.name,
                 price:item.price,
                 unit:item.unit,
                 quantity:item.quantity,
                 image:item.image
            })),
            totalAmount:finalTotal,
            address:{
                fullName:address.fullName,
                mobile:address.mobile,
                city:address.city,
                state:address.state,
                fullAddress:address.fullAddress,
                pincode:address.pincode,
                latitude:position[0],
                longitude:position[1]
            },
            paymentMethod
         }
             )
          window.location.href=result.data.url 

        }catch(error){
           console.log(error)
        }
    }


     const handleCurrentLocation=()=>{
                 if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords
                    setPosition([latitude, longitude])
                },
                (err) => {
                    console.error("Geolocation error:", err)
                }
            ) 
        }
     }

  return (
    <div className='w-[92%] md:w-[80%] mx-auto py-10 relative'>
       <motion.button
        whileTap={{scale:0.97}}
        className='absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold'
          onClick={() => router.push("/user/cart")}>
           <ArrowLeft size={16}/>
           <span>
            Back to cart
           </span>
       </motion.button>
       <motion.h1 
          initial={{opacity: 0, y: 10}}
         animate={{opacity: 1, y: 0}}
         transition={{duration: 0.3}}
       className='text-3xl md:text-4xl font-bold text-green-700 text-center mb-10'>Checkout</motion.h1>

       <div className='grid md:grid-cols-2 gap-8'>
        <motion.div
        className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100'
          initial={{opacity: 0, x: -20}}
         animate={{opacity: 1, x: 0}}
         transition={{duration: 0.3}}>
            <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                <MapPin className='text-green-700'/>   Delivery Address
            </h2>
            <div className='space-y-4'>
              <div className='relative'>
                <User className='absolute left-3 top-3 text-green-600' size={18}/>
                <input type='text' value={address.fullName} onChange={(e) => setAddress((prev) => ({...prev, fullName: e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
              </div>
              <div className='relative'>
                <Phone className='absolute left-3 top-3 text-green-600' size={18}/>
                <input type='text' value={address.mobile}   onChange={(e) => setAddress((prev) => ({...prev, mobile: e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
              </div>
              <div className='relative'>
                <Home className='absolute left-3 top-3 text-green-600' size={18}/>
                <input type='text' value={address.fullAddress} placeholder='Full Address'  onChange={(e) => setAddress((prev) => ({...prev, fullAddress: e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
              </div>
              <div className='grid grid-cols-3 gap-3'>
                <div className='relative'>
                  <Building className='absolute left-3 top-3 text-green-600' size={18}/>
                  <input type='text' value={address.city} placeholder='City'  onChange={(e) => setAddress((prev) => ({...prev, city: e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                </div>
                <div className='relative'>
                  <Navigation className='absolute left-3 top-3 text-green-600' size={18}/>
                  <input type='text' value={address.state} placeholder='State'  onChange={(e) => setAddress((prev) => ({...prev, state: e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                </div>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-3 text-green-600' size={18}/>
                  <input type='text' value={address.pincode} placeholder='Pincode'  onChange={(e) => setAddress((prev) => ({...prev, pincode: e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                </div>
              </div>

              
              <div className='relative z-50 mt-4'>
                <div className='flex gap-2'>
                  <div className='relative flex-1'>
                    <Search className='absolute left-3 top-3.5 text-green-600' size={18}/>
                    <input 
                      type='text' 
                      value={searchQuery} 
                      placeholder='Search area, city, street or landmark...' 
                      onChange={(e) => {
                          const val = e.target.value
                          setSearchQuery(val)
                          if (val.length < 3) {
                              setSuggestions([])
                          }
                      }} 
                      onKeyDown={handleKeyDown}
                      className='pl-10 pr-10 w-full border rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all'
                    />
                    {loadingSuggestions && (
                      <Loader2 className='absolute right-3 top-3.5 text-green-600 animate-spin' size={18}/>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className='bg-green-700 hover:bg-green-800 text-white font-semibold px-5 rounded-lg text-sm transition-all duration-200 active:scale-95 flex items-center gap-1 shadow-sm'
                  >
                    Search
                  </button>
                </div>
                {suggestions.length > 0 && (
                  <ul className='absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[200px] overflow-y-auto z-[9999] divide-y divide-gray-100'>
                    {suggestions.map((item) => (
                      <li 
                        key={item.place_id} 
                        onClick={() => handleSelectSuggestion(item)}
                        className='p-3 text-xs text-gray-700 hover:bg-green-50 cursor-pointer transition-colors flex items-start gap-2'
                      >
                        <MapPin size={14} className='text-green-500 mt-0.5 shrink-0'/>
                        <span>{item.display_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

                <div className='relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner'>
                       {position && MapComponents && (
                         <MapComponents.MapContainer 
                           ref={setMap}
                           center={position} 
                           zoom={13} 
                           scrollWheelZoom={false}
                           style={{ height: '100%', width: '100%' }}
                         > 
                           <MapComponents.TileLayer
                             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                           />
                           <MapComponents.Marker 
                             position={position}
                             draggable={true}
                             eventHandlers={eventHandlers}
                           />
                         </MapComponents.MapContainer>
                            
                       )}

                          <motion.button
                            whileTap={{scale:0.93}}
                            className='absolute bottom-4 right-4  bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-999'
                            onClick={handleCurrentLocation}>
                          <LocateFixed size={22}/>
                    </motion.button>   
                </div>
            </div>
        </motion.div>
 
    <motion.div
       initial={{opacity: 0, x: 20}}
       animate={{opacity: 1, x: 0}}
       transition={{duration: 0.3}}
       className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit'>
     <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'> <CreditCard className='text-green-600'/> Payment Methods</h2>
      <div className='space-y-4 mb-6'>
        <button 
         onClick={()=> setPaymentMethod("online")}
         className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
            paymentMethod == "online" ? "border-green-600 bg-green-50 shadow-sm"
            :"hover:bg-gray-50"
        }`}>
          <CreditCard/>  <span className='font-medium text-gray-700'> Pay Online (stripe)</span>
        </button>
           <button 
            onClick={()=>setPaymentMethod("cod")}
           className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
            paymentMethod == "cod" ? "border-green-600 bg-green-50 shadow-sm"
            :"hover:bg-gray-50"
        }`}>
          <Truck/>  <span className='font-medium text-gray-700'> Cash on Delivery (stripe)</span>
        </button>
        
      </div>
        <div className='border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base'>
            <div className='flex justify-between'>
               <span className='font-semibold' >Subrotal</span>
               <span className='font-semibold text-green-600'>₹{subTotal}</span>
                
            </div>
               <div className='flex justify-between'>
               <span className='font-semibold'  >Delivery Fee</span>
               <span className='font-semibold text-green-600'>₹{deliveryFee}</span>
                
            </div>
             <div className='flex justify-between font-bold text-lg border-t pt-3'>
               <span >Final Total</span>
               <span className='font-semibold text-green-600' >₹{finalTotal}</span>
                
            </div>
        </div>
         <motion.button 
         whileTap={{scale:0.93}}
         className='w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold' 
          onClick={()=>{
              if(paymentMethod=="cod"){
                handleCod()
              }else{
                handleOnlinePayment()
              }
          }} >
              {paymentMethod=="cod"?"Place Order" :"pay & Place Order"}
         </motion.button>
         </motion.div>

       </div>
    </div>
  )
}

export default Checkout
  