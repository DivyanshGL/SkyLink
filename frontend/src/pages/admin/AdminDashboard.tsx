import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { flightService } from '../../api/flight.service';
import { userService } from '../../api/user.service';
import { bookingService } from '../../api/booking.service';
import { Plane, Users, Ticket, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ChartData {
  date: string;
  revenue: number;
}

interface Activity {
  id: number;
  userName: string;
  flightId: number;
  totalFare: number;
  time: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    flights: 0,
    users: 0,
    bookings: 0,
    revenue: 0
  });
  
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [flightsRes, usersRes, bookingsRes] = await Promise.all([
          flightService.getAllFlights(),
          userService.getAllUsers(),
          bookingService.getAllBookings()
        ]);

        const bookings = bookingsRes.data;
        const users = usersRes.data;
        
        // 1. Calculate general stats
        const totalRevenue = bookings
          .filter(b => b.status === 'CONFIRMED')
          .reduce((sum, b) => sum + b.totalFare, 0);

        setStats({
          flights: flightsRes.data.length,
          users: users.length,
          bookings: bookings.length,
          revenue: totalRevenue
        });

        // 2. Generate Chart Data (Last 7 Days)
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().split('T')[0];
        });

        const revenueByDay = last7Days.reduce((acc, date) => ({ ...acc, [date]: 0 }), {} as Record<string, number>);

        bookings.forEach(b => {
          if (b.status === 'CONFIRMED') {
            const date = new Date(b.bookingTime).toISOString().split('T')[0];
            if (revenueByDay[date] !== undefined) {
              revenueByDay[date] += b.totalFare;
            }
          }
        });

        const generatedChartData = last7Days.map(date => ({
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: revenueByDay[date]
        }));
        
        setChartData(generatedChartData);

        // 3. Generate Recent Activity (Last 5 bookings)
        const userMap = new Map(users.map(u => [u.id, u.fullName || 'Unknown User']));
        
        const recent = [...bookings]
          .sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime())
          .slice(0, 5)
          .map(b => ({
            id: b.id,
            userName: userMap.get(b.userId) || `User #${b.userId}`,
            flightId: b.flightId,
            totalFare: b.totalFare,
            status: b.status,
            time: new Date(b.bookingTime).toLocaleString()
          }));
          
        setRecentActivity(recent);

      } catch (err) {
        toast.error("Failed to load dashboard metrics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Flights', value: stats.flights, icon: Plane, color: 'text-sky-600', bg: 'bg-sky-100' },
    { title: 'Total Users', value: stats.users, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Total Bookings', value: stats.bookings, icon: Ticket, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  if (isLoading) return <div className="min-h-[50vh] flex justify-center items-center"><div className="animate-spin h-8 w-8 border-b-2 border-sky-600 rounded-full"></div></div>;

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1000); // Minimum 1000 to prevent division by zero scaling

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 flex items-center gap-4 border-l-4 border-l-transparent hover:border-l-sky-500 transition-colors">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Revenue Chart */}
        <Card className="p-6 lg:col-span-2 flex flex-col min-h-[400px]">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
            <p className="text-sm text-gray-500">Confirmed bookings over the last 7 days</p>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-gray-100 relative">
            {chartData.map((data, i) => (
              <div key={i} className="flex flex-col items-center justify-end h-full flex-1 group relative">
                
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none z-10 whitespace-nowrap">
                  ₹{data.revenue.toLocaleString()}
                </div>
                
                <div className="w-full max-w-[50px] bg-sky-50 rounded-t-md relative flex items-end justify-center h-full group-hover:bg-sky-100 transition-colors">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                    className="w-full bg-sky-500 rounded-t-md relative"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-3 font-medium uppercase tracking-wider">{data.date}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Latest platform bookings</p>
            </div>
            <button 
              onClick={() => navigate('/admin/bookings')}
              className="text-sky-600 hover:text-sky-700 text-sm font-medium flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {recentActivity.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">No recent activity</div>
            ) : (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`p-2 rounded-full mt-1 ${
                    activity.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 
                    activity.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    <Ticket size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.userName} booked Flight #{activity.flightId}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {activity.time.split(',')[1]}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-bold text-gray-900">
                        ₹{activity.totalFare.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
