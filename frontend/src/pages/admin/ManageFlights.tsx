import React, { useEffect, useState, useMemo } from 'react';
import { flightService } from '../../api/flight.service';
import { Flight } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Plus, Edit2, Trash2, Search, ArrowUpDown, Map, AlertTriangle, Plane as PlaneIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const flightSchema = z.object({
  flightNumber: z.string().min(1, "Flight number is required"),
  airline: z.string().min(1, "Airline is required"),
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  totalSeats: z.coerce.number().min(1, "Seats must be greater than 0"),
});

type FlightForm = z.infer<typeof flightSchema>;
type SortConfig = { key: keyof Flight; direction: 'asc' | 'desc' } | null;

const ManageFlights: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Feature States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlightId, setEditingFlightId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FlightForm>({
    resolver: zodResolver(flightSchema)
  });

  const fetchFlights = async () => {
    try {
      setIsLoading(true);
      const res = await flightService.getAllFlights();
      setFlights(res.data);
    } catch (err) {
      toast.error("Failed to fetch flights");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  // Compute Analytics
  const analytics = useMemo(() => {
    const totalFlights = flights.length;
    const uniqueRoutes = new Set(flights.map(f => `${f.source}-${f.destination}`)).size;
    const lowSeatWarnings = flights.filter(f => f.availableSeats < (f.totalSeats * 0.2)).length; // Less than 20% capacity remaining

    return { totalFlights, uniqueRoutes, lowSeatWarnings };
  }, [flights]);

  // Handle Search & Sort
  const filteredAndSortedFlights = useMemo(() => {
    let result = [...flights];

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.flightNumber.toLowerCase().includes(q) ||
        f.airline.toLowerCase().includes(q) ||
        f.source.toLowerCase().includes(q) ||
        f.destination.toLowerCase().includes(q)
      );
    }

    // Sort logic
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [flights, searchQuery, sortConfig]);

  const requestSort = (key: keyof Flight) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const openAddModal = () => {
    setEditingFlightId(null);
    reset({
      flightNumber: '', airline: '', source: '', destination: '',
      departureTime: '', arrivalTime: '', price: 0, totalSeats: 100
    });
    setIsModalOpen(true);
  };

  const openEditModal = (flight: Flight) => {
    setEditingFlightId(flight.id);
    reset({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      source: flight.source,
      destination: flight.destination,
      departureTime: flight.departureTime.slice(0, 16), 
      arrivalTime: flight.arrivalTime.slice(0, 16),
      price: flight.price,
      totalSeats: flight.totalSeats
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FlightForm) => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        ...data,
        source: data.source.trim().toUpperCase(),
        destination: data.destination.trim().toUpperCase(),
      };

      if (editingFlightId) {
        await flightService.updateFlight(editingFlightId, payload);
        toast.success("Flight updated successfully");
      } else {
        await flightService.addFlight(payload);
        toast.success("Flight added successfully");
      }
      setIsModalOpen(false);
      fetchFlights();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this flight?")) {
      try {
        await flightService.deleteFlight(id);
        toast.success("Flight deleted");
        fetchFlights();
      } catch (err) {
        toast.error("Failed to delete flight");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Flights</h2>
          <p className="text-gray-500 text-sm mt-1">Add, update, search, and analyze flight inventory.</p>
        </div>
        <Button className="flex items-center gap-2 shadow-sm" onClick={openAddModal}>
          <Plus size={18} /> Add Flight
        </Button>
      </div>

      {/* Analytics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-lg">
            <PlaneIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Active Flights</p>
            <h3 className="text-2xl font-bold text-gray-900">{analytics.totalFlights}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Map size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Unique Routes</p>
            <h3 className="text-2xl font-bold text-gray-900">{analytics.uniqueRoutes}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Low Seats (&lt; 20%)</p>
            <h3 className="text-2xl font-bold text-gray-900">{analytics.lowSeatWarnings}</h3>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <Input 
            className="pl-10 h-11" 
            placeholder="Search by flight number, airline, or location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 flex items-center px-2">
          Showing {filteredAndSortedFlights.length} result(s)
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">Loading flights...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight No.</TableHead>
                <TableHead>Airline</TableHead>
                <TableHead>Route</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => requestSort('departureTime')}
                >
                  <div className="flex items-center gap-1">Departure <ArrowUpDown size={14} className="text-gray-400"/></div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => requestSort('price')}
                >
                  <div className="flex items-center gap-1">Price <ArrowUpDown size={14} className="text-gray-400"/></div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => requestSort('availableSeats')}
                >
                  <div className="flex items-center gap-1">Seats <ArrowUpDown size={14} className="text-gray-400"/></div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedFlights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                  <TableCell>{flight.airline}</TableCell>
                  <TableCell>
                    {flight.source} <span className="text-gray-400 mx-1">→</span> {flight.destination}
                  </TableCell>
                  <TableCell>{new Date(flight.departureTime).toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-gray-900">₹{flight.price}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      (flight.availableSeats / flight.totalSeats) < 0.2 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {flight.availableSeats} / {flight.totalSeats}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(flight)}
                        className="p-2 text-gray-400 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
                        title="Edit Flight"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(flight.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Flight"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedFlights.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    No flights found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingFlightId ? "Edit Flight" : "Add New Flight"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Flight Number" placeholder="e.g. AA123" {...register('flightNumber')} error={errors.flightNumber?.message} />
            <Input label="Airline" placeholder="e.g. American Airlines" {...register('airline')} error={errors.airline?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Source" placeholder="e.g. JFK" {...register('source')} error={errors.source?.message} />
            <Input label="Destination" placeholder="e.g. LAX" {...register('destination')} error={errors.destination?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input type="datetime-local" label="Departure Time" {...register('departureTime')} error={errors.departureTime?.message} />
            <Input type="datetime-local" label="Arrival Time" {...register('arrivalTime')} error={errors.arrivalTime?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" label="Price (₹)" {...register('price')} error={errors.price?.message} />
            <Input type="number" label="Total Seats" {...register('totalSeats')} error={errors.totalSeats?.message} />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingFlightId ? 'Save Changes' : 'Add Flight'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageFlights;
