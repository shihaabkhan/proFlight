

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { addDays, format } from 'date-fns'
import { Search, MapPin, Calendar, Users, Plus, Minus, X } from 'lucide-react'

const SearchForm = ({ className = '', compact = false }) => {
  const navigate = useNavigate()
  const [tripType, setTripType] = useState('roundTrip')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [originDropdownOpen, setOriginDropdownOpen] = useState(false)
  const [destinationDropdownOpen, setDestinationDropdownOpen] = useState(false)
  const [departDate, setDepartDate] = useState(addDays(new Date(), 7))
  const [returnDate, setReturnDate] = useState(addDays(new Date(), 14))
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  })
  const [travelClass, setTravelClass] = useState('economy')
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false)
  const [showMultiCity, setShowMultiCity] = useState(false)
  const [multiCityTrips, setMultiCityTrips] = useState([
    { origin: '', destination: '', date: addDays(new Date(), 7) },
  ])
  const [recentSearches] = useState([
    { from: 'JFK', to: 'LAX' },
    { from: 'SFO', to: 'SEA' },
    { from: 'ORD', to: 'DEN' },
  ])

  // Sample airport data for autocomplete
  const airports = [
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York' },
    { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles' },
    { code: 'LHR', name: 'Heathrow Airport', city: 'London' },
    { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris' },
    { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai' },
    { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore' },
    { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco' },
    { code: 'ORD', name: '\'O\'Hare International Airport', city: 'Chicago' },
    { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle' },
    { code: 'DEN', name: 'Denver International Airport', city: 'Denver' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // In a real app, we would format this data for the API call
    const searchParams = {
      tripType,
      origin,
      destination,
      departDate,
      returnDate: tripType === 'oneWay' ? null : returnDate,
      passengers,
      travelClass,
      multiCityTrips: tripType === 'multiCity' ? multiCityTrips : null,
    }
    
    console.log('Search params:', searchParams)
    
    // Navigate to search results page with params
    navigate('/search')
  }

  const togglePassengerDropdown = () => {
    setIsPassengerDropdownOpen(!isPassengerDropdownOpen)
  }

  const updatePassengers = (type, operation) => {
    setPassengers((prev) => {
      const newValue = operation === 'add' 
        ? prev[type] + 1 
        : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
      
      return { ...prev, [type]: newValue }
    })
  }

  const handleTripTypeChange = (type) => {
    setTripType(type)
    if (type === 'multiCity') {
      setShowMultiCity(true)
    } else {
      setShowMultiCity(false)
    }
  }

  const addMultiCityTrip = () => {
    if (multiCityTrips.length < 5) {
      setMultiCityTrips([
        ...multiCityTrips,
        { origin: '', destination: '', date: addDays(new Date(), multiCityTrips.length * 3 + 7) }
      ])
    }
  }

  const removeMultiCityTrip = (index) => {
    if (multiCityTrips.length > 1) {
      setMultiCityTrips(multiCityTrips.filter((_, i) => i !== index))
    }
  }

  const updateMultiCityTrip = (index, field, value) => {
    const updatedTrips = [...multiCityTrips]
    updatedTrips[index] = { ...updatedTrips[index], [field]: value }
    setMultiCityTrips(updatedTrips)
  }

  const handleOriginChange = (e) => {
    setOrigin(e.target.value)
    setOriginDropdownOpen(true)
  }

  const handleDestinationChange = (e) => {
    setDestination(e.target.value)
    setDestinationDropdownOpen(true)
  }

  const handleOriginSelect = (airportCode) => {
    setOrigin(airportCode)
    setOriginDropdownOpen(false)
  }

  const handleDestinationSelect = (airportCode) => {
    setDestination(airportCode)
    setDestinationDropdownOpen(false)
  }

  // Close dropdowns when clicking outside
  const handleClickOutside = () => {
    setOriginDropdownOpen(false)
    setDestinationDropdownOpen(false)
  }

  const totalPassengers = passengers.adults + passengers.children + passengers.infants

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 md:p-6 ${className}`}>
      {/* Trip Type Selection */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          type="button"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            tripType === 'roundTrip'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleTripTypeChange('roundTrip')}
        >
          Round Trip
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            tripType === 'oneWay'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleTripTypeChange('oneWay')}
        >
          One Way
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            tripType === 'multiCity'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleTripTypeChange('multiCity')}
        >
          Multi-City
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {!showMultiCity ? (
          <div className="space-y-4">
            {/* Origin and Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="origin"
                    type="text"
                    className="input-field pl-10"
                    placeholder="City or airport"
                    value={origin}
                    onChange={handleOriginChange}
                    onFocus={() => setOriginDropdownOpen(true)}
                    required
                  />
                </div>
                {originDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {airports
                      .filter(airport => 
                        !origin ||
                        airport.code.toLowerCase().includes(origin.toLowerCase()) ||
                        airport.name.toLowerCase().includes(origin.toLowerCase()) ||
                        airport.city.toLowerCase().includes(origin.toLowerCase())
                      )
                      .map((airport, index) => (
                        <button
                          key={index}
                          type="button"
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleOriginSelect(airport.code)}
                        >
                          <div className="font-medium">{airport.city} ({airport.code})</div>
                          <div className="text-sm text-gray-500">{airport.name}</div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="destination"
                    type="text"
                    className="input-field pl-10"
                    placeholder="City or airport"
                    value={destination}
                    onChange={handleDestinationChange}
                    onFocus={() => setDestinationDropdownOpen(true)}
                    required
                  />
                </div>
                {destinationDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {airports
                      .filter(airport => 
                        !destination ||
                        airport.code.toLowerCase().includes(destination.toLowerCase()) ||
                        airport.name.toLowerCase().includes(destination.toLowerCase()) ||
                        airport.city.toLowerCase().includes(destination.toLowerCase())
                      )
                      .map((airport, index) => (
                        <button
                          key={index}
                          type="button"
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleDestinationSelect(airport.code)}
                        >
                          <div className="font-medium">{airport.city} ({airport.code})</div>
                          <div className="text-sm text-gray-500">{airport.name}</div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="departDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <DatePicker
                    id="departDate"
                    selected={departDate}
                    onChange={(date) => setDepartDate(date)}
                    minDate={new Date()}
                    className="input-field pl-10"
                    dateFormat="MMM d, yyyy"
                    required
                  />
                </div>
              </div>
              
              {tripType === 'roundTrip' && (
                <div>
                  <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <DatePicker
                      id="returnDate"
                      selected={returnDate}
                      onChange={(date) => setReturnDate(date)}
                      minDate={departDate}
                      className="input-field pl-10"
                      dateFormat="MMM d, yyyy"
                      required={tripType === 'roundTrip'}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Multi-city form
          <div className="space-y-4">
            {multiCityTrips.map((trip, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor={`origin-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      From
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        id={`origin-${index}`}
                        type="text"
                        className="input-field pl-10"
                        placeholder="City or airport"
                        value={trip.origin}
                        onChange={(e) => updateMultiCityTrip(index, 'origin', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor={`destination-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      To
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        id={`destination-${index}`}
                        type="text"
                        className="input-field pl-10"
                        placeholder="City or airport"
                        value={trip.destination}
                        onChange={(e) => updateMultiCityTrip(index, 'destination', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor={`date-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <DatePicker
                        id={`date-${index}`}
                        selected={trip.date}
                        onChange={(date) => updateMultiCityTrip(index, 'date', date)}
                        minDate={new Date()}
                        className="input-field pl-10"
                        dateFormat="MMM d, yyyy"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {multiCityTrips.length > 1 && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={() => removeMultiCityTrip(index)}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
            
            {multiCityTrips.length < 5 && (
              <button
                type="button"
                className="flex items-center justify-center w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                onClick={addMultiCityTrip}
              >
                <Plus size={18} className="mr-2" />
                Add another flight
              </button>
            )}
          </div>
        )}
        
        {/* Passengers and Class Selection */}
        <div className="mt-4">
          <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
            Passengers & Class
          </label>
          <div className="relative">
            <button
              type="button"
              id="passengers"
              className="input-field text-left flex items-center justify-between"
              onClick={togglePassengerDropdown}
            >
              <div className="flex items-center">
                <Users className="text-gray-400 mr-2" size={18} />
                <span>
                  {totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'},{' '}
                  {travelClass.charAt(0).toUpperCase() + travelClass.slice(1)}
                </span>
              </div>
            </button>
            
            {isPassengerDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 p-4">
                <div className="space-y-4">
                  {/* Passenger types */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium">Adults</div>
                        <div className="text-sm text-gray-500">12+ years</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          className="p-1 border border-gray-300 rounded-full disabled:opacity-50"
                          onClick={() => updatePassengers('adults', 'subtract')}
                          disabled={passengers.adults <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center">{passengers.adults}</span>
                        <button
                          type="button"
                          className="p-1 border border-gray-300 rounded-full"
                          onClick={() => updatePassengers('adults', 'add')}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium">Children</div>
                        <div className="text-sm text-gray-500">2-11 years</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          className="p-1 border border-gray-300 rounded-full disabled:opacity-50"
                          onClick={() => updatePassengers('children', 'subtract')}
                          disabled={passengers.children <= 0}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center">{passengers.children}</span>
                        <button
                          type="button"
                          className="p-1 border border-gray-300 rounded-full"
                          onClick={() => updatePassengers('children', 'add')}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Infants</div>
                        <div className="text-sm text-gray-500">0-23 months</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          className="p-1 border border-gray-300 rounded-full disabled:opacity-50"
                          onClick={() => updatePassengers('infants', 'subtract')}
                          disabled={passengers.infants <= 0}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center">{passengers.infants}</span>
                        <button
                          type="button"
                          className="p-1 border border-gray-300 rounded-full disabled:opacity-50"
                          onClick={() => updatePassengers('infants', 'add')}
                          disabled={passengers.infants >= passengers.adults} // Typically 1 infant per adult
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Travel Class */}
                  <div>
                    <div className="font-medium mb-2">Cabin Class</div>
                    <div className="grid grid-cols-2 gap-2">
                      {['economy', 'premium economy', 'business', 'first'].map((classType) => (
                        <button
                          key={classType}
                          type="button"
                          className={`py-2 px-3 rounded-lg text-sm ${
                            travelClass === classType
                              ? 'bg-primary-100 text-primary-700 border border-primary-300'
                              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                          }`}
                          onClick={() => setTravelClass(classType)}
                        >
                          {classType.charAt(0).toUpperCase() + classType.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="w-full btn btn-primary"
                    onClick={togglePassengerDropdown}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Searches */}
        {!compact && recentSearches.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Recent Searches</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  type="button"
                  className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                  onClick={() => {
                    setOrigin(search.from)
                    setDestination(search.to)
                  }}
                >
                  {search.from} &rarr; {search.to}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Search Button */}
        <div className="mt-6">
          <button type="submit" className="w-full btn btn-primary py-3 text-base font-semibold flex items-center justify-center">
            <Search size={18} className="mr-2" />
            Search Flights
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchForm

