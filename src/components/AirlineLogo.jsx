
import { Plane } from 'lucide-react'

const AirlineLogo = ({ airline, size = 'md' }) => {
  // Map to store airline logos (in a real app, these would be imported images)
  const logoMap = {
    'American Airlines': 'AA',
    'Delta Air Lines': 'DL',
    'United Airlines': 'UA',
    'Southwest Airlines': 'WN',
    'JetBlue Airways': 'B6',
    'British Airways': 'BA',
    'Lufthansa': 'LH',
    'Air France': 'AF',
    'Emirates': 'EK',
    'Singapore Airlines': 'SQ',
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }
  
  // Get airline code or default to first two letters of airline name
  const code = logoMap[airline] || airline.substring(0, 2).toUpperCase()
  
  // Color based on airline name hash (just for demo purposes)
  const getColorFromAirlineName = (name) => {
    const colors = [
      'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500',
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ]
    
    // Simple hash function to get consistent color for same airline
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${getColorFromAirlineName(airline)} text-white font-bold`}>
      {code}
    </div>
  )
}

export default AirlineLogo
