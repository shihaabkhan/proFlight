import { useState, useEffect } from 'react'
import { Search, AlertCircle, Edit, Calendar, Clock, ChevronRight, PlaneLanding, User, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

const ManageBooking = () => {
  const [bookingReference, setBookingReference] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingFound, setBookingFound] = useState(false)
  const [bookingDetails, setBookingDetails] = useState(null)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: [],
    cancelled: []
  })

  // Fetch all bookings on component mount
  useEffect(() => {
    fetchBookings()
  }, [])

  // Function to fetch bookings from the API
  const fetchBookings = async () => {
    setBookingsLoading(true)
    try {
      const response = await fetch('https://vanijapp.adya.ai/api/v1/vanij/llm_playground/flow/get_my_booking_list?per_page=20')
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      
      const data = await response.json()
      
      if (data.meta.status) {
        // Process the bookings data
        const processedBookings = processBookingsData(data.data)
        setBookings(processedBookings)
      } else {
        throw new Error(data.meta.message || 'Failed to fetch bookings')
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load bookings. Please try again later.')
    } finally {
      setBookingsLoading(false)
    }
  }

  // Process bookings data into required format
  const processBookingsData = (bookingsData) => {
    const today = new Date()
    const upcoming = []
    const past = []
    const cancelled = []

    bookingsData.forEach(booking => {
      const departureDate = new Date(booking.original_departure_date_time)
      const bookingData = {
        reference: booking.booking_id,
        flights: [
          {
            id: booking.flight_id,
            airline: booking.flight_id.substring(0, 2), // Extract airline code from flight_id
            flightNumber: booking.flight_id,
            origin: booking.from,
            originCity: booking.from,
            destination: booking.destination,
            destinationCity: booking.destination,
            departureTime: booking.original_departure_date_time,
            arrivalTime: booking.arrival_date_time,
            status: booking.booking_status
          }
        ],
        passengers: [
          {
            id: booking.passenger_details?.passenger_id || 1,
            name: booking.passenger_details?.passenger_name || 'Passenger',
            type: 'Adult'
          }
        ],
        totalAmount: booking.amount,
        currency: booking.currency,
        checkInAvailable: isCheckInAvailable(booking.original_departure_date_time),
        canModify: isModifiable(booking.booking_status),
        canCancel: isCancellable(booking.booking_status),
        created: booking.booking_date_time,
        bookingClass: booking.class,
        seatNumber: booking.seat_number,
        paymentStatus: booking.payment_status
      }

      if (booking.booking_status === 'CONFIRMED' && departureDate > today) {
        upcoming.push(bookingData)
      } else if (booking.booking_status === 'Payment Initiated' || booking.booking_status === 'Scheduled') {
        upcoming.push(bookingData)
      } else if (booking.booking_status === 'CANCELLED') {
        cancelled.push({
          ...bookingData,
          cancelledOn: booking.updated_at,
          refundAmount: booking.amount * 0.9, // Assuming 90% refund
          refundStatus: 'Processed'
        })
      } else {
        past.push(bookingData)
      }
    })

    return { upcoming, past, cancelled }
  }

  // Check if check-in is available (24 hours before departure)
  const isCheckInAvailable = (departureTime) => {
    const departureDate = new Date(departureTime)
    const now = new Date()
    const timeDiff = departureDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    return hoursDiff <= 24 && hoursDiff > 1
  }

  // Check if booking can be modified
  const isModifiable = (status) => {
    return status === 'CONFIRMED' || status === 'Payment Initiated' || status === 'Scheduled'
  }

  // Check if booking can be cancelled
  const isCancellable = (status) => {
    return status === 'CONFIRMED' || status === 'Payment Initiated' || status === 'Scheduled'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setBookingFound(false)

    // Validate input
    if (!bookingReference.trim()) {
      setError('Please enter a booking reference')
      setLoading(false)
      return
    }

    // Search for booking by reference
    setTimeout(() => {
      const foundBooking = [...bookings.upcoming, ...bookings.past, ...bookings.cancelled]
        .find(booking => booking.reference.toLowerCase() === bookingReference.toLowerCase())

      setLoading(false)
      
      if (foundBooking) {
        setBookingDetails(foundBooking)
        setBookingFound(true)
      } else {
        setError('No booking found with the provided reference')
      }
    }, 1000)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600'
      case 'CANCELLED':
        return 'text-red-600'
      case 'Payment Initiated':
        return 'text-yellow-600'
      case 'Scheduled':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  // Calculates flight duration
  const calculateFlightDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime)
    const arrival = new Date(arrivalTime)
    const diffMs = arrival - departure
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Manage Your Booking</h1>
          
          {/* Booking search form */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Retrieve Your Booking</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="bookingReference" className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Reference
                  </label>
                  <input
                    type="text"
                    id="bookingReference"
                    placeholder="e.g. BK12346"
                    value={bookingReference}
                    onChange={(e) => setBookingReference(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary py-3 flex items-center justify-center"
                disabled={loading}
              >
                <Search size={18} className="mr-2" />
                {loading ? 'Searching...' : 'Retrieve Booking'}
              </button>
            </form>
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <div className="flex items-center">
                <AlertCircle size={20} className="text-red-600 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Booking details */}
          {bookingFound && bookingDetails && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="bg-primary-600 text-white p-4">
                <h2 className="text-xl font-semibold">Booking Details</h2>
                <p className="text-sm text-primary-100">Reference: {bookingDetails.reference}</p>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500">Booking Date</p>
                    <p className="font-medium">{formatDate(bookingDetails.created)}</p>
                  </div>
                  
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium ${getStatusBadgeClass(bookingDetails.flights[0].status)}`}>
                      {bookingDetails.flights[0].status}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">{bookingDetails.currency} {bookingDetails.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="font-medium">{bookingDetails.bookingClass}</p>
                  </div>
                  
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500">Seat Number</p>
                    <p className="font-medium">{bookingDetails.seatNumber}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className={`font-medium ${bookingDetails.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
                      {bookingDetails.paymentStatus}
                    </p>
                  </div>
                </div>

                <h3 className="font-semibold mb-4">Flight Details</h3>
                
                {bookingDetails.flights.map((flight, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary-600 mr-3">
                        <PlaneLanding size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{flight.airline} {flight.flightNumber}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(flight.departureTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <p className="text-lg font-bold">{formatTime(flight.departureTime)}</p>
                        <p className="font-medium">{flight.origin}</p>
                        <p className="text-sm text-gray-600">{flight.originCity}</p>
                      </div>
                      
                      <div className="flex-grow mx-4">
                        <div className="relative w-full h-0.5 bg-gray-200 my-2">
                          <div className="absolute left-0 right-0 top-1/2 border-b border-gray-300 border-dashed"></div>
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                        </div>
                        <p className="text-xs text-center text-gray-500">
                          {calculateFlightDuration(flight.departureTime, flight.arrivalTime)}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-lg font-bold">{formatTime(flight.arrivalTime)}</p>
                        <p className="font-medium">{flight.destination}</p>
                        <p className="text-sm text-gray-600">{flight.destinationCity}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <h3 className="font-semibold mb-4">Passengers</h3>
                
                <div className="mb-6">
                  {bookingDetails.passengers.map((passenger, index) => (
                    <div 
                      key={index} 
                      className="flex items-center p-3 border-b border-gray-200 last:border-b-0"
                    >
                      <User size={16} className="text-gray-500 mr-2" />
                      <div>
                        <p className="font-medium">{passenger.name}</p>
                        <p className="text-xs text-gray-500">{passenger.type}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  {bookingDetails.checkInAvailable && (
                    <Link to="/check-in" className="flex-1 btn btn-primary flex items-center justify-center">
                      <Calendar size={16} className="mr-2" />
                      Check-in Now
                    </Link>
                  )}
                  
                  {bookingDetails.canModify && (
                    <button className="flex-1 btn btn-outline flex items-center justify-center">
                      <Edit size={16} className="mr-2" />
                      Modify Booking
                    </button>
                  )}
                  
                  {bookingDetails.canCancel && (
                    <button className="flex-1 btn btn-outline text-red-600 border-red-600 hover:bg-red-50">
                      Cancel Booking
                    </button>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Booking Options</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to="#" className="flex items-center justify-between text-blue-700 hover:underline">
                        <span>Manage seats</span>
                        <ChevronRight size={16} />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="flex items-center justify-between text-blue-700 hover:underline">
                        <span>Add baggage</span>
                        <ChevronRight size={16} />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="flex items-center justify-between text-blue-700 hover:underline">
                        <span>Select meals</span>
                        <ChevronRight size={16} />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="flex items-center justify-between text-blue-700 hover:underline">
                        <span>Request special assistance</span>
                        <ChevronRight size={16} />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* My Bookings Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-primary-600 text-white p-4">
              <h2 className="text-xl font-semibold">My Bookings</h2>
              <p className="text-sm text-primary-100">View all your trips in one place</p>
            </div>
            
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'upcoming'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-600 hover:text-primary-600 hover:border-b-2 hover:border-primary-300'
                  }`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'past'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-600 hover:text-primary-600 hover:border-b-2 hover:border-primary-300'
                  }`}
                  onClick={() => setActiveTab('past')}
                >
                  Past
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'cancelled'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-600 hover:text-primary-600 hover:border-b-2 hover:border-primary-300'
                  }`}
                  onClick={() => setActiveTab('cancelled')}
                >
                  Cancelled
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Loading state */}
              {bookingsLoading && (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your bookings...</p>
                </div>
              )}

              {/* No bookings state */}
              {!bookingsLoading && bookings[activeTab].length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                    <PlaneLanding size={24} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No {activeTab} bookings</h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'upcoming' 
                      ? 'You have no upcoming trips. Start planning your next adventure!'
                      : activeTab === 'past'
                        ? 'You have no past trips with us yet.'
                        : 'You have no cancelled bookings.'}
                  </p>
                  {activeTab === 'upcoming' && (
                    <Link to="/" className="btn btn-primary">
                      Book a Flight
                    </Link>
                  )}
                </div>
              )}

              {/* Bookings list */}
              {!bookingsLoading && bookings[activeTab].length > 0 && (
                <div className="space-y-4">
                  {bookings[activeTab].map((booking, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div className="mb-2 md:mb-0">
                          <p className="text-sm text-gray-500">Reference</p>
                          <p className="font-medium">{booking.reference}</p>
                        </div>
                        
                        <div className="mb-2 md:mb-0">
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-medium">{formatDate(booking.flights[0].departureTime)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className={`font-medium ${getStatusBadgeClass(booking.flights[0].status)}`}>
                            {booking.flights[0].status}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <p className="text-lg font-bold">{booking.flights[0].origin}</p>
                          <p className="text-sm text-gray-600">{booking.flights[0].originCity}</p>
                        </div>
                        
                        <div className="flex-grow mx-4">
                          <div className="relative w-full h-0.5 bg-gray-200 my-2">
                            <div className="absolute left-0 right-0 top-1/2 border-b border-gray-300 border-dashed"></div>
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-lg font-bold">{booking.flights[0].destination}</p>
                          <p className="text-sm text-gray-600">{booking.flights[0].destinationCity}</p>
                        </div>
                      </div>
                      
                      {activeTab === 'cancelled' && (
                        <div className="bg-red-50 border border-red-100 rounded p-3 mb-4">
                          <div className="flex items-start">
                            <AlertTriangle size={16} className="text-red-600 mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-red-800">Cancelled on {formatDate(booking.cancelledOn)}</p>
                              <p className="text-xs text-red-700">
                                Refund {booking.refundStatus}: {booking.currency} {booking.refundAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">Passengers: {booking.passengers.length}</p>
                        </div>
                        
                        <button 
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                          onClick={() => {
                            setBookingDetails(booking)
                            setBookingFound(true)
                          }}
                        >
                          View Details
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Help Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Need Help With Your Booking?</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">What You Can Do</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Check in online from 24 hours up to 1 hour before your flight</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Change your flight date, time, or destination (fees may apply)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Add extra services like baggage, meals, or seat selection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Cancel your booking and request a refund (subject to fare conditions)</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Clock size={16} className="text-blue-600 mr-2" />
                    Changes & Cancellations
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Need to modify your trip? Most bookings can be changed online.
                  </p>
                  <Link to="/support" className="text-blue-700 text-sm font-medium hover:underline flex items-center">
                    Learn about our policies
                    <ChevronRight size={16} />
                  </Link>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <AlertCircle size={16} className="text-green-600 mr-2" />
                    Contact Support
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Our support team is available 24/7 to assist with your booking.
                  </p>
                  <Link to="/support" className="text-green-700 text-sm font-medium hover:underline flex items-center">
                    Get support
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageBooking