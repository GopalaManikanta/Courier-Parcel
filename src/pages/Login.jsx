import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ShieldCheck, Sparkles, Truck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: 'admin@courier.com',
      password: 'password123'
    }
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('courier_remembered_email');
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (rememberMe) {
        localStorage.setItem('courier_remembered_email', data.email);
      } else {
        localStorage.removeItem('courier_remembered_email');
      }

      const success = await login(data.email, data.password);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch {
      toast.error('An unexpected login error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-white flex flex-col lg:flex-row font-sans select-none z-50 overflow-hidden">
      
      {/* LEFT 58%: 100% Full Viewport Height Hero Image Panel */}
      <div className="lg:w-[58%] h-64 lg:h-full relative bg-slate-950 flex flex-col justify-between p-8 lg:p-14">
        
        {/* Iconic Express Courier Parcel Delivery Truck Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=95"
            alt="Express Courier Parcel Delivery Truck"
            className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000 brightness-105 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-slate-950/50"></div>
        </div>

        {/* Brand Logo Header Overlay */}
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

        {/* Center Hero Information Content */}
        <div className="relative z-10 my-auto text-white space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-[#0B2E8C]/90 text-white text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-md border border-blue-400/40 drop-shadow-md">
            <ShieldCheck className="w-4 h-4 text-sky-300" /> Enterprise Logistics Control Engine
          </div>

          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
            Real-Time Express Parcel Dispatch
          </h1>

          <p className="text-base lg:text-lg text-slate-100 leading-relaxed font-semibold drop-shadow-lg">
            Track shipments, manage route dispatches, and optimize nationwide courier operations with instant live updates.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs font-extrabold text-white/90">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
              <Truck className="w-4 h-4 text-sky-300" /> 100% Live Tracking
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 99.8% On-Time Delivery
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
        
        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          
          {/* Form Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#0B2E8C] bg-blue-50 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#0B2E8C]" /> Authorized Operations Sign In
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Logistics Control Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              Log in to access courier dispatch control panel
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">Corporate Email Address</label>
              <div className="relative rounded-full shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
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
                  placeholder="admin@courier.com"
                  className={`block w-full pl-11 pr-4 py-3.5 border rounded-full text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] transition-all ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-600 font-semibold pl-4">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">Password</label>
              <div className="relative rounded-full shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  placeholder="••••••••••••••••"
                  className={`block w-full pl-11 pr-11 py-3.5 border rounded-full text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] transition-all ${
                    errors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600 font-semibold pl-4">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between px-2 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#0B2E8C] border-slate-300 rounded focus:ring-0 cursor-pointer"
                />
                Remember my preference
              </label>
              <Link to="/forgot-password" className="text-xs text-slate-500 hover:text-[#0B2E8C] underline font-semibold">
                Forgot password?
              </Link>
            </div>

            {/* Deep Navy Blue Rounded Pill Sign In Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0B2E8C] hover:bg-[#082269] text-white py-4 px-4 rounded-full text-sm font-bold shadow-xl shadow-[#0B2E8C]/25 hover:shadow-2xl transition-all cursor-pointer disabled:opacity-70 mt-3 flex justify-center items-center"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In to Control Center'
              )}
            </button>

            {/* Don't have an account link */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-extrabold text-[#0B2E8C] hover:underline">
                  Register new Account
                </Link>
              </p>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;
