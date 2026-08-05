import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plane } from 'lucide-react';
import { authService } from '../api/auth.service';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().min(10, "Phone number is required")
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      const res = await authService.register(data);
      if (res.success) {
        toast.success("Registration successful! Please login.");
        navigate('/login');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
            <Plane size={24} className="transform -rotate-45" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500 transition-colors">Sign in</Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Create Account
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
