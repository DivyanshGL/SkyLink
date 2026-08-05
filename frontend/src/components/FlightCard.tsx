import React from 'react';
import { Flight } from '../types';
import { PlaneTakeoff, PlaneLanding, Clock, Users } from 'lucide-react';

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelect }) => {
  const departureDate = new Date(flight.departureTime);
  const arrivalDate = new Date(flight.arrivalTime);
  
  const durationMs = arrivalDate.getTime() - departureDate.getTime();
  const durationHrs = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMins = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col md:flex-row group">
      {/* Flight Info Section */}
      <div className="flex-1 p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-sm font-semibold">
            <span>{flight.flightNumber}</span>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Users size={16} />
            <span>{flight.availableSeats} seats left</span>
          </div>
        </div>

        <div className="flex items-center justify-between relative">
          {/* Origin */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm font-medium text-gray-500 flex items-center justify-center gap-1">
              <PlaneTakeoff size={14} />
              {flight.origin}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {departureDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          </div>

          {/* Duration Line */}
          <div className="flex-1 px-8 relative">
            <div className="absolute left-0 w-full top-1/2 -translate-y-1/2 flex items-center px-8">
              <div className="h-[2px] w-full bg-gray-200 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs font-semibold text-gray-400 flex items-center gap-1 group-hover:text-sky-500 transition-colors">
                  <Clock size={12} />
                  {durationHrs}h {durationMins}m
                </div>
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm font-medium text-gray-500 flex items-center justify-center gap-1">
              <PlaneLanding size={14} />
              {flight.destination}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {arrivalDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Price & Action Section */}
      <div className="bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100 p-6 md:p-8 flex flex-row md:flex-col justify-between items-center md:w-64">
        <div className="text-center md:mb-6">
          <p className="text-sm text-gray-500 font-medium mb-1">Price per adult</p>
          <div className="text-3xl font-bold text-indigo-900">₹{flight.price}</div>
        </div>
        
        {onSelect && (
          <button
            onClick={() => onSelect(flight)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5 w-full md:w-auto whitespace-nowrap"
          >
            Select Flight
          </button>
        )}
      </div>
    </div>
  );
};

export default FlightCard;
