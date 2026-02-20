
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Filter, ArrowUpDown, ChevronDown, ChevronUp, Check, X, AlertCircle, Search } from 'lucide-react'
import SearchForm from '../components/SearchForm'
import FlightCard from '../components/FlightCard'

const SearchResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSearchFormVisible, setIsSearchFormVisible] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [flights, setFlights] = useState([])
  const [activeSection, setActiveSection] = useState('all')
  const [selectedAirlines, setSelectedAirlines] = useState([])
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [timeRange, setTimeRange] = useState({ 
    departure: [0, 24], // 0-24 hours
    arrival: [0, 24]
  })
  const [sortOption, setSortOption] = useState('price-asc')
  const [stopFilter, setStopFilter] = useState('any')
  
  // Mock flight data (in a real app, this would come from API)
  const mockFlights = [
    {
      id: 'FL001',
      airline: 'American Airlines',
      flightNumber: 'AA1234',
      origin: 'JFK',
      destination: 'LAX',
      departureTime: '2023-06-15T08:30:00',
      arrivalTime: '2023-06-15T12:15:00',
      durationMinutes: 345,
      stops: 0,
      price: 299,
      fareClass: 'Economy',
      discount: 50,
      aircraft: 'Boeing 737',
      baggage: '1 checked bag',
      onTimePerformance: 0.92,
      features: ['In-flight Wi-Fi', 'Power outlets', 'Personal entertainment'],
    },
    {
      id: 'FL002',
      airline: 'Delta Air Lines',
      flightNumber: 'DL4567',
      origin: 'JFK',
      destination: 'LAX',
      departureTime: '2023-06-15T10:15:00',
      arrivalTime: '2023-06-15T15:30:00',
      durationMinutes: 375,
      stops: 1,
      price: 279,
      fareClass: 'Economy',
      discount: 0,
      aircraft: 'Airbus A320',
      baggage: '1 checked bag',
      onTimePerformance: 0.87,
      features: ['Wi-Fi available for purchase', 'USB charging ports'],
      layovers: [
        { airport: 'ATL', durationMinutes: 75 }
      ]
    },
    {
      id: 'FL003',
      airline: 'United Airlines',
      flightNumber: 'UA8910',
      origin: 'JFK',
      destination: 'LAX',
      departureTime: '2023-06-15T13:45:00',
      arrivalTime: '2023-06-15T17:30:00',
      durationMinutes: 345,
      stops: 0,
      price: 329,
      fareClass: 'Economy',
      discount: 0,
      aircraft: 'Boeing 787',
      baggage: '1 checked bag',
      onTimePerformance: 0.94,
      features: ['Premium Wi-Fi', 'Power outlets', 'DIRECTV', 'Spacious legroom'],
    },
    {
      id: 'FL004',
      airline: 'JetBlue Airways',
      flightNumber: 'B6721',
      origin: 'JFK',
      destination: 'LAX',
      departureTime: '2023-06-15T15:20:00',
      arrivalTime: '2023-06-15T21:15:00',
      durationMinutes: 415,
      stops: 1,
      price: 259,
      fareClass: 'Economy',
      discount: 30,
      aircraft: 'Airbus A321',
      baggage: '1 checked bag',
      onTimePerformance: 0.82,
      features: ['Free Wi-Fi', 'Power outlets', 'Free movies & TV shows', 'Extra legroom'],
      layovers: [
        { airport: 'BOS', durationMinutes: 95 }
      ]
    },
    {
      id: 'FL005',
      airline: 'Southwest Airlines',
      flightNumber: 'WN2468',
      origin: 'JFK',
      destination: 'LAX',
      departureTime: '2023-06-15T18:00:00',
      arrivalTime: '2023-06-15T22:30:00',
      durationMinutes: 330,
      stops: 0,
      price: 289,
      fareClass: 'Economy',
      discount: 0,
      aircraft: 'Boeing 737',
      baggage: '2 checked bags',
      onTimePerformance: 0.89,
      features: ['Free Wi-Fi', 'Free movies & TV shows'],
    },
    {
      id: 'FL006',
      airline: 'American Airlines',
      flightNumber: 'AA5678',
      origin: 'JFK',
      destination: 'LAX',
      departureTime: '2023-06-15T21:30:00',
      arrivalTime: '2023-06-16T01:15:00',
      durationMinutes: 345,
      stops: 0,
      price: 269,
      fareClass: 'Economy',
      discount: 0,
      aircraft: 'Boeing 737',
      baggage: '1 checked bag',
      onTimePerformance: 0.91,
      features: ['In-flight Wi-Fi', 'Power outlets', 'Personal entertainment'],
    },
  ]
  
  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setFlights(mockFlights)
      setLoading(false)
    }, 1500)
  }, [])
  
  // Get unique airlines for filter
  const airlines = [...new Set(mockFlights.map(flight => flight.airline))]
  
  const toggleAirline = (airline) => {
    if (selectedAirlines.includes(airline)) {
      setSelectedAirlines(selectedAirlines.filter(a => a !== airline))
    } else {
      setSelectedAirlines([...selectedAirlines, airline])
    }
  }
  
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }
  
  const clearFilters = () => {
    setSelectedAirlines([])
    setPriceRange([0, 2000])
    setTimeRange({ departure: [0, 24], arrival: [0, 24] })
    setStopFilter('any')
  }
  
  // Filter flights based on selected criteria
  const filteredFlights = flights.filter(flight => {
    // Filter by airlines
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) {
      return false
    }
    
    // Filter by price
    if (flight.price < priceRange[0] || flight.price > priceRange[1]) {
      return false
    }
    
    // Filter by stops
    if (stopFilter !== 'any') {
      const stopCount = parseInt(stopFilter)
      if (flight.stops !== stopCount) {
        return false
      }
    }
    
    // Filter by departure time
    const departureHour = new Date(flight.departureTime).getHours()
    if (departureHour < timeRange.departure[0] || departureHour > timeRange.departure[1]) {
      return false
    }
    
    // Filter by arrival time
    const arrivalHour = new Date(flight.arrivalTime).getHours()
    if (arrivalHour < timeRange.arrival[0] || arrivalHour > timeRange.arrival[1]) {
      return false
    }
    
    return true
  })
  
  // Sort flights based on selected option
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'duration-asc':
        return a.durationMinutes - b.durationMinutes
      case 'departure-asc':
        return new Date(a.departureTime) - new Date(b.departureTime)
      case 'arrival-asc':
        return new Date(a.arrivalTime) - new Date(b.arrivalTime)
      default:
        return a.price - b.price
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search form toggle */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsSearchFormVisible(!isSearchFormVisible)}
          >
            <div>
              <p className="text-sm text-gray-600">New York (JFK) Ã¢ÂÂ Los Angeles (LAX)</p>
              <p className="text-xs text-gray-500">Jun 15, 2023 Ã¢ÂÂ¢ 1 Passenger Ã¢ÂÂ¢ Economy</p>
            </div>
            <div>
              <button className="text-primary-600">
                {isSearchFormVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>
          
          {isSearchFormVisible && (
            <div className="mt-4 pb-4">
              <SearchForm compact={true} />
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear all
                </button>
              </div>
              
              {/* Price Filter */}
              <div className="mb-6">
                <h3 
                  className="font-medium mb-2 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('price')}
                >
                  <span>Price Range</span>
                  {activeSection === 'price' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </h3>
                
                {activeSection === 'price' && (
                  <div className="mt-2">
                    <div className="flex justify-between mb-2 text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      value={priceRange[1]} 
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              
              {/* Airlines Filter */}
              <div className="mb-6">
                <h3 
                  className="font-medium mb-2 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('airlines')}
                >
                  <span>Airlines</span>
                  {activeSection === 'airlines' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </h3>
                
                {activeSection === 'airlines' && (
                  <div className="mt-2 space-y-2">
                    {airlines.map((airline) => (
                      <div key={airline} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`airline-${airline}`}
                          checked={selectedAirlines.includes(airline)}
                          onChange={() => toggleAirline(airline)}
                          className="mr-2"
                        />
                        <label htmlFor={`airline-${airline}`} className="text-sm cursor-pointer">
                          {airline}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Stops Filter */}
              <div className="mb-6">
                <h3 
                  className="font-medium mb-2 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('stops')}
                >
                  <span>Stops</span>
                  {activeSection === 'stops' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </h3>
                
                {activeSection === 'stops' && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="stop-any"
                        name="stops"
                        value="any"
                        checked={stopFilter === 'any'}
                        onChange={() => setStopFilter('any')}
                        className="mr-2"
                      />
                      <label htmlFor="stop-any" className="text-sm cursor-pointer">
                        Any number of stops
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="stop-0"
                        name="stops"
                        value="0"
                        checked={stopFilter === '0'}
                        onChange={() => setStopFilter('0')}
                        className="mr-2"
                      />
                      <label htmlFor="stop-0" className="text-sm cursor-pointer">
                        Nonstop only
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="stop-1"
                        name="stops"
                        value="1"
                        checked={stopFilter === '1'}
                        onChange={() => setStopFilter('1')}
                        className="mr-2"
                      />
                      <label htmlFor="stop-1" className="text-sm cursor-pointer">
                        1 stop
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Time Filter */}
              <div className="mb-6">
                <h3 
                  className="font-medium mb-2 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('time')}
                >
                  <span>Time</span>
                  {activeSection === 'time' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </h3>
                
                {activeSection === 'time' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm mb-2">Departure Time</p>
                      <div className="flex justify-between mb-1 text-xs">
                        <span>12 AM</span>
                        <span>12 PM</span>
                        <span>11 PM</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="24" 
                        value={timeRange.departure[1]} 
                        onChange={(e) => setTimeRange({
                          ...timeRange,
                          departure: [timeRange.departure[0], parseInt(e.target.value)]
                        })}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <p className="text-sm mb-2">Arrival Time</p>
                      <div className="flex justify-between mb-1 text-xs">
                        <span>12 AM</span>
                        <span>12 PM</span>
                        <span>11 PM</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="24" 
                        value={timeRange.arrival[1]} 
                        onChange={(e) => setTimeRange({
                          ...timeRange,
                          arrival: [timeRange.arrival[0], parseInt(e.target.value)]
                        })}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-20 right-4 z-30">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="btn btn-primary rounded-full shadow-lg flex items-center"
            >
              <Filter size={16} className="mr-2" />
              Filters
            </button>
          </div>
          
          {/* Mobile Filter Overlay */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex lg:hidden">
              <div className="bg-white w-4/5 max-w-md h-full overflow-y-auto ml-auto p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {/* Filter content - same as sidebar */}
                {/* Price Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
                
                {/* Airlines Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Airlines</h3>
                  <div className="space-y-2">
                    {airlines.map((airline) => (
                      <div key={airline} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`mobile-airline-${airline}`}
                          checked={selectedAirlines.includes(airline)}
                          onChange={() => toggleAirline(airline)}
                          className="mr-2"
                        />
                        <label htmlFor={`mobile-airline-${airline}`} className="text-sm cursor-pointer">
                          {airline}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Stops Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Stops</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="mobile-stop-any"
                        name="mobile-stops"
                        value="any"
                        checked={stopFilter === 'any'}
                        onChange={() => setStopFilter('any')}
                        className="mr-2"
                      />
                      <label htmlFor="mobile-stop-any" className="text-sm cursor-pointer">
                        Any number of stops
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="mobile-stop-0"
                        name="mobile-stops"
                        value="0"
                        checked={stopFilter === '0'}
                        onChange={() => setStopFilter('0')}
                        className="mr-2"
                      />
                      <label htmlFor="mobile-stop-0" className="text-sm cursor-pointer">
                        Nonstop only
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="mobile-stop-1"
                        name="mobile-stops"
                        value="1"
                        checked={stopFilter === '1'}
                        onChange={() => setStopFilter('1')}
                        className="mr-2"
                      />
                      <label htmlFor="mobile-stop-1" className="text-sm cursor-pointer">
                        1 stop
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-8">
                  <button 
                    onClick={clearFilters}
                    className="flex-1 btn btn-outline"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 btn btn-primary"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Flight Results */}
          <div className="flex-grow">
            {/* Top Controls */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {loading ? 'Searching flights...' : `${sortedFlights.length} flights found`}
                  </p>
                  <p className="text-sm text-gray-600">
                    Prices include taxes + fees for 1 adult
                  </p>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm mr-2">Sort by:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="price-asc">Price: Lowest first</option>
                    <option value="price-desc">Price: Highest first</option>
                    <option value="duration-asc">Duration: Shortest first</option>
                    <option value="departure-asc">Departure: Earliest first</option>
                    <option value="arrival-asc">Arrival: Earliest first</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                    <div className="flex flex-col lg:flex-row justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      
                      <div className="flex-grow my-4 lg:my-0 lg:mx-8">
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <div className="h-5 bg-gray-200 rounded w-16 mb-2 mx-auto"></div>
                            <div className="h-3 bg-gray-200 rounded w-10 mx-auto"></div>
                          </div>
                          
                          <div className="flex-grow mx-4">
                            <div className="h-2 bg-gray-200 rounded w-full my-4"></div>
                          </div>
                          
                          <div className="text-center">
                            <div className="h-5 bg-gray-200 rounded w-16 mb-2 mx-auto"></div>
                            <div className="h-3 bg-gray-200 rounded w-10 mx-auto"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="h-7 bg-gray-200 rounded w-20 mb-2 ml-auto"></div>
                        <div className="h-9 bg-gray-200 rounded w-24 ml-auto"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No Results State */}
            {!loading && sortedFlights.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <AlertCircle size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">No flights found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any flights matching your criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
            
            {/* Flight Results */}
            {!loading && sortedFlights.length > 0 && (
              <div className="space-y-4">
                {sortedFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResults
