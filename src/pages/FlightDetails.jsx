
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Luggage, Shield, Info, Check, X, CreditCard, Calendar, ChevronRight, AlertTriangle } from 'lucide-react'
import AirlineLogo from '../components/AirlineLogo'

const FlightDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [flight, setFlight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedFareClass, setSelectedFareClass] = useState('economy')
  const [selectedSeats, setSelectedSeats] = useState([])
  
  // Mock flight data (in a real app, this would come from API)
  useEffect(() => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setFlight({
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
        onTimePerformance: 0.92,
        terminalDeparture: 'Terminal 8',
        terminalArrival: 'Terminal 4',
        features: ['In-flight Wi-Fi', 'Power outlets', 'Personal entertainment', 'Complimentary snacks', 'Beverage service'],
        fareClasses: {
          economy: {
            name: 'Economy',
            price: 299,
            benefits: ['Standard seat selection', '1 checked bag', 'Carry-on bag', 'Meal for purchase'],
            restrictions: ['Change fee applies', 'Non-refundable'],
            seatsAvailable: 42
          },
          premium: {
            name: 'Premium Economy',
            price: 499,
            benefits: ['Extra legroom', '2 checked bags', 'Priority boarding', 'Complimentary meal', 'Dedicated cabin'],
            restrictions: ['Change fee applies'],
            seatsAvailable: 18
          },
          business: {
            name: 'Business Class',
            price: 899,
            benefits: ['Fully adjustable seat', '2 checked bags', 'Priority check-in', 'Lounge access', 'Premium dining', 'Priority baggage'],
            restrictions: [],
            seatsAvailable: 8
          }
        },
        seatMap: {
          rows: 30,
          columns: 6,
          unavailableSeats: ['3A', '3B', '4C', '5F', '7D', '8A', '9E', '10B', '12C', '14F']
        }
      })
      setLoading(false)
    }, 1500)
  }, [id])
  
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
  }
  
  const getSeatClasses = (row, col) => {
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F']
    const seatId = `${row}${seatLetters[col]}`
    
    if (flight.seatMap.unavailableSeats.includes(seatId)) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }
    
    if (selectedSeats.includes(seatId)) {
      return 'bg-primary-600 text-white'
    }
    
    // First class seats (rows 1-3)
    if (row <= 3) {
      return 'bg-yellow-100 hover:bg-yellow-200 cursor-pointer'
    }
    
    // Premium economy (rows 4-10)
    if (row <= 10) {
      return 'bg-blue-100 hover:bg-blue-200 cursor-pointer'
    }
    
    // Regular economy
    return 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
  }
  
  const toggleSeatSelection = (row, col) => {
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F']
    const seatId = `${row}${seatLetters[col]}`
    
    // Don't allow selection of unavailable seats
    if (flight.seatMap.unavailableSeats.includes(seatId)) {
      return
    }
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatId))
    } else {
      // Limit to 1 seat for demo purposes
      setSelectedSeats([seatId])
    }
  }
  
  const handleContinueToBooking = () => {
    navigate(`/booking/${flight.id}?class=${selectedFareClass}&seat=${selectedSeats.join(',')}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Search Results
          </button>
        </div>
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-60 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : flight ? (
          <>
            {/* Flight Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold mb-4">
                {flight.originCity} to {flight.destinationCity}
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Flight Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-4">
                    <AirlineLogo airline={flight.airline} size="lg" />
                    <div className="ml-3">
                      <p className="font-semibold">{flight.airline}</p>
                      <p className="text-sm text-gray-600">Flight {flight.flightNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold">{formatTime(flight.departureTime)}</p>
                      <p className="text-sm font-medium">{flight.origin}</p>
                      <p className="text-xs text-gray-500">{formatDate(flight.departureTime)}</p>
                      <p className="text-xs text-gray-500">{flight.terminalDeparture}</p>
                    </div>
                    
                    <div className="flex flex-col items-center px-4">
                      <p className="text-sm text-gray-600 mb-1">{formatDuration(flight.durationMinutes)}</p>
                      <div className="relative w-24 h-0.5 bg-gray-300">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stops`}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-bold">{formatTime(flight.arrivalTime)}</p>
                      <p className="text-sm font-medium">{flight.destination}</p>
                      <p className="text-xs text-gray-500">{formatDate(flight.arrivalTime)}</p>
                      <p className="text-xs text-gray-500">{flight.terminalArrival}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-4 gap-y-2">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{Math.round(flight.onTimePerformance * 100)}% on time</span>
                    </div>
                    <div className="flex items-center">
                      <Luggage size={14} className="mr-1" />
                      <span>{flight.baggage}</span>
                    </div>
                  </div>
                </div>
                
                {/* Flight Features */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold mb-3">Features and Amenities</h3>
                  <ul className="space-y-2">
                    {flight.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check size={16} className="text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="font-semibold mb-2">Aircraft</h3>
                    <p className="text-sm">{flight.aircraft}</p>
                  </div>
                </div>
                
                {/* Purchase Summary */}
                <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                  <h3 className="font-semibold mb-3">Purchase Summary</h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Base fare</span>
                      <span className="font-medium">${flight.fareClasses[selectedFareClass].price}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Taxes & fees</span>
                      <span className="font-medium">$49</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>${flight.fareClasses[selectedFareClass].price + 49}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4 text-sm">
                    <Shield size={14} className="text-green-500 mr-2" />
                    <span>Price guaranteed for 12 hours</span>
                  </div>
                  
                  <button
                    onClick={handleContinueToBooking}
                    className="w-full btn btn-primary"
                    disabled={selectedSeats.length === 0}
                  >
                    {selectedSeats.length === 0 ? 'Select a seat to continue' : 'Continue to Booking'}
                  </button>
                  
                  <div className="mt-4 flex items-center text-xs text-gray-500">
                    <Info size={12} className="mr-1" />
                    <span>Booking is subject to our terms and conditions</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fare Selection */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Select Your Fare</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(flight.fareClasses).map(([key, fareClass]) => (
                  <div 
                    key={key}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedFareClass === key 
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedFareClass(key)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold">{fareClass.name}</h3>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">${fareClass.price}</p>
                        <p className="text-xs text-gray-500">per person</p>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="mb-2">{fareClass.seatsAvailable} seats available</p>
                      
                      <h4 className="font-medium mt-3 mb-1">Includes:</h4>
                      <ul className="space-y-1">
                        {fareClass.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center">
                            <Check size={14} className="text-green-500 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      
                      {fareClass.restrictions.length > 0 && (
                        <>
                          <h4 className="font-medium mt-3 mb-1">Restrictions:</h4>
                          <ul className="space-y-1">
                            {fareClass.restrictions.map((restriction, index) => (
                              <li key={index} className="flex items-center">
                                <X size={14} className="text-red-500 mr-2" />
                                {restriction}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Seat Selection */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Select Your Seat</h2>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-3/4">
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
                      <div className="text-center mb-6">
                        <div className="w-24 h-8 bg-gray-500 rounded-t-3xl mx-auto"></div>
                      </div>
                      
                      <div className="inline-block min-w-full">
                        {Array.from({ length: flight.seatMap.rows }).map((_, rowIndex) => (
                          <div key={rowIndex} className="flex items-center my-2">
                            <div className="w-8 text-center text-sm font-medium">
                              {rowIndex + 1}
                            </div>
                            
                            <div className="flex space-x-2">
                              {/* A-C seats */}
                              {[0, 1, 2].map((colIndex) => (
                                <button
                                  key={`${rowIndex}-${colIndex}`}
                                  className={`w-8 h-8 rounded-md text-sm font-medium ${getSeatClasses(rowIndex + 1, colIndex)}`}
                                  onClick={() => toggleSeatSelection(rowIndex + 1, colIndex)}
                                  disabled={flight.seatMap.unavailableSeats.includes(`${rowIndex + 1}${['A', 'B', 'C'][colIndex]}`)}
                                >
                                  {['A', 'B', 'C'][colIndex]}
                                </button>
                              ))}
                              
                              {/* Aisle */}
                              <div className="w-8"></div>
                              
                              {/* D-F seats */}
                              {[3, 4, 5].map((colIndex) => (
                                <button
                                  key={`${rowIndex}-${colIndex}`}
                                  className={`w-8 h-8 rounded-md text-sm font-medium ${getSeatClasses(rowIndex + 1, colIndex)}`}
                                  onClick={() => toggleSeatSelection(rowIndex + 1, colIndex)}
                                  disabled={flight.seatMap.unavailableSeats.includes(`${rowIndex + 1}${['D', 'E', 'F'][colIndex - 3]}`)}
                                >
                                  {['D', 'E', 'F'][colIndex - 3]}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-100 rounded mr-2"></div>
                      <span>First Class</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
                      <span>Premium Economy</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
                      <span>Economy</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                      <span>Unavailable</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-primary-600 rounded mr-2"></div>
                      <span>Selected</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold mb-3">Selection Summary</h3>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Fare Class</p>
                      <p className="font-medium">{flight.fareClasses[selectedFareClass].name}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Selected Seat</p>
                      {selectedSeats.length > 0 ? (
                        <p className="font-medium">{selectedSeats.join(', ')}</p>
                      ) : (
                        <p className="text-sm text-gray-500">No seat selected</p>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={handleContinueToBooking}
                        className="w-full btn btn-primary"
                        disabled={selectedSeats.length === 0}
                      >
                        {selectedSeats.length === 0 ? 'Select a seat to continue' : 'Continue to Booking'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Flight Not Found</h2>
            <p className="text-gray-600 mb-4">We couldn't find the flight details you're looking for.</p>
            <button
              onClick={() => navigate('/search')}
              className="btn btn-primary"
            >
              Return to Search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FlightDetails
