
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plane, Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // In a real app, this would search or redirect to search results
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <Plane size={48} className="text-primary-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
          
          <p className="text-gray-600 mb-8">
            We're sorry, but the page you're looking for seems to have taken off without you. 
            It might have been moved, deleted, or it never existed in the first place.
          </p>
          
          <div className="mb-10">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search for something else..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <Link to="/" className="btn btn-primary flex items-center justify-center">
              <Home size={18} className="mr-2" />
              Return to Home
            </Link>
            <Link to="/search" className="btn btn-outline flex items-center justify-center">
              <ArrowLeft size={18} className="mr-2" />
              Back to Search
            </Link>
          </div>
          
          <div className="mt-10 border-t border-gray-200 pt-8 text-sm">
            <h3 className="font-medium mb-3">You might want to try:</h3>
            <ul className="text-gray-600 space-y-2">
              <li>â¢ Checking the URL for typos</li>
              <li>â¢ Going back to the previous page</li>
              <li>â¢ Starting fresh from our homepage</li>
              <li>â¢ Using the search function above</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
