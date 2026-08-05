import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Calendar, MapPin, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination || !travelDate) return;
    
    navigate(`/flights?source=${source.trim().toUpperCase()}&destination=${destination.trim().toUpperCase()}&date=${travelDate}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
            alt="Aircraft wing in the sky" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-50"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
              Find Your Next <span className="text-sky-400">Adventure</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
              Book flights across the globe with SkyLink. We make travel simple, affordable, and seamless.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20"
          >
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={20} />
                </div>
                <Input
                  className="pl-10 h-14 text-lg"
                  placeholder="Where from?"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                />
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={20} />
                </div>
                <Input
                  className="pl-10 h-14 text-lg"
                  placeholder="Where to?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Calendar size={20} />
                </div>
                <Input
                  type="date"
                  className="pl-10 h-14 text-lg"
                  value={travelDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setTravelDate(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="h-14 px-8 text-lg bg-sky-600 hover:bg-sky-700">
                <Search size={20} className="mr-2" />
                Search Flights
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why choose SkyLink?</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">We provide the best booking experience with features designed to make your journey smoother from start to finish.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Worldwide Coverage", desc: "Access to thousands of flights globally with the best airlines.", icon: "🌍" },
              { title: "Best Prices", desc: "We guarantee competitive prices and clear pricing with no hidden fees.", icon: "💰" },
              { title: "24/7 Support", desc: "Our dedicated support team is always ready to help you with your bookings.", icon: "🎧" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
