import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService } from '../api/booking.service';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

import { motion, AnimatePresence } from 'framer-motion';
import { Plane } from 'lucide-react';

interface LocationState {
  flightId: number;
  seatsBooked: number;
}

const BookingFlow: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    if (!state?.flightId) {
      navigate('/');
      return;
    }
    const fetchUserId = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const { userService } = await import('../api/user.service');
          const usersRes = await userService.getAllUsers();
          const currentUser = usersRes.data.find(u => u.email === email);
          if (currentUser) {
            setUserId(currentUser.id);
          }
        } catch (e) {
          console.error("Failed to fetch user id", e);
        }
      }
    };
    fetchUserId();
  }, [state, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      
      // Add deliberate 3.5s delay for payment animation
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      const res = await bookingService.createBooking({
        flightId: state.flightId,
        userId: userId,
        seatsBooked: state.seatsBooked
      });
      
      if (res.success) {
        setBookingRef(res.data.id.toString());
        setIsProcessing(false);
        setStep(2);
      }
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white p-6 rounded-3xl shadow-xl inline-block mb-8"
          >
            <Plane size={64} className="text-sky-600 transform -rotate-45" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Processing Payment</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">Securely contacting your bank and finalizing your reservation...</p>
          
          <div className="w-64 h-1.5 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <motion.div 
              className="h-full bg-sky-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.5, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="w-full p-10 text-center shadow-xl border-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            >
              <CheckCircle2 size={72} className="text-green-500 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your flight has been successfully booked.</p>
            <div className="bg-gray-50 p-4 rounded-xl mb-8 inline-block border border-gray-100">
              <span className="text-sm text-gray-500 block mb-1">Booking Reference</span>
              <span className="text-2xl font-mono font-bold text-gray-900">#{bookingRef}</span>
            </div>
            <Button className="w-full h-12 text-lg" onClick={() => navigate('/bookings')}>
              View My Bookings
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Complete Payment</h1>
        
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="bg-sky-100 p-3 rounded-full text-sky-600">
              <CreditCard size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
              <p className="text-gray-500">All transactions are secure and encrypted.</p>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <Input label="Cardholder Name" required placeholder="John Doe" />
            <Input label="Card Number" required placeholder="0000 0000 0000 0000" maxLength={19} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry Date" required placeholder="MM/YY" maxLength={5} />
              <Input label="CVV" required placeholder="123" maxLength={4} type="password" />
            </div>
            
            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full text-lg" isLoading={isProcessing}>
                Pay Now
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BookingFlow;
