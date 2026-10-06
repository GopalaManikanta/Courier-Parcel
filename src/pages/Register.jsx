import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Shield, Sparkles, Truck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: 'Customer',
      password: '',
      confirmPassword: ''
    }
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const success = await registerUser(data);
      if (success) {
        navigate('/login');
      }
    } catch {
      toast.error('An unexpected error occurred during registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-white flex flex-col lg:flex-row font-sans select-none z-50 overflow-hidden">
      
      {/* LEFT 58%: 100% Full Viewport Height Hero Image Panel */}
      <div className="lg:w-[58%] h-64 lg:h-full relative bg-slate-950 flex flex-col justify-between p-8 lg:p-14">
        
        {/* REGISTER SPECIFIC COURIER WAREHOUSE CARGO HUB IMAGE */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=95"
            alt="Courier Cargo Warehouse Logistics Hub"
            className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000 brightness-105 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-slate-950/50"></div>
        </div>

        {/* Logo Header Overlay */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/login')}>
            <span className="text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center drop-shadow-lg">
              g<span className="text-amber-400 font-extrabold text-2xl lg:text-3xl">a</span>atiTrack
            </span>
            <div className="text-left leading-none ml-1">
              <span className="block text-[10px] font-extrabold text-blue-200 tracking-wider drop-shadow">COURIER MANAGEMENT SYSTEM</span>
            </div>
          </div>
        </div>

        {/* Center Hero Info Text */}
        <div className="relative z-10 my-auto text-white space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-[#0B2E8C]/90 text-white text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-md border border-blue-400/40 drop-shadow-md">
            <Sparkles className="w-4 h-4 text-sky-300" /> Flipkart & Amazon Grade Parcel Network
          </div>

          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
            Create Your Express Account
          </h1>

          <p className="text-base lg:text-lg text-slate-100 leading-relaxed font-semibold drop-shadow-lg">
            Join gaatiTrack Courier Management System to send, manage, and track parcel shipments nationwide.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs font-extrabold text-white/90">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
              <Truck className="w-4 h-4 text-sky-300" /> Instant Tracking
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Secure Access
            </div>
          </div>
        </div>

        {/* PERFECT SMOOTH SINGLE-SEGMENT C-CURVE ARC */}
        <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-32 lg:w-44 xl:w-56 pointer-events-none z-20">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
            <path d="M 100,-1 L 100,101 L 100,100 C 15,75 15,25 100,0 Z" />
          </svg>
        </div>

      </div>

      {/* RIGHT 42%: 100% Full Height Form Panel */}
      <div className="lg:w-[42%] h-full bg-white flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto z-20">
        
        <div className="max-w-md w-full mx-auto my-auto">
          
          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Sign Up
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              Create a new account to access courier dispatch services
            </p>
          </div>

          {/* Registration Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Full Name Input */}
            <div className="space-y-1">
              <div className="relative rounded-full shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters'
                    }
                  })}
                  placeholder="Full Name"
                  className={`block w-full pl-11 pr-4 py-3 border rounded-full text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] transition-all ${
                    errors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-red-600 font-semibold pl-4">{errors.name.message}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <div className="relative rounded-full shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  placeholder="Email Address"
                  className={`block w-full pl-11 pr-4 py-3 border rounded-full text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] transition-all ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-600 font-semibold pl-4">{errors.email.message}</p>
              )}
            </div>

            {/* Account Type Selection */}
            <div className="space-y-1">
              <div className="relative rounded-full shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Shield className="h-4 w-4" />
                </div>
                <select
                  {...register('role', { required: 'Please select account type' })}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-300 bg-white rounded-full text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2E8C]"
                >
                  <option value="Customer">Customer / Individual Sender</option>
                  <option value="Agent/Admin">Courier Agent / Authority</option>
                </select>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="relative rounded-full shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  placeholder="Password"
                  className={`block w-full pl-11 pr-11 py-3 border rounded-full text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] transition-all ${
                    errors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600 font-semibold pl-4">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <div className="relative rounded-full shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === passwordValue || 'Passwords do not match'
                  })}
                  placeholder="Confirm Password"
                  className={`block w-full pl-11 pr-11 py-3 border rounded-full text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] transition-all ${
                    errors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 font-semibold pl-4">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Deep Navy Blue Rounded Pill Sign Up Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0B2E8C] hover:bg-[#082269] text-white py-3.5 px-4 rounded-full text-sm font-bold shadow-xl shadow-[#0B2E8C]/25 hover:shadow-2xl transition-all cursor-pointer disabled:opacity-70 mt-3 flex justify-center items-center"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign Up Now'
              )}
            </button>

            {/* Already have an account link */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-extrabold text-[#0B2E8C] hover:underline">
                  Log In
                </Link>
              </p>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Register;
