
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ChatBot from './ChatBot'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import MobileNavigation from './MobileNavigation'

const Layout = () => {
  const [showChatBot, setShowChatBot] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const location = useLocation()

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      
      {showChatBot && (
        <ChatBot onClose={() => setShowChatBot(false)} />
      )}
      
      <button 
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition duration-300 z-40"
        aria-label="Open FlightBot assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </button>
      
      {isMobile && <MobileNavigation />}
    </div>
  )
}

export default Layout
