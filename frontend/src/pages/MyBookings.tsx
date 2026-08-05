import React, { useEffect, useState } from 'react';
import { bookingService } from '../api/booking.service';
import { flightService } from '../api/flight.service';
import { userService } from '../api/user.service';
import { Booking, Flight, User } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Plane, Calendar, QrCode } from 'lucide-react';
import { toast } from 'sonner';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [flightsMap, setFlightsMap] = useState<Map<number, Flight>>(new Map());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Boarding Pass state
  const [selectedPass, setSelectedPass] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        if (!token || !email) return;

        const usersRes = await userService.getAllUsers();
        const currentUser = usersRes.data.find(u => u.email === email);
        const userId = currentUser ? currentUser.id : 1;
        
        setUser(currentUser || null);

        const [bookingsRes, flightsRes] = await Promise.all([
          bookingService.getBookingsByUser(userId),
          flightService.getAllFlights()
        ]);
        
        setBookings(bookingsRes.data);
        
        const fMap = new Map(flightsRes.data.map(f => [f.id, f]));
        setFlightsMap(fMap);
        
      } catch (err) {
        toast.error("Failed to load your bookings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancelBooking = async (id: number) => {
    try {
      await bookingService.cancelBooking(id);
      toast.success("Booking cancelled successfully");
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Cancellation failed");
    }
  };

  // Deterministically generate fake seat numbers based on booking ID
  const getFakeSeats = (bookingId: number, count: number) => {
    const rows = [12, 14, 15, 22, 28, 30];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const row = rows[bookingId % rows.length];
    
    return Array.from({ length: count }).map((_, i) => {
      const char = letters[(bookingId + i) % letters.length];
      return `${row}${char}`;
    }).join(', ');
  };

  if (isLoading) return <div className="min-h-screen flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-sky-600 rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h2>
        
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <Card className="p-16 text-center text-gray-500">
              <Plane className="mx-auto h-16 w-16 mb-4 opacity-40 text-sky-500" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
              <p>You haven't made any flight reservations yet.</p>
              <Button className="mt-6" onClick={() => window.location.href = '/flights'}>
                Explore Flights
              </Button>
            </Card>
          ) : (
            bookings.map(booking => {
              const flight = flightsMap.get(booking.flightId);
              
              return (
                <Card key={booking.id} className="p-6 hover:shadow-md transition-shadow border border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                        <span className="text-gray-500 text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">Ref: #{booking.id}</span>
                      </div>
                      
                      {flight ? (
                        <div className="mt-4 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{flight.source} → {flight.destination}</h3>
                          <p className="text-sm text-gray-500 mt-1">{flight.airline} • {flight.flightNumber}</p>
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <Plane size={20} className="text-sky-500" /> Flight ID: {booking.flightId}
                        </div>
                      )}
                      
                      <div className="text-gray-600 flex items-center gap-2 mt-4 text-sm">
                        <Calendar size={16} className="text-gray-400" /> 
                        Booked: {new Date(booking.bookingTime).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 md:pl-6 md:border-l border-gray-100 min-w-[200px]">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Total Fare</div>
                        <div className="text-3xl font-extrabold text-sky-600">₹{booking.totalFare.toLocaleString()}</div>
                        <div className="text-sm text-gray-500 mt-1">{booking.seatsBooked} Seat(s)</div>
                      </div>
                      
                      <div className="flex flex-col gap-2 mt-6 w-full">
                        {booking.status === 'CONFIRMED' && flight && (
                          <Button 
                            className="w-full"
                            onClick={() => setSelectedPass(booking)}
                          >
                            View Boarding Pass
                          </Button>
                        )}
                        {booking.status === 'CONFIRMED' && (
                          <Button 
                            variant="danger" 
                            className="w-full"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Boarding Pass Modal */}
      <Modal
        isOpen={!!selectedPass}
        onClose={() => setSelectedPass(null)}
        title=""
        maxWidth="max-w-3xl"
      >
        {selectedPass && flightsMap.get(selectedPass.flightId) && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Top Color Bar */}
            <div className="bg-sky-600 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Plane size={28} className="rotate-45" />
                <span className="text-xl font-bold tracking-wider">SkyLink Pass</span>
              </div>
              <div className="text-right">
                <p className="text-sky-100 text-sm">FLIGHT</p>
                <p className="text-xl font-bold">{flightsMap.get(selectedPass.flightId)?.flightNumber}</p>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="p-8 flex flex-col md:flex-row gap-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              
              {/* Left Side details */}
              <div className="flex-1 space-y-8">
                
                {/* Passenger & Seats */}
                <div className="flex justify-between border-b border-dashed border-gray-300 pb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Passenger</p>
                    <p className="text-xl font-bold text-gray-900">{user?.fullName || 'Traveler'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Seats</p>
                    <p className="text-xl font-bold text-sky-600">
                      {getFakeSeats(selectedPass.id, selectedPass.seatsBooked)}
                    </p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-5xl font-black text-gray-900 mb-1">{flightsMap.get(selectedPass.flightId)?.source.slice(0,3).toUpperCase()}</h2>
                    <p className="text-sm text-gray-500 font-medium capitalize">{flightsMap.get(selectedPass.flightId)?.source.toLowerCase()}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {new Date(flightsMap.get(selectedPass.flightId)!.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center px-4 relative">
                    <div className="w-full h-px border-t-2 border-dashed border-gray-300 relative top-3 z-0"></div>
                    <Plane size={24} className="text-sky-500 relative z-10 bg-gray-50 p-1 rounded-full rotate-90" />
                    <p className="text-xs text-gray-400 mt-4 text-center">DIRECT</p>
                  </div>
                  
                  <div className="text-right">
                    <h2 className="text-5xl font-black text-gray-900 mb-1">{flightsMap.get(selectedPass.flightId)?.destination.slice(0,3).toUpperCase()}</h2>
                    <p className="text-sm text-gray-500 font-medium capitalize">{flightsMap.get(selectedPass.flightId)?.destination.toLowerCase()}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {new Date(flightsMap.get(selectedPass.flightId)!.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-dashed border-gray-300">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                    <p className="font-bold text-gray-900">
                      {new Date(flightsMap.get(selectedPass.flightId)!.departureTime).toLocaleDateString([], {day: 'numeric', month: 'short'})}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Gate</p>
                    <p className="font-bold text-gray-900">T2-{(selectedPass.flightId % 10) + 1}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Boarding</p>
                    <p className="font-bold text-red-600">
                      {new Date(new Date(flightsMap.get(selectedPass.flightId)!.departureTime).getTime() - 45*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side Barcode (Desktop only visual) */}
              <div className="hidden md:flex flex-col items-center justify-center border-l-2 border-dashed border-gray-300 pl-8 ml-2">
                <QrCode size={160} className="text-gray-800" strokeWidth={1} />
                <p className="text-xs font-mono text-gray-500 mt-4 tracking-widest">{selectedPass.id}X{flightsMap.get(selectedPass.flightId)?.flightNumber}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 text-center border-t border-gray-200 text-xs text-gray-500">
              Please present this digital pass at the boarding gate at least 45 minutes before departure.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyBookings;
