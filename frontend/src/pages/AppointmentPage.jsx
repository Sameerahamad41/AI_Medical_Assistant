import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { appointmentService } from '../services/services'
import toast from 'react-hot-toast'
import { FiCalendar, FiClock, FiActivity, FiUserPlus, FiCheckCircle } from 'react-icons/fi'

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // AI Recommendation State
  const [symptoms, setSymptoms] = useState('')
  const [recommending, setRecommending] = useState(false)
  const [recommendations, setRecommendations] = useState([])

  // Booking Form State
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [notes, setNotes] = useState('')
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    fetchAppointments()
    
    // If redirected from ChatPage with symptoms
    if (location.state?.symptoms) {
      setSymptoms(location.state.symptoms)
      handleRecommend(location.state.symptoms)
    }
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getMyAppointments()
      setAppointments(res.data.data)
    } catch (err) {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleRecommend = async (autoSymptom = null) => {
    const symptomToSearch = autoSymptom || symptoms
    
    if (!symptomToSearch.trim()) {
      toast.error('Please enter your symptoms')
      return
    }
    
    setRecommending(true)
    setRecommendations([])
    setSelectedDoctor(null)

    try {
      const res = await appointmentService.recommendDoctors(symptomToSearch)
      setRecommendations(res.data.data)
      toast.success('AI found specialists for you!')
    } catch (err) {
      toast.error('Failed to get recommendations. Try again.')
    } finally {
      setRecommending(false)
    }
  }

  const handleBook = async (e) => {
    e.preventDefault()
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      toast.error('Please fill all required fields')
      return
    }

    setBooking(true)
    try {
      const data = {
        doctorName: selectedDoctor.doctorName,
        specialization: selectedDoctor.specialization,
        appointmentDate,
        appointmentTime,
        notes
      }
      await appointmentService.bookAppointment(data)
      toast.success('Appointment booked successfully!')
      
      // Reset form
      setSelectedDoctor(null)
      setAppointmentDate('')
      setAppointmentTime('')
      setNotes('')
      setSymptoms('')
      setRecommendations([])
      
      // Refresh list
      fetchAppointments()
    } catch (err) {
      toast.error('Failed to book appointment')
    } finally {
      setBooking(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <FiCalendar className="text-blue-400" /> Appointments
        </h1>
        <p className="text-white/60">Find the right specialist using AI and book your consultation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: AI Finder & Booking */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
              <FiActivity className="text-green-400" /> AI Doctor Finder
            </h2>
            <div className="space-y-3">
              <label className="block text-sm text-white/70">What are your symptoms?</label>
              <textarea 
                className="input-field min-h-[100px] resize-none"
                placeholder="E.g., I have a severe headache, nausea, and sensitivity to light..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              <button 
                onClick={handleRecommend}
                disabled={recommending}
                className="btn-primary w-full flex justify-center py-3"
              >
                {recommending ? 'Analyzing Symptoms...' : 'Find Specialists'}
              </button>
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="glass-card p-6 rounded-2xl animate-fade-in">
              <h3 className="text-lg font-semibold mb-4 text-white">Recommended Doctors</h3>
              <div className="space-y-3">
                {recommendations.map((doc, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedDoctor?.doctorName === doc.doctorName 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-blue-300">{doc.doctorName}</h4>
                        <p className="text-sm text-white/60">{doc.specialization}</p>
                      </div>
                      {selectedDoctor?.doctorName === doc.doctorName && (
                        <FiCheckCircle className="text-blue-500" size={20} />
                      )}
                    </div>
                    <p className="text-xs text-white/50 italic">"{doc.reason}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedDoctor && (
            <div className="glass-card p-6 rounded-2xl animate-fade-in border border-blue-500/30">
              <h3 className="text-lg font-semibold mb-4 text-white">Book Consultation</h3>
              <form onSubmit={handleBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      className="input-field"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Time</label>
                    <input 
                      type="time" 
                      required
                      className="input-field"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Additional Notes</label>
                  <textarea 
                    className="input-field"
                    placeholder="Any previous medical history to note?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={booking}
                  className="btn-primary w-full flex justify-center py-3"
                >
                  {booking ? 'Booking...' : `Confirm Appointment with ${selectedDoctor.doctorName}`}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Appointments */}
        <div className="glass-card p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
            <FiClock className="text-cyan-400" /> Upcoming Appointments
          </h2>
          
          {loading ? (
            <div className="text-center text-white/50 py-10">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center text-white/50 py-10 border border-dashed border-white/10 rounded-xl">
              No upcoming appointments.
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(app => (
                <div key={app.id} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-blue-300">{app.doctorName}</h4>
                      <p className="text-sm text-white/60">{app.specialization}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      app.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-400' :
                      app.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/80 mt-3 bg-black/20 p-2 rounded-lg">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={14} className="text-white/40"/>
                      {app.appointmentDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock size={14} className="text-white/40"/>
                      {app.appointmentTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
