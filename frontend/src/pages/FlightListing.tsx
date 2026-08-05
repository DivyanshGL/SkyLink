import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { flightService } from '../api/flight.service';
import { Flight } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Plane, Clock, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

const FlightListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('price_asc');
  
  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setIsLoading(true);
        let res;
        if (source && destination && date) {
          res = await flightService.searchFlights({ source, destination, travelDate: date });
        } else {
          res = await flightService.getAllFlights();
        }
        
        // Ensure we only show SCHEDULED or DELAYED flights, not CANCELLED
        const validFlights = res.data.filter((f: Flight) => f.status !== 'CANCELLED');
        setFlights(validFlights);
        
        // Initialize max price filter dynamically based on data
        if (validFlights.length > 0) {
          const maxFlightPrice = Math.max(...validFlights.map((f: Flight) => f.price));
          setMaxPrice(maxFlightPrice);
        }
        
      } catch (err: any) {
        toast.error("Failed to load flights.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlights();
  }, [source, destination, date]);

  // Derived filter options
  const uniqueAirlines = useMemo(() => {
    return Array.from(new Set(flights.map(f => f.airline))).sort();
  }, [flights]);
  
  const absoluteMaxPrice = useMemo(() => {
    return flights.length > 0 ? Math.max(...flights.map(f => f.price)) : 100000;
  }, [flights]);
  
  const absoluteMinPrice = useMemo(() => {
    return flights.length > 0 ? Math.min(...flights.map(f => f.price)) : 0;
  }, [flights]);

  // Apply Filters & Sorting
  const filteredAndSortedFlights = useMemo(() => {
    return flights
      .filter(f => {
        // Price Filter
        if (f.price > maxPrice) return false;
        
        // Airline Filter
        if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airline)) return false;
        
        return true;
      })
      .sort((a, b) => {
        // Sorting
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'time_asc') return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
        if (sortBy === 'time_desc') return new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime();
        return 0;
      });
  }, [flights, maxPrice, selectedAirlines, sortBy]);

  const toggleAirline = (airline: string) => {
    if (selectedAirlines.includes(airline)) {
      setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
    } else {
      setSelectedAirlines([...selectedAirlines, airline]);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Summary Header */}
        <div className="bg-sky-600 text-white rounded-xl p-6 mb-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-3">
              {source ? source.toUpperCase() : 'ALL ROUTES'} <Plane className="opacity-70" /> {destination ? destination.toUpperCase() : 'ANYWHERE'}
            </h1>
            <p className="text-sky-100 mt-1">
              {date ? new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'All upcoming flights'}
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/')} className="bg-white text-sky-700 hover:bg-sky-50 shadow-sm w-full md:w-auto">
            <Search size={18} className="mr-2" /> Modify Search
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-72 space-y-6 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Filter size={18} className="text-sky-500" /> Filters
                </h3>
                {(selectedAirlines.length > 0 || maxPrice < absoluteMaxPrice) && (
                  <button 
                    onClick={() => {
                      setSelectedAirlines([]);
                      setMaxPrice(absoluteMaxPrice);
                    }}
                    className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="space-y-8">
                {/* Sort By Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h4>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2.5"
                  >
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="time_asc">Departure: Earliest</option>
                    <option value="time_desc">Departure: Latest</option>
                  </select>
                </div>
                
                <hr className="border-gray-100" />

                {/* Price Filter */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">Max Price</h4>
                    <span className="text-sm font-bold text-sky-600">₹{maxPrice.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min={absoluteMinPrice}
                    max={absoluteMaxPrice}
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-sky-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                    disabled={flights.length === 0}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                    <span>₹{absoluteMinPrice.toLocaleString()}</span>
                    <span>₹{absoluteMaxPrice.toLocaleString()}</span>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Airlines Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Airlines</h4>
                  {flights.length === 0 ? (
                    <p className="text-sm text-gray-400">No airlines available</p>
                  ) : (
                    <div className="space-y-2">
                      {uniqueAirlines.map(airline => (
                        <label key={airline} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center">
                            <input 
                              type="checkbox" 
                              checked={selectedAirlines.includes(airline)}
                              onChange={() => toggleAirline(airline)}
                              className="w-4 h-4 border-2 border-gray-300 rounded text-sky-600 focus:ring-sky-500 transition-colors cursor-pointer" 
                            />
                          </div>
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">{airline}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600 mx-auto mb-4"></div>
                Searching for best flights...
              </div>
            ) : filteredAndSortedFlights.length === 0 ? (
              <div className="bg-white p-12 rounded-xl text-center border border-gray-200 shadow-sm flex flex-col items-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Plane className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No flights found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria.</p>
                {(selectedAirlines.length > 0 || maxPrice < absoluteMaxPrice) && (
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => {
                      setSelectedAirlines([]);
                      setMaxPrice(absoluteMaxPrice);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-500 mb-2">Showing {filteredAndSortedFlights.length} result(s)</p>
                {filteredAndSortedFlights.map(flight => (
                  <Card key={flight.id} className="hover:shadow-md hover:border-sky-200 transition-all">
                    <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                      <div className="w-full md:w-1/5">
                        <div className="font-bold text-gray-900 bg-sky-50 text-sky-800 inline-block px-2 py-1 rounded text-sm mb-1">{flight.airline}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{flight.flightNumber}</div>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-between w-full px-2">
                        <div className="text-right flex-1">
                          <div className="text-2xl font-bold text-gray-900">{formatTime(flight.departureTime)}</div>
                          <div className="text-sm font-medium text-gray-500 uppercase">{flight.source}</div>
                        </div>
                        
                        <div className="flex flex-col items-center px-4 md:px-8 w-32 md:w-48">
                          <div className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                            <Clock size={12} /> {getDuration(flight.departureTime, flight.arrivalTime)}
                          </div>
                          <div className="w-full h-[2px] bg-gray-200 relative rounded-full">
                            <Plane size={16} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sky-500 bg-white px-1" />
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-sky-600 font-bold mt-1.5">Direct</div>
                        </div>

                        <div className="text-left flex-1">
                          <div className="text-2xl font-bold text-gray-900">{formatTime(flight.arrivalTime)}</div>
                          <div className="text-sm font-medium text-gray-500 uppercase">{flight.destination}</div>
                        </div>
                      </div>

                      <div className="w-full md:w-auto md:min-w-[160px] flex flex-col items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                        <div className="text-xs text-gray-500 mb-0.5">Price per adult</div>
                        <div className="text-3xl font-black text-sky-600 mb-1 tracking-tight">₹{flight.price.toLocaleString()}</div>
                        <div className="text-xs font-medium text-orange-500 mb-4 bg-orange-50 px-2 py-1 rounded">
                          Only {flight.availableSeats} seats left
                        </div>
                        <Button 
                          className="w-full shadow-md shadow-sky-500/20"
                          onClick={() => navigate(`/flights/${flight.id}`)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightListing;
