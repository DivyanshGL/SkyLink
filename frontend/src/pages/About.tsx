import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Globe, Shield, Clock } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="mx-auto h-16 w-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
            <Plane size={32} className="transform -rotate-45" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About SkyLink</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're on a mission to make global travel accessible, seamless, and affordable for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <Globe className="text-sky-500 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach</h3>
            <p className="text-gray-600">Connecting you to over 500 destinations worldwide with our extensive network of partner airlines.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <Shield className="text-sky-500 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Booking</h3>
            <p className="text-gray-600">Industry-leading encryption ensures your personal and payment data is always safe with us.</p>
          </div>
        </div>

        <div className="bg-sky-600 text-white rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-sky-100 mb-8 max-w-xl mx-auto">Join millions of satisfied travelers who choose SkyLink for their adventures every year.</p>
          <a href="/" className="inline-block bg-white text-sky-600 font-bold px-8 py-3 rounded-full hover:bg-sky-50 transition-colors">
            Search Flights Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
