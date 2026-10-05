import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo - gaatiTrack Matching Style */}
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center gap-1.5 group">
          <span className="text-2xl sm:text-3xl font-black text-[#0B2E8C] tracking-tight flex items-center">
            g<span className="text-amber-500 font-extrabold text-xl sm:text-2xl">a</span>atiTrack
          </span>
          <div className="text-left leading-none ml-1 hidden sm:block">
            <span className="block text-[9px] font-bold text-slate-600 tracking-wider">COURIER MANAGEMENT SYSTEM</span>
          </div>
        </Link>

        {/* User Navigation & Logout */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              
              {/* User Role Tag */}
              <div className="flex items-center gap-2.5 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-800 text-xs font-semibold">
                <div className="w-6 h-6 rounded-full bg-[#0B2E8C] text-white flex items-center justify-center text-xs font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline font-bold text-[#0B2E8C]">{user?.name}</span>
                <span className="bg-[#0B2E8C]/10 text-[#0B2E8C] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {user?.role || 'Authority'}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0B2E8C] hover:bg-[#082269] rounded-full shadow transition-all cursor-pointer"
                title="Logout Account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-[#0B2E8C] hover:underline"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0B2E8C] hover:bg-[#082269] rounded-full shadow"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
