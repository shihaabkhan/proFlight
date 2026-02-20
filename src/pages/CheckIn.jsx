
import { useState } from 'react'
import { Search, AlertCircle, Calendar, User, CreditCard, Check } from 'lucide-react'

const CheckIn = () => {
  const [searchType, setSearchType] = useState('booking')
  const [bookingReference, setBookingReference] = useState('')
  const [lastName, setLastName] = useState('')
  const [eTicketNumber, setETicketNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookingFound, setBookingFound] = useState(false)
  const [bookingDetails, setBookingDetails] = useState(null)
  const [selectedPassengers, setSelectedPassengers] = useState([])
  const [checkInCompleted, setCheckInCompleted] = useState(false)

  // Mock booking data
  const mockBookingDetails = {
    reference: 'BK12345678',
    flights: [
      {
        id: 'FL001',
        airline: 'American Airlines',
        flightNumber: 'AA1234',
        origin: 'JFK',
        originCity: 'New York',
        destination: 'LAX',
        destinationCity: 'Los Angeles',
        departureTime: '2023-06-15T08:30:00',
        arrivalTime: '2023-06-15T12:15:00',
        checkInOpen: true,
        checkInDeadline: '2023-06-15T07:30:00'
      }
    ],
    passengers: [
      {
        id: 1,
        name: 'John Doe',
        type: 'Adult',
        seat: null,
        checkInEligible: true
      },
      {
        id: 2,
        name: 'Jane Doe',
        type: 'Adult',
        seat: null,
        checkInEligible: true
      }
    ],
    contactEmail: 'john.doe@example.com'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setBookingFound(false)
    setCheckInCompleted(false)

    // Validate input
    if (searchType === 'booking' && (!bookingReference.trim() || !lastName.trim())) {
      setError('Please enter both booking reference and last name')
      setLoading(false)
      return
    }

    if (searchType === 'eticket' && !eTicketNumber.trim()) {
      setError('Please enter e-ticket number')
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // Simulate successful booking retrieval
      setBookingDetails(mockBookingDetails)
      setBookingFound(true)
      // Select all passengers by default
      setSelectedPassengers(mockBookingDetails.passengers.map(p => p.id))
    }, 1500)
  }

  const togglePassengerSelection = (passengerId) => {
    setSelectedPassengers(prev => {
      if (prev.includes(passengerId)) {
        return prev.filter(id => id !== passengerId)
      } else {
        return [...prev, passengerId]
      }
    })
  }

  const handleCheckIn = () => {
    if (selectedPassengers.length === 0) {
      setError('Please select at least one passenger to check in')
      return
    }

    setLoading(true)
    setError(null)

    // Simulate API call for check-in
    setTimeout(() => {
      setLoading(false)
      // Assign random seats to passengers
      const updatedBooking = {
        ...bookingDetails,
        passengers: bookingDetails.passengers.map(passenger => {
          if (selectedPassengers.includes(passenger.id)) {
            // Generate a random seat (just for demo)
            const row = Math.floor(Math.random() * 30) + 1
            const column = String.fromCharCode(65 + Math.floor(Math.random() * 6)) // A to F
            
            return {
              ...passenger,
              seat: `${row}${column}`
            }
          }
          return passenger
        })
      }
      
      setBookingDetails(updatedBooking)
      setCheckInCompleted(true)
    }, 2000)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Online Check-In</h1>
          
          {!checkInCompleted && (
            <>
              {/* Check-in form */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex mb-6">
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium mr-2 ${
                      searchType === 'booking'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSearchType('booking')}
                  >
                    Booking Reference
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      searchType === 'eticket'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSearchType('eticket')}
                  >
                    E-Ticket Number
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {searchType === 'booking' ? (
                    <>
                      <div className="mb-4">
                        <label htmlFor="bookingReference" className="block text-sm font-medium text-gray-700 mb-1">
                          Booking Reference
                        </label>
                        <input
                          type="text"
                          id="bookingReference"
                          placeholder="e.g. BK12345678"
                          value={bookingReference}
                          onChange={(e) => setBookingReference(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
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
                    </>
                  ) : (
                    <div className="mb-4">
                      <label htmlFor="eTicketNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        E-Ticket Number
                      </label>
                      <input
                        type="text"
                        id="eTicketNumber"
                        placeholder="e.g. 012-3456789012"
                        value={eTicketNumber}
                        onChange={(e) => setETicketNumber(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}

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
                    <h2 className="text-xl font-semibold">Booking Retrieved</h2>
                    <p className="text-sm text-primary-100">Reference: {bookingDetails.reference}</p>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold mb-4">Flight Details</h3>
                    
                    {bookingDetails.flights.map((flight, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-medium">{flight.airline} {flight.flightNumber}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(flight.departureTime)} Ã¢ÂÂ¢ {formatTime(flight.departureTime)}
                            </p>
                          </div>
                          
                          {flight.checkInOpen ? (
                            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              Check-in Open
                            </div>
                          ) : (
                            <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              Check-in Not Open
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <p className="text-lg font-bold">{flight.origin}</p>
                            <p className="text-sm text-gray-600">{flight.originCity}</p>
                          </div>
                          
                          <div className="flex-grow mx-4">
                            <div className="relative w-full h-0.5 bg-gray-200 my-2">
                              <div className="absolute left-0 right-0 top-1/2 border-b border-gray-300 border-dashed"></div>
                              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-lg font-bold">{flight.destination}</p>
                            <p className="text-sm text-gray-600">{flight.destinationCity}</p>
                          </div>
                        </div>
                        
                        {flight.checkInOpen && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Check-in deadline:</span> {formatTime(flight.checkInDeadline)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    <h3 className="font-semibold mb-4">Passengers</h3>
                    
                    <div className="mb-6">
                      {bookingDetails.passengers.map((passenger, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`passenger-${passenger.id}`}
                              checked={selectedPassengers.includes(passenger.id)}
                              onChange={() => togglePassengerSelection(passenger.id)}
                              disabled={!passenger.checkInEligible}
                              className="mr-3"
                            />
                            <label htmlFor={`passenger-${passenger.id}`} className="flex items-center">
                              <User size={16} className="text-gray-500 mr-2" />
                              <div>
                                <p className="font-medium">{passenger.name}</p>
                                <p className="text-xs text-gray-500">{passenger.type}</p>
                              </div>
                            </label>
                          </div>
                          
                          {passenger.seat && (
                            <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                              Seat {passenger.seat}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mb-6">
                      <div className="flex items-start">
                        <Calendar size={20} className="text-blue-600 mr-2 mt-1" />
                        <div>
                          <p className="font-medium">Important Notice</p>
                          <p className="text-sm">You must complete the check-in process at least 1 hour before departure.</p>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full btn btn-primary py-3"
                      onClick={handleCheckIn}
                      disabled={loading || selectedPassengers.length === 0}
                    >
                      {loading ? 'Processing...' : 'Complete Check-In'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Check-in complete */}
          {checkInCompleted && bookingDetails && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="bg-green-600 text-white p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                  <Check size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Check-In Complete!</h2>
                <p>Your boarding passes are ready</p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-600 mb-3">Your boarding passes have been sent to:</p>
                  <p className="font-medium">{bookingDetails.contactEmail}</p>
                </div>

                <h3 className="font-semibold mb-4">Flight Details</h3>
                
                {bookingDetails.flights.map((flight, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">{flight.airline} {flight.flightNumber}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(flight.departureTime)} Ã¢ÂÂ¢ {formatTime(flight.departureTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-lg font-bold">{flight.origin}</p>
                        <p className="text-sm text-gray-600">{flight.originCity}</p>
                      </div>
                      
                      <div className="flex-grow mx-4">
                        <div className="relative w-full h-0.5 bg-gray-200 my-2">
                          <div className="absolute left-0 right-0 top-1/2 border-b border-gray-300 border-dashed"></div>
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-lg font-bold">{flight.destination}</p>
                        <p className="text-sm text-gray-600">{flight.destinationCity}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <h3 className="font-semibold mb-4">Boarding Passes</h3>
                
                <div className="space-y-4 mb-6">
                  {bookingDetails.passengers
                    .filter(passenger => selectedPassengers.includes(passenger.id))
                    .map((passenger, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 p-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <User size={16} className="text-gray-500 mr-2" />
                            <p className="font-medium">{passenger.name}</p>
                          </div>
                          {passenger.seat && (
                            <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                              Seat {passenger.seat}
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <div className="flex justify-between mb-4">
                            <div>
                              <p className="text-xs text-gray-500">Flight</p>
                              <p className="font-medium">
                                {bookingDetails.flights[0].airline} {bookingDetails.flights[0].flightNumber}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Date</p>
                              <p className="font-medium">
                                {formatDate(bookingDetails.flights[0].departureTime)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Boarding</p>
                              <p className="font-medium">
                                {formatTime(new Date(bookingDetails.flights[0].departureTime).getTime() - 30 * 60000)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-center mb-4">
                            {/* Fake QR Code display */}
                            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-600">Boarding Pass QR</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-center space-x-2">
                            <button className="btn btn-outline py-2 flex items-center text-sm">
                              <CreditCard size={16} className="mr-1" />
                              Add to Wallet
                            </button>
                            <button className="btn btn-outline py-2 flex items-center text-sm">
                              Download PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-2">Important Information</h4>
                  <ul className="text-sm space-y-2">
                    <li>Please arrive at the airport at least 2 hours before your flight.</li>
                    <li>Have your boarding pass and ID ready for security check.</li>
                    <li>Boarding typically begins 30-45 minutes before departure time.</li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="btn btn-primary flex-1">
                    Email Boarding Passes
                  </button>
                  <button className="btn btn-outline flex-1">
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Check-in Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Online Check-In Information</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">When to Check In</h4>
                <p className="text-gray-600 text-sm">
                  Online check-in typically opens 24 hours before your scheduled departure time and closes 1 hour before departure. Check-in early to get your preferred seat selection.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">What You'll Need</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">Ã¢ÂÂ¢</span>
                    <span>Your booking reference or e-ticket number</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">Ã¢ÂÂ¢</span>
                    <span>Passenger's last name as it appears on the booking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">Ã¢ÂÂ¢</span>
                    <span>Valid passport or ID for all passengers (depending on your destination)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Benefits of Online Check-In</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">Ã¢ÂÂ¢</span>
                    <span>Skip the check-in counters at the airport</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">Ã¢ÂÂ¢</span>
                    <span>Select your preferred seats</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">Ã¢ÂÂ¢</span>
                    <span>Save time at the airport by going directly to bag drop (if you have checked luggage) or to security</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">Ã¢ÂÂ¢</span>
                    <span>Receive your boarding pass electronically</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckIn
