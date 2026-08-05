import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flightService } from '../api/flight.service';
import { Flight } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowLeft, Users, Briefcase, Check } from 'lucide-react';
import { toast } from 'sonner';

const FlightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Seat Map State
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  // We'll generate a random subset of occupied seats based on flight.availableSeats / totalSeats
  const [occupiedSeats, setOccupiedSeats] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await flightService.getFlightById(Number(id));
        setFlight(res.data);
        
        // Deterministically mock occupied seats for realism based on flight ID
        const occupiedCount = res.data.totalSeats - res.data.availableSeats;
        const fakeOccupied = new Set<string>();
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        const rowsCount = Math.ceil(res.data.totalSeats / 6);
        
        // Pseudo-randomly pick seats
        for (let i = 0; i < occupiedCount; i++) {
          const row = (Math.floor(Math.abs(Math.sin(res.data.id * i) * rowsCount)) % rowsCount) + 1;
          const letter = letters[i % 6];
          fakeOccupied.add(`${row}${letter}`);
        }
        setOccupiedSeats(fakeOccupied);
        
        // Auto-select first available seat if none selected
        if (selectedSeats.length === 0) {
          // Find first available
          for (let r = 1; r <= rowsCount; r++) {
            for (let l of letters) {
              if (!fakeOccupied.has(`${r}${l}`)) {
                setSelectedSeats([`${r}${l}`]);
                return;
              }
            }
          }
        }
        
      } catch (err) {
        toast.error("Failed to load flight details");
        navigate('/flights');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchFlight();
  }, [id, navigate]);

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.has(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      if (selectedSeats.length === 1) {
        toast.error("You must select at least one seat.");
        return;
      }
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleContinue = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info("Please login to continue booking");
      navigate('/login');
      return;
    }
    
    // Pass seatsBooked (length of selectedSeats) to checkout. 
    // Backend just expects a number.
    navigate('/checkout', { state: { flightId: flight?.id, seatsBooked: selectedSeats.length } });
  };

  if (isLoading) return <div className="min-h-[60vh] flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div></div>;
  if (!flight) return null;

  const totalFare = flight.price * selectedSeats.length;
  const rowsCount = Math.ceil(flight.totalSeats / 6);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-sky-600 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Review your flight & Select Seats</h1>
            
            <Card className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{flight.source} to {flight.destination}</h3>
                  <p className="text-gray-500">{new Date(flight.departureTime).toLocaleDateString()}</p>
                </div>
                <div className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium border border-sky-200">
                  {flight.airline}
                </div>
              </div>

              <div className="relative border-l-2 border-gray-200 ml-4 pl-6 pb-8">
                <div className="absolute w-3 h-3 bg-gray-400 rounded-full -left-[7px] top-1 border-2 border-white"></div>
                <div className="text-lg font-bold">{new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="text-gray-600">{flight.source}</div>
              </div>
              <div className="relative border-l-2 border-transparent ml-4 pl-6">
                <div className="absolute w-3 h-3 bg-sky-500 rounded-full -left-[7px] top-1 border-2 border-white"></div>
                <div className="text-lg font-bold">{new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="text-gray-600">{flight.destination}</div>
              </div>
            </Card>

            {/* Inline Interactive Seat Map */}
            <Card className="p-0 overflow-hidden border-2 border-sky-100">
              <div className="bg-sky-50 p-4 border-b border-sky-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Interactive Seat Map</h3>
                  <p className="text-sm text-gray-500">Click on available seats to select them</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Unavailable</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-3 border-2 border-gray-200 rounded-sm"></div> Available</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-3 bg-sky-500 rounded-sm"></div> Selected</div>
                </div>
              </div>
              
              <div className="py-8 bg-white relative">
                {/* Plane Nose Graphic */}
                <div className="flex justify-center mb-6">
                  <div className="w-64 h-24 bg-gray-100 rounded-t-full border-t-4 border-x-4 border-gray-200 relative overflow-hidden flex flex-col items-center justify-end pb-2">
                    <div className="w-24 h-10 bg-sky-100 rounded-full mb-3 opacity-50 blur-sm"></div>
                    <p className="text-xs text-gray-400 font-bold tracking-widest">FRONT OF CABIN</p>
                  </div>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto px-4 pb-10">
                  <div className="w-64 mx-auto space-y-3 relative">
                    {/* Airplane Body Background */}
                    <div className="absolute inset-0 bg-gray-50 border-x-4 border-gray-200 -mx-4 rounded-b-[40px] -z-10 shadow-inner"></div>
                    
                    {Array.from({ length: Math.min(rowsCount, 20) }).map((_, rIndex) => {
                      const rowNum = rIndex + 1;
                      return (
                        <div key={rowNum} className="flex justify-between items-center px-4 relative z-10 pt-2">
                          <div className="flex gap-2">
                            {['A', 'B', 'C'].map(letter => {
                              const seatId = `${rowNum}${letter}`;
                              const isOccupied = occupiedSeats.has(seatId);
                              const isSelected = selectedSeats.includes(seatId);
                              
                              return (
                                <button
                                  key={seatId}
                                  disabled={isOccupied}
                                  onClick={() => toggleSeat(seatId)}
                                  className={`w-10 h-10 rounded-t-xl rounded-b-md flex items-center justify-center text-sm font-bold transition-all relative overflow-hidden
                                    ${isOccupied ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                                      isSelected ? 'bg-sky-500 text-white shadow-md transform -translate-y-1' : 
                                      'bg-white text-gray-600 border-2 border-gray-200 hover:border-sky-400 hover:text-sky-600 hover:-translate-y-0.5 shadow-sm'
                                    }
                                  `}
                                  title={seatId}
                                >
                                  {isSelected ? <Check size={16} strokeWidth={3} /> : letter}
                                  {isSelected && <div className="absolute bottom-0 w-full h-1.5 bg-sky-700"></div>}
                                  {!isSelected && !isOccupied && <div className="absolute bottom-0 w-full h-1.5 bg-gray-100"></div>}
                                </button>
                              );
                            })}
                          </div>
                          
                          <div className="w-8 text-center text-sm font-bold text-gray-300">
                            {rowNum}
                          </div>
                          
                          <div className="flex gap-2">
                            {['D', 'E', 'F'].map(letter => {
                              const seatId = `${rowNum}${letter}`;
                              const isOccupied = occupiedSeats.has(seatId);
                              const isSelected = selectedSeats.includes(seatId);
                              
                              return (
                                <button
                                  key={seatId}
                                  disabled={isOccupied}
                                  onClick={() => toggleSeat(seatId)}
                                  className={`w-10 h-10 rounded-t-xl rounded-b-md flex items-center justify-center text-sm font-bold transition-all relative overflow-hidden
                                    ${isOccupied ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                                      isSelected ? 'bg-sky-500 text-white shadow-md transform -translate-y-1' : 
                                      'bg-white text-gray-600 border-2 border-gray-200 hover:border-sky-400 hover:text-sky-600 hover:-translate-y-0.5 shadow-sm'
                                    }
                                  `}
                                  title={seatId}
                                >
                                  {isSelected ? <Check size={16} strokeWidth={3} /> : letter}
                                  {isSelected && <div className="absolute bottom-0 w-full h-1.5 bg-sky-700"></div>}
                                  {!isSelected && !isOccupied && <div className="absolute bottom-0 w-full h-1.5 bg-gray-100"></div>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Fare Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Users size={16} className="text-sky-500"/> Selected Seats
                  </span>
                  <span className="text-sm font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-md">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                  </span>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between text-gray-600 mb-3">
                    <span>Base Fare (x{selectedSeats.length})</span>
                    <span>₹{totalFare.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 mb-4">
                    <span>Taxes & Fees</span>
                    <span className="text-green-600 font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold text-gray-900 border-t border-dashed border-gray-300 pt-4 mt-2">
                    <span>Total Amount</span>
                    <span className="text-sky-600">₹{totalFare.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full shadow-md shadow-sky-500/20 hover:-translate-y-0.5 transition-transform" onClick={handleContinue}>
                Continue to Payment
              </Button>
            </Card>
            
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-sky-500"/> Baggage Allowance
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex justify-between pb-4 border-b border-gray-50"><span>Cabin baggage</span> <span className="font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded">7 kg</span></li>
                <li className="flex justify-between"><span>Check-in baggage</span> <span className="font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded">15 kg</span></li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
