import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Search,
  AlertCircle,
  Loader2,
  PlaneIcon,
  ArrowDownUp
} from 'lucide-react'

const Booking = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({
    key: 'booking_date_time',
    direction: 'desc'
  })
  const [filterStatus, setFilterStatus] = useState('all')

  // Fetch bookings data
  useEffect(() => {
    fetchBookings()
  }, [])

  // Apply filters and sort when bookings or filter settings change
  useEffect(() => {
    let result = [...bookings]
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(booking => booking.booking_status === filterStatus)
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase()
      result = result.filter(booking => 
        booking.booking_id.toLowerCase().includes(lowercasedSearch) ||
        booking.from.toLowerCase().includes(lowercasedSearch) ||
        booking.destination.toLowerCase().includes(lowercasedSearch) ||
        (booking.passenger_details?.passenger_name?.toLowerCase().includes(lowercasedSearch))
      )
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key]
        let bVal = b[sortConfig.key]
        
        // Handle nested properties
        if (sortConfig.key === 'passenger_name') {
          aVal = a.passenger_details?.passenger_name || ''
          bVal = b.passenger_details?.passenger_name || ''
        }
        
        // Handle date comparisons
        if (sortConfig.key === 'booking_date_time' || 
            sortConfig.key === 'original_departure_date_time' ||
            sortConfig.key === 'arrival_date_time') {
          return sortConfig.direction === 'asc' 
            ? new Date(aVal) - new Date(bVal)
            : new Date(bVal) - new Date(aVal)
        }
        
        // Handle string comparisons
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }
        
        // Handle number comparisons
        return sortConfig.direction === 'asc' 
          ? aVal - bVal 
          : bVal - aVal
      })
    }
    
    setFilteredBookings(result)
  }, [bookings, searchTerm, sortConfig, filterStatus])

  const fetchBookings = async () => {
    console.log("laoding the bookings")
    setLoading(true)
    try {

      const response = await fetch('https://vanijapp.adya.ai/api/v1/vanij/llm_playground/flow/get_my_booking_list?per_page=20',{
        method: 'GET'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      
      const data = await response.json()
      
      if (data.meta.status) {
        setBookings(data.data)
        setFilteredBookings(data.data)
      } else {
        throw new Error(data.meta.message || 'Failed to fetch bookings')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (e) {
      return dateString
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      // Handle format like "2025-05-20 07:30"
      let date
      if (dateString.includes(' ')) {
        const [datePart, timePart] = dateString.split(' ')
        date = new Date(`${datePart}T${timePart}`)
      } else {
        date = new Date(dateString)
      }
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch (e) {
      return dateString
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'Payment Initiated':
        return 'bg-blue-100 text-blue-800'
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'NOT-PAID':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-primary-600 mr-4"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Home
            </button>
            <h1 className="text-2xl font-bold">My Bookings</h1>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search bookings..."
              />
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="Payment Initiated">Payment Initiated</option>
                <option value="Scheduled">Scheduled</option>
              </select>
              
              <button
                onClick={fetchBookings}
                className="btn btn-primary flex items-center gap-2"
              >
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Bookings List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center min-h-64">
            <Loader2 size={32} className="text-primary-600 animate-spin" />
            <span className="ml-2 text-gray-700">Loading your bookings...</span>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-center items-center min-h-64">
            <AlertCircle size={32} className="text-red-500 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">Failed to load bookings</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchBookings}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-center items-center min-h-64">
            <Calendar size={32} className="text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your filters to see more results.' 
                : 'You have no bookings at the moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Table Header for sorting on desktop */}
            <div className="hidden md:grid md:grid-cols-6 bg-gray-100 p-4 rounded-t-xl font-medium text-gray-700">
              <div className="cursor-pointer flex items-center" onClick={() => handleSort('booking_id')}>
                Booking ID
                {sortConfig.key === 'booking_id' && (
                  <ArrowDownUp size={14} className="ml-1" />
                )}
              </div>
              <div className="cursor-pointer flex items-center" onClick={() => handleSort('passenger_name')}>
                Passenger
                {sortConfig.key === 'passenger_name' && (
                  <ArrowDownUp size={14} className="ml-1" />
                )}
              </div>
              <div className="cursor-pointer flex items-center" onClick={() => handleSort('from')}>
                Route
                {sortConfig.key === 'from' && (
                  <ArrowDownUp size={14} className="ml-1" />
                )}
              </div>
              <div className="cursor-pointer flex items-center" onClick={() => handleSort('original_departure_date_time')}>
                Departure
                {sortConfig.key === 'original_departure_date_time' && (
                  <ArrowDownUp size={14} className="ml-1" />
                )}
              </div>
              <div className="cursor-pointer flex items-center" onClick={() => handleSort('booking_status')}>
                Status
                {sortConfig.key === 'booking_status' && (
                  <ArrowDownUp size={14} className="ml-1" />
                )}
              </div>
              <div className="text-right">Actions</div>
            </div>
            
            {filteredBookings.map((booking) => (
              <div 
                key={booking.booking_id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Desktop View */}
                <div className="hidden md:grid md:grid-cols-6 p-6 items-center">
                  <div>
                    <div className="font-medium">{booking.booking_id}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(booking.booking_date_time)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium">
                      {booking.passenger_details?.passenger_name || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.passenger_details?.phone_number || 'N/A'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{booking.from}</span>
                      <svg className="w-4 h-4 mx-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className="font-medium">{booking.destination}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Flight {booking.flight_id}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium flex items-center">
                      <Clock size={14} className="mr-1 text-gray-500" />
                      {formatTime(booking.original_departure_date_time)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(booking.original_departure_date_time)}
                    </div>
                  </div>
                  
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.booking_status)}`}>
                      {booking.booking_status}
                    </span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                        {booking.payment_status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <button 
                      onClick={() => navigate(`/booking/${booking.booking_id}`)}
                      className="btn btn-sm btn-outline mr-2"
                    >
                      Details
                    </button>
                    {booking.payment_status === 'NOT-PAID' && (
                      <button className="btn btn-sm btn-primary">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Mobile View */}
                <div className="md:hidden p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-lg">{booking.booking_id}</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(booking.booking_date_time)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium mb-1 ${getStatusColor(booking.booking_status)}`}>
                        {booking.booking_status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                        {booking.payment_status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-100 rounded-full p-2 mr-3">
                      <PlaneIcon size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium flex items-center">
                        {booking.from} 
                        <svg className="w-4 h-4 mx-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg> 
                        {booking.destination}
                      </div>
                      <div className="text-xs text-gray-500">
                        Flight {booking.flight_id} â¢ Class {booking.class}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-sm text-gray-600">Departure</div>
                      <div className="font-medium">{formatTime(booking.original_departure_date_time)}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(booking.original_departure_date_time)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 text-right">Arrival</div>
                      <div className="font-medium text-right">{formatTime(booking.arrival_date_time)}</div>
                      <div className="text-xs text-gray-500 text-right">
                        {formatDate(booking.arrival_date_time)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Passenger</div>
                    <div className="font-medium">
                      {booking.passenger_details?.passenger_name || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.passenger_details?.phone_number || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <div className="text-sm font-medium">
                      {booking.currency} {booking.amount || 0}
                    </div>
                    <div>
                      <button 
                        onClick={() => navigate(`/booking/${booking.booking_id}`)}
                        className="btn btn-sm btn-outline mr-2"
                      >
                        Details
                      </button>
                      {booking.payment_status === 'NOT-PAID' && (
                        <button className="btn btn-sm btn-primary">
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Booking