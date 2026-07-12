import { useState, useEffect } from 'react'
import { FiPhoneCall, FiMapPin, FiActivity, FiNavigation, FiHeart, FiAlertTriangle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { locationService } from '../services/services'

const FIRST_AID_GUIDES = [
  {
    title: 'Heart Attack',
    icon: FiHeart,
    color: 'bg-red-500/20 text-red-500 border-red-500/50',
    steps: [
      'Have the person sit down, rest, and try to keep calm.',
      'Loosen any tight clothing.',
      'Ask if they take any chest pain medication (like nitroglycerin) and help them take it.',
      'If the pain does not go away promptly with rest or within 3 minutes of taking medication, call emergency services.',
      'If the person is unconscious and unresponsive, begin CPR.'
    ]
  },
  {
    title: 'Choking',
    icon: FiAlertTriangle,
    color: 'bg-orange-500/20 text-orange-500 border-orange-500/50',
    steps: [
      'Stand behind the person. Place one foot slightly in front of the other for balance.',
      'Wrap your arms around the waist. Tip the person forward slightly.',
      'Make a fist with one hand. Position it slightly above the person\'s navel.',
      'Grasp the fist with the other hand. Press hard into the abdomen with a quick, upward thrust (Heimlich maneuver).',
      'Perform between 6 and 10 abdominal thrusts until the blockage is dislodged.'
    ]
  },
  {
    title: 'Severe Bleeding',
    icon: FiActivity,
    color: 'bg-rose-500/20 text-rose-500 border-rose-500/50',
    steps: [
      'Remove any clothing or debris on the wound. Don\'t remove large or deeply embedded objects.',
      'Stop the bleeding. Place a sterile bandage or clean cloth on the wound. Press the bandage firmly with your palm to control bleeding.',
      'Help the injured person lie down. If possible, place the person on a rug or blanket to prevent loss of body heat.',
      'Don\'t remove the gauze or bandage. If the bleeding seeps through, add another bandage on top of it.',
      'Immobilize the injured body part as much as possible.'
    ]
  }
]

export default function SosPage() {
  const [locationState, setLocationState] = useState({
    loading: true,
    error: null,
    lat: null,
    lon: null,
    address: null,
    countryCode: null,
  })

  const [hospitals, setHospitals] = useState([])
  const [loadingHospitals, setLoadingHospitals] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState(null)

  useEffect(() => {
    locateUser()
  }, [])

  const locateUser = () => {
    setLocationState(prev => ({ ...prev, loading: true, error: null }))
    if (!navigator.geolocation) {
      setLocationState(prev => ({ ...prev, loading: false, error: 'Geolocation is not supported by your browser' }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          // Reverse Geocoding
          const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          const nomData = await nomRes.json()
          
          setLocationState({
            loading: false,
            error: null,
            lat: latitude,
            lon: longitude,
            address: nomData.display_name,
            countryCode: nomData.address?.country_code?.toLowerCase() || 'us'
          })

          fetchNearbyHospitals(latitude, longitude)
        } catch (err) {
          setLocationState({
            loading: false,
            error: 'Failed to fetch address details. Check internet connection.',
            lat: latitude,
            lon: longitude,
            address: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
            countryCode: 'us'
          })
        }
      },
      (error) => {
        setLocationState(prev => ({ 
          ...prev, 
          loading: false, 
          error: `Location error: ${error.message}. If blocked, check browser settings.`
        }))
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 0 }
    )
  }

  const fetchNearbyHospitals = async (lat, lon) => {
    setLoadingHospitals(true)
    try {
      // Find hospitals via our backend proxy to avoid CORS
      const res = await locationService.getNearbyHospitals(lat, lon)
      const data = res.data
      
      const hospitalList = data.elements.map(el => {
        const elLat = el.lat || el.center?.lat
        const elLon = el.lon || el.center?.lon
        
        // Calculate rough distance (Haversine approximation for display)
        const dLat = (elLat - lat) * Math.PI / 180
        const dLon = (elLon - lon) * Math.PI / 180
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat * Math.PI / 180) * Math.cos(elLat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        const distKm = 6371 * c
        
        return {
          id: el.id,
          name: el.tags?.name || 'Unnamed Hospital/Clinic',
          lat: elLat,
          lon: elLon,
          distance: distKm.toFixed(1)
        }
      }).sort((a, b) => a.distance - b.distance).slice(0, 5) // Top 5 closest

      setHospitals(hospitalList)
    } catch (err) {
      toast.error('Failed to find nearby hospitals')
    } finally {
      setLoadingHospitals(false)
    }
  }

  // Determine Emergency Number
  const getEmergencyNumber = (code) => {
    return '108'
  }

  const emergencyNumber = getEmergencyNumber(locationState.countryCode)

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8 border-b border-red-500/20 pb-4">
        <div>
          <h1 className="text-4xl font-bold text-red-500 flex items-center gap-3">
            <span className="animate-pulse flex h-4 w-4 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
            EMERGENCY SOS
          </h1>
          <p className="text-red-400/80 mt-1">If this is a life-threatening medical emergency, call for help immediately.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Dispatch & Hospitals */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dispatch Card */}
          <div className="bg-red-950/40 border border-red-500/50 p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-red-500/10">
              <FiPhoneCall size={200} />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div>
                <p className="text-red-400/80 font-medium uppercase tracking-wider text-sm mb-2">Emergency Services</p>
                <h2 className="text-7xl font-black text-red-500 tracking-tight">{emergencyNumber}</h2>
              </div>
              
              <div className="w-full md:w-auto flex-1 md:border-l md:border-red-500/20 md:pl-8">
                <p className="text-red-400/80 font-medium uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
                  <FiMapPin /> Your Exact Location
                </p>
                
                {locationState.loading ? (
                  <div className="text-red-300 animate-pulse text-xl font-medium">Locating you via GPS...</div>
                ) : locationState.error ? (
                  <div className="text-red-400 bg-red-900/30 p-3 rounded-xl border border-red-500/30">
                    {locationState.error}
                    <button onClick={locateUser} className="block mt-2 text-sm underline">Try Again</button>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-100 text-lg font-medium leading-snug">{locationState.address}</p>
                    <p className="text-red-400/60 text-sm mt-1 font-mono">
                      LAT: {locationState.lat?.toFixed(5)} &bull; LON: {locationState.lon?.toFixed(5)}
                    </p>
                    <div className="mt-4 flex gap-3">
                      <a 
                        href={`tel:108`} 
                        className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors"
                      >
                        <FiPhoneCall /> Call 108
                      </a>
                      <a 
                        href={`https://maps.google.com/?q=${locationState.lat},${locationState.lon}`}
                        target="_blank" rel="noreferrer"
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors border border-white/10"
                      >
                        <FiNavigation /> Share Map
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hospitals */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🏥</span> Nearby Hospitals
            </h3>
            
            {loadingHospitals ? (
              <div className="py-8 text-center text-white/50 animate-pulse">Scanning area for medical facilities...</div>
            ) : hospitals.length === 0 ? (
              <div className="py-8 text-center text-white/50 border border-dashed border-white/10 rounded-xl">
                {locationState.loading ? "Waiting for location..." : "No hospitals found within 5km radius."}
              </div>
            ) : (
              <div className="space-y-3">
                {hospitals.map(h => (
                  <div key={h.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white text-lg">{h.name}</h4>
                      <p className="text-blue-400 text-sm font-medium">{h.distance} km away</p>
                    </div>
                    <a 
                      href={`https://maps.google.com/?daddr=${h.lat},${h.lon}`}
                      target="_blank" rel="noreferrer"
                      className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      <FiNavigation size={20} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: First Aid */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-2">Instant First-Aid</h3>
          <p className="text-white/50 text-sm mb-4">Follow these steps while waiting for help to arrive.</p>
          
          {selectedGuide ? (
            <div className="glass-card p-6 rounded-2xl border border-white/20 relative animate-fade-in">
              <button 
                onClick={() => setSelectedGuide(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white text-sm underline"
              >
                Back to list
              </button>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${selectedGuide.color}`}>
                <selectedGuide.icon size={24} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-6">{selectedGuide.title}</h4>
              <ul className="space-y-4">
                {selectedGuide.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-white/90">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/70 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              {FIRST_AID_GUIDES.map(guide => (
                <button
                  key={guide.title}
                  onClick={() => setSelectedGuide(guide)}
                  className={`w-full text-left p-5 rounded-2xl border flex items-center gap-4 transition-all hover:scale-[1.02] ${guide.color}`}
                >
                  <guide.icon size={28} />
                  <span className="text-xl font-bold">{guide.title} Guide</span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
