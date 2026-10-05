import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authorityMode, setAuthorityMode] = useState(true);

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

  const toggleMode = (isAuthority) => {
    setAuthorityMode(isAuthority);
    if (isAuthority) {
      setValue('email', 'admin@courier.com', { shouldValidate: true });
      setValue('password', 'password123', { shouldValidate: true });
      toast.info('Switched to Authority Login mode');
    } else {
      setValue('email', 'user@courier.com', { shouldValidate: true });
      setValue('password', 'password123', { shouldValidate: true });
      toast.info('Switched to Customer Login mode');
    }
  };

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
    <div className="fixed inset-0 w-screen h-screen bg-slate-950 flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans select-none z-50 overflow-hidden">
      
      {/* Central Wide Card */}
      <div className="w-full max-w-[1200px] h-full max-h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative border border-white/10">
        
        {/* LEFT 58%: WIDER High Clarity Courier Delivery Image Panel */}
        <div className="lg:w-[58%] h-64 lg:h-full relative bg-slate-950 flex flex-col justify-between p-8 lg:p-12">
          
          {/* Crystal Clear Delivery Truck Image Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=95"
              alt="Express Courier Logistics"
              className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000 brightness-110 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-slate-950/40"></div>
          </div>

          {/* Logo Header Overlay - Direct Clean Text */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/login')}>
              <span className="text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center drop-shadow-lg">
                g<span className="text-amber-400 font-extrabold text-2xl lg:text-3xl">a</span>atiTrack
              </span>
              <div className="text-left leading-none ml-1">
                <span className="block text-[10px] font-extrabold text-amber-300 tracking-wider drop-shadow">COURIER MANAGEMENT SYSTEM</span>
              </div>
            </div>
          </div>

          {/* Center Info Text - Directly Over Image WITHOUT Background Color Box */}
          <div className="relative z-10 my-auto text-white space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-amber-500/30 text-amber-200 text-xs font-bold px-3.5 py-1 rounded-full drop-shadow">
              <ShieldCheck className="w-4 h-4 text-amber-300" /> Enterprise Logistics Software
            </div>

            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-xl">
              Welcome back!
            </h2>

            <p className="text-sm lg:text-base text-slate-100 leading-relaxed font-semibold drop-shadow-lg">
              Experience the Powerful Courier Management Software with real-time parcel tracking and station dispatching.
            </p>
          </div>

          {/* PERFECT SMOOTH SINGLE-SEGMENT C-CURVE ARC */}
          <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-32 lg:w-44 xl:w-52 pointer-events-none z-20">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
              {/* Single Continuous Bezier C-Curve - Seamless Geometry */}
              <path d="M 100,-1 L 100,101 L 100,100 C 15,75 15,25 100,0 Z" />
            </svg>
          </div>

        </div>

        {/* RIGHT 42%: Clean Form Panel */}
        <div className="lg:w-[42%] h-full bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto z-20">
          
          <div className="max-w-md w-full mx-auto my-auto">
            
            {/* Heading */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#0B2E8C] bg-blue-50 px-2.5 py-0.5 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Authorized Sign In
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Welcome
              </h2>
              <p className="text-xs lg:text-sm text-slate-500 mt-1">
                Log in to your account to continue
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              
              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">Email Address</label>
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
                    placeholder="awesome@user.com"
                    className={`block w-full pl-11 pr-4 py-3 border rounded-full text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] transition-all ${
                      errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-600 font-semibold pl-4">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
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
                    className={`block w-full pl-11 pr-11 py-3 border rounded-full text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] transition-all ${
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
              <div className="flex items-center justify-between px-2 pt-0.5">
                <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#0B2E8C] border-slate-300 rounded focus:ring-0 cursor-pointer"
                  />
                  Remember my preference
                </label>
                <Link to="/forgot-password" className="text-xs text-slate-500 hover:text-[#0B2E8C] underline font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Deep Navy Blue Rounded Pill Sign In Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0B2E8C] hover:bg-[#082269] text-white py-3.5 px-4 rounded-full text-sm font-bold shadow-lg shadow-[#0B2E8C]/20 hover:shadow-xl transition-all cursor-pointer disabled:opacity-70 mt-2 flex justify-center items-center"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Log In'
                )}
              </button>

              {/* Don't have an account link */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-extrabold text-[#0B2E8C] hover:underline">
                    Sign up!
                  </Link>
                </p>
              </div>

            </form>

            {/* Quick Fill Mode Switcher Pills */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => toggleMode(true)}
                className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer text-xs ${
                  authorityMode ? 'bg-[#0B2E8C] text-white border-[#0B2E8C] font-bold shadow-sm' : 'border-slate-300'
                }`}
              >
                Authority Mode
              </button>
              <button
                type="button"
                onClick={() => toggleMode(false)}
                className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer text-xs ${
                  !authorityMode ? 'bg-[#0B2E8C] text-white border-[#0B2E8C] font-bold shadow-sm' : 'border-slate-300'
                }`}
              >
                Customer Mode
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
