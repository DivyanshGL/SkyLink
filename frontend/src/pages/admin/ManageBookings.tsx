import React, { useEffect, useState } from 'react';
import { bookingService } from '../../api/booking.service';
import { Booking } from '../../types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { toast } from 'sonner';

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await bookingService.getAllBookings();
      setBookings(res.data);
    } catch (err) {
      toast.error("Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">Loading bookings...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Flight ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Total Fare</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">#{booking.id}</TableCell>
                  <TableCell>User #{booking.userId}</TableCell>
                  <TableCell>Flight #{booking.flightId}</TableCell>
                  <TableCell>{new Date(booking.bookingTime).toLocaleString()}</TableCell>
                  <TableCell>{booking.seatsBooked}</TableCell>
                  <TableCell className="font-semibold text-gray-900">₹{booking.totalFare}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
