import React, { useEffect, useState } from 'react';
import { userService } from '../api/user.service';
import { bookingService } from '../api/booking.service';
import { User, Booking } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { User as UserIcon, Mail, Phone, MapPin, Award, Plane, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

interface LoyaltyData {
  miles: number;
  tier: 'Blue' | 'Silver' | 'Gold' | 'Platinum';
  nextTierMiles: number | null;
  progress: number;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema)
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) return;

        const usersRes = await userService.getAllUsers();
        const currentUser = usersRes.data.find(u => u.email === email);
        const userId = currentUser ? currentUser.id : 1;

        const [profileRes, bookingsRes] = await Promise.all([
          userService.getProfile(userId),
          bookingService.getBookingsByUser(userId)
        ]);
        
        setProfile(profileRes.data);
        
        // Calculate SkyMiles based on confirmed bookings
        const totalSpent = bookingsRes.data
          .filter((b: Booking) => b.status === 'CONFIRMED')
          .reduce((sum: number, b: Booking) => sum + b.totalFare, 0);
          
        const miles = Math.floor(totalSpent * 0.5); // 1 INR = 0.5 Miles
        
        let tier: LoyaltyData['tier'] = 'Blue';
        let nextTierMiles: number | null = 5000;
        let progress = (miles / 5000) * 100;
        
        if (miles >= 25000) {
          tier = 'Platinum';
          nextTierMiles = null;
          progress = 100;
        } else if (miles >= 10000) {
          tier = 'Gold';
          nextTierMiles = 25000;
          progress = ((miles - 10000) / 15000) * 100;
        } else if (miles >= 5000) {
          tier = 'Silver';
          nextTierMiles = 10000;
          progress = ((miles - 5000) / 5000) * 100;
        }
        
        setLoyalty({ miles, tier, nextTierMiles, progress });
        
      } catch (err) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const openEditModal = () => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        gender: profile.gender || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        pincode: profile.pincode || '',
      });
      setIsEditModalOpen(true);
    }
  };

  const onUpdateProfile = async (data: ProfileForm) => {
    if (!profile) return;
    try {
      setIsUpdating(true);
      const res = await userService.updateProfile(profile.id, data);
      if (res.success) {
        setProfile({ ...profile, ...data });
        toast.success("Profile updated successfully");
        setIsEditModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const getTierColors = (tier: string) => {
    switch(tier) {
      case 'Platinum': return 'from-gray-800 to-black text-gray-100 border-gray-700 shadow-xl shadow-gray-900/20';
      case 'Gold': return 'from-yellow-400 to-yellow-600 text-white border-yellow-300 shadow-xl shadow-yellow-500/20';
      case 'Silver': return 'from-gray-300 to-gray-400 text-gray-800 border-gray-200 shadow-xl shadow-gray-400/20';
      default: return 'from-sky-500 to-blue-600 text-white border-sky-400 shadow-xl shadow-sky-500/20';
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-sky-600 rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
          <Button onClick={openEditModal}>
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <Card className="p-8 border border-gray-100 shadow-sm overflow-hidden relative lg:col-span-2">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-sky-500 to-blue-600"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 mt-12 mb-10">
              <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center text-sky-600 border-4 border-white shadow-md">
                <UserIcon size={56} />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{profile?.fullName || 'User'}</h1>
                <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail size={16} /> {profile?.email}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Contact Info</h3>
                <div className="flex items-start gap-3">
                  <Phone className="text-sky-500 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{profile?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserIcon className="text-sky-500 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-gray-900 capitalize">{profile?.gender || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Address</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="text-sky-500 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {[profile?.address, profile?.city, profile?.state, profile?.country, profile?.pincode]
                        .filter(Boolean)
                        .join(', ') || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* SkyMiles Loyalty Card */}
          {loyalty && (
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`rounded-2xl p-6 bg-gradient-to-br border ${getTierColors(loyalty.tier)} flex flex-col relative overflow-hidden`}
              >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Plane size={120} className="-rotate-45 translate-x-4 -translate-y-4" />
                </div>
                
                <div className="flex justify-between items-start relative z-10 mb-8">
                  <div>
                    <h4 className="text-sm uppercase tracking-widest font-semibold opacity-80 flex items-center gap-2">
                      <Award size={16} /> SkyLink Rewards
                    </h4>
                    <p className="text-2xl font-black mt-1 tracking-tight">{loyalty.tier} Member</p>
                  </div>
                </div>

                <div className="mt-auto relative z-10">
                  <p className="text-sm opacity-80 mb-1">Total SkyMiles</p>
                  <h2 className="text-4xl font-bold tracking-tighter flex items-baseline gap-1">
                    {loyalty.miles.toLocaleString()}
                    <span className="text-lg font-normal opacity-80">mi</span>
                  </h2>
                </div>

                {loyalty.nextTierMiles && (
                  <div className="mt-6 pt-6 border-t border-white/20 relative z-10">
                    <div className="flex justify-between text-xs font-medium opacity-90 mb-2">
                      <span>{loyalty.tier}</span>
                      <span>Next Tier ({loyalty.nextTierMiles.toLocaleString()} mi)</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${loyalty.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                    <p className="text-xs mt-3 opacity-80 flex items-center gap-1">
                      Earn {(loyalty.nextTierMiles - loyalty.miles).toLocaleString()} more miles to upgrade <ChevronRight size={14}/>
                    </p>
                  </div>
                )}
                
                {!loyalty.nextTierMiles && (
                  <div className="mt-6 pt-6 border-t border-white/20 relative z-10">
                    <p className="text-sm font-medium">You've reached the highest tier!</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>

      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
          <Input 
            label="Full Name" 
            {...register('fullName')} 
            error={errors.fullName?.message} 
            required 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Phone Number" 
              {...register('phone')} 
              error={errors.phone?.message} 
            />
            <div className="flex flex-col space-y-1.5 w-full">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <select
                {...register('gender')}
                className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4">Address Details</h4>
            <div className="space-y-4">
              <Input 
                label="Street Address" 
                {...register('address')} 
                error={errors.address?.message} 
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input 
                  label="City" 
                  {...register('city')} 
                  error={errors.city?.message} 
                />
                <Input 
                  label="State/Province" 
                  {...register('state')} 
                  error={errors.state?.message} 
                />
                <Input 
                  label="Postal / Zip Code" 
                  {...register('pincode')} 
                  error={errors.pincode?.message} 
                />
              </div>
              <Input 
                label="Country" 
                {...register('country')} 
                error={errors.country?.message} 
              />
            </div>
          </div>
          
          <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-4">
            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isUpdating}>
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
