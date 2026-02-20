
import { useState } from 'react'
import { User, CreditCard, MapPin, Clock, Shield, LogOut, Edit, Trash, Check, X, Calendar, Plane, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (123) 456-7890',
    dateOfBirth: '1985-05-15',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    country: 'United States',
    postalCode: '10001',
    preferredAirlines: ['American Airlines', 'Delta Air Lines'],
    seatPreference: 'Window',
    mealPreference: 'Regular',
    travelClass: 'Economy',
    frequentFlyerNumber: 'AA1234567'
  })
  
  // Mock data for payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'Credit Card',
      name: 'Visa ending in 4242',
      expiryDate: '05/2025',
      isDefault: true
    },
    {
      id: 2,
      type: 'Credit Card',
      name: 'Mastercard ending in 8888',
      expiryDate: '08/2024',
      isDefault: false
    }
  ])
  
  // Mock data for past trips
  const [pastTrips, setPastTrips] = useState([
    {
      id: 'BK123456',
      origin: 'JFK',
      originCity: 'New York',
      destination: 'LAX',
      destinationCity: 'Los Angeles',
      departureDate: '2023-03-15T08:30:00',
      returnDate: '2023-03-22T14:45:00',
      airline: 'American Airlines',
      status: 'Completed',
      price: 456.78
    },
    {
      id: 'BK654321',
      origin: 'SFO',
      originCity: 'San Francisco',
      destination: 'ORD',
      destinationCity: 'Chicago',
      departureDate: '2023-01-10T10:15:00',
      returnDate: '2023-01-17T18:30:00',
      airline: 'United Airlines',
      status: 'Completed',
      price: 325.45
    }
  ])
  
  // Mock data for upcoming trips
  const [upcomingTrips, setUpcomingTrips] = useState([
    {
      id: 'BK789012',
      origin: 'LAX',
      originCity: 'Los Angeles',
      destination: 'MIA',
      destinationCity: 'Miami',
      departureDate: '2023-07-20T11:45:00',
      returnDate: '2023-07-27T15:30:00',
      airline: 'Delta Air Lines',
      status: 'Confirmed',
      price: 512.33
    }
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserInfo({
      ...userInfo,
      [name]: value
    })
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    // If canceling edit, reset to original values
    if (isEditing) {
      // Would typically fetch from API in a real app
    }
  }

  const handleSaveProfile = () => {
    // Would typically save to API in a real app
    setIsEditing(false)
  }

  const handleSetDefaultPayment = (id) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    )
  }

  const handleRemovePayment = (id) => {
    setPaymentMethods(
      paymentMethods.filter(method => method.id !== id)
    )
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Account</h1>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                    <User size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{userInfo.firstName} {userInfo.lastName}</h2>
                    <p className="text-gray-600">{userInfo.email}</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <button
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${
                      activeTab === 'personal' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('personal')}
                  >
                    <User size={18} className="mr-3" />
                    Personal Information
                  </button>
                  
                  <button
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${
                      activeTab === 'payment' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('payment')}
                  >
                    <CreditCard size={18} className="mr-3" />
                    Payment Methods
                  </button>
                  
                  <button
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${
                      activeTab === 'trips' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('trips')}
                  >
                    <Plane size={18} className="mr-3" />
                    My Trips
                  </button>
                  
                  <button
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${
                      activeTab === 'preferences' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('preferences')}
                  >
                    <Briefcase size={18} className="mr-3" />
                    Travel Preferences
                  </button>
                  
                  <button
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${
                      activeTab === 'security' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('security')}
                  >
                    <Shield size={18} className="mr-3" />
                    Security
                  </button>
                </nav>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full flex items-center px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50">
                    <LogOut size={18} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Shield size={16} className="text-blue-600 mr-2" />
                  Account Protection
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Enable two-factor authentication to add an extra layer of security to your account.
                </p>
                <button className="text-blue-700 text-sm font-medium hover:underline">
                  Enable Now
                </button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {/* Personal Information */}
              {activeTab === 'personal' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    <button
                      className="flex items-center text-primary-600 hover:text-primary-700"
                      onClick={handleEditToggle}
                    >
                      {isEditing ? (
                        <>
                          <X size={18} className="mr-1" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit size={18} className="mr-1" />
                          Edit
                        </>
                      )}
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={userInfo.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={userInfo.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={userInfo.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={userInfo.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={userInfo.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={userInfo.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={userInfo.country}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={userInfo.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSaveProfile}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Full Name</p>
                          <p className="font-medium">{userInfo.firstName} {userInfo.lastName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                          <p className="font-medium">{new Date(userInfo.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          <p className="font-medium">{userInfo.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Phone</p>
                          <p className="font-medium">{userInfo.phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Address</p>
                        <p className="font-medium">{userInfo.address}</p>
                        <p className="font-medium">
                          {userInfo.city}, {userInfo.country} {userInfo.postalCode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Payment Methods */}
              {activeTab === 'payment' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Payment Methods</h2>
                    <button className="btn btn-outline flex items-center">
                      <CreditCard size={16} className="mr-2" />
                      Add New Card
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div 
                        key={method.id} 
                        className={`p-4 border rounded-lg ${
                          method.isDefault ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                              <CreditCard size={20} />
                            </div>
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-gray-600">Expires {method.expiryDate}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {method.isDefault ? (
                              <span className="text-sm text-primary-600 bg-primary-100 px-2 py-1 rounded mr-3">
                                Default
                              </span>
                            ) : (
                              <button 
                                className="text-sm text-gray-600 hover:text-primary-600 mr-3"
                                onClick={() => handleSetDefaultPayment(method.id)}
                              >
                                Set as Default
                              </button>
                            )}
                            
                            <button
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleRemovePayment(method.id)}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* My Trips */}
              {activeTab === 'trips' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-6">Upcoming Trips</h2>
                    
                    {upcomingTrips.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                          <Calendar size={24} />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No upcoming trips</h3>
                        <p className="text-gray-600 mb-4">
                          Time to plan your next adventure!
                        </p>
                        <Link to="/" className="btn btn-primary">
                          Book a Flight
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingTrips.map((trip) => (
                          <div key={trip.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between mb-4">
                              <div>
                                <p className="text-sm text-gray-500">Booking Reference</p>
                                <p className="font-medium">{trip.id}</p>
                              </div>
                              <div>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                  {trip.status}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-center">
                                <p className="text-lg font-bold">{trip.origin}</p>
                                <p className="text-sm text-gray-600">{trip.originCity}</p>
                              </div>
                              
                              <div className="flex-grow mx-4">
                                <div className="relative w-full h-0.5 bg-gray-200 my-2">
                                  <div className="absolute left-0 right-0 top-1/2 border-b border-gray-300 border-dashed"></div>
                                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                                </div>
                                <p className="text-xs text-center">{trip.airline}</p>
                              </div>
                              
                              <div className="text-center">
                                <p className="text-lg font-bold">{trip.destination}</p>
                                <p className="text-sm text-gray-600">{trip.destinationCity}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                              <div>
                                <p className="text-gray-500">Departure</p>
                                <p className="font-medium">{formatDate(trip.departureDate)}</p>
                                <p className="text-gray-500">{formatTime(trip.departureDate)}</p>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-gray-500">Return</p>
                                <p className="font-medium">{formatDate(trip.returnDate)}</p>
                                <p className="text-gray-500">{formatTime(trip.returnDate)}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                              <p className="font-bold text-primary-600">${trip.price.toFixed(2)}</p>
                              
                              <div className="flex space-x-2">
                                <Link 
                                  to={`/check-in`} 
                                  className="btn btn-primary py-1 px-3 text-sm"
                                >
                                  Check-in
                                </Link>
                                <Link 
                                  to={`/manage-booking`} 
                                  className="btn btn-outline py-1 px-3 text-sm"
                                >
                                  Manage
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-6">Past Trips</h2>
                    
                    {pastTrips.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                          <Clock size={24} />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No past trips</h3>
                        <p className="text-gray-600">
                          Your travel history will appear here once you've completed a trip.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pastTrips.map((trip) => (
                          <div key={trip.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between mb-4">
                              <div>
                                <p className="text-sm text-gray-500">Booking Reference</p>
                                <p className="font-medium">{trip.id}</p>
                              </div>
                              <div>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                  {trip.status}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-center">
                                <p className="text-lg font-bold">{trip.origin}</p>
                                <p className="text-sm text-gray-600">{trip.originCity}</p>
                              </div>
                              
                              <div className="flex-grow mx-4">
                                <div className="relative w-full h-0.5 bg-gray-200 my-2">
                                  <div className="absolute left-0 right-0 top-1/2 border-b border-gray-300 border-dashed"></div>
                                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full"></div>
                                </div>
                                <p className="text-xs text-center">{trip.airline}</p>
                              </div>
                              
                              <div className="text-center">
                                <p className="text-lg font-bold">{trip.destination}</p>
                                <p className="text-sm text-gray-600">{trip.destinationCity}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                              <div>
                                <p className="text-gray-500">Departure</p>
                                <p className="font-medium">{formatDate(trip.departureDate)}</p>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-gray-500">Return</p>
                                <p className="font-medium">{formatDate(trip.returnDate)}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                              <p className="font-medium">${trip.price.toFixed(2)}</p>
                              
                              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                Book Again
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Travel Preferences */}
              {activeTab === 'preferences' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Travel Preferences</h2>
                    <button
                      className="flex items-center text-primary-600 hover:text-primary-700"
                      onClick={handleEditToggle}
                    >
                      {isEditing ? (
                        <>
                          <X size={18} className="mr-1" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit size={18} className="mr-1" />
                          Edit
                        </>
                      )}
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="seatPreference" className="block text-sm font-medium text-gray-700 mb-1">
                            Seat Preference
                          </label>
                          <select
                            id="seatPreference"
                            name="seatPreference"
                            value={userInfo.seatPreference}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="Window">Window</option>
                            <option value="Aisle">Aisle</option>
                            <option value="Middle">Middle</option>
                            <option value="No Preference">No Preference</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="mealPreference" className="block text-sm font-medium text-gray-700 mb-1">
                            Meal Preference
                          </label>
                          <select
                            id="mealPreference"
                            name="mealPreference"
                            value={userInfo.mealPreference}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="Regular">Regular</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Kosher">Kosher</option>
                            <option value="Halal">Halal</option>
                            <option value="Gluten-free">Gluten-free</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="travelClass" className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Travel Class
                          </label>
                          <select
                            id="travelClass"
                            name="travelClass"
                            value={userInfo.travelClass}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="Economy">Economy</option>
                            <option value="Premium Economy">Premium Economy</option>
                            <option value="Business">Business</option>
                            <option value="First">First</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="frequentFlyerNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Frequent Flyer Number
                          </label>
                          <input
                            type="text"
                            id="frequentFlyerNumber"
                            name="frequentFlyerNumber"
                            value={userInfo.frequentFlyerNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSaveProfile}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Seat Preference</p>
                          <p className="font-medium">{userInfo.seatPreference}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Meal Preference</p>
                          <p className="font-medium">{userInfo.mealPreference}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Preferred Travel Class</p>
                          <p className="font-medium">{userInfo.travelClass}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Frequent Flyer Number</p>
                          <p className="font-medium">{userInfo.frequentFlyerNumber}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Preferred Airlines</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {userInfo.preferredAirlines.map((airline, index) => (
                            <span 
                              key={index}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {airline}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Security */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium">Change Password</h3>
                          <p className="text-sm text-gray-600">Update your password regularly to keep your account secure</p>
                        </div>
                        <button className="btn btn-outline">
                          Change
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <button className="btn btn-outline">
                          Enable
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium">Login History</h3>
                          <p className="text-sm text-gray-600">View your recent login activity</p>
                        </div>
                        <button className="btn btn-outline">
                          View
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium text-red-600">Delete Account</h3>
                          <p className="text-sm text-gray-600">Permanently delete your account and all associated data</p>
                        </div>
                        <button className="btn text-red-600 border-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
