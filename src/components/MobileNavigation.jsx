
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Plane, User, HelpCircle } from 'lucide-react'

const MobileNavigation = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('/')

  useEffect(() => {
    const path = location.pathname
    if (path === '/') setActiveTab('/')
    else if (path.includes('/search')) setActiveTab('/search')
    else if (path.includes('/flight-status') || path.includes('/check-in') || path.includes('/manage-booking')) 
      setActiveTab('/flight-status')
    else if (path.includes('/profile') || path.includes('/login') || path.includes('/register')) 
      setActiveTab('/profile')
    else if (path.includes('/support')) setActiveTab('/support')
  }, [location])

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around">
        <NavItem 
          to="/" 
          icon={<Home size={20} />} 
          label="Home" 
          isActive={activeTab === '/'} 
        />
        <NavItem 
          to="/search" 
          icon={<Search size={20} />} 
          label="Search" 
          isActive={activeTab === '/search'} 
        />
        <NavItem 
          to="/flight-status" 
          icon={<Plane size={20} />} 
          label="Flights" 
          isActive={activeTab === '/flight-status'} 
        />
        <NavItem 
          to="/profile" 
          icon={<User size={20} />} 
          label="Profile" 
          isActive={activeTab === '/profile'} 
        />
        <NavItem 
          to="/support" 
          icon={<HelpCircle size={20} />} 
          label="Support" 
          isActive={activeTab === '/support'} 
        />
      </div>
    </nav>
  )
}

const NavItem = ({ to, icon, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center py-2 w-full ${
        isActive ? 'text-primary-600' : 'text-gray-500'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  )
}

export default MobileNavigation
