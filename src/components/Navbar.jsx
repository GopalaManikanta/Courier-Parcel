import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package, Users, Radio, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo - gaatiTrack Enterprise Style */}
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center gap-1.5 group shrink-0">
          <span className="text-2xl sm:text-3xl font-black text-[#0B2E8C] tracking-tight flex items-center">
            g<span className="text-amber-500 font-extrabold text-xl sm:text-2xl">a</span>atiTrack
          </span>
          <div className="text-left leading-none ml-1.5 hidden sm:block">
            <span className="block text-[9px] font-black text-slate-800 tracking-wider">COURIER MANAGEMENT SYSTEM</span>
            <span className="block text-[8px] font-bold text-slate-400 tracking-tight">LOGISTICS CONTROL CENTER</span>
          </div>
        </Link>

        {/* Navigation Links & User Profile Toolbar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Dynamic Route Navigation Links */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-full transition-all flex items-center gap-1.5 ${
                    isActive('/dashboard')
                      ? 'bg-[#0B2E8C] text-white shadow-md'
                      : 'bg-white text-slate-700 hover:text-[#0B2E8C] hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link
                  to="/tracking"
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-full transition-all flex items-center gap-1.5 ${
                    isActive('/tracking')
                      ? 'bg-[#0B2E8C] text-white shadow-md'
                      : 'bg-white text-slate-700 hover:text-[#0B2E8C] hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Tracking</span>
                </Link>
                <Link
                  to="/shipments"
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-full transition-all flex items-center gap-1.5 ${
                    isActive('/shipments')
                      ? 'bg-[#0B2E8C] text-white shadow-md'
                      : 'bg-white text-slate-700 hover:text-[#0B2E8C] hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Shipments</span>
                </Link>
                <Link
                  to="/customers"
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-full transition-all flex items-center gap-1.5 ${
                    isActive('/customers')
                      ? 'bg-[#0B2E8C] text-white shadow-md'
                      : 'bg-white text-slate-700 hover:text-[#0B2E8C] hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Customers</span>
                </Link>
                <Link
                  to="/reports"
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-full transition-all flex items-center gap-1.5 ${
                    isActive('/reports')
                      ? 'bg-[#0B2E8C] text-white shadow-md'
                      : 'bg-white text-slate-700 hover:text-[#0B2E8C] hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Reports</span>
                </Link>
              </div>
              
              {/* Notification Center */}
              <NotificationCenter />

              {/* User Admin Tag */}
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-slate-800 text-xs font-semibold">
                <div className="w-6 h-6 rounded-full bg-[#0B2E8C] text-white flex items-center justify-center text-xs font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="hidden md:inline font-bold text-[#0B2E8C]">{user?.name}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0B2E8C] bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-200 rounded-full transition-all cursor-pointer"
                title="Logout Account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
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
