import React, { useState, useEffect } from 'react';
import { flightService } from '../api/flightService';
import { Flight } from '../types';
import FlightCard from '../components/FlightCard';
import { Search, MapPin, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FlightSearch: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [searched, setSearched] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Optionally fetch all flights on load
    const fetchAllFlights = async () => {
      setLoading(true);
      try {
        const res = await flightService.getAllFlights();
        if (res && res.data) {
          setFlights(res.data);
        }
      } catch (error) {
        console.error("Failed to load flights", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllFlights();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    
    // Convert date string to LocalDateTime format string expected by backend if needed,
    // or just pass as is if the backend parses it. We might need to append time.
    let dateStr = date ? `${date}T00:00:00` : null;

    try {
      const res = await flightService.searchFlights({
        origin: origin || null,
        destination: destination || null,
        date: dateStr
      });
      if (res && res.data) {
        setFlights(res.data);
      }
    } catch (error) {
      console.error("Search failed", error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight: Flight) => {
    if (!user) {
      navigate('/login');
      return;
    }
    // In a real app, this would open a booking modal or navigate to a booking page
    alert(`Booking flight ${flight.flightNumber} to ${flight.destination}`);
    // Navigate to a dedicated booking page later
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <MapPin size={20} />
              </div>
              <input
                type="text"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                placeholder="Origin"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
              />
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <MapPin size={20} />
              </div>
              <input
                type="text"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="Destination"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
              />
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Calendar size={20} />
              </div>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <Search size={20} />
              <span className="hidden md:inline">Search</span>
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searched ? 'Search Results' : 'Available Flights'}
          </h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p className="font-medium">Finding the best flights...</p>
            </div>
          ) : flights.length > 0 ? (
            <div className="space-y-6">
              {flights.map(flight => (
                <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <div className="w-16 h-16 mx-auto bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No flights found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FlightSearch;
