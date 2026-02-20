
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Check, Download, Share, Calendar, ArrowRight, MapPin, Phone, Mail, Clock, AlertTriangle, Plane, User, ArrowLeft } from 'lucide-react'
import AirlineLogo from '../components/AirlineLogo'

const Confirmation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // In a real app, this would be an API call to get the booking details
  useEffect(() => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setBooking({
        id: 'BK12345678',
        flight: {
          id: 'FL001',
          airline: 'American Airlines',
          flightNumber: 'AA1234',
          origin: 'JFK',
          originCity: 'New York',
          destination: 'LAX',
          destinationCity: 'Los Angeles',
          departureTime: '2023-06-15T08:30:00',
          arrivalTime: '2023-06-15T12:15:00',
          durationMinutes: 345,
          stops: 0,
          aircraft: 'Boeing 737-800',
          baggage: '1 checked bag',
          terminalDeparture: 'Terminal 8',
          terminalArrival: 'Terminal 4',
          class: 'Economy',
          seat: '15A'
        },
        passengers: [
          {
            id: 1,
            name: 'John Doe',
            type: 'Adult'
          }
        ],
        contact: {
          email: 'john.doe@example.com',
          phone: '+1 (123) 456-7890'
        },
        payment: {
          method: 'Credit Card',
          total: 348,
          currency: 'USD',
          cardLast4: '1234'
        },
        extras: {
          insurance: true,
          priorityBoarding: false,
          extraLegroom: false,
          mealPreference: 'Standard'
        },
        status: 'confirmed',
        createdAt: '2023-05-20T14:32:00',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK12345678AA1234JFK-LAX'
      })
      setLoading(false)
    }, 1500)
  }, [id])
  
  const handleAddToCalendar = () => {
    if (!booking) return
    
    // Create calendar event (this is a basic example, actual implementation would vary)
    const flight = booking.flight
    const startTime = new Date(flight.departureTime).toISOString()
    const endTime = new Date(flight.arrivalTime).toISOString()
    const title = `Flight ${flight.flightNumber}: ${flight.origin} to ${flight.destination}`
    const details = `Airline: ${flight.airline}
Departure: ${new Date(flight.departureTime).toLocaleString()}
Arrival: ${new Date(flight.arrivalTime).toLocaleString()}
Booking Reference: ${booking.id}`
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime.replace(/[-:]/g, '')}/${endTime.replace(/[-:]/g, '')}&details=${encodeURIComponent(details)}`
    
    window.open(googleCalendarUrl, '_blank')
  }
  
  const handleDownloadTicket = () => {
    // In a real app, this would generate a PDF ticket for download
    alert('Ticket download functionality would be implemented here.')
  }
  
  const handleShareBooking = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: `Flight Booking ${booking.id}`,
        text: `My flight details for ${booking.flight.origin} to ${booking.flight.destination}`,
        url: window.location.href
      })
    } else {
      alert('Sharing is not available in your browser. You can copy the booking reference: ' + booking.id)
    }
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </button>
        </div>
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-60 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : booking ? (
          <div className="max-w-4xl mx-auto">
            {/* Success Banner */}
            <div className="bg-green-100 border border-green-200 rounded-xl p-6 text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
              <p className="text-green-700">
                Your booking has been confirmed and your tickets have been sent to your email.
              </p>
            </div>
            
            {/* Booking Reference */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
                  <h2 className="text-2xl font-bold">{booking.id}</h2>
                  <p className="text-sm text-gray-500">Booked on {formatDate(booking.createdAt)}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  <button 
                    onClick={handleDownloadTicket}
                    className="btn btn-outline flex items-center"
                  >
                    <Download size={16} className="mr-2" />
                    E-Ticket
                  </button>
                  
                  <button 
                    onClick={handleAddToCalendar}
                    className="btn btn-outline flex items-center"
                  >
                    <Calendar size={16} className="mr-2" />
                    Add to Calendar
                  </button>
                  
                  <button 
                    onClick={handleShareBooking}
                    className="btn btn-outline flex items-center"
                  >
                    <Share size={16} className="mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
            
            {/* Flight Details */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Flight Details</h3>
              
              <div className="flex items-center mb-6">
                <AirlineLogo airline={booking.flight.airline} size="lg" />
                <div className="ml-3">
                  <p className="font-semibold">{booking.flight.airline}</p>
                  <p className="text-sm text-gray-600">Flight {booking.flight.flightNumber}</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-500">From</p>
                  <div className="flex items-start mb-1">
                    <MapPin size={18} className="text-gray-400 mr-1 mt-1" />
                    <div>
                      <p className="font-semibold">{booking.flight.originCity} ({booking.flight.origin})</p>
                      <p className="text-sm text-gray-600">{booking.flight.terminalDeparture}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">
                    {formatDate(booking.flight.departureTime)}
                  </p>
                  <p className="text-lg font-bold">
                    {formatTime(booking.flight.departureTime)}
                  </p>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-4 md:mb-0">
                  <p className="text-sm text-gray-500 mb-1">Duration</p>
                  <div className="relative w-24 md:w-32 h-0.5 bg-gray-300 my-2">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium">
                    {Math.floor(booking.flight.durationMinutes / 60)}h {booking.flight.durationMinutes % 60}m
                  </p>
                  <p className="text-xs text-gray-500">
                    {booking.flight.stops === 0 ? 'Nonstop' : `${booking.flight.stops} stops`}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">To</p>
                  <div className="flex items-start justify-end mb-1">
                    <div className="text-right mr-1">
                      <p className="font-semibold">{booking.flight.destinationCity} ({booking.flight.destination})</p>
                      <p className="text-sm text-gray-600">{booking.flight.terminalArrival}</p>
                    </div>
                    <MapPin size={18} className="text-gray-400 mt-1" />
                  </div>
                  <p className="text-sm font-medium">
                    {formatDate(booking.flight.arrivalTime)}
                  </p>
                  <p className="text-lg font-bold">
                    {formatTime(booking.flight.arrivalTime)}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-500 mb-1">Class</p>
                  <p className="font-medium">{booking.flight.class}</p>
                </div>
                
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-500 mb-1">Seat</p>
                  <p className="font-medium">{booking.flight.seat}</p>
                </div>
                
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-500 mb-1">Aircraft</p>
                  <p className="font-medium">{booking.flight.aircraft}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Baggage</p>
                  <p className="font-medium">{booking.flight.baggage}</p>
                </div>
              </div>
            </div>
            
            {/* Boarding Pass */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="bg-primary-600 text-white p-4">
                <h3 className="text-lg font-semibold">Mobile Boarding Pass</h3>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="mb-6 md:mb-0 md:mr-6">
                    <img 
                      src={booking.qrCode} 
                      alt="Boarding pass QR code" 
                      className="w-32 h-32 mx-auto md:mx-0"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Passenger</p>
                        <p className="font-medium">{booking.passengers[0].name}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Flight</p>
                        <p className="font-medium">{booking.flight.flightNumber}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(booking.flight.departureTime).split(',')[0]}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Boarding</p>
                        <p className="font-medium">
                          {formatTime(new Date(booking.flight.departureTime).getTime() - 30 * 60 * 1000)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Gate</p>
                        <p className="font-medium">B12</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Seat</p>
                        <p className="font-medium">{booking.flight.seat}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">From</p>
                          <p className="font-medium">{booking.flight.origin}</p>
                        </div>
                        
                        <ArrowRight size={16} className="text-gray-400" />
                        
                        <div>
                          <p className="text-xs text-gray-500">To</p>
                          <p className="font-medium">{booking.flight.destination}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500">Departure</p>
                          <p className="font-medium">{formatTime(booking.flight.departureTime)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <p>Please arrive at the airport at least 2 hours before your flight. Present this boarding pass with your ID at security and the boarding gate.</p>
                </div>
              </div>
            </div>
            
            {/* Passenger & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Passenger Information</h3>
                
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="flex items-center mb-2">
                      <User size={18} className="text-gray-400 mr-2" />
                      <p className="font-medium">{passenger.name}</p>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">
                      {passenger.type}
                    </p>
                  </div>
                ))}
                
                {booking.extras.mealPreference !== 'Standard' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm">
                      <span className="font-medium">Meal Preference:</span> {booking.extras.mealPreference}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                
                <div className="mb-4">
                  <div className="flex items-center mb-1">
                    <Mail size={18} className="text-gray-400 mr-2" />
                    <p className="font-medium">Email</p>
                  </div>
                  <p className="text-sm text-gray-500 ml-6">
                    {booking.contact.email}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <Phone size={18} className="text-gray-400 mr-2" />
                    <p className="font-medium">Phone</p>
                  </div>
                  <p className="text-sm text-gray-500 ml-6">
                    {booking.contact.phone}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Payment & Extras */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{booking.payment.method} (**** {booking.payment.cardLast4})</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Total Paid</p>
                  <p className="text-xl font-bold text-primary-600">
                    {booking.payment.currency} {booking.payment.total.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Extras & Add-ons</h3>
                
                <ul className="space-y-2">
                  <li className="flex items-center">
                    {booking.extras.insurance ? (
                      <Check size={18} className="text-green-500 mr-2" />
                    ) : (
                      <X size={18} className="text-red-500 mr-2" />
                    )}
                    <span>Travel Insurance</span>
                  </li>
                  
                  <li className="flex items-center">
                    {booking.extras.priorityBoarding ? (
                      <Check size={18} className="text-green-500 mr-2" />
                    ) : (
                      <X size={18} className="text-red-500 mr-2" />
                    )}
                    <span>Priority Boarding</span>
                  </li>
                  
                  <li className="flex items-center">
                    {booking.extras.extraLegroom ? (
                      <Check size={18} className="text-green-500 mr-2" />
                    ) : (
                      <X size={18} className="text-red-500 mr-2" />
                    )}
                    <span>Extra Legroom</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Important Information */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Clock size={18} className="text-blue-500 mr-2" />
                Check-in Information
              </h3>
              
              <p className="mb-3">Online check-in opens 24 hours before departure and closes 1 hour before departure.</p>
              
              <div className="flex justify-between items-center bg-white rounded-lg p-4">
                <div>
                  <p className="font-medium">Check-in opens</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(new Date(booking.flight.departureTime).getTime() - 24 * 60 * 60 * 1000)}, {formatTime(new Date(booking.flight.departureTime).getTime() - 24 * 60 * 60 * 1000)}
                  </p>
                </div>
                
                <Link to="/check-in" className="btn btn-primary">
                  Check-in Now
                </Link>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Online Check-in</p>
                    <p className="text-sm text-gray-600">
                      Check-in online to save time at the airport. You can check in 24 hours before your flight.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Airport Arrival</p>
                    <p className="text-sm text-gray-600">
                      Arrive at the airport at least 2 hours before your domestic flight or 3 hours before your international flight.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Baggage Drop</p>
                    <p className="text-sm text-gray-600">
                      Drop your checked baggage at the airline counter. Make sure your bags meet the weight and size requirements.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Security Check</p>
                    <p className="text-sm text-gray-600">
                      Proceed to security with your boarding pass and ID. Remove liquids and electronics as required.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3 flex-shrink-0">
                    5
                  </div>
                  <div>
                    <p className="font-medium">Boarding</p>
                    <p className="text-sm text-gray-600">
                      Be at your gate at least 30 minutes before departure. Boarding typically begins 30-45 minutes before flight time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/" className="btn btn-outline">
                Return to Home
              </Link>
              <Link to="/manage-booking" className="btn btn-primary">
                Manage Your Booking
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-xl p-6 text-center">
            <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">We couldn't find the booking details you're looking for.</p>
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Confirmation
