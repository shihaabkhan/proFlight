
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SearchResults from './pages/SearchResults'
import FlightDetails from './pages/FlightDetails'
import Booking from './pages/Booking'
import Confirmation from './pages/Confirmation'
import UserProfile from './pages/UserProfile'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import FlightStatus from './pages/FlightStatus'
import CheckIn from './pages/CheckIn'
import ManageBooking from './pages/ManageBooking'
import Support from './pages/Support'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="flight/:id" element={<FlightDetails />} />
        <Route path="booking/:id" element={<Booking />} />
        <Route path="confirmation/:id" element={<Confirmation />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="flight-status" element={<FlightStatus />} />
        <Route path="check-in" element={<CheckIn />} />
        <Route path="manage-booking" element={<ManageBooking />} />
        <Route path="support" element={<Support />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
