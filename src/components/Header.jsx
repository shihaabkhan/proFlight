
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, UserCircle, Search, Plane, Clock, Phone, AlertCircle } from 'lucide-react'
import { useScrollPosition } from '../hooks/useScrollPosition'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  // Mock authenticated state - would come from auth store in a real app
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()
  const scrollPosition = useScrollPosition()

  useEffect(() => {
    if (scrollPosition > 10) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  }, [scrollPosition])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogin = () => {
    // This would actually authenticate in a real app
    setIsAuthenticated(true)
    setIsMenuOpen(false)
    navigate('/profile')
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary-600">
            <Plane size={28} />
            <span className="font-bold text-xl hidden md:block">SkyWay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/flight-status" className="font-medium hover:text-primary-600 transition-colors">Flight Status</Link>
            <Link to="/check-in" className="font-medium hover:text-primary-600 transition-colors">Check-in</Link>
            <Link to="/manage-booking" className="font-medium hover:text-primary-600 transition-colors">Manage Booking</Link>
            <Link to="/support" className="font-medium hover:text-primary-600 transition-colors">Support</Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                <UserCircle size={20} className="text-primary-600" />
                <span>My Account</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/register" className="font-medium hover:text-primary-600 transition-colors">Register</Link>
                <Link 
                  to="/login" 
                  className="py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link to="/" className="block py-2 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/flight-status" className="block py-2 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Flight Status
            </Link>
            <Link to="/check-in" className="block py-2 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Check-in
            </Link>
            <Link to="/manage-booking" className="block py-2 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Manage Booking
            </Link>
            <Link to="/support" className="block py-2 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Support
            </Link>
            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <Link to="/profile" className="block py-2 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  My Account
                </Link>
              ) : (
                <div className="space-y-4">
                  <Link to="/register" className="block py-2 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                  <Link to="/login" className="block py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
