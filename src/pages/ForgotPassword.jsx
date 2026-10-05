import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Email Request, Step 2: New Password Form
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // Step 1 Form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors }
  } = useForm();

  // Step 2 Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    formState: { errors: passwordErrors }
  } = useForm();

  const newPasswordValue = watch('newPassword');

  const onEmailSubmit = (data) => {
    setResetEmail(data.email);
    setStep(2);
  };

  const onPasswordSubmit = async (data) => {
    setSubmitting(true);
    try {
      const success = await resetPassword(resetEmail, data.newPassword);
      if (success) {
        navigate('/login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {step === 1 ? 'Reset Password' : 'Create New Password'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {step === 1
              ? 'Enter your registered email address to receive password reset instructions'
              : `Set a new password for ${resetEmail}`}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 my-4">
          <span className={`h-2 rounded-full transition-all ${step === 1 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}></span>
          <span className={`h-2 rounded-full transition-all ${step === 2 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}></span>
        </div>

        {/* Step 1: Email Request */}
        {step === 1 && (
          <form className="mt-6 space-y-5" onSubmit={handleEmailSubmit(onEmailSubmit)}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Registered Email Address</label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  {...registerEmail('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  placeholder="name@example.com"
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all ${
                    emailErrors.email
                      ? 'border-red-300 focus:ring-red-500 bg-red-50/20'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
              </div>
              {emailErrors.email && (
                <p className="mt-1 text-xs text-red-600">{emailErrors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Continue to Reset
            </button>
          </form>
        )}

        {/* Step 2: New Password */}
        {step === 2 && (
          <form className="mt-6 space-y-4" onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all ${
                    passwordErrors.newPassword
                      ? 'border-red-300 focus:ring-red-500 bg-red-50/20'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="mt-1 text-xs text-red-600">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...registerPassword('confirmNewPassword', {
                    required: 'Please confirm your new password',
                    validate: (val) => val === newPasswordValue || 'Passwords do not match'
                  })}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all ${
                    passwordErrors.confirmNewPassword
                      ? 'border-red-300 focus:ring-red-500 bg-red-50/20'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {passwordErrors.confirmNewPassword && (
                <p className="mt-1 text-xs text-red-600">{passwordErrors.confirmNewPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md shadow-blue-500/20 disabled:opacity-70 transition-all cursor-pointer"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2">
                  Update Password <CheckCircle2 className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
