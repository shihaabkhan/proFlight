
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Luggage, Plane, ChevronDown, ChevronUp, Info } from 'lucide-react'
import AirlineLogo from './AirlineLogo'

const FlightCard = ({ flight, isCompact = false }) => {
  const [expanded, setExpanded] = useState(false)
  
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      {/* Main Card Content */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Airline Info */}
          <div className="flex items-center space-x-3">
            <AirlineLogo airline={flight.airline} />
            <div>
              <p className="font-medium">{flight.airline}</p>
              <p className="text-sm text-gray-500">Flight {flight.flightNumber}</p>
            </div>
          </div>
          
          {/* Flight Timeline */}
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-lg font-bold">{formatTime(flight.departureTime)}</p>
                <p className="text-sm text-gray-500">{flight.origin}</p>
                <p className="text-xs text-gray-400">{formatDate(flight.departureTime)}</p>
              </div>
              
              <div className="flex-grow mx-4">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500">{formatDuration(flight.durationMinutes)}</p>
                  <div className="relative w-full h-0.5 bg-gray-200 my-2">
                    <div className="absolute left-0 right-0 top-1/2 border-b border-gray-300 border-dashed"></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                    {flight.stops > 0 && (
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {flight.stops === 0 ? 'Nonstop' : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-bold">{formatTime(flight.arrivalTime)}</p>
                <p className="text-sm text-gray-500">{flight.destination}</p>
                <p className="text-xs text-gray-400">{formatDate(flight.arrivalTime)}</p>
              </div>
            </div>
          </div>
          
          {/* Price and CTA */}
          <div className="text-center lg:text-right mt-4 lg:mt-0">
            {flight.discount > 0 && (
              <p className="text-xs text-green-600 mb-1">Save ${flight.discount}!</p>
            )}
            <p className="text-sm text-gray-500">From</p>
            <p className="text-2xl font-bold text-primary-600">${flight.price}</p>
            <p className="text-xs text-gray-500 mb-2">{flight.fareClass}</p>
            
            {!isCompact && (
              <Link 
                to={`/flight/${flight.id}`}
                className="btn btn-primary inline-block w-full lg:w-auto"
              >
                Select
              </Link>
            )}
          </div>
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap items-center mt-4 text-sm text-gray-600 gap-x-4 gap-y-2">
          <div className="flex items-center">
            <Plane size={16} className="mr-1" />
            <span>{flight.aircraft}</span>
          </div>
          <div className="flex items-center">
            <Luggage size={16} className="mr-1" />
            <span>{flight.baggage}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{Math.round(flight.onTimePerformance * 100)}% on time</span>
          </div>
          
          {flight.features && flight.features.length > 0 && (
            <div className="flex items-center ml-auto">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center text-primary-600 hover:text-primary-700"
              >
                {expanded ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    Less details
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    More details
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
          <h4 className="font-medium mb-2">Flight Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {flight.features && flight.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <Info size={16} className="text-gray-400 mr-2 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          
          {flight.stops > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Layover Details</h4>
              {flight.layovers && flight.layovers.map((layover, index) => (
                <div key={index} className="flex items-center text-sm mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span>
                    {layover.airport} Ã¢ÂÂ¢ {formatDuration(layover.durationMinutes)} layover
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FlightCard
