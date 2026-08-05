import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FlightListing from './pages/FlightListing';
import FlightDetails from './pages/FlightDetails';
import About from './pages/About';

// Protected Customer Pages
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import BookingFlow from './pages/BookingFlow';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageFlights from './pages/admin/ManageFlights';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBookings from './pages/admin/ManageBookings';
import { SplashScreen } from './components/ui/SplashScreen';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <SplashScreen>
        <Toaster position="top-right" richColors />
        <Routes>
        {/* Public Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="flights" element={<FlightListing />} />
          <Route path="flights/:id" element={<FlightDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Customer Routes */}
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="checkout" element={
            <ProtectedRoute>
              <BookingFlow />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="flights" element={<ManageFlights />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="bookings" element={<ManageBookings />} />
        </Route>
      </Routes>
      </SplashScreen>
    </BrowserRouter>
  );
}

export default App;
