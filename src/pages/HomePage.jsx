
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, TrendingUp, Sun, Wind, Umbrella, Search, ChevronRight } from 'lucide-react'
import SearchForm from '../components/SearchForm'

const HomePage = () => {
  const [activeDealTab, setActiveDealTab] = useState('recommended')
  
  // Sample featured destinations
  const featuredDestinations = [
    {
      id: 1,
      city: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
      price: 499,
    },
    {
      id: 2,
      city: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
      price: 899,
    },
    {
      id: 3,
      city: 'New York',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
      price: 399,
    },
    {
      id: 4,
      city: 'Dubai',
      country: 'UAE',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
      price: 599,
    },
  ]
  
  // Sample flight deals
  const flightDeals = {
    recommended: [
      { id: 1, from: 'New York', to: 'Miami', price: 129, dates: 'Jun 10 - Jun 17' },
      { id: 2, from: 'Los Angeles', to: 'Las Vegas', price: 89, dates: 'Jun 15 - Jun 22' },
      { id: 3, from: 'Chicago', to: 'Orlando', price: 159, dates: 'Jul 5 - Jul 12' },
      { id: 4, from: 'Boston', to: 'San Francisco', price: 249, dates: 'Jul 20 - Jul 27' },
    ],
    lastMinute: [
      { id: 5, from: 'Washington DC', to: 'Seattle', price: 199, dates: 'Jun 5 - Jun 12' },
      { id: 6, from: 'Atlanta', to: 'Denver', price: 179, dates: 'Jun 7 - Jun 14' },
      { id: 7, from: 'Dallas', to: 'New Orleans', price: 119, dates: 'Jun 8 - Jun 15' },
      { id: 8, from: 'Phoenix', to: 'Portland', price: 159, dates: 'Jun 9 - Jun 16' },
    ],
    weekend: [
      { id: 9, from: 'San Francisco', to: 'Los Angeles', price: 99, dates: 'Jun 9 - Jun 11' },
      { id: 10, from: 'Chicago', to: 'Nashville', price: 149, dates: 'Jun 16 - Jun 18' },
      { id: 11, from: 'New York', to: 'Boston', price: 119, dates: 'Jun 23 - Jun 25' },
      { id: 12, from: 'Miami', to: 'Key West', price: 89, dates: 'Jun 30 - Jul 2' },
    ],
  }
  
  // Sample weather forecast
  const weatherForecast = [
    { city: 'Miami', temp: '84ÃÂÃÂÃÂÃÂ°F', condition: 'Sunny', icon: <Sun size={20} className="text-yellow-500" /> },
    { city: 'New York', temp: '72ÃÂÃÂÃÂÃÂ°F', condition: 'Partly cloudy', icon: <Sun size={20} className="text-gray-500" /> },
    { city: 'Los Angeles', temp: '76ÃÂÃÂÃÂÃÂ°F', condition: 'Clear', icon: <Sun size={20} className="text-yellow-500" /> },
    { city: 'Chicago', temp: '68ÃÂÃÂÃÂÃÂ°F', condition: 'Windy', icon: <Wind size={20} className="text-blue-500" /> },
    { city: 'Orlando', temp: '82ÃÂÃÂÃÂÃÂ°F', condition: 'Rain showers', icon: <Umbrella size={20} className="text-blue-500" /> },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-16 md:py-24"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1556388158-158ea5ccacbd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl text-center mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore the World with SkyWay
            </h1>
            <p className="text-xl text-white opacity-90">
              Find and book your perfect flight with our advanced search and smart recommendations
            </p>
          </div>
          
          <SearchForm className="max-w-5xl mx-auto" />
        </div>
      </section>
      
      {/* Featured Destinations */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Featured Destinations
            </h2>
            <Link to="/search" className="text-primary-600 font-medium flex items-center hover:text-primary-700">
              View all destinations
              <ChevronRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination) => (
              <div key={destination.id} className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={`${destination.city}, ${destination.country}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{destination.city}</h3>
                    <p>{destination.country}</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-1" />
                      <span className="text-sm">June - August</span>
                    </div>
                    <p className="font-bold text-lg text-primary-600">
                      from ${destination.price}
                    </p>
                  </div>
                  <button className="w-full mt-3 btn btn-outline hover:text-primary-600 hover:border-primary-600">
                    Explore Deals
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Flight Deals */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Flight Deals
          </h2>
          
          {/* Deal Tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
            <button
              className={`px-4 py-2 font-medium ${
                activeDealTab === 'recommended'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
              onClick={() => setActiveDealTab('recommended')}
            >
              Recommended
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeDealTab === 'lastMinute'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
              onClick={() => setActiveDealTab('lastMinute')}
            >
              Last Minute
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeDealTab === 'weekend'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
              onClick={() => setActiveDealTab('weekend')}
            >
              Weekend Getaways
            </button>
          </div>
          
          {/* Deal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flightDeals[activeDealTab].map((deal) => (
              <div key={deal.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-500 mr-1" />
                      <p className="font-medium">{deal.from}</p>
                    </div>
                    <div className="text-gray-400">to</div>
                    <div className="flex items-center">
                      <p className="font-medium">{deal.to}</p>
                      <MapPin size={16} className="text-gray-500 ml-1" />
                    </div>
                  </div>
                  <div className="flex items-center mb-4 text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span className="text-sm">{deal.dates}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg text-primary-600">
                      ${deal.price}
                    </p>
                    <Link 
                      to={`/search?from=${deal.from}&to=${deal.to}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      View Deal
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Weather Forecast */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Weather at Popular Destinations
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {weatherForecast.map((weather, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
                <h3 className="font-bold mb-2">{weather.city}</h3>
                <div className="flex justify-center mb-2">
                  {weather.icon}
                </div>
                <p className="text-lg font-semibold">{weather.temp}</p>
                <p className="text-sm text-gray-600">{weather.condition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Why Choose SkyWay for Your Travel Needs
            </h2>
            <p className="text-gray-600">
              We make flight booking simple, transparent, and personalized to give you the best travel experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Search className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Advanced Search</h3>
              <p className="text-gray-600">
                Find the perfect flight with our powerful filters and intelligent sorting options.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Price Predictions</h3>
              <p className="text-gray-600">
                Our AI analyzes price trends to help you book at the optimal time for the best deals.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary-600"
                >
                  <path d="M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.95 1 4.8a.2.2 0 0 1-.176.293H2.1a.1.1 0 0 0-.1.1V15a1 1 0 0 0 1 1h1.1" />
                  <path d="M19.9 16.15a.1.1 0 0 1 .1.1v.65a.1.1 0 0 1-.1.1H14.2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h2.8a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-2.8a1 1 0 0 1-1-1V8" />
                  <path d="M19.9 8.1a.1.1 0 0 0 .1-.1v-.65a.1.1 0 0 0-.1-.1H14.2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2.8a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2.8a1 1 0 0 0-1 1v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">
                See exactly what you're paying for with detailed fare breakdowns and no hidden fees.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-12 md:py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated with Latest Deals
            </h2>
            <p className="mb-6 opacity-90">
              Subscribe to our newsletter and be the first to know about special offers and promotions.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition duration-200"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm mt-4 opacity-80">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
