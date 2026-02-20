
import { useState } from 'react'
import { Search, AlertCircle, Plane, Clock, ArrowRight } from 'lucide-react'

const FlightStatus = () => {
  const [searchType, setSearchType] = useState('flight')
  const [flightNumber, setFlightNumber] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [flightStatus, setFlightStatus] = useState(null)
  const [error, setError] = useState(null)

  // Mock flight status data
  const mockFlightStatus = {
    flightNumber: 'AA1234',
    airline: 'American Airlines',
    origin: 'JFK',
    originCity: 'New York',
    destination: 'LAX',
    destinationCity: 'Los Angeles',
    scheduledDeparture: '2023-06-15T08:30:00',
    estimatedDeparture: '2023-06-15T08:45:00',
    scheduledArrival: '2023-06-15T12:15:00',
    estimatedArrival: '2023-06-15T12:30:00',
    status: 'On Time',
    terminal: 'Terminal 8',
    gate: 'B12',
    baggage: 'Carousel 4',
    aircraft: 'Boeing 737-800',
    updateTime: '2023-06-15T07:15:00'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearchPerformed(true)
    setLoading(true)
    setError(null)

    // Simulate API call with 1.5s delay
    setTimeout(() => {
      setLoading(false)
      
      // Simple validation
      if (searchType === 'flight' && !flightNumber.trim()) {
        setError('Please enter a valid flight number')
        setFlightStatus(null)
        return
      }

      if (searchType === 'route' && (!origin.trim() || !destination.trim())) {
        setError('Please enter both origin and destination')
        setFlightStatus(null)
        return
      }

      // Mock successful response
      setFlightStatus(mockFlightStatus)
    }, 1500)
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'on time':
        return 'text-green-600 bg-green-100'
      case 'delayed':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      case 'landed':
        return 'text-blue-600 bg-blue-100'
      case 'boarding':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Flight Status</h1>
          
          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex mb-6">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium mr-2 ${
                  searchType === 'flight'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSearchType('flight')}
              >
                By Flight Number
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  searchType === 'route'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSearchType('route')}
              >
                By Route
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {searchType === 'flight' ? (
                <div className="mb-4">
                  <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Flight Number
                  </label>
                  <input
                    type="text"
                    id="flightNumber"
                    placeholder="e.g. AA1234"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                      From
                    </label>
                    <input
                      type="text"
                      id="origin"
                      placeholder="e.g. JFK"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                      To
                    </label>
                    <input
                      type="text"
                      id="destination"
                      placeholder="e.g. LAX"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary py-3 flex items-center justify-center"
              >
                <Search size={18} className="mr-2" />
                Check Flight Status
              </button>
            </form>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center text-red-600 mb-4">
                <AlertCircle size={24} className="mr-2" />
                <h3 className="text-lg font-semibold">Error</h3>
              </div>
              <p className="text-gray-700 mb-4">{error}</p>
              <p className="text-gray-600">Please check your input and try again.</p>
            </div>
          )}

          {/* Flight Status Result */}
          {flightStatus && !loading && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="bg-primary-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Flight Status</h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(flightStatus.status)}`}>
                    {flightStatus.status}
                  </div>
                </div>
                <p className="text-sm text-primary-100">
                  Last updated: {formatDateTime(flightStatus.updateTime)}
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3">
                    <Plane size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{flightStatus.airline}</h3>
                    <p className="text-gray-600">Flight {flightStatus.flightNumber} ÃÂ¢ÃÂÃÂ¢ {flightStatus.aircraft}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between mb-8">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500 mb-1">Departure</p>
                    <p className="text-xl font-bold">{formatTime(flightStatus.scheduledDeparture)}</p>
                    <p className="font-medium">{flightStatus.originCity} ({flightStatus.origin})</p>
                    <p className="text-sm text-gray-600">{flightStatus.terminal}</p>
                    <p className="text-sm text-gray-600">Gate {flightStatus.gate}</p>
                    
                    {new Date(flightStatus.estimatedDeparture) > new Date(flightStatus.scheduledDeparture) && (
                      <p className="text-yellow-600 text-sm mt-2">
                        Estimated: {formatTime(flightStatus.estimatedDeparture)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center mb-4 md:mb-0">
                    <Clock size={20} className="text-gray-400 mb-2" />
                    <div className="relative w-16 md:w-32 h-0.5 bg-gray-300 my-2">
                      <ArrowRight size={16} className="text-gray-500 absolute top-1/2 right-0 transform -translate-y-1/2" />
                    </div>
                    <p className="text-sm text-gray-600">
                      {Math.floor(
                        (new Date(flightStatus.scheduledArrival) - new Date(flightStatus.scheduledDeparture)) / 
                        (1000 * 60)
                      ) / 60} hours
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Arrival</p>
                    <p className="text-xl font-bold">{formatTime(flightStatus.scheduledArrival)}</p>
                    <p className="font-medium">{flightStatus.destinationCity} ({flightStatus.destination})</p>
                    <p className="text-sm text-gray-600">{flightStatus.terminal}</p>
                    <p className="text-sm text-gray-600">Baggage: {flightStatus.baggage}</p>
                    
                    {new Date(flightStatus.estimatedArrival) > new Date(flightStatus.scheduledArrival) && (
                      <p className="text-yellow-600 text-sm mt-2">
                        Estimated: {formatTime(flightStatus.estimatedArrival)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium mb-2">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Aircraft Type:</span>
                        <span>{flightStatus.aircraft}</span>
                      </p>
                    </div>
                    <div>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Flight Duration:</span>
                        <span>
                          {Math.floor(
                            (new Date(flightStatus.scheduledArrival) - new Date(flightStatus.scheduledDeparture)) / 
                            (1000 * 60 * 60)
                          )}h {Math.floor(
                            ((new Date(flightStatus.scheduledArrival) - new Date(flightStatus.scheduledDeparture)) / 
                            (1000 * 60)) % 60
                          )}m
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Search Performed Yet */}
          {!searchPerformed && !loading && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                <Plane size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Flight</h3>
              <p className="text-gray-600 mb-2">
                Enter your flight details above to check the current status of your flight.
              </p>
              <p className="text-sm text-gray-500">
                You can search by flight number or route information.
              </p>
            </div>
          )}

          {/* Flight Tracking Tips */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Flight Tracking Tips</h3>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                  1
                </div>
                <div>
                  <p className="font-medium">Check regularly</p>
                  <p className="text-sm text-gray-600">Flight statuses can change, especially during bad weather or busy travel periods.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                  2
                </div>
                <div>
                  <p className="font-medium">Sign up for alerts</p>
                  <p className="text-sm text-gray-600">Enable notifications to receive real-time updates on your flight status.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                  3
                </div>
                <div>
                  <p className="font-medium">Arrive early</p>
                  <p className="text-sm text-gray-600">Even if your flight is delayed, it's recommended to arrive at the airport on time as schedules can change quickly.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightStatus
